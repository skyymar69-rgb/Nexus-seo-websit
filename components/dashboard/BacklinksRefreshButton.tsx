'use client'

import { useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'

/**
 * Rafraîchit le profil de liens depuis DataForSEO (portage OpenSEO) :
 * résumé, 100 meilleurs liens importés, instantané daté.
 */
export function BacklinksRefreshButton({ websiteId, onRefreshed }: { websiteId: string; onRefreshed?: () => void }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const refresh = async () => {
    if (!window.confirm('Rafraîchir depuis DataForSEO ? Coût estimé : environ 0,05 $.')) return
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/backlinks/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Rafraîchissement impossible')
      setMessage(`${json.summary.backlinks} backlinks, ${json.summary.referringDomains} domaines référents, ${json.imported} liens importés (${Number(json.costUsd).toFixed(4)} $).`)
      onRefreshed?.()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={refresh}
        disabled={busy}
        className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Rafraîchir depuis DataForSEO
      </button>
      {message && <p className="text-xs text-cyan-200">{message}</p>}
    </div>
  )
}
