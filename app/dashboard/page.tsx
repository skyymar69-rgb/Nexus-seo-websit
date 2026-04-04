'use client'

import { useSession } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn, formatNumber } from '@/lib/utils'
import { useWebsite } from '@/contexts/WebsiteContext'
import { useDashboardData, type DashboardAudit, type DashboardNotification } from '@/hooks/useDashboardData'
import { ExportMenu } from '@/components/shared/ExportMenu'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Gauge,
  Target,
  Link,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Activity,
  MoreHorizontal,
  ChevronRight,
  Eye,
  AlertCircle,
  BarChart3,
  Zap,
  Users,
  Globe,
  Search,
  Settings,
  Download,
  Play,
  Lightbulb,
  ListTodo,
  Bell,
  FileText,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// ============================================
// STATIC UI CONFIG
// ============================================

function generateToolsByCategory() {
  const categories = [
    {
      id: 'technical-seo',
      name: 'SEO Technique',
      icon: Zap,
      tools: [
        { id: 'site-audit', name: 'Audit de Site', isPro: false },
        { id: 'crawler', name: 'Crawleur Web', isPro: false },
        { id: 'core-web-vitals', name: 'Core Web Vitals', isPro: false },
        { id: 'robots', name: 'Robots.txt', isPro: false },
        { id: 'sitemap', name: 'Sitemap', isPro: false },
        { id: 'ssl', name: 'SSL/Securite', isPro: false },
      ],
    },
    {
      id: 'keywords',
      name: 'Mots-cles',
      icon: Search,
      tools: [
        { id: 'keyword-research', name: 'Recherche Mots-cles', isPro: true },
        { id: 'rank-tracker', name: 'Classements', isPro: false },
        { id: 'long-tail', name: 'Longue traine', isPro: true },
        { id: 'keyword-gap', name: 'Ecart Mots-cles', isPro: true },
        { id: 'intent', name: 'Analyse Intent', isPro: true },
        { id: 'clustering', name: 'Clustering', isPro: true },
      ],
    },
    {
      id: 'backlinks',
      name: 'Backlinks',
      icon: Link,
      tools: [
        { id: 'backlink-analysis', name: 'Analyse Backlinks', isPro: false },
        { id: 'link-gap', name: 'Ecart de Liens', isPro: true },
        { id: 'competitor-links', name: 'Liens Concurrents', isPro: true },
        { id: 'link-quality', name: 'Qualite des Liens', isPro: true },
        { id: 'anchor-text', name: 'Anchor Text', isPro: true },
        { id: 'link-building', name: 'Opportunites', isPro: true },
      ],
    },
    {
      id: 'content',
      name: 'Contenu',
      icon: Settings,
      tools: [
        { id: 'content-audit', name: 'Audit Contenu', isPro: false },
        { id: 'content-gap', name: 'Ecart Contenu', isPro: true },
        { id: 'ai-content', name: 'Generateur IA', isPro: true },
        { id: 'readability', name: 'Lisibilite', isPro: false },
        { id: 'seo-brief', name: 'Brief SEO', isPro: true },
        { id: 'content-calendar', name: 'Calendrier', isPro: true },
      ],
    },
    {
      id: 'competitors',
      name: 'Concurrents',
      icon: Users,
      tools: [
        { id: 'competitor-analysis', name: 'Analyse', isPro: false },
        { id: 'competitor-keywords', name: 'Mots-cles', isPro: true },
        { id: 'competitor-backlinks', name: 'Backlinks', isPro: true },
        { id: 'competitor-content', name: 'Contenu', isPro: true },
        { id: 'competitor-traffic', name: 'Trafic', isPro: true },
        { id: 'competitor-ranking', name: 'Classements', isPro: true },
      ],
    },
    {
      id: 'local',
      name: 'SEO Local',
      icon: Globe,
      tools: [
        { id: 'local-audit', name: 'Audit Local', isPro: false },
        { id: 'gmb-optimizer', name: 'Google My Business', isPro: true },
        { id: 'local-keywords', name: 'Mots-cles Locaux', isPro: true },
        { id: 'review-monitor', name: 'Avis', isPro: true },
        { id: 'citation-audit', name: 'Citations', isPro: true },
        { id: 'local-competitors', name: 'Concurrents Locaux', isPro: true },
      ],
    },
    {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      tools: [
        { id: 'analytics-audit', name: 'Audit Analytics', isPro: false },
        { id: 'traffic-source', name: 'Sources Trafic', isPro: false },
        { id: 'conversion-tracking', name: 'Conversions', isPro: true },
        { id: 'user-behavior', name: 'Comportement', isPro: true },
        { id: 'cohort-analysis', name: 'Cohortes', isPro: true },
        { id: 'attribution', name: 'Attribution', isPro: true },
      ],
    },
    {
      id: 'visibility',
      name: 'Visibilite',
      icon: Eye,
      tools: [
        { id: 'ai-visibility', name: 'Visibilite IA', isPro: true },
        { id: 'featured-snippets', name: 'Featured Snippets', isPro: true },
        { id: 'serp-features', name: 'Fonctionnalites SERP', isPro: true },
        { id: 'brand-monitoring', name: 'Marque', isPro: true },
        { id: 'visibility-score', name: 'Score Visibilite', isPro: false },
        { id: 'visibility-history', name: 'Historique', isPro: false },
      ],
    },
    {
      id: 'utilities',
      name: 'Utilitaires',
      icon: Sparkles,
      tools: [
        { id: 'url-inspector', name: 'Inspecteur URL', isPro: false },
        { id: 'schema-validator', name: 'Schema Validation', isPro: false },
        { id: 'redirect-checker', name: 'Redirections', isPro: false },
        { id: 'api-tools', name: 'API Tools', isPro: true },
        { id: 'bulk-tools', name: 'Outils Batch', isPro: true },
        { id: 'integrations', name: 'Integrations', isPro: true },
      ],
    },
  ]
  return categories
}

