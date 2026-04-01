'use client'

import { useState } from 'react'
import {
  Zap, AlertCircle, TrendingUp, Download, Share2, Loader2, Globe, BarChart3,
  ArrowUpRight, ArrowDownRight, Gauge, Activity, Smartphone, Monitor, TrendingDown, CheckCircle
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'

// Types
interface CoreWebVital {
  value: number
  unit: string
  rating: 'good' | 'needs-improvement' | 'poor'
  threshold: { good: number; needsImprovement: number }
  trend: number
}

interface PerformanceData {
  url: string
  score: number
  grade: string
  device: 'mobile' | 'desktop'
  timestamp: string
  coreWebVitals: {
    lcp: CoreWebVital
    inp: CoreWebVital
    cls: CoreWebVital
    fcp: CoreWebVital
    ttfb: CoreWebVital
    tbt: CoreWebVital
  }
  resources: {
    scripts: { size: number; loadTime: number; blocking: boolean }[]
    stylesheets: { size: number; loadTime: number; blocking: boolean }[]
    images: { size: number; loadTime: number; blocking: boolean }[]
    fonts: { size: number; loadTime: number; blocking: boolean }[]
    other: { size: number; loadTime: number; blocking: boolean }[]
    totalSize: number
  }
  opportunities: Array<{
    title: string
    description: string
    savings: { value: number; unit: string }
    severity: 'high' | 'medium' | 'low'
  }>
  diagnostics: Array<{
    title: string
    description: string
    severity: 'high' | 'medium' | 'low'
  }>
  competitors: Array<{
    name: string
    score: number
    lcp: number
    inp: number
    cls: number
  }>
}

interface HistoryPoint {
  date: string
  lcp: number
  inp: number
  cls: number
  fcp: number
  ttfb: number
  tbt: number
}

// Utility functions
function getRatingInfo(rating: string) {
  if (rating === 'good') return { label: 'Bon', color: 'text-green-500', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/20' }
  if (rating === 'needs-improvement') return { label: 'À améliorer', color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' }
  return { label: 'Faible', color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' }
}

function getScoreInfo(score: number) {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-500', bgColor: 'bg-green-500' }
  if (score >= 70) return { label: 'Bon', color: 'text-emerald-500', bgColor: 'bg-emerald-500' }
  if (score >= 50) return { label: 'À améliorer', color: 'text-amber-500', bgColor: 'bg-amber-500' }
  return { label: 'Faible', color: 'text-red-500', bgColor: 'bg-red-500' }
}

function getSeverityColor(severity: string) {
  if (severity === 'high') return { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  if (severity === 'medium') return { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' }
  return { color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
}

// Overall Performance Gauge Component
function PerformanceGauge({ score, grade }: { score: number; grade: string }) {
  const circumference = 2 * Math.PI * 60
  const offset = circumference - (score / 100) * circumference
  const info = getScoreInfo(score)

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-56 h-56">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="33%" stopColor="#f59e0b" />
              <stop offset="66%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="10" className="text-surface-200 dark:text-surface-700" />
          <circle
            cx="70"
            cy="70"
            r="60"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-surface-900 dark:text-surface-50">{score}</div>
          <div className="text-sm text-surface-600 dark:text-surface-400 mt-2">Grade {grade}</div>
        </div>
      </div>
      <div className={cn('text-lg font-semibold px-4 py-2 rounded-full', info.color)}>{info.label}</div>
    </div>
  )
}

// Core Web Vital Card Component
function VitalCard({
  label,
  value,
  unit,
  status,
  threshold,
  trend,
}: {
  label: string
  value: number
  unit: string
  status: 'good' | 'needs-improvement' | 'poor'
  threshold: { good: number; needsImprovement: number }
  trend: number
}) {
  const ratingInfo = getRatingInfo(status)
  const displayValue = value < 10 ? value.toFixed(2) : Math.round(value)
  const trendIsPositive = trend < 0

  return (
    <div className={cn('rounded-lg p-6 border transition-all', ratingInfo.bgColor, ratingInfo.borderColor)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-surface-600 dark:text-surface-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-50 mt-2">
            {displayValue}
            <span className="text-lg font-normal text-surface-500 ml-1">{unit}</span>
          </p>
        </div>
        <div className={cn('px-3 py-1.5 rounded-full text-xs font-semibold', ratingInfo.color, ratingInfo.bgColor)}>
          {ratingInfo.label}
        </div>
      </div>

      <div className="space-y-2 text-xs text-surface-600 dark:text-surface-400 mb-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div className="flex justify-between">
          <span>Bon: &lt; {threshold.good}{unit}</span>
          <span>À améliorer: &lt; {threshold.needsImprovement}{unit}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs font-medium">
        {trendIsPositive ? (
          <ArrowDownRight className="w-4 h-4 text-green-500" />
        ) : (
          <ArrowUpRight className="w-4 h-4 text-red-500" />
        )}
        <span className={trendIsPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
          {Math.abs(trend)}% {trendIsPositive ? 'amélioration' : 'dégradation'}
        </span>
      </div>
    </div>
  )
}

// Resource Table Component
function ResourceTable({ resources }: { resources: PerformanceData['resources'] }) {
  const allResources = [
    ...resources.scripts.map(r => ({ ...r, type: 'JS', typeLabel: 'JavaScript' })),
    ...resources.stylesheets.map(r => ({ ...r, type: 'CSS', typeLabel: 'Feuille de style' })),
    ...resources.images.map(r => ({ ...r, type: 'Image', typeLabel: 'Image' })),
    ...resources.fonts.map(r => ({ ...r, type: 'Font', typeLabel: 'Police' })),
    ...resources.other.map(r => ({ ...r, type: 'Autre', typeLabel: 'Autre' })),
  ].sort((a, b) => b.size - a.size).slice(0, 10)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700">
            <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Type</th>
            <th className="text-right py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Taille</th>
            <th className="text-right py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Temps chargement</th>
            <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">Bloquant</th>
          </tr>
        </thead>
        <tbody>
          {allResources.map((resource, idx) => (
            <tr key={idx} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
              <td className="py-3 px-4 font-medium text-surface-900 dark:text-surface-50">{resource.typeLabel}</td>
              <td className="text-right py-3 px-4 text-surface-600 dark:text-surface-400">{(resource.size / 1024).toFixed(1)} KB</td>
              <td className="text-right py-3 px-4 text-surface-600 dark:text-surface-400">{Math.round(resource.loadTime)}ms</td>
              <td className="text-center py-3 px-4">
                {resource.blocking ? (
                  <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                    <AlertCircle className="w-4 h-4" /> Oui
                  </span>
                ) : (
                  <span className="text-green-600 dark:text-green-400">Non</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Competitors Comparison Component
function CompetitorComparison({ competitors }: { competitors: PerformanceData['competitors'] }) {
  return (
    <div className="space-y-4">
      {competitors.map((competitor, idx) => (
        <div key={idx} className="p-4 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-surface-900 dark:text-surface-50">{competitor.name}</h4>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{competitor.score}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-xs">LCP</p>
              <p className="font-semibold text-surface-900 dark:text-surface-50">{competitor.lcp.toFixed(2)}s</p>
            </div>
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-xs">INP</p>
              <p className="font-semibold text-surface-900 dark:text-surface-50">{Math.round(competitor.inp)}ms</p>
            </div>
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-xs">CLS</p>
              <p className="font-semibold text-surface-900 dark:text-surface-50">{competitor.cls.toFixed(3)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Demo data generator
function generateDemoData(device: 'mobile' | 'desktop'): PerformanceData {
  const isMobile = device === 'mobile'

  return {
    url: 'https://luxe-vino.fr',
    score: isMobile ? 78 : 88,
    grade: isMobile ? 'B' : 'A',
    device,
    timestamp: new Date().toISOString(),
    coreWebVitals: {
      lcp: {
        value: isMobile ? 2.8 : 1.9,
        unit: 's',
        rating: isMobile ? 'needs-improvement' : 'good',
        threshold: { good: 2.5, needsImprovement: 4 },
        trend: -12,
      },
      inp: {
        value: isMobile ? 185 : 92,
        unit: 'ms',
        rating: isMobile ? 'needs-improvement' : 'good',
        threshold: { good: 200, needsImprovement: 500 },
        trend: -8,
      },
      cls: {
        value: 0.08,
        unit: '',
        rating: 'good',
        threshold: { good: 0.1, needsImprovement: 0.25 },
        trend: 0,
      },
      fcp: {
        value: isMobile ? 1.6 : 0.9,
        unit: 's',
        rating: isMobile ? 'needs-improvement' : 'good',
        threshold: { good: 1.8, needsImprovement: 3 },
        trend: -5,
      },
      ttfb: {
        value: isMobile ? 650 : 380,
        unit: 'ms',
        rating: isMobile ? 'needs-improvement' : 'good',
        threshold: { good: 600, needsImprovement: 1800 },
        trend: -15,
      },
      tbt: {
        value: isMobile ? 245 : 82,
        unit: 'ms',
        rating: isMobile ? 'poor' : 'good',
        threshold: { good: 200, needsImprovement: 600 },
        trend: 22,
      },
    },
    resources: {
      scripts: Array(4).fill(0).map(() => ({ size: 85000 + Math.random() * 50000, loadTime: 120 + Math.random() * 100, blocking: Math.random() > 0.6 })),
      stylesheets: Array(3).fill(0).map(() => ({ size: 45000 + Math.random() * 30000, loadTime: 80 + Math.random() * 60, blocking: true })),
      images: Array(15).fill(0).map(() => ({ size: 200000 + Math.random() * 400000, loadTime: 200 + Math.random() * 300, blocking: false })),
      fonts: Array(2).fill(0).map(() => ({ size: 80000 + Math.random() * 40000, loadTime: 150 + Math.random() * 80, blocking: false })),
      other: Array(2).fill(0).map(() => ({ size: 50000 + Math.random() * 100000, loadTime: 100 + Math.random() * 150, blocking: false })),
      totalSize: isMobile ? 3200000 : 2800000,
    },
    opportunities: [
      {
        title: 'Différer le JavaScript inutilisé',
        description: 'Réduire le JavaScript non critique pour accélérer le chargement initial de la page.',
        savings: { value: 850, unit: 'ms' },
        severity: 'high',
      },
      {
        title: 'Optimiser les images',
        description: 'Convertir les images PNG en WebP et ajouter la compression intelligente.',
        savings: { value: 450, unit: 'ms' },
        severity: 'high',
      },
      {
        title: 'Implémenter le cache HTTPS/2',
        description: 'Activer la mise en cache du serveur et HTTP/2 push pour les ressources critiques.',
        savings: { value: 280, unit: 'ms' },
        severity: 'medium',
      },
      {
        title: 'Minifier le CSS et le JavaScript',
        description: 'Réduire la taille des ressources CSS et JS de 25-30%.',
        savings: { value: 165, unit: 'ms' },
        severity: 'medium',
      },
    ],
    diagnostics: [
      {
        title: 'Animation JS bloquant le thread principal',
        description: 'Les animations de défilement parallaxe utilisent trop de JavaScript, bloquant l\'interaction utilisateur.',
        severity: 'high',
      },
      {
        title: 'Polices web personnalisées non optimisées',
        description: 'Les polices sont chargées de manière synchrone, bloquant le rendu du texte.',
        severity: 'medium',
      },
      {
        title: 'Images non redimensionnées',
        description: 'Plusieurs images sont plus grandes que leur conteneur d\'affichage.',
        severity: 'medium',
      },
      {
        title: 'Requêtes DOM excessives',
        description: 'Le script de panier réinterroge le DOM 45 fois par chargement.',
        severity: 'low',
      },
    ],
    competitors: [
      {
        name: 'Château Margaux',
        score: 82,
        lcp: 2.1,
        inp: 145,
        cls: 0.06,
      },
      {
        name: 'Domaine de la Romanée',
        score: 75,
        lcp: 3.2,
        inp: 210,
        cls: 0.12,
      },
      {
        name: 'Bordeaux Premium',
        score: 68,
        lcp: 4.1,
        inp: 320,
        cls: 0.18,
      },
    ],
  }
}

function generateHistory(): HistoryPoint[] {
  const data: HistoryPoint[] = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      lcp: 1.8 + Math.random() * 1.2,
      inp: 85 + Math.random() * 150,
      cls: 0.05 + Math.random() * 0.1,
      fcp: 0.9 + Math.random() * 0.8,
      ttfb: 350 + Math.random() * 300,
      tbt: 75 + Math.random() * 200,
    })
  }
  return data
}

// Main Component
export default function PerformancePage() {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop')
  const [urlInput, setUrlInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<PerformanceData | null>(null)
  const [historyData, setHistoryData] = useState<HistoryPoint[]>([])
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!urlInput.trim()) {
      setError('Veuillez entrer une URL')
      return
    }

    setLoading(true)
    setError('')

    // Simulate API call
    setTimeout(() => {
      setData(generateDemoData(device))
      setHistoryData(generateHistory())
      setLoading(false)
    }, 2000)
  }

  const handleExport = () => {
    if (!data) return
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `performance-${data.url}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-50">Performance & Core Web Vitals</h1>
                {data && <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{data.url}</p>}
              </div>
            </div>
            {data && (
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  className="px-4 py-2.5 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Analyser de nouveau
                </button>
                <button
                  onClick={handleExport}
                  className="px-4 py-2.5 rounded-lg border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 font-medium hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors inline-flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Exporter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* URL Input */}
        {!data && (
          <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-8">
            <label className="block text-sm font-medium text-surface-900 dark:text-surface-50 mb-4">URL à analyser</label>
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                <Globe className="h-5 w-5 text-surface-400 flex-shrink-0" />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="https://exemple.fr"
                  className="flex-1 bg-transparent text-surface-900 dark:text-surface-50 outline-none placeholder-surface-400"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="px-8 py-3 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center gap-2"
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyse...</> : <><Zap className="w-4 h-4" /> Analyser</>}
              </button>
            </div>
            {error && (
              <div className="text-red-500 text-sm mt-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-16 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-brand-500 mx-auto mb-4" />
            <p className="text-xl font-semibold text-surface-700 dark:text-surface-300">Analyse en cours...</p>
            <p className="text-sm text-surface-500 mt-2">Chargement et analyse de la page</p>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          <>
            {/* Device Toggle */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setDevice('desktop')
                  setData(generateDemoData('desktop'))
                }}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors',
                  device === 'desktop'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
                )}
              >
                <Monitor className="w-4 h-4" /> Desktop
              </button>
              <button
                onClick={() => {
                  setDevice('mobile')
                  setData(generateDemoData('mobile'))
                }}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2 transition-colors',
                  device === 'mobile'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-600'
                )}
              >
                <Smartphone className="w-4 h-4" /> Mobile
              </button>
            </div>

            {/* Overall Score + Core Web Vitals */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1 bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-8 flex items-center justify-center">
                <PerformanceGauge score={data.score} grade={data.grade} />
              </div>
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <VitalCard
                  label="LCP"
                  value={data.coreWebVitals.lcp.value}
                  unit={data.coreWebVitals.lcp.unit}
                  status={data.coreWebVitals.lcp.rating}
                  threshold={data.coreWebVitals.lcp.threshold}
                  trend={data.coreWebVitals.lcp.trend}
                />
                <VitalCard
                  label="INP"
                  value={data.coreWebVitals.inp.value}
                  unit={data.coreWebVitals.inp.unit}
                  status={data.coreWebVitals.inp.rating}
                  threshold={data.coreWebVitals.inp.threshold}
                  trend={data.coreWebVitals.inp.trend}
                />
                <VitalCard
                  label="CLS"
                  value={data.coreWebVitals.cls.value}
                  unit={data.coreWebVitals.cls.unit}
                  status={data.coreWebVitals.cls.rating}
                  threshold={data.coreWebVitals.cls.threshold}
                  trend={data.coreWebVitals.cls.trend}
                />
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: 'FCP', value: data.coreWebVitals.fcp.value, unit: 's' },
                { label: 'TTFB', value: data.coreWebVitals.ttfb.value, unit: 'ms' },
                { label: 'TBT', value: data.coreWebVitals.tbt.value, unit: 'ms' },
              ].map(metric => (
                <div key={metric.label} className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-4">
                  <p className="text-xs font-medium text-surface-600 dark:text-surface-400 uppercase">{metric.label}</p>
                  <p className="text-2xl font-bold text-surface-900 dark:text-surface-50 mt-2">
                    {metric.value < 10 ? metric.value.toFixed(2) : Math.round(metric.value)}
                  </p>
                  <p className="text-xs text-surface-500 mt-1">{metric.unit}</p>
                </div>
              ))}
            </div>

            {/* Performance Evolution Chart */}
            <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6">Évolution des Performances (30 jours)</h2>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={historyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-surface-700" />
                  <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="lcp" stroke="#10b981" strokeWidth={2} name="LCP (s)" dot={false} />
                  <Line type="monotone" dataKey="inp" stroke="#f59e0b" strokeWidth={2} name="INP (ms, /100)" dot={false} />
                  <Line type="monotone" dataKey="cls" stroke="#3b82f6" strokeWidth={2} name="CLS (*10)" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Resource Breakdown */}
            <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6">Répartition des Ressources</h2>
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-4">
                Taille totale: {(data.resources.totalSize / 1024 / 1024).toFixed(2)} MB
              </p>
              <ResourceTable resources={data.resources} />
            </div>

            {/* Opportunities */}
            <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" /> Opportunités d'Optimisation
              </h2>
              <div className="space-y-4">
                {data.opportunities.map((opp, idx) => (
                  <div key={idx} className={cn('rounded-lg p-4 border', getSeverityColor(opp.severity).bg, getSeverityColor(opp.severity).border)}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-surface-900 dark:text-surface-50">{opp.title}</h4>
                        <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{opp.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                          -{opp.savings.value}
                          {opp.savings.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostics */}
            <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" /> Diagnostics Techniques
              </h2>
              <div className="space-y-4">
                {data.diagnostics.map((diag, idx) => {
                  const severityInfo = getSeverityColor(diag.severity)
                  return (
                    <div key={idx} className={cn('rounded-lg p-4 border', severityInfo.bg, severityInfo.border)}>
                      <div className="flex items-start gap-3">
                        <AlertCircle className={cn('w-5 h-5 flex-shrink-0 mt-0.5', severityInfo.color)} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-surface-900 dark:text-surface-50">{diag.title}</h4>
                          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">{diag.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-white dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 p-6">
              <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Comparaison avec les Concurrents
              </h2>
              <CompetitorComparison competitors={data.competitors} />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-lg bg-brand-500 text-white font-medium hover:bg-brand-600 transition-colors inline-flex items-center gap-2">
                <Download className="w-4 h-4" /> Télécharger le Rapport PDF
              </button>
              <button className="px-6 py-3 rounded-lg border border-brand-500 text-brand-600 dark:text-brand-400 font-medium hover:bg-brand-500/10 transition-colors inline-flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Partager les Résultats
              </button>
            </div>
          </>
        )}

        {/* Empty State */}
        {!data && !loading && !error && (
          <div className="text-center py-24">
            <Gauge className="w-20 h-20 text-surface-300 dark:text-surface-600 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-2">Analysez les performances de votre site</h3>
            <p className="text-surface-600 dark:text-surface-400 max-w-md mx-auto">
              Entrez une URL ci-dessus pour obtenir un audit détaillé des Core Web Vitals, des recommandations d'optimisation et une comparaison avec vos concurrents.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
