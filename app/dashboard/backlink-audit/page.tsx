'use client'

import { useState, useEffect, useMemo } from 'react'
import { useWebsite } from '@/contexts/WebsiteContext'
import { Link2, Shield, AlertTriangle, CheckCircle2, Loader2, ExternalLink } from 'lucide-react'

interface Backlink {
  id: string
  sourceUrl: string
  sourceDomain: string
  anchorText: string | null
  da: number
  dr: number
  linkType: 'dofollow' | 'nofollow' | 'ugc' | 'sponsored'
  spamScore: number
  status: 'active' | 'lost' | 'broken'
}

type Quality = 'good' | 'medium' | 'toxic'

function scoreBacklink(b: Backlink): Quality {
  if (b.spamScore > 50 || b.da < 10) return 'toxic'
  if (b.da > 30 && b.linkType === 'dofollow') return 'good'
  return 'medium'
}

const qualityConfig: Record<Quality, { label: string; color: string; bg: string }> = {
  good: { label: 'Bon', color: 'text-green-700', bg: 'bg-green-100' },
  medium: { label: 'Moyen', color: 'text-yellow-700', bg: 'bg-yellow-100' },
  toxic: { label: 'Toxique', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function BacklinkAuditPage() {
  const { selectedWebsite } = useWebsite()
  const [backlinks, setBacklinks] = useState<Backlink[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!selectedWebsite) return
    setLoading(true)
    setError('')
    fetch(`/api/backlinks?websiteId=${selectedWebsite.id}`)
      .then(r => r.ok ? r.json() : Promise.reject('Erreur de chargement'))
      .then(data => setBacklinks(Array.isArray(data) ? data : data.backlinks || []))
      .catch(() => setError('Impossible de charger les backlinks.'))
      .finally(() => setLoading(false))
  }, [selectedWebsite])

  const scored = useMemo(() => backlinks.map(b => ({ ...b, quality: scoreBacklink(b) })), [backlinks])

  const stats = useMemo(() => {
    const total = scored.length
    if (!total) return null
    const good = scored.filter(b => b.quality === 'good').length
    const medium = scored.filter(b => b.quality === 'medium').length
    const toxic = scored.filter(b => b.quality === 'toxic').length
    const dofollow = scored.filter(b => b.linkType === 'dofollow').length
    const nofollow = total - dofollow
    const overallScore = Math.round(((good * 100 + medium * 50) / total))
    return { total, good, medium, toxic, dofollow, nofollow, dofollowPct: Math.round((dofollow / total) * 100), nofollowPct: Math.round((nofollow / total) * 100), overallScore }
  }, [scored])

  if (!selectedWebsite) {
    return <div className="p-8 text-center text-gray-500">Veuillez sélectionner un site web pour commencer l&apos;audit.</div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Audit des Backlinks</h1>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-500">Analyse des backlinks en cours...</span>
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>}

      {!loading && !error && scored.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucun backlink trouvé pour ce site.</p>
          <p className="text-gray-400 mt-1">Les backlinks apparaîtront ici une fois détectés.</p>
        </div>
      )}

      {!loading && stats && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">Score global</p>
              <p className="text-3xl font-bold text-gray-900">{stats.overallScore}<span className="text-lg text-gray-400">/100</span></p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <p className="text-sm text-gray-500">Ratio Dofollow / Nofollow</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: `${stats.dofollowPct}%` }} />
                  <div className="bg-gray-300 h-full" style={{ width: `${stats.nofollowPct}%` }} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{stats.dofollowPct}% dofollow / {stats.nofollowPct}% nofollow</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <p className="text-sm text-gray-500">Bons liens</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats.good}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-sm text-gray-500">Liens toxiques</p>
              </div>
              <p className="text-3xl font-bold text-red-600">{stats.toxic}</p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Domaine source</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Texte d&apos;ancre</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">DA</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">DR</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Type</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Statut</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Qualité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scored.map(b => {
                    const q = qualityConfig[b.quality]
                    return (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                            {b.sourceDomain} <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[200px] truncate">{b.anchorText || '-'}</td>
                        <td className="px-4 py-3 text-center font-medium">{b.da}</td>
                        <td className="px-4 py-3 text-center font-medium">{b.dr}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.linkType === 'dofollow' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                            {b.linkType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === 'active' ? 'bg-green-100 text-green-700' : b.status === 'lost' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${q.bg} ${q.color}`}>{q.label}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
