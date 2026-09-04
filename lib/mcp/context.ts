/**
 * Contexte d'exécution d'un outil MCP : identité authentifiée par clé API,
 * origine publique, et résolution d'un site possédé par l'utilisateur.
 */
import { prisma } from '@/lib/prisma'
import type { UsageContext } from '@/lib/dataforseo/budget'
import { McpToolError } from './helpers'

export type ToolContext = {
  userId: string
  userEmail: string
  baseUrl: string
}

export async function resolveWebsite(context: ToolContext, websiteId: string) {
  const website = await prisma.website.findFirst({
    where: { id: websiteId, userId: context.userId },
    select: { id: true, domain: true, name: true },
  })
  if (!website) {
    throw new McpToolError(`Site ${websiteId} introuvable dans ce compte. Utilisez list_websites pour obtenir un identifiant.`)
  }
  return website
}

export function usageContext(context: ToolContext, websiteId?: string): UsageContext {
  return { userId: context.userId, websiteId: websiteId ?? null }
}

export function dashboardUrl(context: ToolContext, path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, context.baseUrl)
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value))
  }
  return url.toString()
}

export function getPublicBaseUrl(request: Request): string {
  const configured = process.env.NEXT_PUBLIC_URL || process.env.NEXTAUTH_URL
  if (configured) return configured
  const url = new URL(request.url)
  const proto = request.headers.get('x-forwarded-proto') ?? url.protocol.replace(':', '')
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? url.host
  return `${proto}://${host}`
}