function generateChecklistItems() {
  return [
    { id: 1, title: 'Installer Google Analytics', completed: true },
    { id: 2, title: 'Configurer Google Search Console', completed: true },
    { id: 3, title: 'Mettre en place SSL/HTTPS', completed: true },
    { id: 4, title: 'Creer sitemap.xml', completed: true },
    { id: 5, title: 'Optimiser robots.txt', completed: false },
    { id: 6, title: 'Corriger les erreurs 404', completed: false },
    { id: 7, title: 'Ajouter donnees structurees', completed: false },
    { id: 8, title: 'Optimiser images', completed: false },
    { id: 9, title: 'Reduire CLS', completed: false },
    { id: 10, title: 'Ameliorer LCP', completed: false },
  ]
}

// ============================================
// COMPONENTS
// ============================================

function KPICard({
  title,
  value,
  unit = '',
  trend,
  trendPercent,
  icon: Icon,
  color = 'bg-blue-500',
}: {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  trendPercent?: number
  icon: React.ComponentType<any>
  color?: string
}) {
  return (
    <div className="bg-surface-800 rounded-lg border border-surface-700 p-6 hover:border-surface-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-surface-400 text-sm font-medium">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-surface-100">{value}</span>
            {unit && <span className="text-surface-400 text-sm">{unit}</span>}
          </div>
        </div>
        <div className={cn('p-3 rounded-lg', color, 'opacity-20')}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>

      {trend && trendPercent !== undefined && (
        <div className="flex items-center gap-2">
          {trend === 'up' && (
            <>
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 text-sm font-medium">
                +{trendPercent.toFixed(1)}%
              </span>
            </>
          )}
          {trend === 'down' && (
            <>
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-red-500 text-sm font-medium">
                -{Math.abs(trendPercent).toFixed(1)}%
              </span>
            </>
          )}
          {trend === 'stable' && (
            <span className="text-surface-400 text-sm font-medium">Stable</span>
          )}
        </div>
      )}
    </div>
  )
}

