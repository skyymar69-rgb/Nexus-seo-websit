import { z } from 'zod'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import {
  fetchKeywordMetricsForList,
  normalizeAdsKeyword,
  normalizeKeywordOverview,
  type KeywordMetricRow,
} from '@/lib/dataforseo/keyword-metrics'
import { getKeywordDataProvider, isSupportedLanguageCode, resolveMarket } from '@/lib/dataforseo/locations'
import { SERP_ANALYSIS_DEPTH } from '@/lib/dataforseo/serp'
import { dashboardUrl, usageContext } from '../context'
import { errorMessage, formatMcpTable, mcpResponse, type McpTableColumn } from '../helpers'
import { defineTool } from '../server'

export const locationCodeSchema = z
  .number()
  .int()
  .positive()
  .optional()
  .describe('Code de localisation DataForSEO (2250 = France par défaut, 2056 Belgique, 2756 Suisse, 2124 Canada).')

export const languageCodeSchema = z
  .string()
  .refine(isSupportedLanguageCode, { message: 'Langue non prise en charge (fr, en, de, es, it, pt, nl).' })
  .optional()
  .describe('Code langue (fr par défaut).')

const METRIC_COLUMNS: McpTableColumn<KeywordMetricRow>[] = [
  { header: 'mot-clé', value: (row) => row.keyword },
  { header: 'volume', value: (row) => row.searchVolume },
  { header: 'KD', value: (row) => row.keywordDifficulty },
  { header: 'CPC', value: (row) => row.cpc },
  { header: 'concurrence', value: (row) => row.competition },
  { header: 'intention', value: (row) => row.intent },
]

export const researchKeywordsTool = defineTool({
  name: 'research_keywords',
  title: 'Rechercher des mots-clés',
  description:
    'Idées de mots-clés (volume, difficulté, CPC, intention) pour 1 à 5 mots-clés de départ, chacun traité indépendamment. Facturé : environ 0,01 à 0,05 $ par mot-clé de départ. Un échec sur un mot-clé ne fait pas échouer le lot.',
  inputSchema: {
    seeds: z.array(z.string().min(1).max(200)).min(1).max(5).describe('1 à 5 mots-clés de départ.'),
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    limit: z.number().int().min(10).max(300).optional().describe('Nombre max de résultats par mot-clé (50 par défaut).'),
    websiteId: z.string().optional().describe('Site auquel attribuer la dépense (facultatif).'),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const limit = args.limit ?? 50
    const useAds = getKeywordDataProvider(locationCode) === 'google_ads'
    const results = await Promise.all(
      args.seeds.map(async (seed) => {
        try {
          const rows = useAds
            ? (await client.keywords.adsIdeas({ keyword: seed, locationCode, languageCode, limit }))
                .filter((i) => i.keyword)
                .map((i) => normalizeAdsKeyword(i, i.keyword!))
            : (await client.keywords.suggestions({ keyword: seed, locationCode, languageCode, limit }))
                .filter((i) => i.keyword)
                .map((i) => normalizeKeywordOverview(i, i.keyword!))
          return { seed, ok: true as const, source: useAds ? 'google_ads' : 'labs', rowCount: rows.length, rows }
        } catch (error) {
          return { seed, ok: false as const, error: errorMessage(error) }
        }
      }),
    )
    const text = results
      .map((r) =>
        r.ok
          ? `## « ${r.seed} » — ${r.rowCount} mots-clés (source : ${r.source})\n${r.rowCount ? formatMcpTable(r.rows, METRIC_COLUMNS) : '(aucun résultat)'}`
          : `## « ${r.seed} » — ÉCHEC\n${r.error}`,
      )
      .join('\n\n')
    return mcpResponse({
      text: `${text}\n\nColonnes : volume = recherches mensuelles, KD = difficulté 0-100, CPC en USD, concurrence payante 0-1 ; « — » = indisponible.`,
      meta: { url: dashboardUrl(context, '/dashboard/keyword-magic') },
      structuredContent: { results },
    })
  },
})

