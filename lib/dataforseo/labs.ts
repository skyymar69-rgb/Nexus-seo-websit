/**
 * DataForSEO Labs : mots-clés apparentés, suggestions, idées, vue d'ensemble
 * de domaine, mots-clés classés, pages pertinentes, concurrents SERP.
 * Portage d'OpenSEO (MIT).
 */
import { z } from 'zod'
import { dataforseoPost } from './core'
import {
  assertOk,
  buildTaskBilling,
  parseTaskItems,
  type DataforseoApiResponse,
  type DataforseoItemsTask,
} from './envelope'

// Types de charge utile : les champs lus par l'application, typés honnêtement
// (le fil peut renvoyer null partout) ; la signature d'index laisse passer le reste.

export interface LabsMonthlySearch {
  year?: number | null
  month?: number | null
  search_volume?: number | null
  [key: string]: unknown
}

export interface LabsKeywordInfo {
  search_volume?: number | null
  cpc?: number | null
  /** Ratio 0-1 de concurrence payante (Google Ads renvoie un indice 0-100). */
  competition?: number | null
  competition_level?: string | null
  monthly_searches?: LabsMonthlySearch[] | null
  [key: string]: unknown
}

export interface LabsKeywordDataItem {
  keyword?: string | null
  keyword_info?: LabsKeywordInfo | null
  keyword_info_normalized_with_clickstream?: LabsKeywordInfo | null
  keyword_properties?: { keyword_difficulty?: number | null; [key: string]: unknown } | null
  search_intent_info?: { main_intent?: string | null; [key: string]: unknown } | null
  [key: string]: unknown
}

export type KeywordOverviewItem = LabsKeywordDataItem

type RelatedKeywordItem = { keyword_data?: LabsKeywordDataItem | null; [key: string]: unknown }

type LabsMetricsBlock = {
  organic?: { etv?: number | null; count?: number | null; [key: string]: unknown } | null
  [key: string]: unknown
}

export type DomainMetricsItem = { metrics?: LabsMetricsBlock | null; [key: string]: unknown }

export interface RelevantPagesItem {
  page_address?: string | null
  metrics?: LabsMetricsBlock | null
  [key: string]: unknown
}

export type SerpCompetitorItem = {
  domain?: string | null
  avg_position?: number | null
  median_position?: number | null
  visibility?: number | null
  etv?: number | null
  keywords_count?: number | null
  [key: string]: unknown
}

const rankedSerpItemSchema = z
  .object({
    url: z.string().nullable().optional(),
    relative_url: z.string().nullable().optional(),
    rank_absolute: z.number().nullable().optional(),
    etv: z.number().nullable().optional(),
  })
  .passthrough()

