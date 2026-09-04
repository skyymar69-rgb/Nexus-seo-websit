/**
 * Compteur DataForSEO : plafond mensuel + journal append-only.
 *
 * Réponse au §7.2 point 1 du plan de portage : Nexus appelait DataForSEO sans
 * plafond ni journal. Ici, chaque appel payant :
 *   1. vérifie que la dépense du mois (somme du journal) reste sous le plafond,
 *   2. s'exécute,
 *   3. écrit une ligne avec le coût réel renvoyé par DataForSEO (jamais une estimation).
 *
 * Le journal (`DataProviderUsage`) est append-only : aucune ligne n'est mise à
 * jour, le solde est une somme. Les montants sont des entiers en micro-dollars.
 *
 * Limite connue : la lecture du solde et l'écriture ne sont pas sérialisées ;
 * deux appels simultanés près du plafond peuvent passer tous les deux. C'est
 * un garde-fou de dépense, pas un compteur de facturation client.
 */
import { prisma } from '@/lib/prisma'
import { DataforseoError } from './errors'
import { DataforseoChargedTaskError, type DataforseoApiCallCost, type DataforseoApiResponse } from './envelope'

export type DataforseoFeature =
  | 'keyword_research'
  | 'rank_tracking'
  | 'backlinks'
  | 'serp'
  | 'local_seo'
  | 'domain'
  | 'mcp'

export type UsageContext = {
  userId?: string | null
  websiteId?: string | null
  /** Appelé après chaque ligne journalisée, avec le coût réel en micro-dollars. */
  onCost?: (costMicros: number) => void
}

const MICROS_PER_USD = 1_000_000

export function usdToMicros(usd: number): number {
  return Math.round(usd * MICROS_PER_USD)
}

export function microsToUsd(micros: number): number {
  return micros / MICROS_PER_USD
}

/** Plafond mensuel en dollars, 50 par défaut ; 0 désactive DataForSEO. */
export function getMonthlyBudgetUsd(): number {
  const raw = process.env.DATAFORSEO_MONTHLY_BUDGET_USD
  if (raw === undefined || raw === '') return 50
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? value : 50
}

export function startOfMonthUtc(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
}

export async function getMonthToDateSpendMicros(now = new Date()): Promise<number> {
  const result = await prisma.dataProviderUsage.aggregate({
    _sum: { costMicros: true },
    where: { provider: 'dataforseo', createdAt: { gte: startOfMonthUtc(now) } },
  })
  return result._sum.costMicros ?? 0
}

export type BudgetStatus = {
  budgetUsd: number
  spentUsd: number
  remainingUsd: number
  ratio: number
}

export async function getBudgetStatus(): Promise<BudgetStatus> {
  const budgetUsd = getMonthlyBudgetUsd()
  const spentUsd = microsToUsd(await getMonthToDateSpendMicros())
  return {
    budgetUsd,
    spentUsd,
    remainingUsd: Math.max(0, budgetUsd - spentUsd),
    ratio: budgetUsd > 0 ? spentUsd / budgetUsd : 1,
  }
}

/** Refuse l'appel si le plafond mensuel est atteint. */
export async function assertBudgetAvailable(): Promise<void> {
  const status = await getBudgetStatus()
  if (status.budgetUsd <= 0 || status.spentUsd >= status.budgetUsd) {
    throw new DataforseoError('BUDGET_EXCEEDED', undefined, {
      budgetUsd: status.budgetUsd,
      spentUsd: status.spentUsd,
    })
  }
}

export async function recordUsage(input: {
  context: UsageContext
  feature: DataforseoFeature
  billing: DataforseoApiCallCost
  status: 'ok' | 'failed'
}): Promise<void> {
  const costMicros = usdToMicros(input.billing.costUsd)
  await prisma.dataProviderUsage.create({
    data: {
      provider: 'dataforseo',
      userId: input.context.userId ?? null,
      websiteId: input.context.websiteId ?? null,
      feature: input.feature,
      path: input.billing.path.join('/'),
      costMicros,
      status: input.status,
    },
  })
  input.context.onCost?.(costMicros)
}

/**
 * Point de comptage unique. Toute fonction de section qui renvoie une
 * DataforseoApiResponse passe ici avant que sa donnée n'atteigne le produit.
 */
export async function meterDataforseoCall<T>(
  context: UsageContext,
  feature: DataforseoFeature,
  execute: () => Promise<DataforseoApiResponse<T>>,
): Promise<T> {
  await assertBudgetAvailable()

  let result: DataforseoApiResponse<T>
  try {
    result = await execute()
  } catch (error) {
    if (error instanceof DataforseoChargedTaskError) {
      // Requête mal formée non facturée : pas de ligne, erreur de validation.
      if (error.isInvalidField && error.billing.costUsd <= 0) {
        throw new DataforseoError('VALIDATION_ERROR', error.message)
      }
      // Facturée mais échouée : la dépense reste visible dans le journal.
      await recordUsage({ context, feature, billing: error.billing, status: 'failed' })
    }
    throw error
  }

  await recordUsage({ context, feature, billing: result.billing, status: 'ok' })
  return result.data
}

/** Dépense par fonctionnalité sur le mois courant, pour la page réglages et le MCP. */
export async function getMonthlyUsageByFeature(now = new Date()): Promise<Array<{ feature: string; costUsd: number; calls: number }>> {
  const rows = await prisma.dataProviderUsage.groupBy({
    by: ['feature'],
    where: { provider: 'dataforseo', createdAt: { gte: startOfMonthUtc(now) } },
    _sum: { costMicros: true },
    _count: { _all: true },
  })
  return rows
    .map((row) => ({
      feature: row.feature,
      costUsd: microsToUsd(row._sum.costMicros ?? 0),
      calls: row._count._all,
    }))
    .sort((a, b) => b.costUsd - a.costUsd)
}
