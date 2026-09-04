import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ensureUserExists } from '@/lib/ensure-user'
import { hasApiKey, revokeApiKey, rotateApiKey } from '@/lib/mcp/auth'

/**
 * Clé API utilisateur pour le serveur MCP (portage OpenSEO).
 *
 * GET    → { hasKey }
 * POST   → { key } — génère (ou remplace) la clé ; affichée une seule fois
 * DELETE → révoque
 */
async function currentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const userId = (session.user as any).id as string
  await ensureUserExists(userId, session)
  return userId
}

export async function GET() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  return NextResponse.json({ hasKey: await hasApiKey(userId) })
}

export async function POST(_request: NextRequest) {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  try {
    const key = await rotateApiKey(userId)
    return NextResponse.json({ key, mcpUrl: `${process.env.NEXT_PUBLIC_URL ?? ''}/api/mcp` })
  } catch (error) {
    console.error('API key rotation error:', error)
    return NextResponse.json({ error: 'Erreur lors de la génération' }, { status: 500 })
  }
}

export async function DELETE() {
  const userId = await currentUserId()
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  await revokeApiKey(userId)
  return NextResponse.json({ success: true })
}