const domainRankedKeywordItemSchema = z
  .object({
    keyword_data: z
      .object({
        keyword: z.string().nullable().optional(),
        keyword_info: z
          .object({
            search_volume: z.number().nullable().optional(),
            cpc: z.number().nullable().optional(),
          })
          .passthrough()
          .nullable()
          .optional(),
        keyword_properties: z
          .object({ keyword_difficulty: z.number().nullable().optional() })
          .passthrough()
          .nullable()
          .optional(),
        search_intent_info: z
          .object({ main_intent: z.string().nullable().optional() })
          .passthrough()
          .nullable()
          .optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
    ranked_serp_element: z
      .object({
        serp_item: rankedSerpItemSchema.nullable().optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough()

export type DomainRankedKeywordItem = z.infer<typeof domainRankedKeywordItemSchema>

export type DataforseoLabsItemType = 'organic' | 'paid' | 'featured_snippet' | 'local_pack' | 'ai_overview_reference'

type MarketInput = { locationCode: number; languageCode: string }

export async function fetchRelatedKeywords(
  input: MarketInput & { keyword: string; limit: number; depth?: number; includeClickstreamData?: boolean },
): Promise<DataforseoApiResponse<RelatedKeywordItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<RelatedKeywordItem>>(
    '/v3/dataforseo_labs/google/related_keywords/live',
    [
      {
        keyword: input.keyword,
        location_code: input.locationCode,
        language_code: input.languageCode,
        limit: input.limit,
        depth: input.depth ?? 3,
        // Les volumes affinés par clickstream DOUBLENT le coût : opt-in.
        include_clickstream_data: input.includeClickstreamData ?? false,
        include_serp_info: false,
      },
    ],
  )
  const task = assertOk(response)
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

export async function fetchKeywordSuggestions(
  input: MarketInput & { keyword: string; limit: number; includeClickstreamData?: boolean },
): Promise<DataforseoApiResponse<LabsKeywordDataItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<LabsKeywordDataItem>>(
    '/v3/dataforseo_labs/google/keyword_suggestions/live',
    [
      {
        keyword: input.keyword,
        location_code: input.locationCode,
        language_code: input.languageCode,
        limit: input.limit,
        include_clickstream_data: input.includeClickstreamData ?? false,
        include_serp_info: false,
        include_seed_keyword: true,
        ignore_synonyms: false,
        exact_match: false,
      },
    ],
  )
  const task = assertOk(response)
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

export async function fetchKeywordIdeas(
  input: MarketInput & { keyword: string; limit: number; includeClickstreamData?: boolean },
): Promise<DataforseoApiResponse<LabsKeywordDataItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<LabsKeywordDataItem>>(
    '/v3/dataforseo_labs/google/keyword_ideas/live',
    [
      {
        keywords: [input.keyword],
        location_code: input.locationCode,
        language_code: input.languageCode,
        limit: input.limit,
        include_clickstream_data: input.includeClickstreamData ?? false,
        include_serp_info: false,
        ignore_synonyms: false,
        closely_variants: false,
      },
    ],
  )
  const task = assertOk(response)
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

export async function fetchKeywordOverview(
  input: MarketInput & { keywords: string[]; includeClickstreamData?: boolean },
): Promise<DataforseoApiResponse<KeywordOverviewItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<KeywordOverviewItem>>(
    '/v3/dataforseo_labs/google/keyword_overview/live',
    [
      {
        keywords: input.keywords,
        location_code: input.locationCode,
        language_code: input.languageCode,
        include_clickstream_data: input.includeClickstreamData ?? false,
      },
    ],
  )
  const task = assertOk(response)
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

export async function fetchDomainRankOverview(
  input: MarketInput & { target: string },
): Promise<DataforseoApiResponse<DomainMetricsItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<DomainMetricsItem>>(
    '/v3/dataforseo_labs/google/domain_rank_overview/live',
    [{ target: input.target, location_code: input.locationCode, language_code: input.languageCode, limit: 1 }],
  )
  const task = assertOk(response)
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

type RankedKeywordsPage = { items: DomainRankedKeywordItem[]; totalCount: number | null }

export async function fetchRankedKeywords(
  input: MarketInput & {
    target: string
    limit: number
    offset?: number
    orderBy?: string[]
    filters?: unknown[]
    itemTypes?: DataforseoLabsItemType[]
  },
): Promise<DataforseoApiResponse<RankedKeywordsPage>> {
  // ranked_keywords n'a pas de include_subdomains : un domaine couvre toujours
  // ses sous-domaines ; les périmètres plus étroits passent par `filters`.
  const response = await dataforseoPost<DataforseoItemsTask<unknown>>(
    '/v3/dataforseo_labs/google/ranked_keywords/live',
    [
      {
        target: input.target,
        location_code: input.locationCode,
        language_code: input.languageCode,
        limit: input.limit,
        offset: input.offset,
        order_by: input.orderBy,
        filters: input.filters,
        item_types: input.itemTypes,
      },
    ],
  )
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return {
    data: {
      items: parseTaskItems('google-ranked-keywords-live', task, domainRankedKeywordItemSchema),
      totalCount: task.result?.[0]?.total_count ?? null,
    },
    billing: buildTaskBilling(task),
  }
}

type RelevantPagesPage = { items: RelevantPagesItem[]; totalCount: number | null }

export async function fetchRelevantPages(
  input: MarketInput & { target: string; limit: number; offset?: number; orderBy?: string[]; filters?: unknown[] },
): Promise<DataforseoApiResponse<RelevantPagesPage>> {
  const response = await dataforseoPost<DataforseoItemsTask<RelevantPagesItem>>(
    '/v3/dataforseo_labs/google/relevant_pages/live',
    [
      {
        target: input.target,
        location_code: input.locationCode,
        language_code: input.languageCode,
        limit: input.limit,
        offset: input.offset,
        order_by: input.orderBy,
        filters: input.filters,
      },
    ],
  )
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return {
    data: { items: task.result?.[0]?.items ?? [], totalCount: task.result?.[0]?.total_count ?? null },
    billing: buildTaskBilling(task),
  }
}

export async function fetchSerpCompetitors(
  input: MarketInput & {
    keywords: string[]
    itemTypes?: DataforseoLabsItemType[]
    includeSubdomains?: boolean
    limit: number
    offset?: number
  },
): Promise<DataforseoApiResponse<SerpCompetitorItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<SerpCompetitorItem>>(
    '/v3/dataforseo_labs/google/serp_competitors/live',
    [
      {
        keywords: input.keywords,
        location_code: input.locationCode,
        language_code: input.languageCode,
        item_types: input.itemTypes,
        include_subdomains: input.includeSubdomains,
        limit: input.limit,
        offset: input.offset,
      },
    ],
  )
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}
