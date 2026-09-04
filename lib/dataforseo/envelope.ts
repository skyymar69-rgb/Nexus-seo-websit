/**
 * Enveloppe de réponse DataForSEO : statut + coût.
 *
 * Portage d'OpenSEO (src/server/lib/dataforseo/envelope.ts, MIT). C'est la
 * couture qui porte le coût réel de chaque appel jusqu'au point de comptage
 * unique (client.ts). Chaque fetcher de section renvoie DataforseoApiResponse<T> ;
 * rien d'autre ne construit un objet de facturation.
 */
import { z } from 'zod'
import { DataforseoError, type DataforseoErrorCode } from './errors'
import type { DataforseoErrorClassifier } from './core'

export type DataforseoApiCallCost = {
  path: string[]
  costUsd: number
}

export type DataforseoApiResponse<T> = {
  data: T
  billing: DataforseoApiCallCost
}

/**
 * Levée quand une tâche échoue *après* facturation (coût + chemin présents).
 * Le compteur l'attrape pour journaliser la dépense avant de relancer l'erreur.
 */
export class DataforseoChargedTaskError extends DataforseoError {
  constructor(
    message: string,
    public readonly billing: DataforseoApiCallCost,
    /** Vrai quand NOTRE requête était mal formée ("Invalid Field"). */
    public readonly isInvalidField = false,
    code: DataforseoErrorCode = 'INTERNAL_ERROR',
  ) {
    super(code, message)
    this.name = 'DataforseoChargedTaskError'
  }
}

// cost / path arrivent non typés et optionnels : c'est la seule garde qui
// garantit qu'on peut comptabiliser un appel.
const billingMetadataSchema = z.object({
  path: z.array(z.string()),
  cost: z.number(),
  result_count: z.number().nullable().optional(),
})

export interface DataforseoTaskLike {
  status_code?: number
  status_message?: string
  path?: string[]
  cost?: number
  result_count?: number
  result?: unknown[]
  [key: string]: unknown
}

export interface DataforseoResponseLike<T extends DataforseoTaskLike> {
  status_code?: number
  status_message?: string
  tasks?: T[]
  [key: string]: unknown
}

/** Entrée `task.result[0]` portant une liste `items`, la forme courante des endpoints live. */
export interface DataforseoItemsResult<TItem> {
  items?: TItem[] | null
  total_count?: number | null
  [key: string]: unknown
}

export interface DataforseoItemsTask<TItem> extends DataforseoTaskLike {
  result?: DataforseoItemsResult<TItem>[]
}

function tryBuildTaskBilling(task: unknown): DataforseoApiCallCost | null {
  const parsed = billingMetadataSchema.safeParse(task)
  if (!parsed.success) return null
  return { path: parsed.data.path, costUsd: parsed.data.cost }
}

export function buildTaskBilling(task: DataforseoTaskLike): DataforseoApiCallCost {
  const billing = tryBuildTaskBilling(task)
  if (!billing) {
    throw new DataforseoError('INTERNAL_ERROR', 'Tâche DataForSEO sans métadonnées de coût (path/cost)')
  }
  return billing
}

const INVALID_FIELD_MESSAGE_RE = /Invalid Field:\s*'([^']+)'/i

/** DataForSEO renvoie les paramètres postés dans `task.data` : on ajoute la valeur fautive au message. */
function describeInvalidField(message: string, task: DataforseoTaskLike): string {
  const match = message.match(INVALID_FIELD_MESSAGE_RE)
  if (!match) return message
  const field = match[1]
  if (!isRecord(task.data)) return message
  const value = task.data[field]
  if (value === undefined) return message
  return `${message} (envoyé ${field}=${JSON.stringify(value)})`
}

/**
 * "No Search Results" (40501) est un résultat vide réussi, pas un échec. On
 * teste le message, pas seulement le code : 40501 couvre aussi les rejets de
 * validation ("Invalid Field"), qui sont de vrais échecs facturés.
 */
export function isNoResultsTask(task: DataforseoTaskLike): boolean {
  return task.status_message?.toLowerCase().includes('no search results') ?? false
}

/**
 * Codes où le backend DataForSEO lui-même a échoué, renvoyés en HTTP 200 avec
 * une tâche en erreur. Liste explicite, pas une plage : 40101 est le plus
 * fréquent et vit dans la famille 40000, tandis que 50100 "Not Implemented"
 * signifie que nous avons posté un paramètre inexistant (notre bogue).
 * @see https://docs.dataforseo.com/v3/appendix/errors/
 */
const UPSTREAM_FAILURE_STATUS_CODES = new Set([
  40101, 40103, 50000, 50301, 50302, 50303, 50304, 50401, 50402,
])

function isUpstreamServerErrorTask(task: DataforseoTaskLike): boolean {
  return task.status_code !== undefined && UPSTREAM_FAILURE_STATUS_CODES.has(task.status_code)
}

