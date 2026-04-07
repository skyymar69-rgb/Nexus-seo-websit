'use client'

import { useSession } from 'next-auth/react'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useWebsite } from '@/contexts/WebsiteContext'
import {
  RefreshCw,
  Play,
  Loader2,
  Globe,
  Calendar,
  ExternalLink,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// Report components
import { ScoreOverview } from '@/components/dashboard/report/ScoreOverview'
import { AuditSection } from '@/components/dashboard/report/AuditSection'
import { AEOSection } from '@/components/dashboard/report/AEOSection'
import { GEOSection } from '@/components/dashboard/report/GEOSection'
import { PerformanceSection } from '@/components/dashboard/report/PerformanceSection'
import { CrawlSection } from '@/components/dashboard/report/CrawlSection'
import { ActionsSection } from '@/components/dashboard/report/ActionsSection'
import { ReportNav } from '@/components/dashboard/report/ReportNav'

// ── Types ────────────────────────────────────────────────────

interface ScanResults {
  audit: {
    score: number
    grade: string
    summary: { passed: number; warnings: number; errors: number; total: number }
    meta: Record<string, string | null>
    content: Record<string, number>
    checks: Array<{
      id: string; category: string; name: string; status: 'passed' | 'warning' | 'error'
      score: number; value: string; summary: string; impact?: string
    }>
  } | null
  aeo: {
    overallScore: number; grade: string
    snippetReadiness: any; qaPatterns: any; voiceReadiness: any; contentStructure: any
    recommendations: string[]
  } | null
  geo: {
    overallScore: number; grade: string
    categories: any
    recommendations: string[]
  } | null
  geoEngine: {
    eeat: { total: number; experience: number; expertise: number; authority: number; trust: number } | null
    schema: any; faq: any
  }
  performance: {
    score: number; grade: string; lcp: number | null; fid: number | null; cls: number | null; ttfb: number | null
  } | null
  crawl: {
    pagesFound: number; pagesCrawled: number
    statusCodes: Record<string, number>
    issues: Array<{ url: string; issue: string }>
  } | null
}

interface ScanData {
  id: string
  status: string
  progress: number
  auditScore: number | null
  auditGrade: string | null
  aeoScore: number | null
  geoScore: number | null
  perfScore: number | null
  crawlPages: number | null
  startedAt: string
  completedAt: string | null
  results: ScanResults | null
  website: { domain: string; name: string | null }
}

// ── Main Dashboard ───────────────────────────────────────────

export default function DashboardPage() {
  const { data: session } = useSession()
  const { selectedWebsite, websites } = useWebsite()
  const router = useRouter()

  const [latestScan, setLatestScan] = useState<ScanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [scanning, setScanning] = useState(false)

  // Fetch latest scan for selected website
  const fetchLatestScan = useCallback(async () => {
    if (!selectedWebsite?.id) {
      setLatestScan(null)
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`/api/dashboard/stats?websiteId=${selectedWebsite.id}`)
      if (!res.ok) throw new Error()
      const data = await res.json()

      if (data.latestScanId) {
        const scanRes = await fetch(`/api/scan/${data.latestScanId}`)
        if (scanRes.ok) {
          const scanJson = await scanRes.json()
          if (scanJson.success) {
            setLatestScan(scanJson.data)
          }
        }
      } else {
        setLatestScan(null)
      }
    } catch {
      setLatestScan(null)
    } finally {
      setLoading(false)
    }
  }, [selectedWebsite?.id])

  useEffect(() => {
    setLoading(true)
    fetchLatestScan()
  }, [fetchLatestScan])

  // Check onboarding
  useEffect(() => {
    if (!loading && websites.length === 0) {
      router.push('/dashboard/onboarding')
    }
  }, [loading, websites, router])

  // Launch new scan
  const handleNewScan = async () => {
    if (!selectedWebsite) return
    setScanning(true)

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: selectedWebsite.id,
          url: `https://${selectedWebsite.domain}`,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.scanId) {
          router.push(`/dashboard/scan/${data.scanId}`)
          return
        }
      }
    } catch { /* ignore */ } finally {
      setScanning(false)
    }
  }

  // ── Render states ────────────────────────────────────────

  const results = latestScan?.results

  // Loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
      </div>
    )
  }

  // No website selected
  if (!selectedWebsite) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <Globe className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Aucun site selectionne</h2>
          <p className="text-white/50 text-sm mb-6">Ajoutez un site pour commencer votre analyse SEO complete.</p>
          <button
            onClick={() => router.push('/dashboard/onboarding')}
            className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            Ajouter un site
          </button>
        </div>
      </div>
    )
  }

  // No scan yet
  if (!latestScan || !results) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-brand-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Lancez votre premier scan</h2>
          <p className="text-white/50 text-sm mb-6">
            Analysez {selectedWebsite.domain} avec nos 50+ outils : audit technique, AEO, GEO, performance et crawl en une seule passe.
          </p>
          <button
            onClick={handleNewScan}
            disabled={scanning}
            className="px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {scanning ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Lancement...</>
            ) : (
              <><Play className="w-4 h-4" /> Lancer le scan complet</>
            )}
          </button>
        </div>
      </div>
    )
  }

  // ── Full Report View ────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Report header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Rapport — {selectedWebsite.name || selectedWebsite.domain}
          </h1>
          <div className="flex items-center gap-3 mt-1 text-sm text-white/40">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {selectedWebsite.domain}
            </span>
            {latestScan.completedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDistanceToNow(new Date(latestScan.completedAt), { addSuffix: true, locale: fr })}
              </span>
            )}
            <a
              href={`https://${selectedWebsite.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white/60 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNewScan}
            disabled={scanning}
            className="px-4 py-2 rounded-xl bg-brand-500 text-white text-sm font-medium hover:bg-brand-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Relancer le scan
          </button>
        </div>
      </div>

      {/* Score overview */}
      <ScoreOverview
        auditScore={latestScan.auditScore}
        aeoScore={latestScan.aeoScore}
        geoScore={latestScan.geoScore}
        perfScore={latestScan.perfScore}
      />

      {/* Report content with sidebar nav */}
      <div className="flex gap-6">
        {/* Sidebar nav (desktop) */}
        <div className="hidden lg:block w-44 flex-shrink-0">
          <ReportNav />
        </div>

        {/* Main report sections */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Mobile nav */}
          <div className="lg:hidden">
            <ReportNav />
          </div>

          <AuditSection
            score={results.audit?.score ?? latestScan.auditScore}
            grade={results.audit?.grade ?? latestScan.auditGrade}
            checks={results.audit?.checks || []}
            summary={results.audit?.summary || null}
          />

          <AEOSection
            score={results.aeo?.overallScore ?? latestScan.aeoScore}
            grade={results.aeo?.grade || null}
            snippetReadiness={results.aeo?.snippetReadiness || null}
            qaPatterns={results.aeo?.qaPatterns || null}
            voiceReadiness={results.aeo?.voiceReadiness || null}
            contentStructure={results.aeo?.contentStructure || null}
            recommendations={results.aeo?.recommendations || []}
          />

          <GEOSection
            score={results.geo?.overallScore ?? latestScan.geoScore}
            grade={results.geo?.grade || null}
            categories={results.geo?.categories || null}
            eeat={results.geoEngine?.eeat || null}
            recommendations={results.geo?.recommendations || []}
          />

          <PerformanceSection
            score={results.performance?.score ?? latestScan.perfScore}
            grade={results.performance?.grade || null}
            lcp={results.performance?.lcp || null}
            fid={results.performance?.fid || null}
            cls={results.performance?.cls || null}
            ttfb={results.performance?.ttfb || null}
          />

          <CrawlSection
            pagesFound={results.crawl?.pagesFound || null}
            pagesCrawled={results.crawl?.pagesCrawled ?? latestScan.crawlPages}
            statusCodes={results.crawl?.statusCodes || null}
            issues={results.crawl?.issues || null}
          />

          <ActionsSection
            auditChecks={results.audit?.checks || null}
            aeoRecommendations={results.aeo?.recommendations || []}
            geoRecommendations={results.geo?.recommendations || []}
          />
        </div>
      </div>
    </div>
  )
}
