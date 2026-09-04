/**
 * API Backlinks DataForSEO : résumé, liste, domaines référents, pages,
 * historique. Portage d'OpenSEO (MIT). Cette API est facturée à part sur le
 * compte DataForSEO ; un refus d'accès est classifié BILLING_ISSUE.
 */
import { z } from 'zod'
import { dataforseoPost } from './core'
import {
  assertOk,
  buildTaskBilling,
  createBillingClassifier,
  parseTaskItems,
  parseTaskTotalCount,
  type DataforseoApiResponse,
} from './envelope'
import { DataforseoError } from './errors'

const classifyBacklinksError = createBillingClassifier(
  '/backlinks/',
  'Le compte DataForSEO n’a pas accès à l’API Backlinks ou n’a plus de solde',
)

export const DEFAULT_SPAM_THRESHOLD = 60

type BacklinksRequest = {
  target: string
  /** Sous-domaines inclus par défaut (comportement DataForSEO). */
  includeSubdomains?: boolean
}

type BacklinksListRequest = BacklinksRequest & {
  limit?: number
  offset?: number
  orderBy?: string[]
  filters?: unknown[]
  /** "one_per_domain" | "as_is" (liste des backlinks seulement). */
  mode?: string
  hideSpam?: boolean
  spamThreshold?: number
}

export const backlinksSummaryItemSchema = z
  .object({
    target: z.string().optional(),
    rank: z.number().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_pages: z.number().nullable().optional(),
    referring_domains: z.number().nullable().optional(),
    broken_backlinks: z.number().nullable().optional(),
    broken_pages: z.number().nullable().optional(),
    new_backlinks: z.number().nullable().optional(),
    lost_backlinks: z.number().nullable().optional(),
    // DataForSEO livre la clé mal orthographiée et la corrigée.
    new_reffering_domains: z.number().nullable().optional(),
    lost_reffering_domains: z.number().nullable().optional(),
    new_referring_domains: z.number().nullable().optional(),
    lost_referring_domains: z.number().nullable().optional(),
    backlinks_spam_score: z.number().nullable().optional(),
    info: z.object({ target_spam_score: z.number().nullable().optional() }).passthrough().nullable().optional(),
  })
  .passthrough()

export const backlinksItemSchema = z
  .object({
    domain_from: z.string().nullable().optional(),
    url_from: z.string().nullable().optional(),
    url_to: z.string().nullable().optional(),
    anchor: z.string().nullable().optional(),
    item_type: z.string().nullable().optional(),
    dofollow: z.boolean().nullable().optional(),
    rank: z.number().nullable().optional(),
    domain_from_rank: z.number().nullable().optional(),
    page_from_rank: z.number().nullable().optional(),
    backlink_spam_score: z.number().nullable().optional(),
    first_seen: z.string().nullable().optional(),
    last_visited: z.string().nullable().optional(),
    lost_date: z.string().nullable().optional(),
    is_new: z.boolean().nullable().optional(),
    is_lost: z.boolean().nullable().optional(),
    is_broken: z.boolean().nullable().optional(),
  })
  .passthrough()

export const referringDomainItemSchema = z
  .object({
    domain: z.string().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_pages: z.number().nullable().optional(),
    rank: z.number().nullable().optional(),
    first_seen: z.string().nullable().optional(),
    broken_backlinks: z.number().nullable().optional(),
    backlinks_spam_score: z.number().nullable().optional(),
  })
  .passthrough()

export const backlinksHistoryItemSchema = z
  .object({
    date: z.string().nullable().optional(),
    rank: z.number().nullable().optional(),
    backlinks: z.number().nullable().optional(),
    referring_domains: z.number().nullable().optional(),
    new_backlinks: z.number().nullable().optional(),
    lost_backlinks: z.number().nullable().optional(),
    new_referring_domains: z.number().nullable().optional(),
    lost_referring_domains: z.number().nullable().optional(),
  })
  .passthrough()

export type BacklinksSummaryItem = z.infer<typeof backlinksSummaryItemSchema>
export type BacklinksItem = z.infer<typeof backlinksItemSchema>
export type ReferringDomainItem = z.infer<typeof referringDomainItemSchema>
export type BacklinksHistoryItem = z.infer<typeof backlinksHistoryItemSchema>

function commonPayload(input: BacklinksRequest) {
  return {
    target: input.target,
    include_subdomains: input.includeSubdomains ?? true,
    include_indirect_links: true,
    exclude_internal_backlinks: true,
    backlinks_status_type: 'live',
    rank_scale: 'one_hundred',
  }
}

