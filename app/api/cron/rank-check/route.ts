import { NextRequest, NextResponse } from 'next/server'
import { isDataforseoConfigured } from '@/lib/dataforseo/index'
import { listActiveTrackers, runRankCheck } from '@/lib/rank-tracking/service'

/**
 * Cron Vercel — vérification quotidienne des positions (portage OpenSEO).
 * Déclaré dans vercel.json ; protégé par CRON_SECRET comme ai-monitoring.
 *
 * Chaque site est traité séquentiellement pour rester sous la fenêtre de la
 * fonction ; un site qui échoue n'empêche pas les suivants. Le plafond
 * mensuel DataForSEO s'applique à chaque appel (lib/dataforseo/budget.ts).
 */
const CRON_SECRET = process.env.CRON_SECRET || ''
const MAX_SITES_PER_RUN = 25

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!isDataforseoConfigured()) {
    return NextResponse.json({ message: 'DataForSEO non configuré', processed: 0 })
  }

  const trackers = (await listActiveTrackers()).slice(0, MAX_SITES_PER_RUN)
  const outcomes: Array<{ websiteId: string; status: string; checked: number; costUsd: number; error: string | null }> = []
  for (const tracker of trackers) {
    try {
      const run = await runRankCheck({ websiteId: tracker.websiteId, userId: tracker.website.userId, trigger: 'cron' })
      outcomes.push({ websiteId: tracker.websiteId, status: run.status, checked: run.keywordsChecked, costUsd: run.costUsd, error: run.error })
    } catch (error) {
      outcomes.push({
        websiteId: tracker.websiteId,
        status: 'failed',
        checked: 0,
        costUsd: 0,
        error: error instanceof Error ? error.message : String(error),
      })
    }
  }

  return NextResponse.json({
    success: true,
    processed: outcomes.length,
    totalCostUsd: outcomes.reduce((sum, o) => sum + o.costUsd, 0),
    outcomes,
    timestamp: new Date().toISOString(),
  })
}
