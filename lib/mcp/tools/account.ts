import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getBudgetStatus, getMonthlyUsageByFeature } from '@/lib/dataforseo/budget'
import { isDataforseoConfigured } from '@/lib/dataforseo/core'
import { dashboardUrl } from '../context'
import { formatMcpTable, mcpResponse, McpToolError } from '../helpers'
import { defineTool } from '../server'

const DOMAIN_RE = /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/

export const whoamiTool = defineTool({
  name: 'whoami',
  title: 'Qui suis-je',
  description:
    'Confirme le compte Nexus connecté, l’état de DataForSEO et le budget mensuel restant. Gratuit : n’appelle aucun fournisseur.',
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (_args, context) => {
    const configured = isDataforseoConfigured()
    const budget = configured ? await getBudgetStatus() : null
    const lines = [
      `Compte : ${context.userEmail}`,
      `DataForSEO : ${configured ? 'configuré' : 'non configuré (outils facturés indisponibles)'}`,
    ]
    if (budget) {
      lines.push(
        `Budget mensuel : ${budget.spentUsd.toFixed(2)} $ dépensés sur ${budget.budgetUsd.toFixed(2)} $ (${budget.remainingUsd.toFixed(2)} $ restants)`,
      )
    }
    return mcpResponse({
      text: lines.join('\n'),
      meta: { budgetRemainingUsd: budget?.remainingUsd },
      structuredContent: { userEmail: context.userEmail, dataforseoConfigured: configured, budget },
    })
  },
})

export const getDataBudgetTool = defineTool({
  name: 'get_data_budget',
  title: 'Budget de données',
  description:
    'Dépense DataForSEO du mois par fonctionnalité (recherche de mots-clés, suivi de positions, backlinks…) et plafond restant. Gratuit.',
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async () => {
    const [budget, byFeature] = await Promise.all([getBudgetStatus(), getMonthlyUsageByFeature()])
    const table = formatMcpTable(byFeature, [
      { header: 'fonctionnalité', value: (row) => row.feature },
      { header: 'appels', value: (row) => row.calls },
      { header: 'coût ($)', value: (row) => row.costUsd },
    ])
    return mcpResponse({
      text: `Plafond ${budget.budgetUsd.toFixed(2)} $ — dépensé ${budget.spentUsd.toFixed(2)} $ — restant ${budget.remainingUsd.toFixed(2)} $\n\n${byFeature.length ? table : 'Aucun appel ce mois-ci.'}`,
      meta: { budgetRemainingUsd: budget.remainingUsd },
      structuredContent: { budget, byFeature },
    })
  },
})

export const listWebsitesTool = defineTool({
  name: 'list_websites',
  title: 'Lister les sites',
  description:
    'Liste les sites du compte avec leur identifiant (websiteId), requis par les outils d’audit, de suivi de positions et de backlinks. Gratuit.',
  inputSchema: {},
  annotations: { readOnlyHint: true, openWorldHint: false, destructiveHint: false },
  handler: async (_args, context) => {
    const websites = await prisma.website.findMany({
      where: { userId: context.userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, domain: true, name: true, createdAt: true },
    })
    const rows = websites.map((w) => ({ websiteId: w.id, domain: w.domain, name: w.name, createdAt: w.createdAt.toISOString() }))
    const table = formatMcpTable(rows, [
      { header: 'websiteId', value: (row) => row.websiteId },
      { header: 'domaine', value: (row) => row.domain },
      { header: 'nom', value: (row) => row.name },
    ])
    return mcpResponse({
      text: rows.length ? `${rows.length} site(s) :\n${table}` : 'Aucun site. Créez-en un avec create_website.',
      meta: { url: dashboardUrl(context, '/dashboard/projects') },
      structuredContent: { websites: rows },
    })
  },
})

export const createWebsiteTool = defineTool({
  name: 'create_website',
  title: 'Créer un site',
  description: 'Ajoute un site au compte (domaine nu, ex. monsite.fr) et renvoie son websiteId. Gratuit.',
  inputSchema: {
    domain: z.string().min(3).max(253).describe('Domaine sans protocole ni chemin, ex. monsite.fr'),
    name: z.string().max(100).optional().describe('Nom d’affichage'),
  },
  annotations: { readOnlyHint: false, openWorldHint: false, destructiveHint: false },
  handler: async (args, context) => {
    const domain = args.domain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*$/, '').toLowerCase()
    if (!DOMAIN_RE.test(domain)) throw new McpToolError(`Format de domaine invalide : ${args.domain}`)
    const existing = await prisma.website.findUnique({ where: { domain_userId: { domain, userId: context.userId } } })
    if (existing) {
      return mcpResponse({
        text: `Le site ${domain} existe déjà (websiteId ${existing.id}).`,
        structuredContent: { websiteId: existing.id, domain, created: false },
      })
    }
    const website = await prisma.website.create({ data: { domain, name: args.name ?? domain, userId: context.userId } })
    return mcpResponse({
      text: `Site ${domain} créé (websiteId ${website.id}).`,
      meta: { websiteId: website.id, url: dashboardUrl(context, '/dashboard/projects') },
      structuredContent: { websiteId: website.id, domain, created: true },
    })
  },
})

export const accountTools = [whoamiTool, getDataBudgetTool, listWebsitesTool, createWebsiteTool]