const assertOptions = (path: string) => ({ classify: classifyBacklinksError, classifyPath: path }) as const

function combineFilters(userFilters: unknown[] | undefined, spamCondition: unknown[] | undefined): unknown[] | undefined {
  const merged: unknown[] = []
  if (userFilters && userFilters.length > 0) merged.push(...userFilters)
  if (spamCondition) {
    if (merged.length > 0) merged.push('and')
    merged.push(spamCondition)
  }
  return merged.length > 0 ? merged : undefined
}

function spamCondition(field: string, input: BacklinksListRequest): unknown[] | undefined {
  const hide = input.hideSpam ?? true
  return hide ? [field, '<=', input.spamThreshold ?? DEFAULT_SPAM_THRESHOLD] : undefined
}

/** Cible normalisée : domaine nu (sans protocole ni www) ou URL de page complète. */
export function normalizeBacklinksTarget(raw: string): string {
  const trimmed = raw.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed)
      if (url.pathname === '/' && !url.search) return url.hostname.replace(/^www\./, '')
      return url.toString()
    } catch {
      /* passe au traitement domaine */
    }
  }
  return trimmed.replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase()
}

export async function fetchBacklinksSummary(input: BacklinksRequest): Promise<DataforseoApiResponse<BacklinksSummaryItem>> {
  const response = await dataforseoPost('/v3/backlinks/summary/live', [commonPayload(input)], {
    classify: classifyBacklinksError,
  })
  const task = assertOk(response, assertOptions('/v3/backlinks/summary/live'))
  const first = task.result?.[0]
  if (!first) return { data: {}, billing: buildTaskBilling(task) }
  const parsed = backlinksSummaryItemSchema.safeParse(first)
  if (!parsed.success) {
    console.error('dataforseo.backlinks-summary-live.invalid-result', parsed.error.issues.slice(0, 5))
    throw new DataforseoError('INTERNAL_ERROR', 'DataForSEO backlinks/summary a renvoyé une forme invalide')
  }
  return { data: parsed.data, billing: buildTaskBilling(task) }
}

export async function fetchBacklinksRows(
  input: BacklinksListRequest,
): Promise<DataforseoApiResponse<{ items: BacklinksItem[]; totalCount: number | null }>> {
  const filters = combineFilters(input.filters, spamCondition('backlink_spam_score', input))
  const response = await dataforseoPost(
    '/v3/backlinks/backlinks/live',
    [
      {
        ...commonPayload(input),
        limit: input.limit ?? 100,
        offset: input.offset,
        order_by: input.orderBy ?? ['rank,desc'],
        mode: input.mode ?? 'one_per_domain',
        ...(filters ? { filters } : {}),
      },
    ],
    { classify: classifyBacklinksError },
  )
  const task = assertOk(response, assertOptions('/v3/backlinks/backlinks/live'))
  return {
    data: { items: parseTaskItems('backlinks-live', task, backlinksItemSchema), totalCount: parseTaskTotalCount(task) },
    billing: buildTaskBilling(task),
  }
}

export async function fetchReferringDomains(
  input: BacklinksListRequest,
): Promise<DataforseoApiResponse<{ items: ReferringDomainItem[]; totalCount: number | null }>> {
  const filters = combineFilters(input.filters, spamCondition('backlinks_spam_score', input))
  const response = await dataforseoPost(
    '/v3/backlinks/referring_domains/live',
    [
      {
        ...commonPayload(input),
        limit: input.limit ?? 100,
        offset: input.offset,
        order_by: input.orderBy ?? ['backlinks,desc'],
        ...(filters ? { filters } : {}),
      },
    ],
    { classify: classifyBacklinksError },
  )
  const task = assertOk(response, assertOptions('/v3/backlinks/referring_domains/live'))
  return {
    data: {
      items: parseTaskItems('referring-domains-live', task, referringDomainItemSchema),
      totalCount: parseTaskTotalCount(task),
    },
    billing: buildTaskBilling(task),
  }
}

export async function fetchBacklinksHistory(input: {
  target: string
  dateFrom: string
  dateTo: string
}): Promise<DataforseoApiResponse<BacklinksHistoryItem[]>> {
  const response = await dataforseoPost(
    '/v3/backlinks/history/live',
    [{ target: input.target, date_from: input.dateFrom, date_to: input.dateTo, rank_scale: 'one_hundred' }],
    { classify: classifyBacklinksError },
  )
  const task = assertOk(response, assertOptions('/v3/backlinks/history/live'))
  return {
    data: parseTaskItems('backlinks-history-live', task, backlinksHistoryItemSchema),
    billing: buildTaskBilling(task),
  }
}
