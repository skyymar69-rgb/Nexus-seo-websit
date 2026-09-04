import { z } from 'zod'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import { normalizeBacklinksTarget } from '@/lib/dataforseo/backlinks'
import { shapeReferringDomains, shapeSummary } from '@/lib/backlinks/service'
import { usageContext } from '../context'
import { formatMcpTable, mcpResponse } from '../helpers'
import { defineTool } from '../server'

const targetSchema = z.string().min(3).max(2048).describe('Domaine nu (monsite.fr) ou URL de page.')

export const getBacklinksOverviewTool = defineTool({
  name: 'get_backlinks_overview',
  title: 'Profil de liens (résumé)',
  description:
    'Résumé du profil de liens d’un domaine ou d’une page : total de backlinks, domaines référents, rang, nouveaux et perdus, et les 50 meilleurs domaines référents. Facturé : environ 0,02 à 0,05 $. Le compte DataForSEO doit avoir l’API Backlinks activée.',
  inputSchema: {
    target: targetSchema,
    hideSpam: z.boolean().optional().describe('Masquer les domaines au score de spam élevé (oui par défaut).'),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const target = normalizeBacklinksTarget(args.target)
    const [summary, referring] = await Promise.all([
      client.backlinks.summary({ target }),
      client.backlinks.referringDomains({ target, limit: 50, hideSpam: args.hideSpam ?? true }),
    ])
    const shaped = shapeSummary(summary)
    const domains = shapeReferringDomains(referring.items)
    return mcpResponse({
      text: [
        `Profil de liens de ${target} :`,
        `- backlinks : ${shaped.backlinks}`,
        `- domaines référents : ${shaped.referringDomains}`,
        `- rang : ${shaped.rank ?? '—'}`,
        `- nouveaux / perdus (30 j) : ${shaped.newBacklinks ?? '—'} / ${shaped.lostBacklinks ?? '—'}`,
        '',
        domains.length
          ? `Domaines référents (${domains.length}) :\n${formatMcpTable(domains, [
              { header: 'domaine', value: (r) => r.domain },
              { header: 'backlinks', value: (r) => r.backlinks },
              { header: 'pages', value: (r) => r.referringPages },
              { header: 'rang', value: (r) => r.rank },
            ])}`
          : 'Aucun domaine référent.',
      ].join('\n'),
      structuredContent: { target, summary: shaped, referringDomains: domains },
    })
  },
})

export const getBacklinksProfileTool = defineTool({
  name: 'get_backlinks_profile',
  title: 'Liste des backlinks',
  description:
    'Liste paginée des backlinks d’un domaine ou d’une page (source, ancre, dofollow, rang, première vue). Un lien par domaine référent par défaut. Facturé : environ 0,02 $ par page de 100.',
  inputSchema: {
    target: targetSchema,
    page: z.number().int().min(1).optional(),
    pageSize: z.number().int().min(10).max(200).optional(),
    hideSpam: z.boolean().optional(),
    onePerDomain: z.boolean().optional().describe('Un seul lien par domaine référent (oui par défaut).'),
    websiteId: z.string().optional(),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const client = createDataforseoClient(usageContext(context, args.websiteId))
    const target = normalizeBacklinksTarget(args.target)
    const page = args.page ?? 1
    const pageSize = args.pageSize ?? 100
    const result = await client.backlinks.rows({
      target,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      hideSpam: args.hideSpam ?? true,
      mode: args.onePerDomain === false ? 'as_is' : 'one_per_domain',
    })
    const rows = result.items.map((item) => ({
      sourceUrl: item.url_from ?? null,
      sourceDomain: item.domain_from ?? null,
      targetUrl: item.url_to ?? null,
      anchor: item.anchor ?? null,
      dofollow: item.dofollow ?? null,
      rank: item.rank ?? null,
      domainRank: item.domain_from_rank ?? null,
      spamScore: item.backlink_spam_score ?? null,
      firstSeen: item.first_seen ?? null,
      lost: item.is_lost ?? null,
    }))
    return mcpResponse({
      text: rows.length
        ? `${target} : ${result.totalCount ?? '?'} backlinks (page ${page}, ${rows.length} affichés).\n${formatMcpTable(rows, [
            { header: 'source', value: (r) => r.sourceDomain },
            { header: 'ancre', value: (r) => r.anchor },
            { header: 'dofollow', value: (r) => r.dofollow },
            { header: 'rang', value: (r) => r.rank },
            { header: 'url source', value: (r) => r.sourceUrl },
          ])}`
        : `Aucun backlink trouvé pour ${target}.`,
      structuredContent: { target, rows, totalCount: result.totalCount, page, pageSize, hasMore: (result.totalCount ?? 0) > page * pageSize },
    })
  },
})

export const backlinksTools = [getBacklinksOverviewTool, getBacklinksProfileTool]
