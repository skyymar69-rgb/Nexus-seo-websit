'use client'

import { useState, useEffect, useMemo } from 'react'
import { useWebsite } from '@/contexts/WebsiteContext'
import {
  Loader2, AlertTriangle, ExternalLink, ArrowUpDown, Link2, FileText,
  ChevronUp, ChevronDown, Clock
} from 'lucide-react'
import Link from 'next/link'

interface CrawledPage {
  url: string
  statusCode: number
  responseTime: number
  title: string
  h1Count: number
  internalLinks: number
  wordCount: number
  issues: string[]
}

type SortKey = 'internalLinks' | 'wordCount' | 'responseTime' | 'statusCode'

function StatusBadge({ code }: { code: number }) {
  const color = code >= 200 && code < 300
    ? 'bg-emerald-50 text-emerald-700'
    : code >= 300 && code < 400
    ? 'bg-amber-50 text-amber-700'
    : 'bg-red-50 text-red-700'
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>{code}</span>
}

export default function TopPagesPage() {
  const { selectedWebsite } = useWebsite()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pages, setPages] = useState<CrawledPage[]>([])
  const [sortKey, setSortKey] = useState<SortKey>('internalLinks')
  const [sortAsc, setSortAsc] = useState(false)

  useEffect(() => {
    if (!selectedWebsite) return
    const fetchPages = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/crawl?websiteId=${selectedWebsite.id}`)
        if (!res.ok) {
          if (res.status === 404) {
            setPages([])
            return
          }
          throw new Error('Erreur lors du chargement')
        }
        const data = await res.json()
        setPages(data.pages || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur reseau')
      } finally {
        setLoading(false)
      }
    }
    fetchPages()
  }, [selectedWebsite])

  const sorted = useMemo(() => {
    return [...pages].sort((a, b) => {
      const va = a[sortKey] ?? 0
      const vb = b[sortKey] ?? 0
      return sortAsc ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
  }, [pages, sortKey, sortAsc])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(false)
    }
  }

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="w-3 h-3 text-gray-300" />
    return sortAsc ? <ChevronUp className="w-3 h-3 text-blue-600" /> : <ChevronDown className="w-3 h-3 text-blue-600" />
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Top Pages</h1>
          <p className="text-gray-500 mt-1">Pages les plus importantes de votre site</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-500">Chargement des donnees...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Top Pages</h1>
        <p className="text-gray-500 mt-1">
          Pages les plus importantes de votre site
          {selectedWebsite && <span className="text-blue-600 ml-1 font-medium">{selectedWebsite.domain}</span>}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {!error && pages.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune donnee de crawl</h3>
          <p className="text-gray-500 mb-4">Lancez un crawl pour voir vos top pages</p>
          <Link
            href="/dashboard/crawl"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Lancer un crawl
          </Link>
        </div>
      )}

      {pages.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">{pages.length} pages analysees</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">URL</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button onClick={() => handleSort('statusCode')} className="inline-flex items-center gap-1 hover:text-gray-900">
                      Status <SortIcon col="statusCode" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button onClick={() => handleSort('responseTime')} className="inline-flex items-center gap-1 hover:text-gray-900">
                      <Clock className="w-3 h-3" /> Temps <SortIcon col="responseTime" />
                    </button>
                  </th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500">Title</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">H1</th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button onClick={() => handleSort('internalLinks')} className="inline-flex items-center gap-1 hover:text-gray-900">
                      <Link2 className="w-3 h-3" /> Liens <SortIcon col="internalLinks" />
                    </button>
                  </th>
                  <th className="text-center px-3 py-3 font-medium text-gray-500">
                    <button onClick={() => handleSort('wordCount')} className="inline-flex items-center gap-1 hover:text-gray-900">
                      Mots <SortIcon col="wordCount" />
                    </button>
                  </th>
                  <th className="text-left px-3 py-3 font-medium text-gray-500">Problemes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((page, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-2.5 max-w-[240px]">
                      <a href={page.url} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block text-xs font-mono">
                        {page.url.replace(/^https?:\/\//, '')}
                      </a>
                    </td>
                    <td className="px-3 py-2.5 text-center"><StatusBadge code={page.statusCode} /></td>
                    <td className="px-3 py-2.5 text-center text-gray-600">{page.responseTime} ms</td>
                    <td className="px-3 py-2.5 text-gray-700 max-w-[200px] truncate text-xs">{page.title || '-'}</td>
                    <td className="px-3 py-2.5 text-center text-gray-600">{page.h1Count}</td>
                    <td className="px-3 py-2.5 text-center text-gray-600">{page.internalLinks}</td>
                    <td className="px-3 py-2.5 text-center text-gray-600">{page.wordCount?.toLocaleString('fr-FR') ?? '-'}</td>
                    <td className="px-3 py-2.5">
                      {page.issues.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {page.issues.slice(0, 2).map((issue, j) => (
                            <span key={j} className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] rounded">
                              {issue}
                            </span>
                          ))}
                          {page.issues.length > 2 && (
                            <span className="text-[10px] text-gray-400">+{page.issues.length - 2}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-emerald-500 text-xs">OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
