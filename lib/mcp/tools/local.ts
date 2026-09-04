import { z } from 'zod'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import { getIsoCountryCode, resolveMarket } from '@/lib/dataforseo/locations'
import { searchSerpLocations } from '@/lib/dataforseo/serp-locations'
import { usageContext } from '../context'
import { formatMcpTable, mcpResponse, readPath, truncatedCell } from '../helpers'
import { defineTool } from '../server'
import { languageCodeSchema, locationCodeSchema } from './keywords'

export const searchLocalLocationsTool = defineTool({
  name: 'search_local_locations',
  title: 'Rechercher une localisation',
  description:
    'Trouve la chaîne de localisation canonique DataForSEO d’une ville, d’un département ou d’une région (ex. "Lyon,Auvergne-Rhone-Alpes,France"), à passer en locationName aux outils de SERP, de métriques et de suivi local. Gratuit.',
  inputSchema: {
    query: z.string().min(2).max(100).describe('Début du nom de la ville ou de la zone.'),
    locationCode: locationCodeSchema,
  },
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (args) => {
    const { locationCode } = resolveMarket(args)
    const locations = await searchSerpLocations(getIsoCountryCode(locationCode), args.query, 20)
    return mcpResponse({
      text: locations.length
        ? formatMcpTable(locations, [
            { header: 'locationName', value: (l) => l.locationName },
            { header: 'type', value: (l) => l.locationType },
            { header: 'code', value: (l) => l.locationCode },
          ])
        : `Aucune localisation pour « ${args.query} ».`,
      structuredContent: { locations },
    })
  },
})

export const getLocalSerpResultsTool = defineTool({
  name: 'get_local_serp_results',
  title: 'Résultats Google Maps / pack local',
  description:
    'Résultats Google Maps ou Local Finder pour une requête, vus depuis une localisation (nom canonique) ou une coordonnée "lat,lng,rayon_m". Renvoie les fiches : titre, note, avis, catégorie, adresse. Facturé : environ 0,005 $.',
  inputSchema: {
    keyword: z.string().min(1).max(200),
    locationName: z.string().max(200).optional(),
    locationCoordinate: z.string().max(60).optional().describe('"45.7640,4.8357,5000" (latitude, longitude, rayon en mètres).'),
    languageCode: languageCodeSchema,
    searchType: z.enum(['maps', 'local_finder']).optional().describe('maps par défaut.'),
    device: z.enum(['desktop', 'mobile']).optional(),
    depth: z.number().int().min(10).max(100).optional(),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    if (!args.locationName && !args.locationCoordinate) {
      return mcpResponse({ text: 'Indiquez locationName (search_local_locations) ou locationCoordinate.', isError: true })
    }
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { languageCode } = resolveMarket(args)
    const items = await client.serp.local({
      keyword: args.keyword,
      locationName: args.locationName,
      locationCoordinate: args.locationCoordinate,
      languageCode,
      searchType: args.searchType ?? 'maps',
      device: args.device ?? 'desktop',
      depth: args.depth ?? 20,
    })
    const rows = items.map((item) => ({
      rank: readPath(item, 'rank_absolute') ?? readPath(item, 'rank_group') ?? null,
      title: readPath(item, 'title') ?? null,
      rating: readPath(item, 'rating', 'value') ?? null,
      reviews: readPath(item, 'rating', 'votes_count') ?? null,
      category: readPath(item, 'category') ?? null,
      address: readPath(item, 'address') ?? null,
      domain: readPath(item, 'domain') ?? null,
      cid: readPath(item, 'cid') ?? null,
    }))
    return mcpResponse({
      text: rows.length
        ? formatMcpTable(rows, [
            { header: 'rang', value: (r) => r.rank },
            { header: 'établissement', value: (r) => r.title },
            { header: 'note', value: (r) => r.rating },
            { header: 'avis', value: (r) => r.reviews },
            { header: 'catégorie', value: (r) => r.category },
            { header: 'adresse', value: (r) => r.address, format: truncatedCell(60) },
          ])
        : `Aucun résultat local pour « ${args.keyword} ».`,
      structuredContent: { rows, raw: items.slice(0, 50) },
    })
  },
})

