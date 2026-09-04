import { describe, it, expect } from 'vitest'
import { formatMcpCell, formatMcpTable, mcpResponse, readPath, truncatedCell } from '@/lib/mcp/helpers'
import { API_KEY_PREFIX, extractApiKey, generateApiKey, hashApiKey } from '@/lib/mcp/auth'
import { AUDIT_ISSUE_TYPES, listIssueTypes } from '@/lib/audit/issues'
import { listNexusTools } from '@/lib/mcp/server'

describe('mcpResponse', () => {
  it('place les métadonnées dans structuredContent et _meta sans les valeurs indéfinies', () => {
    const result = mcpResponse({ text: 'ok', meta: { websiteId: 'w', costUsd: undefined }, structuredContent: { a: 1 } })
    expect(result.content[0]).toEqual({ type: 'text', text: 'ok' })
    expect(result.structuredContent).toEqual({ a: 1, meta: { websiteId: 'w' } })
    expect(result._meta).toEqual({ websiteId: 'w' })
  })
})

describe('tableaux', () => {
  it('formate les cellules et tronque', () => {
    expect(formatMcpCell(null)).toBe('—')
    expect(formatMcpCell(1.2345)).toBe('1.23')
    expect(formatMcpCell(true)).toBe('oui')
    expect(formatMcpCell('a\n  b')).toBe('a b')
    expect(truncatedCell(4)('abcdef')).toBe('abc…')
    expect(formatMcpTable([{ a: 1 }], [{ header: 'A', value: (r) => r.a }])).toBe('A\n1')
    expect(readPath({ a: { b: 2 } }, 'a', 'b')).toBe(2)
    expect(readPath({ a: 1 }, 'a', 'b')).toBeUndefined()
  })
})

describe('clés API', () => {
  it('génère une clé préfixée dont seul le hachage est stocké', () => {
    const { key, hash } = generateApiKey()
    expect(key.startsWith(API_KEY_PREFIX)).toBe(true)
    expect(hash).toBe(hashApiKey(key))
    expect(hash).not.toContain(key)
  })
  it('lit la clé en Bearer ou x-api-key, et ignore les autres jetons', () => {
    const key = `${API_KEY_PREFIX}abc`
    expect(extractApiKey(new Request('https://x', { headers: { authorization: `Bearer ${key}` } }))).toBe(key)
    expect(extractApiKey(new Request('https://x', { headers: { 'x-api-key': key } }))).toBe(key)
    expect(extractApiKey(new Request('https://x', { headers: { authorization: 'Bearer eyJhbGciOi' } }))).toBeNull()
  })
})

describe('registre des outils et des constats', () => {
  it('les noms d’outils sont uniques et en snake_case', () => {
    const names = listNexusTools().map((t) => t.name)
    expect(new Set(names).size).toBe(names.length)
    for (const name of names) expect(name).toMatch(/^[a-z][a-z0-9_]+$/)
    expect(names.length).toBeGreaterThanOrEqual(25)
  })
  it('chaque constat a un titre, une explication et un correctif en français', () => {
    for (const type of listIssueTypes()) {
      const descriptor = AUDIT_ISSUE_TYPES[type]
      expect(descriptor.title.length).toBeGreaterThan(3)
      expect(descriptor.explanation.length).toBeGreaterThan(20)
      expect(descriptor.howToFix.length).toBeGreaterThan(20)
    }
  })
})
