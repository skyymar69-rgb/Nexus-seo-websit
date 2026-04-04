'use client'

import { useState, useEffect } from 'react'
import { useWebsite } from '@/contexts/WebsiteContext'
import {
  FileText,
  Plus,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle2,
  BarChart3,
  Key,
  Link2,
  Bot,
  Gauge,
} from 'lucide-react'

interface ReportData {
  website: { domain: string; name: string | null }
  generatedAt: string
  audit: { score: number; grade: string; date: string } | null
  keywords: { count: number; avgPosition: number | null }
  backlinks: { count: number; dofollowRatio: number }
  aiVisibility: { queriesAnalyzed: number; mentionRate: number | null }
  performance: {
    score: number
    grade: string
    lcp: number | null
    fcp: number | null
    cls: number | null
    date: string
  } | null
}

interface Report {
  id: string
  title: string
  type: string
  format: string
  data: ReportData | null
  status: string
  createdAt: string
}

export default function ReportsPage() {
  const { selectedWebsite } = useWebsite()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchReports = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/reports')
      if (!res.ok) throw new Error('Erreur lors du chargement des rapports')
      const json = await res.json()
      setReports(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  const handleGenerate = async () => {
    if (!selectedWebsite) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ websiteId: selectedWebsite.id }),
      })
      if (!res.ok) throw new Error('Erreur lors de la generation du rapport')
      const newReport = await res.json()
      setReports((prev) => [newReport, ...prev])
      setExpandedId(newReport.id)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setGenerating(false)
    }
  }

  // No website selected
  if (!selectedWebsite) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Aucun site selectionne
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Selectionnez un site web pour generer des rapports.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rapports</h1>
            <p className="mt-1 text-sm text-gray-500">
              Generez et consultez vos rapports SEO pour{' '}
              <span className="font-medium text-gray-700">
                {selectedWebsite.domain}
              </span>
            </p>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Generer un rapport
          </button>
        </div>
      </div>

      <div className="p-8">
        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">
              Chargement des rapports...
            </span>
          </div>
        )}

        {/* Empty state */}
        {!loading && reports.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <FileText className="h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Aucun rapport
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Cliquez sur &quot;Generer un rapport&quot; pour creer votre
              premier rapport SEO.
            </p>
          </div>
        )}

        {/* Reports list */}
        {!loading && reports.length > 0 && (
          <div className="space-y-4">
            {reports.map((report) => {
              const isExpanded = expandedId === report.id
              return (
                <div
                  key={report.id}
                  className="rounded-lg border border-gray-200 bg-white shadow-sm"
                >
                  {/* Report header */}
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : report.id)
                    }
                    className="flex w-full items-center justify-between px-6 py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {report.title}
                        </p>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.createdAt).toLocaleDateString(
                              'fr-FR',
                              {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {report.status === 'completed'
                              ? 'Termine'
                              : 'En cours'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>

                  {/* Expanded report data */}
                  {isExpanded && report.data && (
                    <div className="border-t border-gray-100 px-6 py-5">
                      <ReportDetail data={report.data} />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function ReportDetail({ data }: { data: ReportData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Audit */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-gray-900">Audit SEO</h4>
        </div>
        {data.audit ? (
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data.audit.score}/100
            </p>
            <p className="text-xs text-gray-500">
              Grade {data.audit.grade} -{' '}
              {new Date(data.audit.date).toLocaleDateString('fr-FR')}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">Aucun audit disponible</p>
        )}
      </div>

      {/* Keywords */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Key className="h-4 w-4 text-green-600" />
          <h4 className="text-sm font-semibold text-gray-900">Mots-cles</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {data.keywords.count}
        </p>
        <p className="text-xs text-gray-500">
          {data.keywords.avgPosition != null
            ? `Position moyenne : ${data.keywords.avgPosition}`
            : 'Aucune position trackee'}
        </p>
      </div>

      {/* Backlinks */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Link2 className="h-4 w-4 text-yellow-600" />
          <h4 className="text-sm font-semibold text-gray-900">Backlinks</h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {data.backlinks.count}
        </p>
        <p className="text-xs text-gray-500">
          {data.backlinks.dofollowRatio}% dofollow
        </p>
      </div>

      {/* AI Visibility */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Bot className="h-4 w-4 text-purple-600" />
          <h4 className="text-sm font-semibold text-gray-900">
            Visibilite IA
          </h4>
        </div>
        <p className="text-2xl font-bold text-gray-900">
          {data.aiVisibility.mentionRate != null
            ? `${data.aiVisibility.mentionRate}%`
            : '-'}
        </p>
        <p className="text-xs text-gray-500">
          {data.aiVisibility.queriesAnalyzed} requetes analysees
        </p>
      </div>

      {/* Performance */}
      <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Gauge className="h-4 w-4 text-teal-600" />
          <h4 className="text-sm font-semibold text-gray-900">Performance</h4>
        </div>
        {data.performance ? (
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {data.performance.score}/100
            </p>
            <p className="text-xs text-gray-500">
              LCP: {data.performance.lcp?.toFixed(1) ?? '-'}s | FCP:{' '}
              {data.performance.fcp?.toFixed(1) ?? '-'}s | CLS:{' '}
              {data.performance.cls?.toFixed(3) ?? '-'}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">
            Aucune donnee de performance
          </p>
        )}
      </div>
    </div>
  )
}
