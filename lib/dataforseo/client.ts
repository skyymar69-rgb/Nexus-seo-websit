/**
 * Client DataForSEO compté. Portage d'OpenSEO (src/server/lib/dataforseo/client.ts,
 * MIT) : le comptage Autumn est remplacé par le journal Prisma de budget.ts.
 *
 * Chaque entrée du client est `meter(fetchX, feature)` : même signature que
 * le fetcher, résout sur sa donnée dépouillée, et journalise le coût réel.
 * Aucun chemin de code ne doit appeler un fetcher de section directement
 * depuis une route ou un outil MCP.
 */
import { meterDataforseoCall, type DataforseoFeature, type UsageContext } from './budget'
import type { DataforseoApiResponse } from './envelope'
import {
  fetchBacklinksHistory,
  fetchBacklinksRows,
  fetchBacklinksSummary,
  fetchReferringDomains,
} from './backlinks'
import {
  fetchBusinessListingsCategories,
  fetchBusinessListingsSearch,
  fetchMyBusinessInfo,
  fetchQuestionsAnswers,
} from './business'
import { fetchAdsKeywordIdeas, fetchAdsSearchVolume } from './google-ads'
import {
  fetchDomainRankOverview,
  fetchKeywordIdeas,
  fetchKeywordOverview,
  fetchKeywordSuggestions,
  fetchRankedKeywords,
  fetchRelatedKeywords,
  fetchRelevantPages,
  fetchSerpCompetitors,
} from './labs'
import { fetchLiveSerp, fetchLocalSerp, fetchRankCheckSerp } from './serp'

function meter<I, T>(
  context: UsageContext,
  fetcher: (input: I) => Promise<DataforseoApiResponse<T>>,
  defaultFeature: DataforseoFeature,
): (input: I & { feature?: DataforseoFeature }) => Promise<T> {
  return (input) => meterDataforseoCall(context, input.feature ?? defaultFeature, () => fetcher(input))
}

export function createDataforseoClient(context: UsageContext = {}) {
  return {
    keywords: {
      related: meter(context, fetchRelatedKeywords, 'keyword_research'),
      suggestions: meter(context, fetchKeywordSuggestions, 'keyword_research'),
      ideas: meter(context, fetchKeywordIdeas, 'keyword_research'),
      overview: meter(context, fetchKeywordOverview, 'keyword_research'),
      adsIdeas: meter(context, fetchAdsKeywordIdeas, 'keyword_research'),
      adsSearchVolume: meter(context, fetchAdsSearchVolume, 'keyword_research'),
    },
    domain: {
      rankOverview: meter(context, fetchDomainRankOverview, 'domain'),
      rankedKeywords: meter(context, fetchRankedKeywords, 'domain'),
      relevantPages: meter(context, fetchRelevantPages, 'domain'),
      serpCompetitors: meter(context, fetchSerpCompetitors, 'domain'),
    },
    serp: {
      live: meter(context, fetchLiveSerp, 'serp'),
      rankCheck: meter(context, fetchRankCheckSerp, 'rank_tracking'),
      local: meter(context, fetchLocalSerp, 'local_seo'),
    },
    backlinks: {
      summary: meter(context, fetchBacklinksSummary, 'backlinks'),
      rows: meter(context, fetchBacklinksRows, 'backlinks'),
      referringDomains: meter(context, fetchReferringDomains, 'backlinks'),
      history: meter(context, fetchBacklinksHistory, 'backlinks'),
    },
    business: {
      listings: meter(context, fetchBusinessListingsSearch, 'local_seo'),
      questionsAnswers: meter(context, fetchQuestionsAnswers, 'local_seo'),
      myBusinessInfo: meter(context, fetchMyBusinessInfo, 'local_seo'),
      // Gratuit ($0) mais journalisé quand même : une ligne à coût nul.
      categories: meter(context, fetchBusinessListingsCategories, 'local_seo'),
    },
  } as const
}

export type DataforseoClient = ReturnType<typeof createDataforseoClient>