/** Task Created / Task Handed / Task In Queue : en cours, pas en échec. */
const TASK_IN_PROGRESS_STATUS_CODES = new Set([20100, 40601, 40602])

export function isTaskInProgress(task: DataforseoTaskLike): boolean {
  return task.status_code !== undefined && TASK_IN_PROGRESS_STATUS_CODES.has(task.status_code)
}

type AssertOkOptions = {
  classify?: DataforseoErrorClassifier
  classifyPath?: string
  /** Traiter "no search results" (40501) comme un succès vide. */
  treatNoResultsAsEmpty?: boolean
  /** Statut de tâche valant succès : 20000 en live, 20100 "Task Created" en task_post. */
  okTaskStatusCode?: number
}

/**
 * Vérifie que la réponse et sa première tâche ont réussi, et renvoie la tâche.
 * L'échelle de statut partagée par tous les endpoints :
 *  - échec d'accès / solde -> erreur classifiée
 *  - backend DataForSEO en erreur -> UPSTREAM_UNAVAILABLE
 *  - tâche facturée mais échouée (coût présent) -> DataforseoChargedTaskError
 */
export function assertOk<T extends DataforseoTaskLike>(
  response: DataforseoResponseLike<T> | null,
  options: AssertOkOptions = {},
): T {
  if (!response) {
    throw new DataforseoError('INTERNAL_ERROR', 'DataForSEO a renvoyé une réponse vide')
  }
  const { classify, classifyPath, treatNoResultsAsEmpty, okTaskStatusCode } = options

  if (response.status_code !== 20000) {
    const message = response.status_message || 'Requête DataForSEO échouée'
    throw classify?.(response.status_code, message, classifyPath ?? '') ?? new DataforseoError('INTERNAL_ERROR', message)
  }

  const task = response.tasks?.[0]
  if (!task) {
    throw new DataforseoError('INTERNAL_ERROR', 'Réponse DataForSEO sans tâche')
  }

  if (task.status_code !== (okTaskStatusCode ?? 20000)) {
    if (treatNoResultsAsEmpty && isNoResultsTask(task)) return task

    const message = task.status_message || 'Tâche DataForSEO échouée'
    const path = classifyPath ?? (task.path ? `/${task.path.join('/')}` : '')
    const classified = classify?.(task.status_code, message, path)
    if (classified) throw classified

    const detailedMessage = describeInvalidField(message, task)
    const isUpstreamFailure = isUpstreamServerErrorTask(task)
    if (isUpstreamFailure) {
      console.warn('dataforseo.upstream-task-failed', { path, status: task.status_code, message: task.status_message })
    }
    const code: DataforseoErrorCode = isUpstreamFailure ? 'UPSTREAM_UNAVAILABLE' : 'INTERNAL_ERROR'

    const billing = tryBuildTaskBilling(task)
    if (billing) {
      throw new DataforseoChargedTaskError(detailedMessage, billing, INVALID_FIELD_MESSAGE_RE.test(message), code)
    }
    throw new DataforseoError(code, detailedMessage)
  }

  return task
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

/** Lit `task.result[0].total_count` des endpoints paginés. */
export function parseTaskTotalCount(task: DataforseoTaskLike): number | null {
  const first = task.result?.[0]
  if (!isRecord(first)) return null
  return typeof first.total_count === 'number' ? first.total_count : null
}

/** Lit `task.result[0].items` en le validant contre un schéma Zod. */
export function parseTaskItems<T extends z.ZodTypeAny>(
  endpoint: string,
  task: DataforseoTaskLike,
  itemSchema: T,
): Array<z.infer<T>> {
  const first = task.result?.[0]
  const items = isRecord(first) ? first.items : []
  const parsed = z.array(itemSchema).safeParse(items ?? [])
  if (!parsed.success) {
    console.error(`dataforseo.${endpoint}.invalid-payload`, parsed.error.issues.slice(0, 5))
    throw new DataforseoError('INTERNAL_ERROR', `DataForSEO ${endpoint} a renvoyé une forme de réponse invalide`)
  }
  return parsed.data
}

/**
 * Classificateur des refus d'accès et de solde partagé par les sections
 * facturées à part (backlinks). DataForSEO répond 40201/40202/40203 et un
 * 402 HTTP sur ces cas.
 */
export function createBillingClassifier(pathPrefix: string, message: string): DataforseoErrorClassifier {
  return (status, details, path) => {
    if (!path.includes(pathPrefix)) return null
    const lower = details.toLowerCase()
    const isBilling =
      status === 402 ||
      status === 40201 ||
      status === 40202 ||
      status === 40203 ||
      lower.includes('insufficient') ||
      lower.includes('not enough money') ||
      lower.includes('access denied') ||
      lower.includes('subscription')
    return isBilling ? new DataforseoError('BILLING_ISSUE', message, { providerPath: path }) : null
  }
}
