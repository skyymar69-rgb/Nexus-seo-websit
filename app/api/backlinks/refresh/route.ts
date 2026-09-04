import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { describeDataforseoError, DataforseoError, isDataforseoConfigured } from '@/lib/dataforseo/index'
import { refreshBacklinks } from '@/lib/backlinks/service'

/**
 * POST /api/backlinks/refresh { websiteId, hideSpam? }
 * Rafraîchit le profil de liens depuis DataForSEO (facturé), importe les
 * 100 meilleurs liens et enregistre un instantané daté.
 */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  const userId = (session.user as any).id as string

  const body = await request.json().catch(() => ({}))
  const websiteId = typeof body?.websiteId === 'string' ? body.websiteId : null
  if (!websiteId) return NextResponse.json({ error: 'websiteId requis' }, { status: 400 })

  const website = await prisma.website.findFirst({ where: { id: websiteId, userId } })
  if (!website) return NextResponse.json({ error: 'Site introuvable' }, { status: 404 })
  if (!isDataforseoConfigured()) {
    return NextResponse.json({ error: 'DataForSEO n’est pas configuré sur ce déploiement.' }, { status: 503 })
  }

  try {
    const result = await refreshBacklinks({ websiteId, userId, hideSpam: body?.hideSpam !== false })
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof DataforseoError) {
      return NextResponse.json({ error: describeDataforseoError(error), code: error.code }, { status: 502 })
    }
    console.error('Backlinks refresh error:', error)
    return NextResponse.json({ error: 'Erreur lors du rafraîchissement' }, { status: 500 })
  }
}
