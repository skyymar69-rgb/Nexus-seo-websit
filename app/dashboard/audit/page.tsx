'use client'

import { useState, useCallback, useMemo } from 'react'
import { cn, getScoreColor, formatNumber } from '@/lib/utils'
import {
  Search,
  Settings,
  Zap,
  Shield,
  FileText,
  Smartphone,
  BookOpen,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  ChevronDown,
  Globe,
  Calendar,
  Loader2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Minus,
  Download,
  Eye,
  ArrowRight,
  Lightbulb,
  Target,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ExportMenu } from '@/components/shared/ExportMenu'

interface ApiCheck {
  id: string
  category: 'meta' | 'content' | 'technical' | 'performance' | 'security' | 'mobile'
  name: string
  status: 'passed' | 'warning' | 'error'
  score: number
  value: string
  recommendation: string
}

interface ApiAuditData {
  url: string
  score: number
  loadTime: number
  htmlSize: number
  checks: ApiCheck[]
  summary: {
    passed: number
    warnings: number
    errors: number
    totalChecks: number
  }
  meta: {
    title: string | null
    description: string | null
    canonical: string | null
    ogTitle: string | null
    ogDescription: string | null
    ogImage: string | null
  }
  content: {
    wordCount: number
    h1Count: number
    h2Count: number
    h3Count: number
    imageCount: number
    imagesWithAlt: number
    internalLinks: number
    externalLinks: number
  }
}

interface ApiAuditResponse {
  success: boolean
  data?: ApiAuditData
  error?: string
}

interface DisplayCategory {
  name: string
  key: string
  score: number
  checks: ApiCheck[]
}

interface PastAudit {
  date: string
  score: number
  passed: number
  warnings: number
  errors: number
}

