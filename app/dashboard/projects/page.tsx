'use client'

import { Globe, Plus, Zap, Link2, BarChart3 } from 'lucide-react'
import { formatNumber, cn } from '@/lib/utils'

interface Site {
  id: string
  domain: string
  status: 'active' | 'paused'
  seoScore: number
  trackedKeywords: number
  backlinks: number
  lastAudit: string
}

const sites: Site[] = [
  {
    id: '1',
    domain: 'monsite.fr',
    status: 'active',
    seoScore: 73,
    trackedKeywords: 1247,
    backlinks: 3892,
    lastAudit: '28 mar 2026',
  },
  {
    id: '2',
    domain: 'blog.monsite.fr',
    status: 'active',
    seoScore: 68,
    trackedKeywords: 342,
    backlinks: 1245,
    lastAudit: '25 mar 2026',
  },
  {
    id: '3',
    domain: 'shop.monsite.fr',
    status: 'paused',
    seoScore: 55,
    trackedKeywords: 89,
    backlinks: 456,
    lastAudit: '15 mar 2026',
  },
]

function ScoreBadge({ score }: { score: number }) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-accent-400'
    if (score >= 60) return 'text-amber-400'
    if (score >= 45) return 'text-orange-400'
    return 'text-red-400'
  }

  const getScoreBg = (score: number) => {
    if (score >= 75) return 'bg-accent-500/10 border-accent-500/20'
    if (score >= 60) return 'bg-amber-500/10 border-amber-500/20'
    if (score >= 45) return 'bg-orange-500/10 border-orange-500/20'
    return 'bg-red-500/10 border-red-500/20'
  }

  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2 text-sm font-semibold',
        getScoreBg(score),
        getScoreColor(score)
      )}
    >
      {score}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <Globe className="h-6 w-6 text-brand-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Projets & Sites
            </h1>
          </div>
          <p className="text-surface-400 mt-1 max-w-xl">
            Gerez vos sites web et vos projets SEO
          </p>
        </div>
        <button className="px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un site
        </button>
      </div>

      {/* Sites Grid */}
      {sites.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur overflow-hidden shadow-sm hover:border-surface-600 transition-colors"
            >
              {/* Header */}
              <div className="p-6 border-b border-surface-700 bg-surface-800/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-sm font-bold text-brand-400">
                      {site.domain.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-surface-100 text-sm">
                        {site.domain}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'w-2.5 h-2.5 rounded-full',
                      site.status === 'active'
                        ? 'bg-accent-500'
                        : 'bg-amber-500'
                    )}
                  />
                </div>
                <p className="text-xs text-surface-500">
                  {site.status === 'active' ? 'Actif' : 'En pause'}
                </p>
              </div>

              {/* Score Progress */}
              <div className="p-6 border-b border-surface-700">
                <div className="flex items-end justify-between mb-3">
                  <p className="text-xs text-surface-500 font-medium uppercase tracking-wide">
                    Score SEO
                  </p>
                  <ScoreBadge score={site.seoScore} />
                </div>
                <div className="w-full h-2 rounded-full bg-surface-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full transition-all"
                    style={{ width: `${site.seoScore}%` }}
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="p-6 border-b border-surface-700 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Zap className="h-4 w-4" />
                    Mots-cles suivis
                  </div>
                  <span className="font-semibold text-surface-100">
                    {formatNumber(site.trackedKeywords)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-surface-400">
                    <Link2 className="h-4 w-4" />
                    Backlinks
                  </div>
                  <span className="font-semibold text-surface-100">
                    {formatNumber(site.backlinks)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-surface-400">
                    <BarChart3 className="h-4 w-4" />
                    Dernier audit
                  </div>
                  <span className="font-semibold text-surface-100">
                    {site.lastAudit}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 flex gap-2">
                <button className="flex-1 px-3 py-2 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors text-sm font-medium">
                  Auditer
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors text-sm font-medium">
                  Mots-cles
                </button>
                <button className="flex-1 px-3 py-2 rounded-lg text-brand-400 hover:bg-brand-500/10 transition-colors text-sm font-medium">
                  Rapports
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 rounded-lg bg-brand-500/15">
              <Globe className="h-12 w-12 text-brand-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-surface-100 mb-2">
            Ajoutez votre premier site
          </h2>
          <p className="text-surface-400 mb-8 max-w-sm mx-auto">
            Ajoutez votre premier site pour commencer l'analyse SEO
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <input
              type="text"
              placeholder="https://votresite.fr"
              className="px-4 py-3 rounded-lg bg-surface-900 border border-surface-700 text-surface-100 placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm"
            />
            <button className="px-4 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
