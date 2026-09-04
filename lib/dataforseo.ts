/**
 * Façade historique de l'intégration DataForSEO.
 *
 * Les fonctions ci-dessous gardent leur signature d'origine pour les routes
 * qui les appellent encore (recherche de mots-clés, vue d'ensemble), mais
 * elles délèguent désormais au client compté de `lib/dataforseo/` (portage
 * d'OpenSEO) : plafond mensuel, journal des coûts réels, erreurs classifiées.
 *
 * Nouveau code : importer `createDataforseoClient` depuis '@/lib/dataforseo/client'
 * ou '@/lib/dataforseo/index' plutôt que ces raccourcis.
 */
import { createDataforseoClient } from './dataforseo/client'
import { isDataforseoConfigured } from './dataforseo/core'
import { normalizeIntent, normalizeKeywordOverview, normalizeAdsKeyword } from './dataforseo/keyword-metrics'
import { DEFAULT_LOCATION_CODE, getKeywordDataProvider, LOCATION_OPTIONS } from './dataforseo/locations'
import type { UsageContext } from './dataforseo/budget'

export interface KeywordData {
  keyword: string
  volume: number
  cpc: number
  competition: number
  difficulty: number
  intent: string
  trend: number[]
}

export interface BacklinkData {
  sourceUrl: string
  sourceDomain: string
  targetUrl: string
  anchorText: string
  domainAuthority: number
  pageAuthority: number
  linkType: 'dofollow' | 'nofollow'
  firstSeen: string
  lastSeen: string
}

export interface BacklinkSummary {
  totalBacklinks: number
  referringDomains: number
  domainRank: number
  dofollow: number
  nofollow: number
}

function resolveLocation(location: string): number {
  const match = LOCATION_OPTIONS.find((option) => option.label.toLowerCase() === location.toLowerCase())
  return match?.code ?? DEFAULT_LOCATION_CODE
}

/** Intention lexicale de secours quand Labs n'en fournit pas (Google Ads). */
export function detectIntent(keyword: string): string {
  const kw = keyword.toLowerCase()
  if (/acheter|prix|tarif|pas cher|promo|livraison|commander/.test(kw)) return 'transactional'
  if (/comment|pourquoi|quand|qu.est|tutoriel|guide|definition/.test(kw)) return 'informational'
  if (/meilleur|comparatif|vs|avis|top|classement/.test(kw)) return 'commercial'
  return 'navigational'
}

function toKeywordData(row: {
  keyword: string
  searchVolume: number | null
  cpc: number | null
  competition: number | null
  keywordDifficulty: number | null
  intent: string | null
  monthlySearches: Array<{ searchVolume: number }>
}): KeywordData {
  const competition = row.competition ?? 0
  return {
    keyword: row.keyword,
    volume: row.searchVolume ?? 0,
    cpc: row.cpc ?? 0,
    competition,
    difficulty: row.keywordDifficulty ?? Math.round(competition * 100),
    intent: normalizeIntent(row.intent) ?? detectIntent(row.keyword),
    trend: row.monthlySearches.map((m) => m.searchVolume),
  }
}

export async function getKeywordVolumes(
  keywords: string[],
  language: string = 'fr',
  location: string = 'France',
  context: UsageContext = {},
): Promise<KeywordData[]> {
  if (!isDataforseoConfigured() || keywords.length === 0) return []
  const client = createDataforseoClient(context)
  const locationCode = resolveLocation(location)
  try {
    if (getKeywordDataProvider(locationCode) === 'google_ads') {
      const items = await client.keywords.adsSearchVolume({ keywords, locationCode, languageCode: language })
      return items.filter((i) => i.keyword).map((i) => toKeywordData(normalizeAdsKeyword(i, i.keyword!)))
    }
    const items = await client.keywords.overview({ keywords, locationCode, languageCode: language })
    return items.filter((i) => i.keyword).map((i) => toKeywordData(normalizeKeywordOverview(i, i.keyword!)))
  } catch (error) {
    console.error('DataForSEO keyword volumes error:', error)
    return []
  }
}

export async function getKeywordSuggestions(
  seed: string,
  language: string = 'fr',
  context: UsageContext = {},
  limit = 50,
): Promise<KeywordData[]> {
  if (!isDataforseoConfigured()) return []
  const client = createDataforseoClient(context)
  try {
    const items = await client.keywords.suggestions({
      keyword: seed,
      locationCode: DEFAULT_LOCATION_CODE,
      languageCode: language,
      limit,
    })
    return items.filter((i) => i.keyword).map((i) => toKeywordData(normalizeKeywordOverview(i, i.keyword!)))
  } catch (error) {
    console.error('DataForSEO keyword suggestions error:', error)
    return []
  }
}

export async function getBacklinkSummary(domain: string, context: UsageContext = {}): Promise<BacklinkSummary | null> {
  if (!isDataforseoConfigured()) return null
  const client = createDataforseoClient(context)
  try {
    const summary = await client.backlinks.summary({ target: domain })
    return {
      totalBacklinks: summary.backlinks ?? 0,
      referringDomains: summary.referring_domains ?? 0,
      domainRank: summary.rank ?? 0,
      dofollow: 0,
      nofollow: 0,
    }
  } catch (error) {
    console.error('DataForSEO backlink summary error:', error)
    return null
  }
}

export async function getBacklinks(domain: string, limit: number = 100, context: UsageContext = {}): Promise<BacklinkData[]> {
  if (!isDataforseoConfigured()) return []
  const client = createDataforseoClient(context)
  try {
    const { items } = await client.backlinks.rows({ target: domain, limit, filters: [['dofollow', '=', true]] })
    return items.map((r) => ({
      sourceUrl: r.url_from ?? '',
      sourceDomain: r.domain_from ?? '',
      targetUrl: r.url_to ?? '',
      anchorText: r.anchor ?? '',
      domainAuthority: r.domain_from_rank ?? 0,
      pageAuthority: r.page_from_rank ?? 0,
      linkType: r.dofollow ? 'dofollow' : 'nofollow',
      firstSeen: r.first_seen ?? '',
      lastSeen: r.last_visited ?? '',
    }))
  } catch (error) {
    console.error('DataForSEO backlinks error:', error)
    return []
  }
}

export async function getSERPResults(keyword: string, language: string = 'fr', context: UsageContext = {}): Promise<any[]> {
  if (!isDataforseoConfigured()) return []
  const client = createDataforseoClient(context)
  try {
    const items = await client.serp.live({ keyword, locationCode: DEFAULT_LOCATION_CODE, languageCode: language, depth: 20 })
    return items
      .filter((i) => i.type === 'organic')
      .map((i) => ({
        position: i.rank_absolute,
        url: i.url,
        domain: i.domain,
        title: i.title,
        description: i.description,
      }))
  } catch (error) {
    console.error('DataForSEO SERP error:', error)
    return []
  }
}

export { isDataforseoConfigured as isDataForSEOConfigured }
