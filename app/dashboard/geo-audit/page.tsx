'use client'

import { useState, useEffect } from 'react'
import { cn, getScoreColor } from '@/lib/utils'
import {
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  Database,
  Users,
  Quote,
  ShieldCheck,
  Bot,
  Globe,
} from 'lucide-react'
import { useWebsite } from '@/contexts/WebsiteContext'
import { UrlInput } from '@/components/shared/UrlInput'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GeoCheck {
  name: string
  status: 'passed' | 'warning' | 'error'
  value: string
  recommendation: string
}

interface GeoCategory {
  score: number
  checks: GeoCheck[]
}

interface GeoResult {
  success: boolean
  url: string
  overallScore: number
  grade: string
  categories: {
    structuredData: GeoCategory
    entityClarity: GeoCategory
    citationReadiness: GeoCategory
    eeat: GeoCategory
    technicalAI: GeoCategory
  }
  recommendations: string[]
}

/* ------------------------------------------------------------------ */
/*  Category config                                                    */
/* ------------------------------------------------------------------ */

type CategoryKey = keyof GeoResult['categories']

const categoryConfig: Record<CategoryKey, { label: string; icon: any; color: string; bgColor: string }> = {
  structuredData:   { label: 'Donnees structurees',    icon: Database,    color: 'text-blue-500',   bgColor: 'bg-blue-500/10' },
  entityClarity:    { label: 'Clarte des entites',     icon: Users,       color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  citationReadiness:{ label: 'Pret pour la citation',  icon: Quote,       color: 'text-amber-500',  bgColor: 'bg-amber-500/10' },
  eeat:             { label: 'E-E-A-T',                icon: ShieldCheck, color: 'text-green-500',  bgColor: 'bg-green-500/10' },
  technicalAI:      { label: 'Technique IA',           icon: Bot,         color: 'text-cyan-500',   bgColor: 'bg-cyan-500/10' },
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getGradeColor(grade: string) {
  switch (grade) {
    case 'A': return { text: 'text-emerald-500', bg: 'bg-emerald-500/10 border-emerald-500/30' }
    case 'B': return { text: 'text-blue-500',    bg: 'bg-blue-500/10 border-blue-500/30' }
    case 'C': return { text: 'text-amber-500',   bg: 'bg-amber-500/10 border-amber-500/30' }
    case 'D': return { text: 'text-orange-500',  bg: 'bg-orange-500/10 border-orange-500/30' }
    default:  return { text: 'text-red-500',     bg: 'bg-red-500/10 border-red-500/30' }
  }
}

function getStatusConfig(status: string) {
  switch (status) {
    case 'passed':  return { label: 'Reussi',         icon: CheckCircle,  color: 'text-green-500',  border: 'border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900',   badge: 'bg-green-200/50' }
    case 'warning': return { label: 'Avertissement',  icon: AlertTriangle,color: 'text-orange-500', border: 'border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900', badge: 'bg-orange-200/50' }
    case 'error':   return { label: 'Critique',       icon: AlertCircle,  color: 'text-red-500',    border: 'border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900',           badge: 'bg-red-200/50' }
    default:        return { label: 'Info',            icon: CheckCircle,  color: 'text-blue-500',   border: 'border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900',       badge: 'bg-blue-200/50' }
  }
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function ExpandableCheck({ check }: { check: GeoCheck }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cfg = getStatusConfig(check.status)
  const Icon = cfg.icon

  return (
    <div className={cn('rounded-lg border p-4 transition-all', cfg.border)}>
      <div
        className="flex items-start gap-3 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={cn('flex-shrink-0 mt-1 p-1.5 rounded-lg', cfg.badge)}>
          <Icon className={cn('h-5 w-5', cfg.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-surface-900 dark:text-surface-50 group-hover:underline">
            {check.name}
          </h4>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{check.value}</p>
        </div>
        <button className="flex-shrink-0 p-2 hover:bg-surface-200/50 dark:hover:bg-surface-700/50 rounded-lg transition-colors">
          <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform', isExpanded && 'rotate-180')} />
        </button>
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

function CategoryCard({
  categoryKey,
  category,
}: {
  categoryKey: CategoryKey
  category: GeoCategory
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const cfg = categoryConfig[categoryKey]
  const Icon = cfg.icon
  const passed = category.checks.filter(c => c.status === 'passed').length
  const warnings = category.checks.filter(c => c.status === 'warning').length
  const errors = category.checks.filter(c => c.status === 'error').length

  return (
    <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 overflow-hidden">
      {/* Header */}
      <div
        className="p-5 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={cn('p-2 rounded-lg', cfg.bgColor)}>
            <Icon className={cn('h-5 w-5', cfg.color)} />
          </div>
          <h3 className="font-semibold text-surface-900 dark:text-surface-50 group-hover:underline">
            {cfg.label}
          </h3>
          <div className="ml-auto flex items-center gap-2">
            <span className={cn('text-lg font-bold', getScoreColor(category.score))}>{category.score}</span>
            <ChevronDown className={cn('h-4 w-4 text-surface-400 transition-transform', isExpanded && 'rotate-180')} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700',
              category.score >= 80 ? 'bg-emerald-500' :
              category.score >= 60 ? 'bg-amber-500' :
              category.score >= 40 ? 'bg-orange-500' : 'bg-red-500'
            )}
            style={{ width: `${category.score}%` }}
          />
        </div>

        {/* Mini summary */}
        <div className="flex gap-4 mt-3 text-xs">
          <span className="text-green-600 dark:text-green-400">{passed} reussi{passed > 1 ? 's' : ''}</span>
          <span className="text-orange-600 dark:text-orange-400">{warnings} avert.</span>
          <span className="text-red-600 dark:text-red-400">{errors} critique{errors > 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Expanded checks */}
      {isExpanded && (
        <div className="px-5 pb-5 space-y-3 border-t border-surface-200 dark:border-surface-800 pt-4">
          {category.checks.map((check, idx) => (
            <ExpandableCheck key={idx} check={check} />
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function GeoAuditPage() {
  const { selectedWebsite } = useWebsite()
  const { checkAccess, getRequiredPlan } = usePlan()

  const [url, setUrl] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<GeoResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Pre-fill URL from selected website
  useEffect(() => {
    if (selectedWebsite?.domain && !url) {
      setUrl(`https://${selectedWebsite.domain}`)
    }
  }, [selectedWebsite])

  // Plan gating
  const hasAccess = checkAccess('geoReports')

  if (!hasAccess) {
    const required = getRequiredPlan('geoReports')
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50">
            Audit GEO
          </h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Analysez votre site pour la Generative Engine Optimization
          </p>
        </div>
        <UpgradePrompt feature="geoReports" requiredPlan={required as any} />
      </div>
    )
  }

  async function handleAnalyze() {
    if (!url.trim() || isAnalyzing) return

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/geo-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'analyse')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Une erreur inattendue est survenue')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const gradeColor = result ? getGradeColor(result.grade) : null

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-surface-50">
          Audit GEO
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mt-1">
          Evaluez la compatibilite de votre site avec les moteurs de recherche generatifs (SGE, Perplexity, ChatGPT Search)
        </p>
      </div>

      {/* URL input form */}
      <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
        <UrlInput
          value={url}
          onChange={setUrl}
          onSubmit={handleAnalyze}
          loading={isAnalyzing}
          submitLabel="Analyser GEO"
        />
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading state */}
      {isAnalyzing && (
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-12">
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-surface-200 dark:border-surface-700" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-surface-900 dark:text-surface-50">Analyse GEO en cours...</p>
              <p className="text-sm text-surface-500 mt-1">Nous evaluons {url} pour les moteurs generatifs</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !isAnalyzing && !error && (
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-12">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center">
              <Globe className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <p className="text-lg font-semibold text-surface-900 dark:text-surface-50">Pret pour l&apos;analyse GEO</p>
              <p className="text-sm text-surface-500 mt-1 max-w-md">
                Entrez l&apos;URL de votre site pour evaluer sa compatibilite avec les moteurs de recherche generatifs et obtenir des recommandations personnalisees.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <>
          {/* Score + Grade header */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Circular gauge */}
              <div className="flex justify-center">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    <circle
                      cx="100" cy="100" r="90"
                      fill="none" stroke="currentColor" strokeWidth="8"
                      className="text-surface-200 dark:text-surface-700"
                    />
                    <circle
                      cx="100" cy="100" r="90"
                      fill="none" stroke="currentColor" strokeWidth="8"
                      strokeDasharray={`${(result.overallScore / 100) * 565} 565`}
                      strokeLinecap="round"
                      className={cn(
                        'transition-all duration-1000',
                        result.overallScore >= 80 && 'text-green-500',
                        result.overallScore >= 60 && result.overallScore < 80 && 'text-amber-500',
                        result.overallScore < 60 && 'text-red-500',
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className={cn('text-4xl font-bold', getScoreColor(result.overallScore))}>
                        {result.overallScore}
                      </p>
                      <p className="text-sm text-surface-500 mt-1">/100</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grade badge + info */}
              <div className="col-span-2 space-y-4">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
                    Score GEO Global
                  </h2>
                  {gradeColor && (
                    <span className={cn('px-4 py-1.5 rounded-full border text-lg font-bold', gradeColor.bg, gradeColor.text)}>
                      {result.grade}
                    </span>
                  )}
                </div>
                <p className="text-surface-600 dark:text-surface-400 text-sm">
                  Analyse de <span className="font-medium text-surface-900 dark:text-surface-50">{result.url}</span>
                </p>

                {/* Quick stats grid */}
                <div className="grid grid-cols-5 gap-3">
                  {(Object.keys(result.categories) as CategoryKey[]).map((key) => {
                    const cfg = categoryConfig[key]
                    const cat = result.categories[key]
                    return (
                      <div key={key} className="rounded-lg bg-white dark:bg-surface-800 p-3 text-center">
                        <p className={cn('text-xl font-bold', getScoreColor(cat.score))}>{cat.score}</p>
                        <p className="text-xs text-surface-600 dark:text-surface-400 mt-1 truncate">{cfg.label}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Category cards grid */}
          <div>
            <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">
              Analyse par categorie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {(Object.keys(result.categories) as CategoryKey[]).map((key) => (
                <CategoryCard key={key} categoryKey={key} category={result.categories[key]} />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-brand-500/10">
                  <Lightbulb className="h-5 w-5 text-brand-500" />
                </div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
                  Recommandations prioritaires
                </h2>
              </div>
              <div className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-lg bg-white dark:bg-surface-800 p-4"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
