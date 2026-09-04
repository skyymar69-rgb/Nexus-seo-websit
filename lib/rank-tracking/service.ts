/**
 * Suivi de positions (portage OpenSEO, adapté au modèle Nexus).
 *
 * OpenSEO : configs → mots-clés → runs → instantanés, avec file DataForSEO
 * (task_post puis task_get) pour les runs planifiés. Ici, v1 en appels live
 * (résultat immédiat, ~30 % plus cher que la file) : c'est le chemin le plus
 * court vers un suivi local par ville, qui manquait à Nexus. La file reste
 * une optimisation possible, documentée dans docs/PORTAGE_OPENSEO.md.
 *
 * Les mots-clés suivis d'un site sont les `Keyword` ayant au moins une ligne
 * `KeywordTracking` pour ce site (créée par POST /api/keywords avec websiteId).
 */
import { prisma } from '@/lib/prisma'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import { clampSerpDepth, type RankCheckResult } from '@/lib/dataforseo/serp'
import type { UsageContext } from '@/lib/dataforseo/budget'
import { DEFAULT_LANGUAGE_CODE, DEFAULT_LOCATION_CODE, getLocationOption } from '@/lib/dataforseo/locations'

export type RankTrackerDevice = 'desktop' | 'mobile'

export interface RankTrackerConfigInput {
  locationCode?: number
  locationName?: string
  languageCode?: string
  device?: RankTrackerDevice
  depth?: number
  active?: boolean
}

const RANK_CHECK_CONCURRENCY = 4
/** Prix indicatif DataForSEO d'une page SERP live avancée (10 résultats). */
const SERP_PAGE_COST_USD = 0.0025

export async function getTrackedKeywords(websiteId: string) {
  const trackings = await prisma.keywordTracking.findMany({
    where: { websiteId },
    distinct: ['keywordId'],
    select: { keyword: { select: { id: true, term: true } } },
  })
  return trackings.map((t) => t.keyword)
}

export async function getConfig(websiteId: string) {
  return prisma.rankTrackerConfig.findFirst({ where: { websiteId }, orderBy: { createdAt: 'asc' } })
}

export async function upsertConfig(websiteId: string, input: RankTrackerConfigInput) {
  const existing = await getConfig(websiteId)
  const locationCode = input.locationCode ?? existing?.locationCode ?? DEFAULT_LOCATION_CODE
  const data = {
    locationCode,
    locationName: input.locationName ?? existing?.locationName ?? '',
    languageCode: input.languageCode ?? existing?.languageCode ?? getLocationOption(locationCode)?.languageCode ?? DEFAULT_LANGUAGE_CODE,
    device: input.device ?? existing?.device ?? 'desktop',
    depth: clampSerpDepth(input.depth ?? existing?.depth ?? 20),
    active: input.active ?? existing?.active ?? true,
  }
  if (existing) return prisma.rankTrackerConfig.update({ where: { id: existing.id }, data })
  return prisma.rankTrackerConfig.create({ data: { websiteId, ...data } })
}

/** Borne haute : stop_crawl_on_match arrête souvent avant la profondeur demandée. */
export function estimateRunCostUsd(keywordCount: number, depth: number): number {
  return keywordCount * (clampSerpDepth(depth) / 10) * SERP_PAGE_COST_USD
}

export interface RunSummary {
  runId: string
  status: 'completed' | 'failed'
  keywordsTotal: number
  keywordsChecked: number
  costUsd: number
  results: Array<RankCheckResult & { previousPosition: number | null }>
  error: string | null
}

