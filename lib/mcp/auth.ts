/**
 * Clés API pour le serveur MCP (portage OpenSEO, adapté à NextAuth).
 *
 * OpenSEO s'appuie sur le plugin api-key de Better-Auth. Nexus a déjà une
 * colonne `User.apiKey` (unique, jamais branchée) : on y stocke le SHA-256
 * de la clé, jamais la clé elle-même. La clé est affichée une seule fois à
 * sa génération. Préfixe `nxs_` pour la reconnaître dans un en-tête.
 */
import { createHash, randomBytes } from 'crypto'
import { prisma } from '@/lib/prisma'

export const API_KEY_PREFIX = 'nxs_'

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex')
}

export function generateApiKey(): { key: string; hash: string } {
  const key = `${API_KEY_PREFIX}${randomBytes(24).toString('base64url')}`
  return { key, hash: hashApiKey(key) }
}

export function extractApiKey(request: Request): string | null {
  const headerKey = request.headers.get('x-api-key')
  if (headerKey?.startsWith(API_KEY_PREFIX)) return headerKey
  const bearer = request.headers.get('authorization')?.replace(/^Bearer /i, '')
  if (bearer?.startsWith(API_KEY_PREFIX)) return bearer
  return null
}

export type ApiKeyIdentity = { userId: string; email: string; name: string | null }

export async function resolveApiKeyIdentity(request: Request): Promise<ApiKeyIdentity | null> {
  const key = extractApiKey(request)
  if (!key) return null
  const user = await prisma.user.findUnique({
    where: { apiKey: hashApiKey(key) },
    select: { id: true, email: true, name: true },
  })
  if (!user) return null
  return { userId: user.id, email: user.email, name: user.name }
}

export async function rotateApiKey(userId: string): Promise<string> {
  const { key, hash } = generateApiKey()
  await prisma.user.update({ where: { id: userId }, data: { apiKey: hash } })
  return key
}

export async function revokeApiKey(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { apiKey: null } })
}

export async function hasApiKey(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { apiKey: true } })
  return !!user?.apiKey
}