function ScoreGauge({ score = 0, grade = '-' }: { score?: number; grade?: string }) {
  const getColorForScore = (s: number) => {
    if (s >= 80) return 'text-emerald-500'
    if (s >= 60) return 'text-amber-500'
    if (s >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getGradeBg = (g: string) => {
    switch (g) {
      case 'A':
        return 'bg-emerald-500/20 text-emerald-400'
      case 'B':
        return 'bg-amber-500/20 text-amber-400'
      case 'C':
        return 'bg-orange-500/20 text-orange-400'
      case '-':
        return 'bg-surface-700 text-surface-400'
      default:
        return 'bg-red-500/20 text-red-400'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 283} 283`}
            className={cn('transition-all duration-500', getColorForScore(score))}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-5xl font-bold', score > 0 ? getColorForScore(score) : 'text-surface-500')}>{score > 0 ? score : '--'}</span>
          <span className="text-surface-400 text-sm">/100</span>
        </div>
      </div>
      <div className={cn('px-4 py-2 rounded-full font-bold text-lg', getGradeBg(grade))}>
        Note: {grade}
      </div>
    </div>
  )
}

function AuditRow({ audit }: { audit: DashboardAudit }) {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500/10 text-emerald-400'
    if (s >= 60) return 'bg-amber-500/10 text-amber-400'
    if (s >= 40) return 'bg-orange-500/10 text-orange-400'
    return 'bg-red-500/10 text-red-400'
  }

  const formattedDate = new Date(audit.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const timeAgo = formatDistanceToNow(new Date(audit.createdAt), {
    locale: fr,
    addSuffix: true,
  })

  return (
    <tr className="border-b border-surface-700 hover:bg-surface-800/50 transition-colors">
      <td className="px-6 py-4 text-sm text-surface-200">{formattedDate}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className={cn('px-3 py-1 rounded-full font-bold text-sm', getScoreColor(audit.score))}>
            {audit.score}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-surface-300">
        <span className="px-2 py-1 bg-surface-700 rounded font-medium">{audit.grade}</span>
      </td>
      <td className="px-6 py-4 text-sm text-surface-400">{audit.website.domain}</td>
      <td className="px-6 py-4 text-sm text-surface-400">{timeAgo}</td>
      <td className="px-6 py-4 text-right">
        <button className="p-2 hover:bg-surface-700 rounded-lg transition-colors">
          <MoreHorizontal className="w-4 h-4 text-surface-400" />
        </button>
      </td>
    </tr>
  )
}

function RecommendationCard({
  rec,
}: {
  rec: {
    id: number
    title: string
    description: string
    priority: string
    impact: number
    effort: string
    category: string
  }
}) {
  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'critical':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    }
  }

  const getEffortColor = (e: string) => {
    switch (e) {
      case 'easy':
        return 'bg-green-500/10 text-green-400'
      case 'medium':
        return 'bg-amber-500/10 text-amber-400'
      default:
        return 'bg-red-500/10 text-red-400'
    }
  }

  return (
    <div className="bg-surface-800 rounded-lg border border-surface-700 p-4 hover:border-surface-600 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="text-sm font-bold text-surface-100 mb-1">{rec.title}</h4>
          <p className="text-xs text-surface-400">{rec.description}</p>
        </div>
        <span className={cn('px-2 py-1 rounded text-xs font-semibold border whitespace-nowrap ml-2', getPriorityColor(rec.priority))}>
          {rec.priority === 'critical' && 'Critique'}
          {rec.priority === 'high' && 'Haute'}
          {rec.priority === 'medium' && 'Moyenne'}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="text-surface-400">Impact: <span className="text-surface-200 font-semibold">{rec.impact}%</span></span>
        </div>
        <div className={cn('px-2 py-1 rounded', getEffortColor(rec.effort))}>
          {rec.effort === 'easy' && 'Facile'}
          {rec.effort === 'medium' && 'Moyen'}
          {rec.effort === 'hard' && 'Difficile'}
        </div>
      </div>
    </div>
  )
}

function ToolCard({
  tool,
  category,
}: {
  tool: { id: string; name: string; isPro: boolean }
  category: any
}) {
  const Icon = category.icon
  return (
    <div className="bg-surface-800 rounded-lg border border-surface-700 p-4 hover:border-surface-600 transition-all hover:shadow-lg cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <Icon className="w-5 h-5 text-surface-400 group-hover:text-indigo-400 transition-colors" />
        {tool.isPro && (
          <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs font-bold">
            PRO
          </span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-surface-200 group-hover:text-indigo-400 transition-colors">
        {tool.name}
      </h4>
      <p className="text-xs text-surface-500 mt-1">{category.name}</p>
    </div>
  )
}

function ActivityItem({ notification }: { notification: DashboardNotification }) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'audit_complete':
        return { icon: CheckCircle2, color: 'bg-blue-500/10 text-blue-600' }
      case 'ranking_change':
        return { icon: TrendingUp, color: 'bg-green-500/10 text-green-600' }
      case 'backlink_new':
        return { icon: Link, color: 'bg-purple-500/10 text-purple-600' }
      case 'issue_detected':
        return { icon: AlertCircle, color: 'bg-amber-500/10 text-amber-600' }
      default:
        return { icon: Bell, color: 'bg-indigo-500/10 text-indigo-600' }
    }
  }

  const { icon: Icon, color } = getIconForType(notification.type)

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    locale: fr,
    addSuffix: true,
  })

  return (
    <div className="flex gap-4 pb-4 border-b border-surface-700 last:border-b-0 last:pb-0">
      <div className={cn('p-2 rounded-lg h-fit', color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-surface-200">{notification.title}</h4>
        <p className="text-xs text-surface-400 mt-1">{notification.message}</p>
        <p className="text-xs text-surface-500 mt-2">{timeAgo}</p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0" />
      )}
    </div>
  )
}

// ============================================
// LOADING SKELETON
// ============================================

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-900 to-surface-950 text-surface-100">
      {/* Top bar skeleton */}
      <div className="sticky top-0 z-40 border-b border-surface-800 bg-surface-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-surface-700 animate-pulse" />
              <div>
                <div className="h-5 w-40 bg-surface-700 rounded animate-pulse" />
                <div className="h-3 w-28 bg-surface-700 rounded mt-2 animate-pulse" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-9 w-24 bg-surface-700 rounded-lg animate-pulse" />
              <div className="h-9 w-9 bg-surface-700 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface-800 rounded-lg border border-surface-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="h-4 w-20 bg-surface-700 rounded animate-pulse" />
                  <div className="h-8 w-16 bg-surface-700 rounded mt-3 animate-pulse" />
                </div>
                <div className="w-11 h-11 rounded-lg bg-surface-700 animate-pulse" />
              </div>
              <div className="h-4 w-24 bg-surface-700 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Chart skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-surface-800 rounded-lg border border-surface-700 p-8">
            <div className="h-5 w-24 bg-surface-700 rounded animate-pulse mb-6" />
            <div className="w-48 h-48 rounded-full bg-surface-700 animate-pulse mx-auto" />
          </div>
          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <div className="h-5 w-40 bg-surface-700 rounded animate-pulse mb-6" />
            <div className="h-[300px] bg-surface-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Table skeleton */}
        <div className="bg-surface-800 rounded-lg border border-surface-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-700">
            <div className="h-5 w-32 bg-surface-700 rounded animate-pulse" />
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="px-6 py-4 flex gap-8 border-b border-surface-700">
              <div className="h-4 w-28 bg-surface-700 rounded animate-pulse" />
              <div className="h-4 w-12 bg-surface-700 rounded animate-pulse" />
              <div className="h-4 w-8 bg-surface-700 rounded animate-pulse" />
              <div className="h-4 w-24 bg-surface-700 rounded animate-pulse" />
              <div className="h-4 w-20 bg-surface-700 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================
// EMPTY STATE COMPONENTS
// ============================================

function EmptyStateCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<any>
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="p-4 rounded-full bg-surface-700/50 mb-4">
        <Icon className="w-8 h-8 text-surface-500" />
      </div>
      <h3 className="text-sm font-semibold text-surface-300 mb-1">{title}</h3>
      <p className="text-xs text-surface-500 max-w-xs">{description}</p>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD
// ============================================

export default function DashboardPage() {
  const { data: session } = useSession()
  const { selectedWebsite, websites } = useWebsite()
  const { data: stats, isLoading, error, refetch } = useDashboardData(selectedWebsite?.id)
  const [dateRange, setDateRange] = useState('30')
  const router = useRouter()

  // Redirect to onboarding if no websites configured
  useEffect(() => {
    if (!isLoading && websites && websites.length === 0) {
      router.push('/dashboard/onboarding')
    }
  }, [isLoading, websites, router])

  const checklistItems = useMemo(() => generateChecklistItems(), [])
  const toolCategories = useMemo(() => generateToolsByCategory(), [])

  const completedChecklist = checklistItems.filter(item => item.completed).length
  const checklistPercent = Math.round((completedChecklist / checklistItems.length) * 100)
  const allTools = toolCategories.flatMap(cat => cat.tools).length

  // Derive score and grade from API data
  const currentScore = stats?.audits.latestScore ?? 0
  const currentGrade = currentScore >= 90 ? 'A' : currentScore >= 70 ? 'B' : currentScore >= 50 ? 'C' : currentScore > 0 ? 'D' : '-'

  // Build mini score trend from recent audits
  const scoreTrendData = useMemo(() => {
    if (!stats?.recentActivity.audits || stats.recentActivity.audits.length === 0) return []
    return [...stats.recentActivity.audits]
      .reverse()
      .map((a) => ({
        date: new Date(a.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
        score: a.score,
      }))
  }, [stats])

  // Build KPI cards from real data
  const kpisData = useMemo(() => {
    if (!stats) return []
    return [
      {
        title: 'Score SEO',
        value: stats.audits.latestScore ?? '--',
        unit: stats.audits.latestScore !== null ? '/100' : '',
        icon: Gauge,
        color: 'bg-blue-500',
      },
      {
        title: 'Mots-cles suivis',
        value: formatNumber(stats.keywords.total),
        unit: '',
        icon: Search,
        color: 'bg-green-500',
      },
      {
        title: 'Position moyenne',
        value: stats.keywords.avgPosition !== null ? stats.keywords.avgPosition.toFixed(1) : '--',
        unit: '',
        icon: Target,
        color: 'bg-amber-500',
      },
      {
        title: 'Backlinks',
        value: formatNumber(stats.backlinks.total),
        unit: stats.backlinks.total > 0 ? `${stats.backlinks.dofollowRatio.toFixed(0)}% dofollow` : '',
        icon: Link,
        color: 'bg-purple-500',
      },
      {
        title: 'Visibilite IA',
        value: stats.aiVisibility.totalQueries > 0 ? `${stats.aiVisibility.mentionRate.toFixed(0)}` : '--',
        unit: stats.aiVisibility.totalQueries > 0 ? '%' : '',
        icon: Sparkles,
        color: 'bg-indigo-500',
      },
      {
        title: 'Audits realises',
        value: formatNumber(stats.audits.total),
        unit: '',
        icon: FileText,
        color: 'bg-cyan-500',
      },
    ]
  }, [stats])

  // No website selected state
  if (!selectedWebsite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Globe className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-200 mb-2">Aucun site selectionne</h2>
          <p className="text-surface-400">Veuillez selectionner ou ajouter un site pour commencer</p>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500/60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-200 mb-2">Erreur de chargement</h2>
          <p className="text-surface-400 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium"
          >
            Reessayer
          </button>
        </div>
      </div>
    )
  }

  const recentAudits = stats?.recentActivity.audits ?? []
  const recentNotifications = stats?.recentActivity.notifications ?? []

  const lastAuditTime = recentAudits.length > 0
    ? formatDistanceToNow(new Date(recentAudits[0].createdAt), { locale: fr, addSuffix: true })
    : null

  const exportData = {
    title: 'Dashboard SEO Nexus',
    sections: [
      { title: 'KPIs', content: `Score: ${currentScore}/100` },
      { title: 'Audits Recents', content: recentAudits.length + ' audits' },
    ],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-900 via-surface-900 to-surface-950 text-surface-100">
      {/* TOP BAR */}
      <div className="sticky top-0 z-40 border-b border-surface-800 bg-surface-900/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-indigo-500" />
                <div>
                  <h1 className="text-lg font-bold text-surface-100">{selectedWebsite.domain}</h1>
                  <p className="text-xs text-surface-400">
                    {lastAuditTime
                      ? `Dernier audit: ${lastAuditTime}`
                      : 'Aucun audit realise'}
                  </p>
                </div>
              </div>
            </div>

            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 bg-surface-800 border border-surface-700 rounded-lg text-sm text-surface-300 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="7">7 jours</option>
                <option value="30">30 jours</option>
                <option value="90">90 jours</option>
                <option value="365">1 annee</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <ExportMenu
                data={exportData}
                variant="compact"
                label="Exporter"
              />
              <button
                onClick={refetch}
                className="p-2 hover:bg-surface-800 rounded-lg transition-colors text-surface-400 hover:text-surface-200"
                title="Rafraichir"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* KPI CARDS ROW */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpisData.map((kpi, idx) => (
              <KPICard
                key={idx}
                title={kpi.title}
                value={kpi.value}
                unit={kpi.unit}
                icon={kpi.icon}
                color={kpi.color}
              />
            ))}
          </div>
        </div>

        {/* SEO HEALTH SCORE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-surface-800 rounded-lg border border-surface-700 p-8">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Score SEO</h2>
            <ScoreGauge score={currentScore} grade={currentGrade} />
          </div>

          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Evolution du Score</h2>
            {scoreTrendData.length > 1 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreTrendData}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" />
                  <XAxis
                    dataKey="date"
                    stroke="rgb(107, 114, 128)"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgb(17, 24, 39)',
                      border: '1px solid rgb(55, 65, 81)',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => [`${Number(value).toFixed(0)}`, 'Score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    dot={{ fill: '#6366f1', r: 4 }}
                    strokeWidth={3}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyStateCard
                icon={BarChart3}
                title="Pas encore de donnees"
                description="Lancez au moins 2 audits pour voir l'evolution de votre score SEO dans le temps."
              />
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-3">
            <Play className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-semibold text-center">Nouvel Audit</span>
          </button>
          <button className="bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-3">
            <Target className="w-5 h-5 text-green-500" />
            <span className="text-sm font-semibold text-center">Classements</span>
          </button>
          <button className="bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-3">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-semibold text-center">Concurrents</span>
          </button>
          <button className="bg-surface-800 hover:bg-surface-700 border border-surface-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-3">
            <Download className="w-5 h-5 text-orange-500" />
            <span className="text-sm font-semibold text-center">Rapport</span>
          </button>
        </div>

        {/* KEYWORDS & STATS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Keyword Stats */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Mots-cles</h2>
            {stats && stats.keywords.total > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-surface-900/50 rounded-lg">
                  <p className="text-4xl font-bold text-surface-100">{formatNumber(stats.keywords.total)}</p>
                  <p className="text-sm text-surface-400 mt-2">Mots-cles suivis</p>
                </div>
                <div className="text-center p-6 bg-surface-900/50 rounded-lg">
                  <p className="text-4xl font-bold text-surface-100">
                    {stats.keywords.avgPosition !== null ? stats.keywords.avgPosition.toFixed(1) : '--'}
                  </p>
                  <p className="text-sm text-surface-400 mt-2">Position moyenne</p>
                </div>
              </div>
            ) : (
              <EmptyStateCard
                icon={Search}
                title="Aucun mot-cle suivi"
                description="Ajoutez des mots-cles pour suivre vos positions dans les resultats de recherche."
              />
            )}
          </div>

          {/* Backlinks Stats */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Backlinks</h2>
            {stats && stats.backlinks.total > 0 ? (
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-surface-900/50 rounded-lg">
                  <p className="text-4xl font-bold text-surface-100">{formatNumber(stats.backlinks.total)}</p>
                  <p className="text-sm text-surface-400 mt-2">Liens entrants</p>
                </div>
                <div className="text-center p-6 bg-surface-900/50 rounded-lg">
                  <p className="text-4xl font-bold text-surface-100">{stats.backlinks.dofollowRatio.toFixed(0)}%</p>
                  <p className="text-sm text-surface-400 mt-2">Dofollow</p>
                </div>
              </div>
            ) : (
              <EmptyStateCard
                icon={Link}
                title="Aucun backlink detecte"
                description="Les backlinks vers votre site apparaitront ici une fois detectes."
              />
            )}
          </div>
        </div>

        {/* RECENT AUDITS TABLE */}
        <div className="bg-surface-800 rounded-lg border border-surface-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-700">
            <h2 className="text-lg font-bold text-surface-100">Audits Recents</h2>
          </div>
          {recentAudits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-900 border-b border-surface-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Note</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Site</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Date relative</th>
                    <th className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentAudits.map((audit) => (
                    <AuditRow key={audit.id} audit={audit} />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyStateCard
              icon={FileText}
              title="Aucun audit realise"
              description="Lancez votre premier audit SEO pour obtenir une analyse complete de votre site."
            />
          )}
        </div>

        {/* AI ADVISOR PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recommandations IA
              </h2>
            </div>
            {recentAudits.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-surface-400">
                  Les recommandations sont generees apres chaque audit. Consultez le detail de votre dernier audit pour voir les actions recommandees.
                </p>
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1 mt-4">
                  Voir le dernier audit <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <EmptyStateCard
                icon={Lightbulb}
                title="Lancez un audit pour recevoir des recommandations"
                description="Notre IA analysera votre site et vous proposera des actions concretes pour ameliorer votre SEO."
              />
            )}
          </div>

          {/* CHECKLIST PROGRESS */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-500" />
                Checklist
              </h2>
              <span className="text-2xl font-bold text-indigo-400">{checklistPercent}%</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-2 bg-surface-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${checklistPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-surface-400 mt-2">
                {completedChecklist} sur {checklistItems.length} elements completes
              </p>
            </div>

            {/* Items Preview */}
            <div className="space-y-2">
              {checklistItems.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm">
                  <div className={cn(
                    'w-4 h-4 rounded border flex items-center justify-center',
                    item.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-surface-600'
                  )}>
                    {item.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <span className={item.completed ? 'text-surface-500 line-through' : 'text-surface-300'}>
                    {item.title}
                  </span>
                </div>
              ))}
              <p className="text-xs text-indigo-400 mt-3 cursor-pointer hover:text-indigo-300">
                Voir les {checklistItems.length} elements
              </p>
            </div>
          </div>
        </div>

        {/* TOOL GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-100">Acces Outils ({allTools})</h2>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1">
              Voir tous <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {toolCategories.map((category) => (
            <div key={category.id}>
              <h3 className="text-sm font-bold text-surface-200 mb-3 flex items-center gap-2">
                <category.icon className="w-4 h-4 text-indigo-500" />
                {category.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {category.tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} category={category} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ACTIVITY FEED */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Activite Recente
            </h2>
            {recentNotifications.length > 0 ? (
              <div className="space-y-4">
                {recentNotifications.map((notification) => (
                  <ActivityItem key={notification.id} notification={notification} />
                ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={Activity}
                title="Aucune activite recente"
                description="Vos notifications et activites apparaitront ici au fur et a mesure de votre utilisation."
              />
            )}
          </div>

          {/* STATS SUMMARY */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-surface-200 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Resume
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Sites web</span>
                  <span className="font-bold text-surface-200">{stats?.websites.total ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Audits realises</span>
                  <span className="font-bold text-surface-200">{stats?.audits.total ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Mots-cles suivis</span>
                  <span className="font-bold text-surface-200">{stats?.keywords.total ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Backlinks</span>
                  <span className="font-bold text-surface-200">{stats?.backlinks.total ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-surface-700 pt-6">
              <h3 className="text-sm font-bold text-surface-200 mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-500" />
                Visibilite IA
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Requetes analysees</span>
                  <span className="font-bold text-surface-200">{stats?.aiVisibility.totalQueries ?? 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Taux de mention</span>
                  <span className="font-bold text-surface-200">{stats?.aiVisibility.mentionRate.toFixed(0) ?? 0}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Notifications non lues</span>
                  <span className="font-bold text-indigo-400">{stats?.notifications.unread ?? 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