const categoryConfig: Record<string, { label: string; icon: any; color: string; bgColor: string }> = {
  meta:        { label: 'SEO On-Page',   icon: FileText,   color: 'text-blue-500',   bgColor: 'bg-blue-500/10' },
  content:     { label: 'Contenu',       icon: BookOpen,   color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  technical:   { label: 'Technique',     icon: Settings,   color: 'text-orange-500', bgColor: 'bg-orange-500/10' },
  performance: { label: 'Performance',   icon: Zap,        color: 'text-amber-500',  bgColor: 'bg-amber-500/10' },
  security:    { label: 'Accessibilité', icon: Shield,     color: 'text-green-500',  bgColor: 'bg-green-500/10' },
  mobile:      { label: 'Mobile',        icon: Smartphone, color: 'text-cyan-500',   bgColor: 'bg-cyan-500/10' },
}

const DEMO_PAST_AUDITS: PastAudit[] = [
  { date: '2025-03-29', score: 74, passed: 28, warnings: 8, errors: 4 },
  { date: '2025-03-22', score: 70, passed: 25, warnings: 10, errors: 5 },
  { date: '2025-03-15', score: 68, passed: 24, warnings: 11, errors: 5 },
  { date: '2025-03-08', score: 65, passed: 22, warnings: 12, errors: 6 },
  { date: '2025-03-01', score: 62, passed: 20, warnings: 13, errors: 7 },
]

const DEMO_RECOMMENDATIONS = [
  { id: '1', priority: 'critique', title: 'Optimiser les images en WebP', impact: '+15 points', effort: '2-3 jours' },
  { id: '2', priority: 'haute', title: 'Implémenter la mise en cache du navigateur', impact: '+12 points', effort: '1-2 jours' },
  { id: '3', priority: 'haute', title: 'Améliorer les Core Web Vitals (LCP)', impact: '+10 points', effort: '3-5 jours' },
  { id: '4', priority: 'moyenne', title: 'Ajouter des schémas structurés JSON-LD', impact: '+8 points', effort: '1 jour' },
  { id: '5', priority: 'moyenne', title: 'Réduire le JavaScript non critique', impact: '+7 points', effort: '2-3 jours' },
]

function getGrade(score: number): string {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function getSeverityFromStatus(status: string) {
  switch (status) {
    case 'error':   return { label: 'critique', icon: AlertCircle, color: 'text-red-500', border: 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900', badge: 'bg-red-200/50' }
    case 'warning': return { label: 'avertissement', icon: AlertTriangle, color: 'text-orange-500', border: 'border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900', badge: 'bg-orange-200/50' }
    case 'passed':  return { label: 'réussi', icon: CheckCircle, color: 'text-green-500', border: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900', badge: 'bg-green-200/50' }
    default:        return { label: 'info', icon: Info, color: 'text-blue-500', border: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900', badge: 'bg-blue-200/50' }
  }
}

function ExpandableCheck({ check }: { check: ApiCheck }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const sev = getSeverityFromStatus(check.status)
  const Icon = sev.icon

  return (
    <div className={cn('rounded-lg border p-4 transition-all', sev.border)}>
      <div className="flex items-start gap-3 cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
        <div className={cn('flex-shrink-0 mt-1 p-1.5 rounded-lg', sev.badge)}>
          <Icon className={cn('h-5 w-5', sev.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 group-hover:underline">
            {check.name}
          </h4>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{check.value}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-bold', getScoreColor(check.score))}>{check.score}</span>
          <button className="flex-shrink-0 p-2 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 rounded-lg transition-colors">
            <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform', isExpanded && 'rotate-180')} />
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-current border-opacity-10">
          <div className="bg-white dark:bg-surface-800/50 rounded-lg p-4">
            <h5 className="font-semibold text-surface-900 dark:text-surface-50 text-sm mb-2">Recommandation</h5>
            <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{check.recommendation}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    critique: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    haute: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    moyenne: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    basse: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  }
  return (
    <span className={cn('px-2 py-1 text-xs font-semibold rounded-full', colors[priority as keyof typeof colors] || colors.basse)}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  )
}

export default function AuditPage() {
  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState('tous')
  const [depth, setDepth] = useState('500')
  const [mode, setMode] = useState('rapide')
  const [userAgent, setUserAgent] = useState('googlebot')
  const [result, setResult] = useState<ApiAuditData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'status' | 'score' | 'name'>('status')

  const handleAnalyze = useCallback(async () => {
    if (!url) return

    let processedUrl = url.trim()
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl
    }

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: processedUrl }),
      })

      const json: ApiAuditResponse = await response.json()

      if (!json.success || !json.data) {
        setError(json.error || 'Erreur lors de l\'analyse')
        return
      }

      setResult(json.data)
    } catch (err) {
      setError('Impossible de se connecter au serveur. Vérifiez votre connexion.')
    } finally {
      setIsAnalyzing(false)
    }
  }, [url])

  const categories: DisplayCategory[] = useMemo(() => {
    if (!result) return []
    const grouped: Record<string, ApiCheck[]> = {}
    for (const check of result.checks) {
      if (!grouped[check.category]) grouped[check.category] = []
      grouped[check.category].push(check)
    }
    return Object.entries(grouped).map(([key, checks]) => {
      const avgScore = Math.round(checks.reduce((sum, c) => sum + c.score, 0) / checks.length)
      const config = categoryConfig[key]
      return { name: config?.label || key, key, score: avgScore, checks }
    })
  }, [result])

  const allChecks = result?.checks || []

  const issueCounts = {
    tous: allChecks.length,
    critiques: allChecks.filter((c) => c.status === 'error').length,
    avertissements: allChecks.filter((c) => c.status === 'warning').length,
    reussis: allChecks.filter((c) => c.status === 'passed').length,
  }

  let filteredChecks = activeTab === 'tous' ? allChecks
    : activeTab === 'critiques' ? allChecks.filter((c) => c.status === 'error')
    : activeTab === 'avertissements' ? allChecks.filter((c) => c.status === 'warning')
    : allChecks.filter((c) => c.status === 'passed')

  if (sortBy === 'score') {
    filteredChecks = [...filteredChecks].sort((a, b) => b.score - a.score)
  } else if (sortBy === 'name') {
    filteredChecks = [...filteredChecks].sort((a, b) => a.name.localeCompare(b.name))
  }

  const grade = result ? getGrade(result.score) : ''

  const radarData = categories.map(cat => ({
    name: cat.name.substring(0, 8),
    score: cat.score,
  }))

  const distributionData = [
    { name: 'Réussis', value: issueCounts.reussis, color: '#10b981' },
    { name: 'Avertissements', value: issueCounts.avertissements, color: '#f59e0b' },
    { name: 'Critiques', value: issueCounts.critiques, color: '#ef4444' },
  ]

  const evolutionData = DEMO_PAST_AUDITS.slice().reverse()

  const issuesByCategory = categories.map(cat => ({
    name: cat.name,
    errors: cat.checks.filter(c => c.status === 'error').length,
    warnings: cat.checks.filter(c => c.status === 'warning').length,
  }))

  const previousScore = DEMO_PAST_AUDITS[0].score
  const scoreChange = result ? result.score - previousScore : 0
  const scoreChangePercent = result ? ((scoreChange / previousScore) * 100).toFixed(1) : '0'

  const exportData = {
    title: 'Audit SEO',
    description: `Rapport d'audit SEO pour ${result?.url || 'votre site'}`,
    website: result?.url || '',
    date: new Date().toLocaleDateString('fr-FR'),
    type: 'audit' as const,
    summary: result ? {
      'Score global': `${result.score}/100`,
      'Grade': grade || 'N/A',
      'Éléments réussis': result.summary.passed || 0,
      'Avertissements': result.summary.warnings || 0,
      'Erreurs critiques': result.summary.errors || 0,
      'Temps de réponse': `${result.loadTime || 0}ms`,
      'Taille HTML': `${((result.htmlSize || 0) / 1024).toFixed(1)} KB`,
    } : undefined,
    columns: [
      { key: 'name', label: 'Vérification' },
      { key: 'category', label: 'Catégorie' },
      { key: 'status', label: 'Statut' },
      { key: 'score', label: 'Score' },
      { key: 'recommendation', label: 'Recommandation' },
    ],
    rows: result?.checks || [],
    recommendations: DEMO_RECOMMENDATIONS.map(r => r.title),
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header with Export */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">Audit SEO</h1>
          </div>
          {result && (
            <p className="text-surface-600 dark:text-surface-400">
              {result.url}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {result && (
            <ExportMenu
              data={exportData}
              label="Exporter"
              variant="compact"
            />
          )}
          <button className="px-4 py-2.5 rounded-lg bg-surface-200 dark:bg-surface-800 text-surface-900 dark:text-surface-50 hover:bg-surface-300 dark:hover:bg-surface-700 font-medium transition-colors inline-flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Historique
          </button>
        </div>
      </div>

      {/* URL Input */}
      <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-surface-900 dark:text-surface-100 mb-3">
            Entrez l&apos;URL de votre site
          </label>
          <div className="flex gap-3 flex-col lg:flex-row">
            <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
              <Globe className="h-5 w-5 text-surface-400" />
              <input
                type="url"
                placeholder="https://exemple.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                className="flex-1 bg-transparent text-surface-900 dark:text-surface-50 outline-none placeholder-surface-400"
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all whitespace-nowrap inline-flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Audit en cours...</>
              ) : (
                'Lancer un audit'
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2">Profondeur d&apos;audit</label>
            <select value={depth} onChange={(e) => setDepth(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm outline-none">
              <option value="100">100 pages</option>
              <option value="500">500 pages</option>
              <option value="1000">1000 pages</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2">Mode de crawl</label>
            <div className="flex gap-2">
              {['rapide', 'complet'].map((m) => (
                <button key={m} onClick={() => setMode(m)} className={cn('flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors', mode === m ? 'bg-brand-500 text-white' : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300')}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2">User-Agent</label>
            <select value={userAgent} onChange={(e) => setUserAgent(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm outline-none">
              <option value="googlebot">Googlebot (Desktop)</option>
              <option value="mobile">Googlebot (Mobile)</option>
              <option value="firefox">Firefox (Desktop)</option>
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Erreur d&apos;analyse</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
              <button onClick={handleAnalyze} className="mt-3 px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {isAnalyzing && (
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-surface-200 dark:border-surface-700" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-surface-900 dark:text-surface-50">Analyse en cours...</p>
              <p className="text-sm text-surface-500 mt-1">Nous analysons {url} en profondeur</p>
            </div>
          </div>
        </div>
      )}

      {result && !isAnalyzing && (
        <>
          {/* Last Audit Summary with Score Gauge */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-200 dark:text-surface-700" />
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${(result.score / 100) * 565} 565`} strokeLinecap="round"
                      className={cn('transition-all duration-1000', result.score >= 80 && 'text-green-500', result.score >= 60 && result.score < 80 && 'text-amber-500', result.score < 60 && 'text-red-500')} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className={cn('text-4xl font-bold', getScoreColor(result.score))}>{result.score}</p>
                      <p className="text-sm text-surface-500 mt-1">/100</p>
                      <p className="text-xs font-semibold mt-2 px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400">
                        Grade {grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Résumé du dernier audit</h2>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-lg bg-white dark:bg-surface-800 p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">{result.summary.passed}</p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Réussis</p>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-surface-800 p-4 text-center">
                      <p className="text-2xl font-bold text-amber-600">{result.summary.warnings}</p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Avertissements</p>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-surface-800 p-4 text-center">
                      <p className="text-2xl font-bold text-red-600">{result.summary.errors}</p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">Critiques</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-4">Comparaison avec l&apos;audit précédent</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold text-surface-900 dark:text-surface-50">Changement de score</span>
                        {scoreChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : scoreChange < 0 ? (
                          <TrendingDown className="h-4 w-4 text-red-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-surface-500" />
                        )}
                      </div>
                      <p className={cn('text-2xl font-bold', scoreChange > 0 ? 'text-green-600' : scoreChange < 0 ? 'text-red-600' : 'text-surface-600')}>
                        {scoreChange > 0 ? '+' : ''}{scoreChange} points ({scoreChangePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Scores Radar */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6">Scores par catégorie</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#666' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3">
                {categories.map((cat) => {
                  const config = categoryConfig[cat.key] || { label: cat.name, icon: Settings, color: 'text-surface-500', bgColor: 'bg-surface-500/10' }
                  const CatIcon = config.icon
                  const issueCount = cat.checks.filter(c => c.status === 'error' || c.status === 'warning').length
                  return (
                    <div key={cat.key} className="rounded-lg bg-white dark:bg-surface-800 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn('p-2 rounded-lg', config.bgColor)}>
                            <CatIcon className={cn('h-4 w-4', config.color)} />
                          </div>
                          <div>
                            <p className="font-semibold text-surface-900 dark:text-surface-50 text-sm">{config.label}</p>
                            <p className="text-xs text-surface-500">{issueCount} problème{issueCount !== 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <p className={cn('text-lg font-bold', getScoreColor(cat.score))}>{cat.score}</p>
                      </div>
                      <div className="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                        <div className={cn('h-full rounded-full transition-all', cat.score >= 80 && 'bg-green-500', cat.score >= 60 && cat.score < 80 && 'bg-amber-500', cat.score < 60 && 'bg-red-500')} style={{ width: `${cat.score}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Issues Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-sm text-surface-600 dark:text-surface-400">Réussis</p>
              </div>
              <p className="text-2xl font-bold text-green-600">{issueCounts.reussis}</p>
            </div>
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-surface-600 dark:text-surface-400">Avertissements</p>
              </div>
              <p className="text-2xl font-bold text-amber-600">{issueCounts.avertissements}</p>
            </div>
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-sm text-surface-600 dark:text-surface-400">Critiques</p>
              </div>
              <p className="text-2xl font-bold text-red-600">{issueCounts.critiques}</p>
            </div>
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 p-4">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <p className="text-sm text-surface-600 dark:text-surface-400">Total</p>
              </div>
              <p className="text-2xl font-bold text-blue-600">{issueCounts.tous}</p>
            </div>
          </div>

          {/* Detailed Checks Table */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">Vérifications détaillées</h2>
              <div className="flex gap-2">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50 text-sm outline-none">
                  <option value="status">Trier par statut</option>
                  <option value="score">Trier par score</option>
                  <option value="name">Trier par nom</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-surface-200 dark:border-surface-800 mb-6">
              {[
                { key: 'tous', label: 'Tous', count: issueCounts.tous },
                { key: 'critiques', label: 'Critiques', count: issueCounts.critiques },
                { key: 'avertissements', label: 'Avertissements', count: issueCounts.avertissements },
                { key: 'reussis', label: 'Réussis', count: issueCounts.reussis },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'px-4 py-3 font-medium text-sm border-b-2 transition-colors',
                    activeTab === tab.key
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                      : 'border-transparent text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-200'
                  )}
                >
                  {tab.label}
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 font-semibold">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filteredChecks.length > 0 ? (
                filteredChecks.map((check, idx) => <ExpandableCheck key={idx} check={check} />)
              ) : (
                <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-surface-900 dark:text-surface-50">Aucun problème détecté</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400 mt-2">Votre site respecte toutes les bonnes pratiques pour cette catégorie.</p>
                </div>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribution Pie Chart */}
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">Distribution des résultats</h3>
              <div className="h-80 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={distributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {distributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Evolution Line Chart */}
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">Évolution des scores (10 derniers audits)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" dot={{ fill: '#3b82f6' }} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Issues by Category Bar Chart */}
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 lg:col-span-2">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">Problèmes par catégorie</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={issuesByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="errors" fill="#ef4444" name="Erreurs" />
                    <Bar dataKey="warnings" fill="#f59e0b" name="Avertissements" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* AI Recommendations Panel */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">Recommandations prioritaires (IA)</h2>
            </div>
            <div className="space-y-3">
              {DEMO_RECOMMENDATIONS.slice(0, 5).map((rec) => (
                <div key={rec.id} className="rounded-lg bg-white dark:bg-surface-800 p-4 border border-surface-200 dark:border-surface-700">
                  <div className="flex items-start gap-4">
                    <PriorityBadge priority={rec.priority} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-surface-900 dark:text-surface-50 mb-1">{rec.title}</h4>
                      <div className="flex gap-4 text-sm text-surface-600 dark:text-surface-400">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" /> {rec.impact}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {rec.effort}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-surface-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Meta & Content Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">Balises Meta</h3>
              <div className="space-y-3">
                {[
                  { label: 'Title', value: result.meta.title, warn: 'Manquant' },
                  { label: 'Description', value: result.meta.description, warn: 'Manquante' },
                  { label: 'Canonical', value: result.meta.canonical, warn: 'Non défini' },
                ].map(({ label, value, warn }) => (
                  <div key={label} className="rounded-lg bg-white dark:bg-surface-800 p-3">
                    <p className="text-xs font-semibold text-surface-500 mb-1">{label}</p>
                    <p className="text-sm text-surface-900 dark:text-surface-50 break-all">
                      {value || <span className="text-red-500 italic">{warn}</span>}
                    </p>
                    {value && <p className="text-xs text-surface-400 mt-1">{value.length} caractères</p>}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
              <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">Analyse du contenu</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Mots', value: formatNumber(result.content.wordCount) },
                  { label: 'H1', value: result.content.h1Count, color: result.content.h1Count === 1 ? 'text-green-600' : 'text-amber-500' },
                  { label: 'H2', value: result.content.h2Count },
                  { label: 'H3', value: result.content.h3Count },
                  { label: 'Images', value: result.content.imageCount, sub: result.content.imageCount - result.content.imagesWithAlt > 0 ? `${result.content.imageCount - result.content.imagesWithAlt} sans alt` : undefined },
                  { label: 'Liens', value: result.content.internalLinks + result.content.externalLinks, sub: `${result.content.internalLinks} int. / ${result.content.externalLinks} ext.` },
                ].map(({ label, value, color, sub }) => (
                  <div key={label} className="rounded-lg bg-white dark:bg-surface-800 p-3">
                    <p className="text-xs font-semibold text-surface-500 mb-1">{label}</p>
                    <p className={cn('text-2xl font-bold', color || 'text-surface-900 dark:text-surface-50')}>{value}</p>
                    {sub && <p className="text-xs text-surface-400 mt-1">{sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit History */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6">Historique des audits</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-surface-200 dark:border-surface-800">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Réussis</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Avertissements</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Erreurs</th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_PAST_AUDITS.map((audit, idx) => (
                    <tr key={idx} className="border-b border-surface-200 dark:border-surface-800 hover:bg-white dark:hover:bg-surface-800/50 transition-colors">
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-400">{audit.date}</td>
                      <td className="py-3 px-4">
                        <span className={cn('font-bold', getScoreColor(audit.score))}>{audit.score}</span>
                      </td>
                      <td className="py-3 px-4 text-green-600">{audit.passed}</td>
                      <td className="py-3 px-4 text-amber-600">{audit.warnings}</td>
                      <td className="py-3 px-4 text-red-600">{audit.errors}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button className="text-brand-600 dark:text-brand-400 hover:underline text-xs font-medium flex items-center gap-1">
                            <Eye className="h-3 w-3" /> Voir
                          </button>
                          <button className="text-surface-600 dark:text-surface-400 hover:underline text-xs font-medium">
                            Comparer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Technical Summary */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-6">Résumé technique</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg bg-white dark:bg-surface-800 p-4">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">HTTPS</p>
                <p className={cn('text-2xl font-bold', result.url.startsWith('https') ? 'text-green-600' : 'text-red-500')}>
                  {result.url.startsWith('https') ? 'Actif' : 'Inactif'}
                </p>
              </div>
              <div className="rounded-lg bg-white dark:bg-surface-800 p-4">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Temps de réponse</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{result.loadTime}ms</p>
              </div>
              <div className="rounded-lg bg-white dark:bg-surface-800 p-4">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Taille HTML</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{(result.htmlSize / 1024).toFixed(1)} KB</p>
              </div>
              <div className="rounded-lg bg-white dark:bg-surface-800 p-4">
                <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">Vérifications</p>
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">
                  {result.summary.totalChecks}
                  <span className="text-sm font-normal text-surface-500 ml-1">
                    ({result.summary.passed} OK)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!result && !isAnalyzing && !error && (
        <div className="rounded-lg border border-dashed border-surface-300 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/50 p-16">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-brand-50 dark:bg-brand-950/30 mb-4">
              <Search className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-2">Lancez votre premier audit</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md">
              Entrez l&apos;URL de votre site ci-dessus pour obtenir une analyse SEO complète avec des recommandations personnalisées basées sur l&apos;IA.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
