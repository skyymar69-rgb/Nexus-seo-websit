import { z } from 'zod'
import { crawlSite } from '@/lib/audit/crawler'
import { AUDIT_ISSUE_TYPES, listIssueTypes } from '@/lib/audit/issues'
import {
  createCrawlSession,
  getCrawlIssues,
  getCrawlPages,
  getLatestCrawlSession,
  markCrawlFailed,
  persistCrawlResult,
  summarizeIssues,
} from '@/lib/audit/persist'
import { dashboardUrl, resolveWebsite } from '../context'
import { mcpResponse, McpToolError } from '../helpers'
import { defineTool } from '../server'

const websiteIdSchema = z.string().min(1).describe('Identifiant du site (list_websites).')

export const runSiteAuditTool = defineTool({
  name: 'run_site_audit',
  title: 'Lancer un audit de site',
  description:
    'Explore le site (robots.txt respecté, sitemaps, même origine) jusqu’à 50 pages en moins d’une minute, et renvoie le résumé des constats par gravité : liens cassés, titles et descriptions manquants ou en double, chaînes de redirections, pages orphelines, canoniques, contenu insuffisant… Gratuit (aucun fournisseur payant). Les résultats sont enregistrés sur le site et lisibles avec get_audit_issues et get_audit_pages. Si le site bloque le robot, les pages sont marquées « bloquées » plutôt que cassées.',
  inputSchema: {
    websiteId: websiteIdSchema,
    url: z.string().max(2048).optional().describe('URL de départ ; par défaut https://<domaine du site>.'),
    maxPages: z.number().int().min(1).max(50).optional().describe('Budget de pages (20 par défaut, 50 max).'),
  },
  annotations: { readOnlyHint: false, openWorldHint: true, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const startUrl = args.url ?? `https://${website.domain}`
    const maxPages = args.maxPages ?? 20
    const crawlId = await createCrawlSession(website.id, startUrl, maxPages)
    try {
      const result = await crawlSite({ startUrl, maxPages, timeBudgetMs: 45_000 })
      await persistCrawlResult(crawlId, result)
      const summary = summarizeIssues(result.issues)
      const blocked = result.pages.filter((p) => p.fetchClass === 'blocked').length
      return mcpResponse({
        text: [
          `Audit ${crawlId} de ${result.startUrl} : ${result.pages.length} pages en ${Math.round(result.durationMs / 1000)} s${result.truncated ? ' (budget atteint, exploration partielle)' : ''}${blocked ? `, ${blocked} page(s) bloquée(s) par le site` : ''}.`,
          `${result.issues.length} constats :`,
          ...summary.map((row) => `- [${row.severity}] ${row.title} (${row.issueType}) : ${row.count}`),
          'Détail et correctifs : get_audit_issues.',
        ].join('\n'),
        meta: { websiteId: website.id, runId: crawlId, url: dashboardUrl(context, '/dashboard/crawl') },
        structuredContent: {
          crawlId,
          startUrl: result.startUrl,
          pagesCrawled: result.pages.length,
          truncated: result.truncated,
          durationMs: result.durationMs,
          issueCount: result.issues.length,
          summary,
        },
      })
    } catch (error) {
      await markCrawlFailed(crawlId, error)
      throw error
    }
  },
})

async function latestSession(websiteId: string) {
  const session = await getLatestCrawlSession(websiteId)
  if (!session) throw new McpToolError('Aucun audit terminé pour ce site. Lancez-en un avec run_site_audit.')
  return session
}

export const getAuditIssuesTool = defineTool({
  name: 'get_audit_issues',
  title: 'Constats d’audit',
  description:
    'Rapport de constats du dernier audit du site, triés par gravité, chacun avec son explication et son correctif (how_to_fix). Gratuit.',
  inputSchema: {
    websiteId: websiteIdSchema,
    severity: z.enum(['critical', 'warning', 'info']).optional(),
    issueType: z.string().optional().describe(`Un type parmi : ${listIssueTypes().join(', ')}`),
    limit: z.number().int().min(1).max(1000).optional().describe('200 par défaut.'),
  },
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const session = await latestSession(website.id)
    const report = await getCrawlIssues(session.id, { severity: args.severity, issueType: args.issueType, limit: args.limit })
    const issuesWithExplanation = report.issues.map((issue) => ({
      ...issue,
      explanation: AUDIT_ISSUE_TYPES[issue.issueType as keyof typeof AUDIT_ISSUE_TYPES]?.explanation ?? null,
    }))
    return mcpResponse({
      text:
        report.total === 0
          ? `Aucun constat pour l’audit ${session.id}${args.severity || args.issueType ? ' avec ces filtres' : ''}.`
          : [
              `Audit ${session.id} (${session.startUrl ?? website.domain}) : ${report.total} constats.`,
              ...report.summary.map((row) => `- [${row.severity}] ${row.title} (${row.issueType}) : ${row.count}`),
              'Lignes complètes avec how_to_fix dans structuredContent.issues.',
            ].join('\n'),
      meta: { websiteId: website.id, runId: session.id, url: dashboardUrl(context, '/dashboard/crawl') },
      structuredContent: { crawlId: session.id, total: report.total, summary: report.summary, issues: issuesWithExplanation },
    })
  },
})

export const getAuditPagesTool = defineTool({
  name: 'get_audit_pages',
  title: 'Pages auditées',
  description:
    'Pages du dernier audit avec leurs données (statut, title, description, nombre de mots, indexabilité, profondeur, liens). Gratuit.',
  inputSchema: {
    websiteId: websiteIdSchema,
    statusCode: z.number().int().optional(),
    fetchClass: z.enum(['ok', 'blocked', 'error']).optional(),
    urlContains: z.string().optional(),
    limit: z.number().int().min(1).max(500).optional().describe('100 par défaut.'),
  },
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const website = await resolveWebsite(context, args.websiteId)
    const session = await latestSession(website.id)
    const all = await getCrawlPages(session.id, 500)
    const filtered = all.filter(
      (page) =>
        (!args.fetchClass || page.fetchClass === args.fetchClass) &&
        (args.statusCode === undefined || page.statusCode === args.statusCode) &&
        (!args.urlContains || page.url.includes(args.urlContains)),
    )
    const limit = args.limit ?? 100
    const pages = filtered.slice(0, limit)
    return mcpResponse({
      text: [
        `Audit ${session.id} : ${filtered.length} pages${filtered.length > limit ? ` (${limit} affichées)` : ''}.`,
        ...pages.slice(0, 30).map((p) => `- ${p.statusCode} ${p.url}${p.fetchClass !== 'ok' ? ` [${p.fetchClass}]` : ''} « ${p.title} »`),
        'Lignes complètes dans structuredContent.pages.',
      ].join('\n'),
      meta: { websiteId: website.id, runId: session.id },
      structuredContent: { crawlId: session.id, pages, total: filtered.length },
    })
  },
})

export const auditTools = [runSiteAuditTool, getAuditIssuesTool, getAuditPagesTool]
