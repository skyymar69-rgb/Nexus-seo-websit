/**
 * Surface publique de l'intégration DataForSEO (portage d'OpenSEO, MIT).
 * Les internes vivent dans les fichiers de section ; tout passe par
 * envelope.ts (statut + coût) et est compté dans client.ts / budget.ts.
 */
export { createDataforseoClient, type DataforseoClient } from './client'
export { isDataforseoConfigured } from './core'
export { DataforseoError, describeDataforseoError, type DataforseoErrorCode } from './errors'
export {
  getBudgetStatus,
  getMonthlyBudgetUsd,
  getMonthlyUsageByFeature,
  microsToUsd,
  usdToMicros,
  type BudgetStatus,
  type DataforseoFeature,
  type UsageContext,
} from './budget'
export {
  fetchKeywordMetricsForList,
  normalizeIntent,
  normalizeKeywordOverview,
  normalizeAdsKeyword,
  type KeywordMetricRow,
  type MonthlySearch,
} from './keyword-metrics'
export {
  DEFAULT_LANGUAGE_CODE,
  DEFAULT_LOCATION_CODE,
  LOCATION_OPTIONS,
  formatLocationLabel,
  getIsoCountryCode,
  getKeywordDataProvider,
  getLocationOption,
  isSupportedLanguageCode,
  isSupportedLocationCode,
  resolveMarket,
  type LocationOption,
} from './locations'
export { fetchSerpLocationsForCountry, searchSerpLocations, type SerpLocationResult } from './serp-locations'
export { SERP_ANALYSIS_DEPTH, buildRankCheckResult, clampSerpDepth, type RankCheckResult, type SerpLiveItem } from './serp'
export { normalizeBacklinksTarget, DEFAULT_SPAM_THRESHOLD } from './backlinks'
export type { LabsKeywordDataItem, DomainRankedKeywordItem, RelevantPagesItem, SerpCompetitorItem } from './labs'
export type { AdsKeywordItem } from './google-ads'
export type { BacklinksSummaryItem, BacklinksItem, ReferringDomainItem, BacklinksHistoryItem } from './backlinks'
