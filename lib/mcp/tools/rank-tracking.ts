import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import {
  estimateRunCostUsd,
  getConfig,
  getTrackedKeywords,
  getTrackerOverview,
  runRankCheck,
  upsertConfig,
} from '@/lib/rank-tracking/service'
import { dashboardUrl, resolveWebsite } from '../context'
import { formatMcpTable, mcpResponse } from '../helpers'
import { defineTool } from '../server'
import { languageCodeSchema, locationCodeSchema } from './keywords'

const websiteIdSchema = z.string().min(1).describe('Identifiant du site (list_websites).')

export const getRankTrackerTool = defineTool({
  name: 'get_rank_tracker',
  title: 'Suivi de positions',
  description:
    'Configuration du suivi (marché, localisation locale, appareil, profondeur), dernier run et dernière position connue par mot-clé suivi. Gratuit.',
  inputSchema: { websiteId: websiteIdSchema },
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const overview = await getTrackerOverview(website.id)
    const rows = overview.keywords.map((k) => ({
      keyword: k.term,
      position: k.latest?.position ?? null,
      previousPosition: k.latest?.previousPosition ?? null,
      url: k.latest?.url ?? null,
      checkedAt: k.latest?.date?.toISOString() ?? null,
    }))
    const config = overview.config
    return mcpResponse({
      text: [
        `Suivi de ${website.domain} : ${config ? `${config.locationName || 'national'} (${config.locationCode}/${config.languageCode}), ${config.device}, profondeur ${config.depth}, ${config.active ? 'actif' : 'inactif'}` : 'non configuré (valeurs par défaut : France, desktop, profondeur 20)'}.`,
        overview.lastRun
          ? `Dernier run ${overview.lastRun.startedAt.toISOString()} : ${overview.lastRun.status}, ${overview.lastRun.keywordsChecked}/${overview.lastRun.keywordsTotal} mots-clés, ${overview.lastRun.costUsd.toFixed(4)} $.`
          : 'Aucun run encore.',
        `Coût estimé d’un run : ${overview.estimatedRunCostUsd.toFixed(4)} $ (${rows.length} mots-clés).`,
        '',
        rows.length
          ? formatMcpTable(rows, [
              { header: 'mot-clé', value: (r) => r.keyword },
              { header: 'position', value: (r) => r.position },
              { header: 'précédente', value: (r) => r.previousPosition },
              { header: 'url', value: (r) => r.url },
            ])
          : 'Aucun mot-clé suivi. Ajoutez-en avec add_rank_tracking_keywords.',
      ].join('\n'),
      meta: { websiteId: website.id, url: dashboardUrl(context, '/dashboard/rank-tracker') },
      structuredContent: { config, lastRun: overview.lastRun, keywords: rows, estimatedRunCostUsd: overview.estimatedRunCostUsd },
    })
  },
})

export const configureRankTrackerTool = defineTool({
  name: 'configure_rank_tracker',
  title: 'Configurer le suivi',
  description:
    'Définit le marché et, pour un suivi local, la localisation canonique (search_local_locations) ; appareil desktop ou mobile ; profondeur 10 à 100. Gratuit.',
  inputSchema: {
    websiteId: websiteIdSchema,
    locationCode: locationCodeSchema,
    languageCode: languageCodeSchema,
    locationName: z.string().max(200).optional().describe('Chaîne canonique DataForSEO, ex. "Lyon,Auvergne-Rhone-Alpes,France" ; chaîne vide = national.'),
    device: z.enum(['desktop', 'mobile']).optional(),
    depth: z.number().int().min(10).max(100).optional(),
    active: z.boolean().optional().describe('Inclure dans le run quotidien (cron).'),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const { websiteId: _websiteId, ...input } = args
    const config = await upsertConfig(website.id, input)
    return mcpResponse({
      text: `Suivi de ${website.domain} configuré : ${config.locationName || 'national'} (${config.locationCode}/${config.languageCode}), ${config.device}, profondeur ${config.depth}, ${config.active ? 'actif' : 'inactif'}.`,
      meta: { websiteId: website.id },
      structuredContent: { config },
    })
  },
})

