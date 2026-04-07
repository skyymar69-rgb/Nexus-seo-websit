'use client'

import { useState } from 'react'
import { Globe, Plus, Zap, Link2, BarChart3, Trash2, ExternalLink, Loader2, Search, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWebsite } from '@/contexts/WebsiteContext'
import { useRouter } from 'next/navigation'

export default function ProjectsPage() {
  const { websites, selectedWebsite, selectWebsite, addWebsite, refreshWebsites } = useWebsite()
  const router = useRouter()
  const [newDomain, setNewDomain] = useState('')
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!newDomain.trim()) { setError('Domaine requis'); return }
    const domain = newDomain.trim().replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '')
    setAdding(true)
    setError('')
    try {
      await addWebsite(domain, newName || domain)
      setNewDomain('')
      setNewName('')
      setShowForm(false)
      await refreshWebsites()
    } catch (e: any) {
      setError(e.message || 'Erreur lors de l\'ajout')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce site ? Cette action est irreversible.')) return
    try {
      await fetch(`/api/websites?id=${id}`, { method: 'DELETE' })
      await refreshWebsites()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-brand-950/30">
              <Globe className="h-6 w-6 text-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Mes Sites</h1>
          </div>
          <p className="text-sm text-surface-500">
            Gerez vos sites web. Selectionnez un site pour voir ses donnees dans le dashboard.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary px-4 py-2.5 rounded-xl flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Ajouter un site
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 p-6">
          <h3 className="font-bold text-surface-900 dark:text-white mb-4">Ajouter un site</h3>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-surface-500 mb-1">Domaine</label>
              <input
                type="text"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                placeholder="exemple.fr"
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-surface-500 mb-1">Nom (optionnel)</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Mon site principal"
                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 text-sm outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>
            <div className="flex items-end">
              <button onClick={handleAdd} disabled={adding} className="btn-primary px-6 py-2.5 rounded-xl disabled:opacity-50">
                {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sites list */}
      {websites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {websites.map((site) => {
            const isSelected = selectedWebsite?.id === site.id
            return (
              <div
                key={site.id}
                onClick={() => selectWebsite(site.id)}
                className={cn(
                  'rounded-xl border bg-white dark:bg-surface-900 overflow-hidden cursor-pointer transition-all hover:shadow-md',
                  isSelected
                    ? 'border-brand-400 dark:border-brand-600 ring-2 ring-brand-400/20'
                    : 'border-surface-200 dark:border-surface-800 hover:border-surface-300 dark:hover:border-surface-700'
                )}
              >
                {/* Header */}
                <div className="p-5 border-b border-surface-100 dark:border-surface-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                        isSelected ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'
                      )}>
                        {site.domain.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-surface-900 dark:text-white text-sm">{site.name || site.domain}</h3>
                        <p className="text-xs text-surface-500">{site.domain}</p>
                      </div>
                    </div>
                    {isSelected && <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400">Actif</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); selectWebsite(site.id); router.push('/dashboard/audit') }}
                    className="flex-1 px-3 py-2 rounded-lg text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition-colors"
                  >
                    Auditer
                  </button>
                  <a
                    href={`https://${site.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(site.id) }}
                    className="px-3 py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-dashed border-surface-300 dark:border-surface-700 p-16 text-center">
          <Globe className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-surface-900 dark:text-white mb-2">Aucun site ajoute</h3>
          <p className="text-sm text-surface-500 mb-6 max-w-sm mx-auto">
            Ajoutez votre premier site pour commencer a auditer et suivre votre SEO.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary px-6 py-3 rounded-xl">
            <Plus className="w-4 h-4" /> Ajouter un site
          </button>
        </div>
      )}
    </div>
  )
}
