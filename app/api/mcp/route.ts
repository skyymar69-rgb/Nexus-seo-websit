import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js'
import { resolveApiKeyIdentity } from '@/lib/mcp/auth'
import { getPublicBaseUrl } from '@/lib/mcp/context'
import { createNexusMcpServer } from '@/lib/mcp/server'

/**
 * Serveur MCP Nexus — transport HTTP streamable, sans session (portage OpenSEO).
 *
 * Authentification par clé API utilisateur (`Authorization: Bearer nxs_…`
 * ou `x-api-key`), générée dans Réglages. Chaque requête construit son
 * serveur et le referme : les réponses sont bufferisées en JSON, aucun flux
 * SSE n'est retenu par une fonction serverless.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, x-api-key, mcp-session-id, MCP-Protocol-Version',
  'Access-Control-Expose-Headers': 'mcp-session-id',
  'Access-Control-Max-Age': '86400',
} as const

function withCors(response: Response): Response {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(CORS_HEADERS)) headers.set(name, value)
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function unauthorized(): Response {
  return withCors(
    new Response(
      JSON.stringify({ error: 'invalid_api_key', error_description: 'Clé API absente ou invalide. Générez-en une dans Réglages > Clé API.' }),
      { status: 401, headers: { 'Content-Type': 'application/json', 'WWW-Authenticate': 'Bearer realm="nexus-mcp"' } },
    ),
  )
}

async function handle(request: Request): Promise<Response> {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS_HEADERS })

  const identity = await resolveApiKeyIdentity(request)
  if (!identity) return unauthorized()

  const server = createNexusMcpServer({
    userId: identity.userId,
    userEmail: identity.email,
    baseUrl: getPublicBaseUrl(request),
  })
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })

  try {
    await server.connect(transport)
    return withCors(await transport.handleRequest(request))
  } catch (error) {
    console.error('[mcp] request failed:', error)
    return withCors(
      new Response(JSON.stringify({ jsonrpc: '2.0', error: { code: -32603, message: 'Erreur interne du serveur MCP' }, id: null }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
  } finally {
    await Promise.all([transport.close().catch(() => {}), server.close().catch(() => {})])
  }
}

export { handle as GET, handle as POST, handle as DELETE, handle as OPTIONS }
