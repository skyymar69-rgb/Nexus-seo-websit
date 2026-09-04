'use client'

import { useEffect, useState } from 'react'
import { Key, Loader2, Copy, Check, Trash2 } from 'lucide-react'

/**
 * Clé API pour le serveur MCP (portage OpenSEO). La clé n'est affichée
 * qu'une fois : seul son hachage est conservé côté serveur.
 */
export function ApiKeyPanel() {
  const [hasKey, setHasKey] = useState<boolean | null>(null)
  const [freshKey, setFreshKey] = useState<string | null>(null)
  const [mcpUrl, setMcpUrl] = useState<string>('')
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings/api-key')
      .then((r) => (r.ok ? r.json() : { hasKey: false }))
      .then((j) => setHasKey(!!j.hasKey))
      .catch(() => setHasKey(false))
    setMcpUrl(`${window.location.origin}/api/mcp`)
  }, [])

  const generate = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/settings/api-key', { method: 'POST' })
      if (!res.ok) throw new Error('Génération impossible')
      const json = await res.json()
      setFreshKey(json.key)
      setHasKey(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setBusy(false)
    }
  }

  const revoke = async () => {
    setBusy(true)
    setError(null)
    try {
      await fetch('/api/settings/api-key', { method: 'DELETE' })
      setHasKey(false)
      setFreshKey(null)
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    if (!freshKey) return
    await navigator.clipboard.writeText(freshKey).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const config = freshKey
    ? JSON.stringify({ mcpServers: { nexus: { type: 'http', url: mcpUrl, headers: { Authorization: `Bearer ${freshKey}` } } } }, null, 2)
    : null

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-6">
      <h2 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
        <Key className="h-5 w-5 text-cyan-400" />
        Clé API et serveur MCP
      </h2>
      <p className="text-sm text-white/50 mb-4">
        Connectez Claude Code, Cursor ou tout agent compatible MCP à vos données Nexus : mots-clés, SERP,
        backlinks, audit de site, suivi de positions. Adresse du serveur : <code className="text-cyan-300">{mcpUrl}</code>
      </p>

      {freshKey && config && (
        <div className="mb-4 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4 space-y-3">
          <p className="text-sm text-white/80">
            Copiez cette clé maintenant : elle ne sera plus affichée.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all rounded bg-black/40 px-3 py-2 text-xs text-cyan-200">{freshKey}</code>
            <button onClick={copy} className="rounded-lg border border-white/10 px-3 py-2 text-white/70 hover:bg-white/[0.06]" aria-label="Copier la clé">
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
          <details className="text-xs text-white/60">
            <summary className="cursor-pointer">Configuration Claude Code / Cursor (.mcp.json)</summary>
            <pre className="mt-2 overflow-x-auto rounded bg-black/40 p-3 text-[11px] text-white/70">{config}</pre>
          </details>
        </div>
      )}

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={generate}
          disabled={busy || hasKey === null}
          className="px-4 py-3 rounded-lg border font-medium transition-colors border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-200 disabled:opacity-50 flex items-center gap-2"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
          {hasKey ? 'Régénérer la clé' : 'Générer une clé API'}
        </button>
        {hasKey && (
          <button
            onClick={revoke}
            disabled={busy}
            className="px-4 py-3 rounded-lg border font-medium transition-colors border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 disabled:opacity-50 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Révoquer
          </button>
        )}
      </div>
      {hasKey && !freshKey && (
        <p className="mt-3 text-xs text-white/40">Une clé est active. La régénérer invalide l’ancienne.</p>
      )}
    </div>
  )
}
