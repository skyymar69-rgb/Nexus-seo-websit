/**
 * Aides de réponse MCP (portage OpenSEO : formatters.ts + table.ts, MIT).
 *
 * Un outil renvoie ses lignes dans structuredContent, mais les clients qui
 * n'affichent que le bloc texte verraient seulement un résumé : chaque ligne
 * est donc aussi rendue dans un tableau compact séparé par des barres.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'

export type McpResponseMeta = {
  url?: string
  websiteId?: string
  runId?: string
  costUsd?: number
  budgetRemainingUsd?: number
}

export function mcpResponse(opts: {
  text: string
  meta?: McpResponseMeta
  structuredContent?: Record<string, unknown>
  isError?: boolean
}): CallToolResult {
  const result: CallToolResult = { content: [{ type: 'text', text: opts.text }] }
  if (opts.isError) result.isError = true
  let meta: Record<string, unknown> | undefined
  if (opts.meta) {
    meta = {}
    for (const [key, value] of Object.entries(opts.meta)) if (value !== undefined) meta[key] = value
  }
  const hasMeta = meta != null && Object.keys(meta).length > 0
  if (opts.structuredContent) {
    result.structuredContent = hasMeta ? { ...opts.structuredContent, meta } : opts.structuredContent
  } else if (hasMeta) {
    result.structuredContent = { meta }
  }
  if (hasMeta) result._meta = meta
  return result
}

export class McpToolError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'McpToolError'
  }
}

export type McpTableColumn<T> = {
  header: string
  value: (row: T) => unknown
  format?: (value: unknown) => string
}

export function formatMcpCell(value: unknown): string {
  if (value == null || value === '') return '—'
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '—'
    return Number.isInteger(value) ? String(value) : value.toFixed(2)
  }
  if (typeof value === 'boolean') return value ? 'oui' : 'non'
  if (typeof value === 'string') return value.replace(/\s+/g, ' ').trim()
  if (typeof value === 'bigint') return value.toString()
  try {
    return JSON.stringify(value) ?? '—'
  } catch {
    return '—'
  }
}

export function truncatedCell(maxLength: number) {
  return (value: unknown): string => {
    const cell = formatMcpCell(value)
    return cell.length > maxLength ? `${cell.slice(0, maxLength - 1)}…` : cell
  }
}

export function formatMcpTable<T>(rows: readonly T[], columns: readonly McpTableColumn<T>[]): string {
  const headerLine = columns.map((column) => column.header).join(' | ')
  const rowLines = rows.map((row) =>
    columns
      .map((column) => {
        const raw = column.value(row)
        return column.format ? column.format(raw) : formatMcpCell(raw)
      })
      .join(' | '),
  )
  return [headerLine, ...rowLines].join('\n')
}

/** Suit une chaîne de clés dans des enregistrements inconnus (lignes fournisseur). */
export function readPath(source: unknown, ...path: string[]): unknown {
  let current: unknown = source
  for (const key of path) {
    if (typeof current !== 'object' || current === null) return undefined
    current = Reflect.get(current, key)
  }
  return current
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