export const searchLocalBusinessesTool = defineTool({
  name: 'search_local_businesses',
  title: 'Annuaire d’établissements',
  description:
    'Recherche d’établissements Google Business autour d’une coordonnée, par catégorie ou nom (note, avis, revendication, site). Facturé : environ 0,002 $ par lot de 100.',
  inputSchema: {
    locationCoordinate: z.string().min(3).max(60).describe('"lat,lng,rayon_m", ex. "45.7640,4.8357,10000".'),
    title: z.string().max(200).optional().describe('Nom (ou début de nom) de l’établissement.'),
    categories: z.array(z.string()).max(10).optional().describe('Catégories Google, ex. ["plumber"].'),
    isClaimed: z.boolean().optional(),
    limit: z.number().int().min(10).max(200).optional(),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const items = await client.business.listings({
      locationCoordinate: args.locationCoordinate,
      title: args.title,
      categories: args.categories,
      isClaimed: args.isClaimed,
      limit: args.limit ?? 50,
      orderBy: ['rating.votes_count,desc'],
    })
    const rows = items.map((item) => ({
      title: readPath(item, 'title') ?? null,
      category: readPath(item, 'category') ?? null,
      rating: readPath(item, 'rating', 'value') ?? null,
      reviews: readPath(item, 'rating', 'votes_count') ?? null,
      claimed: readPath(item, 'is_claimed') ?? null,
      domain: readPath(item, 'domain') ?? null,
      address: readPath(item, 'address') ?? null,
      cid: readPath(item, 'cid') ?? null,
    }))
    return mcpResponse({
      text: rows.length
        ? formatMcpTable(rows, [
            { header: 'établissement', value: (r) => r.title },
            { header: 'catégorie', value: (r) => r.category },
            { header: 'note', value: (r) => r.rating },
            { header: 'avis', value: (r) => r.reviews },
            { header: 'revendiqué', value: (r) => r.claimed },
            { header: 'site', value: (r) => r.domain },
          ])
        : 'Aucun établissement trouvé.',
      structuredContent: { rows },
    })
  },
})

export const getBusinessProfileTool = defineTool({
  name: 'get_business_profile',
  title: 'Fiche Google Business',
  description: 'Fiche Google Business d’un établissement (nom + ville, ou nom exact) : catégorie, note, avis, horaires, attributs, site. Facturé : environ 0,002 $.',
  inputSchema: {
    keyword: z.string().min(2).max(200).describe('Nom de l’établissement, éventuellement suivi de la ville.'),
    locationCode: locationCodeSchema,
    locationCoordinate: z.string().max(60).optional(),
    languageCode: languageCodeSchema,
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { locationCode, languageCode } = resolveMarket(args)
    const profile = await client.business.myBusinessInfo({
      keyword: args.keyword,
      locationCode: args.locationCoordinate ? undefined : locationCode,
      locationCoordinate: args.locationCoordinate,
      languageCode,
    })
    if (!profile) return mcpResponse({ text: `Aucune fiche Google Business trouvée pour « ${args.keyword} ».`, structuredContent: { profile: null } })
    const lines = [
      `Fiche : ${readPath(profile, 'title') ?? '?'}`,
      `Catégorie : ${readPath(profile, 'category') ?? '—'}`,
      `Note : ${readPath(profile, 'rating', 'value') ?? '—'} (${readPath(profile, 'rating', 'votes_count') ?? 0} avis)`,
      `Adresse : ${readPath(profile, 'address') ?? '—'}`,
      `Site : ${readPath(profile, 'url') ?? readPath(profile, 'domain') ?? '—'}`,
      `Revendiquée : ${readPath(profile, 'is_claimed') ? 'oui' : 'non'}`,
    ]
    return mcpResponse({ text: lines.join('\n'), structuredContent: { profile } })
  },
})

export const getGoogleBusinessQuestionsTool = defineTool({
  name: 'get_google_business_questions',
  title: 'Questions et réponses Google',
  description: 'Questions posées sur une fiche Google Business, avec ou sans réponse. Facturé : environ 0,002 $.',
  inputSchema: {
    keyword: z.string().min(2).max(200),
    locationCoordinate: z.string().min(3).max(60).describe('"lat,lng,rayon_m".'),
    languageCode: languageCodeSchema,
    depth: z.number().int().min(10).max(100).optional(),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const { languageCode } = resolveMarket(args)
    const items = await client.business.questionsAnswers({
      keyword: args.keyword,
      locationCoordinate: args.locationCoordinate,
      languageCode,
      depth: args.depth ?? 20,
    })
    const rows = items.map((item) => ({
      question: readPath(item, 'question_text') ?? readPath(item, 'text') ?? null,
      answers: Array.isArray(readPath(item, 'items')) ? (readPath(item, 'items') as unknown[]).length : 0,
    }))
    return mcpResponse({
      text: rows.length
        ? formatMcpTable(rows, [
            { header: 'question', value: (r) => r.question, format: truncatedCell(120) },
            { header: 'réponses', value: (r) => r.answers },
          ])
        : 'Aucune question sur cette fiche.',
      structuredContent: { rows, raw: items.slice(0, 50) },
    })
  },
})

export const localTools = [
  searchLocalLocationsTool,
  getLocalSerpResultsTool,
  searchLocalBusinessesTool,
  getBusinessProfileTool,
  getGoogleBusinessQuestionsTool,
]