export const addRankTrackingKeywordsTool = defineTool({
  name: 'add_rank_tracking_keywords',
  title: 'Ajouter des mots-clés au suivi',
  description: 'Ajoute jusqu’à 100 mots-clés au suivi de positions d’un site. Gratuit ; la première position est mesurée au prochain run.',
  inputSchema: {
    websiteId: websiteIdSchema,
    keywords: z.array(z.string().min(1).max(200)).min(1).max(100),
    languageCode: languageCodeSchema,
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const language = args.languageCode ?? 'fr'
    const tracked = new Set((await getTrackedKeywords(website.id)).map((k) => k.term))
    let added = 0
    for (const raw of args.keywords) {
      const term = raw.trim().toLowerCase()
      if (!term || tracked.has(term)) continue
      const keyword = await prisma.keyword.upsert({
        where: { term_userId_language: { term, userId: context.userId, language } },
        update: {},
        create: { term, language, userId: context.userId },
      })
      await prisma.keywordTracking.create({ data: { keywordId: keyword.id, websiteId: website.id } })
      tracked.add(term)
      added += 1
    }
    return mcpResponse({
      text: `${added} mot(s)-clé(s) ajouté(s) au suivi de ${website.domain} (${tracked.size} au total). Lancez run_rank_tracker pour mesurer.`,
      meta: { websiteId: website.id, url: dashboardUrl(context, '/dashboard/rank-tracker') },
      structuredContent: { added, total: tracked.size },
    })
  },
})

export const removeRankTrackingKeywordsTool = defineTool({
  name: 'remove_rank_tracking_keywords',
  title: 'Retirer des mots-clés du suivi',
  description: 'Retire des mots-clés du suivi d’un site (et leur historique de positions pour ce site). Gratuit.',
  inputSchema: { websiteId: websiteIdSchema, keywords: z.array(z.string().min(1).max(200)).min(1).max(100) },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: true },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const terms = args.keywords.map((k) => k.trim().toLowerCase())
    const result = await prisma.keywordTracking.deleteMany({
      where: { websiteId: website.id, keyword: { term: { in: terms } } },
    })
    return mcpResponse({
      text: `${result.count} instantané(s) supprimé(s) ; les mots-clés ${terms.join(', ')} ne sont plus suivis pour ${website.domain}.`,
      meta: { websiteId: website.id },
      structuredContent: { removedSnapshots: result.count },
    })
  },
})

export const estimateRankTrackerCostTool = defineTool({
  name: 'estimate_rank_tracker_cost',
  title: 'Estimer le coût d’un run',
  description: 'Borne haute du coût DataForSEO d’une vérification de positions pour un site, avant de la lancer. Gratuit.',
  inputSchema: { websiteId: websiteIdSchema },
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const [config, keywords] = await Promise.all([getConfig(website.id), getTrackedKeywords(website.id)])
    const depth = config?.depth ?? 20
    const costUsd = estimateRunCostUsd(keywords.length, depth)
    return mcpResponse({
      text: `${keywords.length} mots-clés × profondeur ${depth} : au plus ${costUsd.toFixed(4)} $ (l’exploration s’arrête dès que le site est trouvé, le coût réel est souvent inférieur).`,
      structuredContent: { keywords: keywords.length, depth, estimatedCostUsd: costUsd },
    })
  },
})

export const runRankTrackerTool = defineTool({
  name: 'run_rank_tracker',
  title: 'Vérifier les positions',
  description:
    'Mesure la position Google de chaque mot-clé suivi (appels SERP en direct, national ou local selon la configuration) et enregistre un instantané. Facturé : voir estimate_rank_tracker_cost.',
  inputSchema: { websiteId: websiteIdSchema },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const run = await runRankCheck({ websiteId: website.id, userId: context.userId, trigger: 'mcp' })
    const rows = run.results.map((r) => ({ keyword: r.keyword, position: r.position, previousPosition: r.previousPosition, url: r.url }))
    return mcpResponse({
      text: [
        `Run ${run.runId} : ${run.status}, ${run.keywordsChecked}/${run.keywordsTotal} mots-clés, ${run.costUsd.toFixed(4)} $.${run.error ? ` Erreurs : ${run.error}` : ''}`,
        rows.length
          ? formatMcpTable(rows, [
              { header: 'mot-clé', value: (r) => r.keyword },
              { header: 'position', value: (r) => r.position },
              { header: 'précédente', value: (r) => r.previousPosition },
              { header: 'url', value: (r) => r.url },
            ])
          : '',
      ].join('\n'),
      meta: { websiteId: website.id, runId: run.runId, costUsd: run.costUsd, url: dashboardUrl(context, '/dashboard/rank-tracker') },
      structuredContent: { ...run, results: rows },
    })
  },
})

export const rankTrackingTools = [
  getRankTrackerTool,
  configureRankTrackerTool,
  addRankTrackingKeywordsTool,
  removeRankTrackingKeywordsTool,
  estimateRankTrackerCostTool,
  runRankTrackerTool,
]
