/**
 * Données mots-clés Google Ads : pays non couverts par Labs, et volumes
 * localisés (ville, région) que Labs ne sait pas produire. Prix forfaitaire
 * par requête ; volume / CPC / concurrence, mais ni difficulté ni intention.
 * Portage d'OpenSEO (MIT).
 */
import { dataforseoPost } from './core'
import type { LabsMonthlySearch } from './labs'
import { assertOk, buildTaskBilling, type DataforseoApiResponse, type DataforseoTaskLike } from './envelope'

export interface AdsKeywordItem {
  keyword?: string | null
  search_volume?: number | null
  cpc?: number | null
  /** "LOW" | "MEDIUM" | "HIGH" (Labs renvoie un ratio 0-1). */
  competition?: string | null
  /** Échelle 0-100 ; l'application stocke un ratio 0-1. */
  competition_index?: number | null
  monthly_searches?: LabsMonthlySearch[] | null
  [key: string]: unknown
}

type KeywordsDataTask<T> = DataforseoTaskLike & { result?: T[] }

// Les tâches keywords_data renvoient les éléments directement dans `result`.
function taskItems<T>(task: KeywordsDataTask<T>): T[] {
  return task.result ?? []
}

export async function fetchAdsSearchVolume(input: {
  keywords: string[]
  locationCode: number
  languageCode: string
  /** location_name canonique DataForSEO (ville, région) : Google Ads accepte tout geotarget. */
  locationName?: string
}): Promise<DataforseoApiResponse<AdsKeywordItem[]>> {
  const locationParams = input.locationName
    ? { location_name: input.locationName }
    : { location_code: input.locationCode }
  const response = await dataforseoPost<KeywordsDataTask<AdsKeywordItem>>(
    '/v3/keywords_data/google_ads/search_volume/live',
    [{ keywords: input.keywords, ...locationParams, language_code: input.languageCode }],
  )
  const task = assertOk(response)
  return { data: taskItems(task), billing: buildTaskBilling(task) }
}

export async function fetchAdsKeywordIdeas(input: {
  keyword: string
  locationCode: number
  languageCode: string
  limit: number
}): Promise<DataforseoApiResponse<AdsKeywordItem[]>> {
  const response = await dataforseoPost<KeywordsDataTask<AdsKeywordItem>>(
    '/v3/keywords_data/google_ads/keywords_for_keywords/live',
    [
      {
        keywords: [input.keyword],
        location_code: input.locationCode,
        language_code: input.languageCode,
        sort_by: 'search_volume',
      },
    ],
  )
  const task = assertOk(response)
  // Pas de paramètre limit sur cet endpoint : on tronque côté appelant.
  return { data: taskItems(task).slice(0, input.limit), billing: buildTaskBilling(task) }
}
