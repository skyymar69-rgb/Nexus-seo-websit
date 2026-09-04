/**
 * SERP Google : résultats organiques live, vérification de position (rank
 * check) nationale ou locale, résultats Maps / Local Finder.
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

// DataForSEO explore (et facture) une page Google de 10 résultats à la fois,
// séquentiellement : la profondeur est le seul levier sur le coût et la latence.
export const SERP_ANALYSIS_DEPTH = 20

/** Les profondeurs hors 10-100 sont refusées. */
export function clampSerpDepth(depth: number): number {
  return Math.min(100, Math.max(10, depth))
}

/**
 * Arrête l'exploration dès que le domaine cible est trouvé : seules les pages
 * explorées sont facturées. Restreint aux résultats organiques, avec
 * sous-domaines, exactement comme buildRankCheckResult.
 */
function stopCrawlOnTarget(targetDomain: string) {
  return {
    stop_crawl_on_match: [{ match_value: targetDomain, match_type: 'with_subdomains' }],
    find_targets_in: ['organic'],
  }
}

export const serpSnapshotItemSchema = z
  .object({
    type: z.string(),
    rank_group: z.number().nullable().optional(),
    rank_absolute: z.number().nullable().optional(),
    domain: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    url: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    breadcrumb: z.string().nullable().optional(),
    etv: z.number().nullable().optional(),
  })
  .passthrough()

export type SerpLiveItem = z.infer<typeof serpSnapshotItemSchema>

export async function fetchLiveSerp(input: {
  keyword: string
  locationCode: number
  languageCode: string
  locationName?: string
  device?: 'desktop' | 'mobile'
  depth?: number
}): Promise<DataforseoApiResponse<SerpLiveItem[]>> {
  const device = input.device ?? 'desktop'
  const locationParams = input.locationName
    ? { location_name: input.locationName }
    : { location_code: input.locationCode }
  const response = await dataforseoPost('/v3/serp/google/organic/live/advanced', [
    {
      keyword: input.keyword,
      ...locationParams,
      language_code: input.languageCode,
      device,
      os: device === 'desktop' ? 'windows' : 'android',
      depth: clampSerpDepth(input.depth ?? SERP_ANALYSIS_DEPTH),
    },
  ])
  // Une SERP vide valide arrive en erreur de tâche : on la garde dans le
  // chemin de facturation et on renvoie une liste vide.
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return {
    data: parseTaskItems('google-organic-live-advanced', task, serpSnapshotItemSchema),
    billing: buildTaskBilling(task),
  }
}

export interface RankCheckResult {
  keywordId: string
  keyword: string
  position: number | null
  url: string | null
  serpFeatures: string[]
}

export function buildRankCheckResult(
  input: { keywordId: string; keyword: string; targetDomain: string },
  items: SerpLiveItem[],
): RankCheckResult {
  const target = input.targetDomain.toLowerCase().replace(/^www\./, '')
  const organicMatch = items.find((item) => {
    if (item.type !== 'organic' || item.domain == null) return false
    const domain = item.domain.toLowerCase().replace(/^www\./, '')
    return domain === target || domain.endsWith(`.${target}`)
  })
  return {
    keywordId: input.keywordId,
    keyword: input.keyword,
    // rank_group = position parmi les organiques (ce que l'utilisateur appelle
    // « ma position ») ; rank_absolute compterait aussi les blocs SERP.
    position: organicMatch ? (organicMatch.rank_group ?? organicMatch.rank_absolute ?? null) : null,
    url: organicMatch?.url ?? null,
    serpFeatures: Array.from(new Set(items.map((item) => item.type).filter(Boolean))),
  }
}

export async function fetchRankCheckSerp(input: {
  keyword: string
  keywordId: string
  locationCode: number
  languageCode: string
  locationName?: string
  device: 'desktop' | 'mobile'
  targetDomain: string
  depth: number
}): Promise<DataforseoApiResponse<RankCheckResult>> {
  const depth = clampSerpDepth(input.depth)
  const locationParams = input.locationName
    ? { location_name: input.locationName }
    : { location_code: input.locationCode }
  const response = await dataforseoPost('/v3/serp/google/organic/live/advanced', [
    {
      keyword: input.keyword,
      ...locationParams,
      language_code: input.languageCode,
      device: input.device,
      os: input.device === 'desktop' ? 'windows' : 'android',
      depth,
      ...stopCrawlOnTarget(input.targetDomain),
    },
  ])
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  const items = parseTaskItems('google-organic-live-advanced', task, serpSnapshotItemSchema)
  return { data: buildRankCheckResult(input, items), billing: buildTaskBilling(task) }
}

export async function fetchLocalSerp(input: {
  keyword: string
  locationCoordinate?: string
  locationName?: string
  languageCode: string
  searchType: 'maps' | 'local_finder'
  device: 'desktop' | 'mobile'
  depth: number
}): Promise<DataforseoApiResponse<Record<string, unknown>[]>> {
  const os = input.device === 'desktop' ? 'windows' : 'android'
  const locationParams = input.locationCoordinate
    ? { location_coordinate: input.locationCoordinate }
    : { location_name: input.locationName }
  const path =
    input.searchType === 'maps'
      ? '/v3/serp/google/maps/live/advanced'
      : '/v3/serp/google/local_finder/live/advanced'
  const response = await dataforseoPost<DataforseoItemsTask<Record<string, unknown>>>(path, [
    {
      keyword: input.keyword,
      ...locationParams,
      language_code: input.languageCode,
      device: input.device,
      os,
      depth: input.depth,
    },
  ])
  // 40501 = SERP vide facturée, fréquent sur des requêtes par coordonnées.
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}
