/**
 * Serveur MCP Nexus (portage OpenSEO, MIT).
 *
 * Un serveur par requête, sans état : la liste d'outils est fixe et aucune
 * notification n'est publiée, donc `listChanged` n'est pas annoncé. Chaque
 * outil reçoit le contexte authentifié (clé API) et renvoie texte + données
 * structurées. Les erreurs métier deviennent des réponses `isError` lisibles
 * plutôt que des erreurs de protocole.
 */
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult, ToolAnnotations } from '@modelcontextprotocol/sdk/types.js'
import type { z } from 'zod'
import { describeDataforseoError, DataforseoError } from '@/lib/dataforseo/errors'
import type { ToolContext } from './context'
import { errorMessage, mcpResponse, McpToolError } from './helpers'
import { accountTools } from './tools/account'
import { auditTools } from './tools/audit'
import { backlinksTools } from './tools/backlinks'
import { domainTools } from './tools/domain'
import { keywordTools } from './tools/keywords'
import { localTools } from './tools/local'
import { rankTrackingTools } from './tools/rank-tracking'

export type NexusTool<Shape extends z.ZodRawShape = z.ZodRawShape> = {
  name: string
  title: string
  description: string
  inputSchema: Shape
  annotations?: ToolAnnotations
  handler: (args: z.infer<z.ZodObject<Shape>>, context: ToolContext) => Promise<CallToolResult>
}

export function defineTool<Shape extends z.ZodRawShape>(tool: NexusTool<Shape>): NexusTool<Shape> {
  return tool
}

export const MCP_SERVER_VERSION = '0.1.0'

export const MCP_INSTRUCTIONS =
  'Outils SEO Nexus (KAYZEN LYON) : recherche de mots-clés, SERP, concurrents, domaine, backlinks, ' +
  'audit de site multipage, suivi de positions national et local, SEO local. ' +
  'Les outils marqués « facturé » consomment le budget DataForSEO du déploiement ; ' +
  'demandez confirmation avant un lot important (plus de 50 mots-clés ou 10 SERP). ' +
  'La visibilité dans les moteurs IA (taux de citation) n’est pas servie ici : elle relève de Synaptik (synaptik.kayzen-lyon.com).'

function toErrorResult(error: unknown): CallToolResult {
  if (error instanceof McpToolError) return mcpResponse({ text: error.message, isError: true })
  if (error instanceof DataforseoError) {
    return mcpResponse({ text: `${describeDataforseoError(error)} (${error.code})`, isError: true })
  }
  console.error('[mcp] tool failed:', error)
  return mcpResponse({ text: `Erreur inattendue : ${errorMessage(error)}`, isError: true })
}

export function listNexusTools(): NexusTool[] {
  return [
    ...accountTools,
    ...keywordTools,
    ...domainTools,
    ...backlinksTools,
    ...auditTools,
    ...rankTrackingTools,
    ...localTools,
  ] as NexusTool[]
}

export function createNexusMcpServer(context: ToolContext): McpServer {
  const server = new McpServer(
    { name: 'Nexus SEO MCP', title: 'Nexus SEO', version: MCP_SERVER_VERSION },
    { capabilities: { tools: { listChanged: false } }, instructions: MCP_INSTRUCTIONS },
  )

  for (const tool of listNexusTools()) {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: tool.annotations,
      },
      async (args: unknown) => {
        try {
          return await tool.handler(args as never, context)
        } catch (error) {
          return toErrorResult(error)
        }
      },
    )
  }

  return server
}
