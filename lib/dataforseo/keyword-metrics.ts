/**
 * Hydratation d'une liste de mots-clés avec des métriques fraîches, routée
 * par marché (Labs ou Google Ads) et par localisation (nationale ou locale).
 * Portage d'OpenSEO (MIT).
 *
 * Une demande locale (locationName) prend le volume chez Google Ads, seule
 * source acceptant un geotarget infra-national, et la difficulté / intention
 * nationales chez Labs. Un volume national n'est jamais affiché sous une
 * étiquette locale : les mots-clés que Google Ads ne renvoie pas gardent
 * KD / intention et un volume nul.
 */
import type { AdsKeywordItem } from './google-ads'
import type { KeywordOverviewItem } from './labs'
import { getKeywordDataProvider } from './locations'

// DataForSEO accepte ~700 mots-clés par requête sur ces endpoints.
const BATCH_SIZE = 700

export type MonthlySearch = { year: number; month: number; searchVolume: number }

export type KeywordMetricRow = {
  keyword: string
  searchVolume: number | null
  cpc: number | null
  competition: number | null
  competitionLevel: string | null
  keywordDifficulty: number | null
  intent: string | null
  monthlySearches: MonthlySearch[]
}

type MetricsClient = {
  keywordOverview: (input: {
    keywords: string[]
    locationCode: number
    languageCode: string
    includeClickstreamData?: boolean
  }) => Promise<KeywordOverviewItem[]>
  adsSearchVolume: (input: {
    keywords: string[]
    locationCode: number
    languageCode: string
    locationName?: string
  }) => Promise<AdsKeywordItem[]>
}

function toMonthlySearches(
  entries: Array<{ year?: number | null; month?: number | null; search_volume?: number | null }> | null | undefined,
): MonthlySearch[] {
  return (entries ?? []).map((entry) => ({
    year: entry.year ?? 0,
    month: entry.month ?? 0,
    searchVolume: entry.search_volume ?? 0,
  }))
}

export function normalizeKeywordOverview(item: KeywordOverviewItem, keyword: string): KeywordMetricRow {
  const info = item.keyword_info
  const clickstreamInfo = item.keyword_info_normalized_with_clickstream
  const usesClickstream = clickstreamInfo?.search_volume != null
  return {
    keyword,
    searchVolume: clickstreamInfo?.search_volume ?? info?.search_volume ?? null,
    cpc: info?.cpc ?? null,
    competition: info?.competition ?? null,
    competitionLevel: info?.competition_level ?? null,
    keywordDifficulty: item.keyword_properties?.keyword_difficulty ?? null,
    intent: item.search_intent_info?.main_intent ?? null,
    monthlySearches: toMonthlySearches(usesClickstream ? clickstreamInfo?.monthly_searches : info?.monthly_searches),
  }
}

export function normalizeAdsKeyword(item: AdsKeywordItem, keyword: string): KeywordMetricRow {
  return {
    keyword,
    searchVolume: item.search_volume ?? null,
    cpc: item.cpc ?? null,
    competition: item.competition_index != null ? item.competition_index / 100 : null,
    competitionLevel: item.competition ?? null,
    keywordDifficulty: null,
    intent: null,
    monthlySearches: toMonthlySearches(item.monthly_searches),
  }
}

function nullMetricRow(keyword: string): KeywordMetricRow {
  return {
    keyword,
    searchVolume: null,
    cpc: null,
    competition: null,
    competitionLevel: null,
    keywordDifficulty: null,
    intent: null,
    monthlySearches: [],
  }
}

export function mergeLocalAndNationalRows(
  keywords: string[],
  adsItems: AdsKeywordItem[],
  labsItems: KeywordOverviewItem[],
): KeywordMetricRow[] {
  const labsByKeyword = new Map(
    labsItems.filter((item) => item.keyword).map((item) => [item.keyword!.toLowerCase(), item]),
  )
  const rows: KeywordMetricRow[] = []
  const covered = new Set<string>()

  for (const item of adsItems) {
    if (!item.keyword) continue
    covered.add(item.keyword.toLowerCase())
    const row = normalizeAdsKeyword(item, item.keyword)
    const labs = labsByKeyword.get(item.keyword.toLowerCase())
    row.keywordDifficulty = labs?.keyword_properties?.keyword_difficulty ?? null
    row.intent = labs?.search_intent_info?.main_intent ?? null
    rows.push(row)
  }

  // Google Ads fusionne parfois des quasi-doublons : on garde KD / intention
  // nationales pour les absents, sans substituer le volume national.
  for (const keyword of keywords) {
    if (covered.has(keyword.toLowerCase())) continue
    const labs = labsByKeyword.get(keyword.toLowerCase())
    if (!labs) continue
    rows.push({
      ...nullMetricRow(keyword),
      keywordDifficulty: labs.keyword_properties?.keyword_difficulty ?? null,
      intent: labs.search_intent_info?.main_intent ?? null,
    })
  }
  return rows
}

export async function fetchKeywordMetricsForList(
  client: MetricsClient,
  params: {
    keywords: string[]
    locationCode: number
    languageCode: string
    includeClickstreamData?: boolean
    locationName?: string
  },
): Promise<KeywordMetricRow[]> {
  const useGoogleAds = getKeywordDataProvider(params.locationCode) === 'google_ads'
  const rows: KeywordMetricRow[] = []

  for (let i = 0; i < params.keywords.length; i += BATCH_SIZE) {
    const keywords = params.keywords.slice(i, i + BATCH_SIZE)

    if (useGoogleAds) {
      const items = await client.adsSearchVolume({
        keywords,
        locationCode: params.locationCode,
        locationName: params.locationName,
        languageCode: params.languageCode,
      })
      const covered = new Set<string>()
      for (const item of items) {
        if (!item.keyword) continue
        covered.add(item.keyword.toLowerCase())
        rows.push(normalizeAdsKeyword(item, item.keyword))
      }
      if (params.locationName) {
        rows.push(...keywords.filter((k) => !covered.has(k.toLowerCase())).map(nullMetricRow))
      }
    } else if (params.locationName) {
      const [adsItems, labsItems] = await Promise.all([
        client.adsSearchVolume({
          keywords,
          locationCode: params.locationCode,
          locationName: params.locationName,
          languageCode: params.languageCode,
        }),
        client.keywordOverview({
          keywords,
          locationCode: params.locationCode,
          languageCode: params.languageCode,
          includeClickstreamData: params.includeClickstreamData ?? false,
        }),
      ])
      rows.push(...mergeLocalAndNationalRows(keywords, adsItems, labsItems))
    } else {
      const items = await client.keywordOverview({
        keywords,
        locationCode: params.locationCode,
        languageCode: params.languageCode,
        includeClickstreamData: params.includeClickstreamData ?? false,
      })
      for (const item of items) {
        if (!item.keyword) continue
        rows.push(normalizeKeywordOverview(item, item.keyword))
      }
    }
  }
  return rows
}

/** Intention normalisée pour l'enum de l'application. */
export function normalizeIntent(intent: string | null): 'informational' | 'navigational' | 'transactional' | 'commercial' | null {
  switch (intent) {
    case 'informational':
    case 'navigational':
    case 'transactional':
    case 'commercial':
      return intent
    default:
      return null
  }
}
