import { z } from 'zod'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import { resolveMarket } from '@/lib/dataforseo/locations'
import { normalizeBacklinksTarget } from '@/lib/dataforseo/backlinks'
import { usageContext } from '../context'
import { formatMcpTable, mcpResponse, readPath } from '../helpers'
import { defineTool } from '../server'
import { languageCodeSchema, locationCodeSchema } from './keywords'

const targetSchema = z.string().min(3).max(253).describe('Domaine nu, ex. concurrent.fr')

export const getDomainOverviewTool = defineTool({
  name: 'get_domain_overview',
  title: 'Vue d’ensemble d’un domaine',
  description:
    'Empreinte organique d’un domaine (nombre de mots-clés positionnés, trafic estimé) et ses 20 meilleurs mots-clés. Facturé : environ 0,02 $.',
  inputSchema: { target: targetSchema, locationCode: locationCodeSchema, languageCode: languageCodeSchema, websiteId: z.string().optional() },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const target = normalizeBacklinksTarget(args.target)
    const [overview, ranked] = await Promise.all([
      client.domain.rankOverview({ target, locationCode, languageCode }),
      client.domain.rankedKeywords({ target, locationCode, languageCode, limit: 20, orderBy: ['ranked_serp_element.serp_item.etv,desc'] }),
    ])
    const organic = overview[0]?.metrics?.organic
    const rows = ranked.items.map((item) => ({
      keyword: item.keyword_data?.keyword ?? null,
      position: item.ranked_serp_element?.serp_item?.rank_absolute ?? null,
      url: item.ranked_serp_element?.serp_item?.url ?? null,
      searchVolume: item.keyword_data?.keyword_info?.search_volume ?? null,
      etv: item.ranked_serp_element?.serp_item?.etv ?? null,
    }))
    return mcpResponse({
      text: [
        `Domaine ${target} : ${organic?.count ?? '?'} mots-clés positionnés, trafic organique estimé ${organic?.etv != null ? Math.round(organic.etv) : '?'} visites/mois.`,
        '',
        rows.length
          ? `Meilleurs mots-clés :\n${formatMcpTable(rows, [
              { header: 'mot-clé', value: (r) => r.keyword },
              { header: 'position', value: (r) => r.position },
              { header: 'volume', value: (r) => r.searchVolume },
              { header: 'trafic est.', value: (r) => r.etv },
              { header: 'url', value: (r) => r.url },
            ])}`
          : 'Aucun mot-clé positionné trouvé.',
      ].join('\n'),
      structuredContent: { target, organicKeywords: organic?.count ?? null, organicEtv: organic?.etv ?? null, topKeywords: rows, totalCount: ranked.totalCount },
    })
  },
})

export const getRankedKeywordsTool = defineTool({
  name: 'get_ranked_keywords',
  title: 'Mots-clés positionnés d’un domaine',
  description:
    'Mots-clés sur lesquels un domaine se positionne, avec position, URL, volume et intention. Paginé (limit/offset). Facturé : environ 0,01 $ + 0,0001 $ par ligne.',
  inputSchema: {
    target: targetSchema,
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    limit: z.number().int().min(10).max(500).optional().describe('100 par défaut.'),
    offset: z.number().int().min(0).optional(),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const target = normalizeBacklinksTarget(args.target)
    const ranked = await client.domain.rankedKeywords({
      target,
      locationCode,
      languageCode,
      limit: args.limit ?? 100,
      offset: args.offset,
      orderBy: ['ranked_serp_element.serp_item.etv,desc'],
    })
    const rows = ranked.items.map((item) => ({
      keyword: item.keyword_data?.keyword ?? null,
      position: item.ranked_serp_element?.serp_item?.rank_absolute ?? null,
      url: item.ranked_serp_element?.serp_item?.url ?? null,
      searchVolume: item.keyword_data?.keyword_info?.search_volume ?? null,
      cpc: item.keyword_data?.keyword_info?.cpc ?? null,
      keywordDifficulty: item.keyword_data?.keyword_properties?.keyword_difficulty ?? null,
      intent: readPath(item, 'keyword_data', 'search_intent_info', 'main_intent') ?? null,
      etv: item.ranked_serp_element?.serp_item?.etv ?? null,
    }))
    return mcpResponse({
      text: rows.length
        ? `${target} : ${ranked.totalCount ?? rows.length} mots-clés (affichés ${rows.length}).\n${formatMcpTable(rows, [
            { header: 'mot-clé', value: (r) => r.keyword },
            { header: 'position', value: (r) => r.position },
            { header: 'volume', value: (r) => r.searchVolume },
            { header: 'KD', value: (r) => r.keywordDifficulty },
            { header: 'intention', value: (r) => r.intent },
            { header: 'url', value: (r) => r.url },
          ])}`
        : `Aucun mot-clé positionné pour ${target}.`,
      structuredContent: { target, rows, totalCount: ranked.totalCount, offset: args.offset ?? 0 },
    })
  },
})

export const domainTools = [getDomainOverviewTool, getRankedKeywordsTool]
