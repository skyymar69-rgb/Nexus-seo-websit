/**
 * Le seul `fetch` authentifié vers DataForSEO.
 *
 * Portage d'OpenSEO (src/server/lib/dataforseo/core.ts, MIT). Différences :
 * identifiants lus depuis DATAFORSEO_API_KEY (base64 de login:password) ou
 * DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD, et plus de dépendance Cloudflare.
 *
 * Lève sur les réponses non 2xx ; les échecs au niveau tâche (HTTP 200 avec une
 * tâche en erreur) sont traités en aval par `assertOk` (envelope.ts).
 */
import { DataforseoError, type DataforseoErrorCode } from './errors'
import type { DataforseoResponseLike, DataforseoTaskLike } from './envelope'

const API_BASE = 'https://api.dataforseo.com'
const MAX_ERROR_PAYLOAD_LENGTH = 1600
// Plafond de sécurité sur tout appel live (les SERP profondes sont les plus lentes).
const REQUEST_TIMEOUT_MS = 60_000
// Relance des lectures idempotentes sur 5xx transitoire. Tentatives = retries + 1.
const MAX_RETRIES = 2
const RETRY_BACKOFF_MS = 250

export function getDataforseoAuthHeader(): string | null {
  const apiKey = process.env.DATAFORSEO_API_KEY
  if (apiKey) return `Basic ${apiKey}`
  const login = process.env.DATAFORSEO_LOGIN
  const password = process.env.DATAFORSEO_PASSWORD
  if (login && password) {
    return `Basic ${Buffer.from(`${login}:${password}`).toString('base64')}`
  }
  return null
}

export function isDataforseoConfigured(): boolean {
  return getDataforseoAuthHeader() !== null
}

/**
 * Traduit un échec HTTP ou tâche DataForSEO en erreur produit (ex. problème
 * de facturation). Renvoie null quand l'échec n'est pas reconnu, pour laisser
 * l'appelant retomber sur l'erreur générique.
 */
export type DataforseoErrorClassifier = (
  status: number | undefined,
  details: string,
  path: string,
) => DataforseoError | null

function formatErrorPayload(value: unknown): string {
  const text =
    typeof value === 'string'
      ? value
      : (() => {
          try {
            return JSON.stringify(value)
          } catch {
            return String(value)
          }
        })()
  return text.length > MAX_ERROR_PAYLOAD_LENGTH
    ? `${text.slice(0, MAX_ERROR_PAYLOAD_LENGTH)}... [tronqué]`
    : text
}

function requestPath(url: string): string {
  try {
    return new URL(url).pathname
  } catch {
    return url
  }
}

type RequestOptions = {
  /** Reconnaît un échec d'accès ou de facturation et le traduit en erreur produit. */
  classify?: DataforseoErrorClassifier
  /**
   * 0 pour les appels facturés non idempotents (task_post) : un 5xx ne prouve
   * pas que le fournisseur n'a pas facturé, on ne rejoue jamais.
   */
  maxServerErrorRetries?: number
}

async function authenticatedFetch(
  url: string,
  init: RequestInit,
  options: RequestOptions,
): Promise<Response> {
  const auth = getDataforseoAuthHeader()
  if (!auth) throw new DataforseoError('NOT_CONFIGURED')
  const maxRetries = options.maxServerErrorRetries ?? MAX_RETRIES
  const headers = new Headers(init.headers)
  headers.set('Authorization', auth)
  // Un seul signal pour toutes les tentatives : les relances partagent le
  // budget de temps au lieu d'en ouvrir un nouveau.
  const signal = init.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS)
  const path = requestPath(url)

  for (let attempt = 0; ; attempt++) {
    let response: Response
    try {
      response = await fetch(url, { ...init, headers, signal })
    } catch (error) {
      // Délai dépassé : non relancé, l'appel a peut-être déjà été facturé.
      if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
        throw new DataforseoError('UPSTREAM_UNAVAILABLE', `DataForSEO : délai dépassé sur ${path}`, {
          provider: 'dataforseo',
          providerPath: path,
        })
      }
      throw error
    }
    if (response.ok) return response

    if (response.status >= 500 && attempt < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_BACKOFF_MS * (attempt + 1)))
      continue
    }

    const rawText = await response.text()
    const classified = options.classify?.(response.status, rawText, path)
    if (classified) throw classified

    const code: DataforseoErrorCode =
      response.status >= 500
        ? 'UPSTREAM_UNAVAILABLE'
        : response.status === 429
          ? 'RATE_LIMITED'
          : response.status === 401
            ? 'DATAFORSEO_AUTH_FAILED'
            : 'INTERNAL_ERROR'
    if (code === 'UPSTREAM_UNAVAILABLE') {
      console.warn('dataforseo.upstream-http-failed', { path, status: response.status })
    }
    throw new DataforseoError(code, `DataForSEO HTTP ${response.status} sur ${path}`, {
      provider: 'dataforseo',
      providerStatus: String(response.status),
      providerPath: path,
      responseBody: formatErrorPayload(rawText),
    })
  }
}

async function request<TTask extends DataforseoTaskLike>(
  method: 'GET' | 'POST',
  path: string,
  body: unknown,
  options: RequestOptions,
): Promise<DataforseoResponseLike<TTask> | null> {
  const response = await authenticatedFetch(
    `${API_BASE}${path}`,
    {
      method,
      headers: {
        Accept: 'application/json',
        ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      },
      body: method === 'POST' ? JSON.stringify(body) : undefined,
    },
    options,
  )
  const text = await response.text()
  if (text === '') return null
  // Le type de tâche est la prétention de l'appelant sur la charge utile ;
  // les champs exploités sont validés en aval (envelope.ts + schémas Zod).
  return JSON.parse(text) as DataforseoResponseLike<TTask>
}

/** POST un tableau de tâches et renvoie l'enveloppe parsée. */
export function dataforseoPost<TTask extends DataforseoTaskLike = DataforseoTaskLike>(
  path: string,
  tasks: unknown[],
  options: RequestOptions = {},
): Promise<DataforseoResponseLike<TTask> | null> {
  return request<TTask>('POST', path, tasks, options)
}

/** GET (task_get, appendix, locations). */
export function dataforseoGet<TTask extends DataforseoTaskLike = DataforseoTaskLike>(
  path: string,
  options: RequestOptions = {},
): Promise<DataforseoResponseLike<TTask> | null> {
  return request<TTask>('GET', path, undefined, options)
}
