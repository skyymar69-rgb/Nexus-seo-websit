'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, MapPin, Play, RefreshCw, Smartphone, Monitor } from 'lucide-react'

/**
 * Commandes du suivi de positions (portage OpenSEO) : configuration
 * (localisation locale, appareil), estimation du coût et lancement d'un run.
 */
type Overview = {
  configured: boolean
  config: { locationCode: number; locationName: string; languageCode: string; device: string; depth: number; active: boolean } | null
  lastRun: { status: string; keywordsChecked: number; keywordsTotal: number; costUsd: number; startedAt: string; error: string | null } | null
  keywords: Array<unknown>
  estimatedRunCostUsd: number
}

type LocationHit = { locationName: string; displayLabel: string; locationType: string }

export function RankTrackerControls({ websiteId, onRunCompleted }: { websiteId: string; onRunCompleted?: () => void }) {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [running, setRunning] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [hits, setHits] = useState<LocationHit[]>([])

  const load = useCallback(async () => {
    const res = await fetch(`/api/rank-tracker?websiteId=${websiteId}`)
    if (res.ok) setOverview(await res.json())
  }, [websiteId])

  useEffect(() => {
    load().catch(() => {})
  }, [load])

  useEffect(() => {
    if (query.trim().length < 2) {
      setHits([])
      return
    }
    const handle = setTimeout(async () => {
      const res = await fetch(
        `/api/rank-tracker/locations?q=${encodeURIComponent(query)}&locationCode=${overview?.config?.locationCode ?? 2250}`,
      )
      if (res.ok) setHits((await res.json()).locations ?? [])
    }, 300)
    return () => clearTimeout(handle)
  }, [query, overview?.config?.locationCode])

  const save = async (patch: Record<string, unknown>) => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/rank-tracker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId, ...patch }),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Enregistrement impossible')
      await load()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setSaving(false)
    }
  }

  const run = async () => {
    if (!overview) return
    if (!window.confirm(`Lancer une vérification ? Coût maximal estimé : ${overview.estimatedRunCostUsd.toFixed(3)} $.`)) return
    setRunning(true)
    setMessage(null)
    try {
      const res = await fetch('/api/rank-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Vérification impossible')
      setMessage(`Run ${json.status} : ${json.keywordsChecked}/${json.keywordsTotal} mots-clés, ${Number(json.costUsd).toFixed(4)} $.${json.error ? ` ${json.error}` : ''}`)
      await load()
      onRunCompleted?.()
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setRunning(false)
    }
  }

  if (!overview) return null
  const config = overview.config
  const device = config?.device ?? 'desktop'

  return (
    <div className="mb-6 rounded-xl border border-white/5 bg-white/[0.03] p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <MapPin className="h-4 w-4 text-cyan-400" />
          {config?.locationName ? config.locationName.split(',')[0] : 'National (France)'}
        </div>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ville pour un suivi local…"
            className="w-56 rounded-lg border border-white/10 bg-black/30 px-3 py-1.5 text-sm text-white placeholder:text-white/30"
          />
          {hits.length > 0 && (
            <ul className="absolute z-10 mt-1 w-72 max-h-56 overflow-auto rounded-lg border border-white/10 bg-[#0d1515] text-sm">
              {hits.map((hit) => (
                <li key={hit.locationName}>
                  <button
                    className="w-full px-3 py-1.5 text-left text-white/80 hover:bg-white/[0.06]"
                    onClick={() => {
                      setQuery('')
                      setHits([])
                      save({ locationName: hit.locationName })
                    }}
                  >
                    {hit.displayLabel} <span className="text-white/30">({hit.locationType})</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {config?.locationName && (
          <button onClick={() => save({ locationName: '' })} className="text-xs text-white/40 hover:text-white/70">
            Revenir au national
          </button>
        )}
        <button
          onClick={() => save({ device: device === 'desktop' ? 'mobile' : 'desktop' })}
          disabled={saving}
          className="flex items-center gap-1 rounded-lg border border-white/10 px-2 py-1.5 text-xs text-white/70 hover:bg-white/[0.06]"
          title="Appareil simulé"
        >
          {device === 'desktop' ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
          {device === 'desktop' ? 'Ordinateur' : 'Mobile'}
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => load()} className="rounded-lg border border-white/10 p-1.5 text-white/50 hover:bg-white/[0.06]" title="Actualiser">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={run}
            disabled={running || !overview.configured || overview.keywords.length === 0}
            className="flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-sm text-cyan-200 hover:bg-cyan-500/20 disabled:opacity-50"
            title={!overview.configured ? 'DataForSEO non configuré' : `≈ ${overview.estimatedRunCostUsd.toFixed(3)} $`}
          >
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Vérifier les positions
          </button>
        </div>
      </div>
      <p className="text-xs text-white/40">
        {overview.lastRun
          ? `Dernier run ${new Date(overview.lastRun.startedAt).toLocaleString('fr-FR')} : ${overview.lastRun.keywordsChecked}/${overview.lastRun.keywordsTotal} mots-clés, ${overview.lastRun.costUsd.toFixed(4)} $.`
          : 'Aucune vérification encore.'}{' '}
        Coût maximal d’un run : {overview.estimatedRunCostUsd.toFixed(3)} $ ; le cron quotidien reprend cette configuration
        {config?.active === false ? ' (désactivé)' : ''}.
      </p>
      {message && <p className="text-xs text-cyan-200">{message}</p>}
    </div>
  )
}
