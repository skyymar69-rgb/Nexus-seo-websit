import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { describeDataforseoError, DataforseoError, isDataforseoConfigured } from '@/lib/dataforseo/index'
import { getTrackerOverview, runRankCheck, upsertConfig } from '@/lib/rank-tracking/service'

/**
 * Suivi de positions (portage OpenSEO).
 *
 * GET  /api/rank-tracker?websiteId=…   configuration, dernier run, dernières positions
 * PUT  /api/rank-tracker               { websiteId, locationCode?, locationName?, languageCode?, device?, depth?, active? }
 * POST /api/rank-tracker               { websiteId } → lance une vérification live (facturée)
 */

async function ownedWebsite(request: NextRequest, websiteId: string | null) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: NextResponse.json({ error: 'Non autorisé' }, { status: 401 }) }
  if (!websiteId) return { error: NextResponse.json({ error: 'websiteId requis' }, { status: 400 }) }
  const userId = (session.user as any).id as string
  const website = await prisma.website.findFirst({ where: { id: websiteId, userId } })
  if (!website) return { error: NextResponse.json({ error: 'Site introuvable' }, { status: 404 }) }
  return { website, userId }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const scope = await ownedWebsite(request, searchParams.get('websiteId'))
  if ('error' in scope) return scope.error
  try {
    const overview = await getTrackerOverview(scope.website.id)
    return NextResponse.json({ ...overview, configured: isDataforseoConfigured() })
  } catch (error) {
    console.error('Rank tracker GET error:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 })
  }
}

const configSchema = z.object({
  websiteId: z.string().min(1),
  locationCode: z.number().int().positive().optional(),
  locationName: z.string().max(200).optional(),
  languageCode: z.string().min(2).max(8).optional(),
  device: z.enum(['desktop', 'mobile']).optional(),
  depth: z.number().int().min(10).max(100).optional(),
  active: z.boolean().optional(),
})

export async function PUT(request: NextRequest) {
  const parsed = configSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Paramètres invalides', issues: parsed.error.issues }, { status: 400 })
  const scope = await ownedWebsite(request, parsed.data.websiteId)
  if ('error' in scope) return scope.error
  try {
    const { websiteId: _websiteId, ...input } = parsed.data
    const config = await upsertConfig(scope.website.id, input)
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Rank tracker PUT error:', error)
    return NextResponse.json({ error: 'Erreur lors de l’enregistrement' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const scope = await ownedWebsite(request, typeof body?.websiteId === 'string' ? body.websiteId : null)
  if ('error' in scope) return scope.error
  if (!isDataforseoConfigured()) {
    return NextResponse.json({ error: 'DataForSEO n’est pas configuré sur ce déploiement.' }, { status: 503 })
  }
  try {
    const run = await runRankCheck({ websiteId: scope.website.id, userId: scope.userId, trigger: 'manual' })
    return NextResponse.json(run)
  } catch (error) {
    if (error instanceof DataforseoError) {
      return NextResponse.json({ error: describeDataforseoError(error), code: error.code }, { status: 502 })
    }
    console.error('Rank tracker POST error:', error)
    return NextResponse.json({ error: 'Erreur lors de la vérification' }, { status: 500 })
  }
}