export const getKeywordMetricsTool = defineTool({
  name: 'get_keyword_metrics',
  title: 'Métriques de mots-clés',
  description:
    'Volume, difficulté, CPC, intention et tendance mensuelle pour une liste de mots-clés connus (jusqu’à 200). Avec locationName (ville, département), le volume devient local via Google Ads et la difficulté reste nationale. Facturé : environ 0,01 $ par lot de 100.',
  inputSchema: {
    keywords: z.array(z.string().min(1).max(200)).min(1).max(200),
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    locationName: z
      .string()
      .max(200)
      .optional()
      .describe('Localisation canonique DataForSEO pour un volume local, ex. "Lyon,Auvergne-Rhone-Alpes,France" (voir search_local_locations).'),
    includeClickstreamData: z.boolean().optional().describe('Volumes affinés par clickstream : double le coût.'),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const rows = await fetchKeywordMetricsForList(
      { keywordOverview: client.keywords.overview, adsSearchVolume: client.keywords.adsSearchVolume },
      { keywords: args.keywords, locationCode, languageCode, locationName: args.locationName, includeClickstreamData: args.includeClickstreamData },
    )
    return mcpResponse({
      text: rows.length ? formatMcpTable(rows, METRIC_COLUMNS) : 'Aucune métrique renvoyée.',
      structuredContent: { rows, locationCode, languageCode, locationName: args.locationName ?? null },
    })
  },
})

export const getSerpResultsTool = defineTool({
  name: 'get_serp_results',
  title: 'Résultats Google (SERP)',
  description:
    'Résultats organiques Google en direct pour 1 à 10 requêtes : qui se positionne, sur quelle URL, avec quels blocs SERP. Facturé : environ 0,005 $ par requête à la profondeur 20 (+0,0025 $ par tranche de 10).',
  inputSchema: {
    queries: z.array(z.string().min(1).max(200)).min(1).max(10),
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    locationName: z.string().max(200).optional().describe('Localisation locale canonique (SERP vue depuis une ville).'),
    device: z.enum(['desktop', 'mobile']).optional(),
    depth: z.number().int().min(10).max(100).optional().describe('Profondeur, multiple de 10 (20 par défaut).'),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const depth = args.depth ?? SERP_ANALYSIS_DEPTH
    const results = await Promise.all(
      args.queries.map(async (keyword) => {
        try {
          const items = await client.serp.live({ keyword, locationCode, languageCode, locationName: args.locationName, device: args.device, depth })
          const trimmed = items.slice(0, depth).map((item) => ({
            type: item.type,
            rank: item.rank_absolute ?? item.rank_group ?? null,
            title: item.title ?? null,
            url: item.url ?? null,
            domain: item.domain ?? null,
            description: item.description ?? null,
          }))
          return { keyword, ok: true as const, items: trimmed }
        } catch (error) {
          return { keyword, ok: false as const, error: errorMessage(error) }
        }
      }),
    )
    const text = results
      .map((r) =>
        r.ok
          ? `« ${r.keyword} » (${r.items.length} résultats) :\n${formatMcpTable(r.items, [
              { header: 'rang', value: (i) => i.rank },
              { header: 'type', value: (i) => i.type },
              { header: 'domaine', value: (i) => i.domain },
              { header: 'titre', value: (i) => i.title },
              { header: 'url', value: (i) => i.url },
            ])}`
          : `« ${r.keyword} » : ÉCHEC — ${r.error}`,
      )
      .join('\n\n')
    return mcpResponse({ text, structuredContent: { results, depth } })
  },
})

export const findSerpCompetitorsTool = defineTool({
  name: 'find_serp_competitors',
  title: 'Concurrents SERP',
  description:
    'Domaines qui se positionnent le plus souvent sur un jeu de 1 à 20 mots-clés (position moyenne, visibilité, trafic estimé). Facturé : environ 0,01 $ par appel.',
  inputSchema: {
    keywords: z.array(z.string().min(1).max(200)).min(1).max(20),
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    limit: z.number().int().min(5).max(100).optional(),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const items = await client.domain.serpCompetitors({ keywords: args.keywords, locationCode, languageCode, limit: args.limit ?? 20 })
    const rows = items.map((item) => ({
      domain: item.domain ?? null,
      avgPosition: item.avg_position ?? null,
      medianPosition: item.median_position ?? null,
      visibility: item.visibility ?? null,
      etv: item.etv ?? null,
      keywordsCount: item.keywords_count ?? null,
    }))
    return mcpResponse({
      text: rows.length
        ? formatMcpTable(rows, [
            { header: 'domaine', value: (r) => r.domain },
            { header: 'pos. moy.', value: (r) => r.avgPosition },
            { header: 'visibilité', value: (r) => r.visibility },
            { header: 'trafic est.', value: (r) => r.etv },
            { header: 'mots-clés', value: (r) => r.keywordsCount },
          ])
        : 'Aucun concurrent trouvé pour ces mots-clés.',
      structuredContent: { rows },
    })
  },
})

export const keywordTools = [researchKeywordsTool, getKeywordMetricsTool, getSerpResultsTool, findSerpCompetitorsTool]