export async function runRankCheck(input: {
  websiteId: string
  userId?: string | null
  trigger: 'manual' | 'cron' | 'mcp'
}): Promise<RunSummary> {
  const website = await prisma.website.findUnique({ where: { id: input.websiteId }, select: { id: true, domain: true } })
  if (!website) throw new Error('Site introuvable')
  const config = (await getConfig(website.id)) ?? (await upsertConfig(website.id, {}))
  const keywords = await getTrackedKeywords(website.id)

  const run = await prisma.rankCheckRun.create({
    data: { configId: config.id, trigger: input.trigger, keywordsTotal: keywords.length },
  })

  let costMicros = 0
  const context: UsageContext = {
    userId: input.userId ?? null,
    websiteId: website.id,
    onCost: (micros) => {
      costMicros += micros
    },
  }
  const client = createDataforseoClient(context)
  const results: RunSummary['results'] = []
  const failures: string[] = []
  const now = new Date()

  const queue = [...keywords]
  const worker = async () => {
    while (queue.length > 0) {
      const keyword = queue.shift()!
      try {
        const result = await client.serp.rankCheck({
          keyword: keyword.term,
          keywordId: keyword.id,
          locationCode: config.locationCode,
          languageCode: config.languageCode,
          locationName: config.locationName || undefined,
          device: config.device as RankTrackerDevice,
          targetDomain: website.domain,
          depth: config.depth,
        })
        const previous = await prisma.keywordTracking.findFirst({
          where: {
            keywordId: keyword.id,
            websiteId: website.id,
            device: config.device,
            locationName: config.locationName,
            position: { not: null },
          },
          orderBy: { date: 'desc' },
          select: { position: true },
        })
        await prisma.keywordTracking.create({
          data: {
            keywordId: keyword.id,
            websiteId: website.id,
            position: result.position,
            previousPosition: previous?.position ?? null,
            url: result.url,
            serpFeatures: JSON.stringify(result.serpFeatures),
            date: new Date(now.getTime() + results.length),
            runId: run.id,
            device: config.device,
            locationName: config.locationName,
          },
        })
        results.push({ ...result, previousPosition: previous?.position ?? null })
      } catch (error) {
        failures.push(`${keyword.term} : ${error instanceof Error ? error.message : String(error)}`)
        // Un plafond atteint arrête tout le run : inutile d'enchaîner des refus.
        if (error instanceof Error && 'code' in error && (error as { code?: string }).code === 'BUDGET_EXCEEDED') {
          queue.length = 0
        }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(RANK_CHECK_CONCURRENCY, keywords.length) }, worker))

  const status = failures.length > 0 && results.length === 0 ? 'failed' : 'completed'
  const error = failures.length > 0 ? failures.slice(0, 5).join(' | ').slice(0, 500) : null
  await prisma.rankCheckRun.update({
    where: { id: run.id },
    data: { status, keywordsChecked: results.length, costMicros, error, completedAt: new Date() },
  })

  return { runId: run.id, status, keywordsTotal: keywords.length, keywordsChecked: results.length, costUsd: costMicros / 1_000_000, results, error }
}

/** Dernière position connue par mot-clé pour un site, avec la configuration et le dernier run. */
export async function getTrackerOverview(websiteId: string) {
  const [config, keywords] = await Promise.all([getConfig(websiteId), getTrackedKeywords(websiteId)])
  const lastRun = config
    ? await prisma.rankCheckRun.findFirst({ where: { configId: config.id }, orderBy: { startedAt: 'desc' } })
    : null
  const rows = await Promise.all(
    keywords.map(async (keyword) => {
      const latest = await prisma.keywordTracking.findFirst({
        where: { keywordId: keyword.id, websiteId, position: { not: null } },
        orderBy: { date: 'desc' },
        select: { position: true, previousPosition: true, url: true, date: true, device: true, locationName: true },
      })
      return { keywordId: keyword.id, term: keyword.term, latest }
    }),
  )
  return {
    config,
    lastRun: lastRun ? { ...lastRun, costUsd: lastRun.costMicros / 1_000_000 } : null,
    keywords: rows,
    estimatedRunCostUsd: estimateRunCostUsd(keywords.length, config?.depth ?? 20),
  }
}

/** Sites dont le suivi est actif et qui ont au moins un mot-clé suivi (pour le cron). */
export async function listActiveTrackers() {
  return prisma.rankTrackerConfig.findMany({
    where: { active: true, website: { keywordTracking: { some: {} } } },
    select: { id: true, websiteId: true, website: { select: { userId: true } } },
  })
}
