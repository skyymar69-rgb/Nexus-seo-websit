'use client'

import { useState, useMemo } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import {
  TrendingUp,
  Calendar,
  Award,
  Zap,
  Target,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ComposedChart,
} from 'recharts'

// Demo data for score evolution over 90 days
const scoreEvolutionData = [
  { day: 'Jour 1', score: 52, technical: 48, onpage: 55, content: 50, experience: 48 },
  { day: 'Jour 8', score: 54, technical: 50, onpage: 57, content: 52, experience: 50 },
  { day: 'Jour 15', score: 57, technical: 53, onpage: 60, content: 55, experience: 53 },
  { day: 'Jour 22', score: 61, technical: 57, onpage: 64, content: 60, experience: 57 },
  { day: 'Jour 29', score: 64, technical: 61, onpage: 67, content: 63, experience: 61 },
  { day: 'Jour 36', score: 68, technical: 65, onpage: 71, content: 67, experience: 66 },
  { day: 'Jour 43', score: 71, technical: 68, onpage: 74, content: 70, experience: 70 },
  { day: 'Jour 50', score: 74, technical: 71, onpage: 77, content: 73, experience: 73 },
  { day: 'Jour 57', score: 77, technical: 74, onpage: 80, content: 76, experience: 76 },
  { day: 'Jour 64', score: 79, technical: 76, onpage: 82, content: 78, experience: 78 },
  { day: 'Jour 71', score: 81, technical: 79, onpage: 84, content: 81, experience: 80 },
  { day: 'Jour 78', score: 83, technical: 81, onpage: 86, content: 83, experience: 82 },
  { day: 'Jour 85', score: 85, technical: 83, onpage: 88, content: 85, experience: 84 },
  { day: 'Jour 90', score: 87, technical: 85, onpage: 90, content: 87, experience: 86 },
]

// Keyword position evolution
const keywordPositionData = [
  { day: 'Jour 1', avgPosition: 34.5 },
  { day: 'Jour 8', avgPosition: 31.2 },
  { day: 'Jour 15', avgPosition: 28.7 },
  { day: 'Jour 22', avgPosition: 26.3 },
  { day: 'Jour 29', avgPosition: 24.1 },
  { day: 'Jour 36', avgPosition: 21.8 },
  { day: 'Jour 43', avgPosition: 19.5 },
  { day: 'Jour 50', avgPosition: 17.8 },
  { day: 'Jour 57', avgPosition: 16.2 },
  { day: 'Jour 64', avgPosition: 14.9 },
  { day: 'Jour 71', avgPosition: 13.8 },
  { day: 'Jour 78', avgPosition: 12.7 },
  { day: 'Jour 85', avgPosition: 11.9 },
  { day: 'Jour 90', avgPosition: 10.4 },
]

// Backlink growth over time
const backlinkGrowthData = [
  { day: 'Jour 1', backlinks: 2340, referring: 156 },
  { day: 'Jour 8', backlinks: 2520, referring: 168 },
  { day: 'Jour 15', backlinks: 2890, referring: 185 },
  { day: 'Jour 22', backlinks: 3450, referring: 210 },
  { day: 'Jour 29', backlinks: 4120, referring: 235 },
  { day: 'Jour 36', backlinks: 4890, referring: 268 },
  { day: 'Jour 43', backlinks: 5680, referring: 305 },
  { day: 'Jour 50', backlinks: 6450, referring: 340 },
  { day: 'Jour 57', backlinks: 7280, referring: 380 },
  { day: 'Jour 64', backlinks: 8120, referring: 420 },
  { day: 'Jour 71', backlinks: 8950, referring: 458 },
  { day: 'Jour 78', backlinks: 9780, referring: 495 },
  { day: 'Jour 85', backlinks: 10620, referring: 530 },
  { day: 'Jour 90', backlinks: 11450, referring: 565 },
]

// Core Web Vitals Evolution
const coreWebVitalsData = [
  { day: 'Jour 1', lcp: 3.8, fid: 95, cls: 0.18 },
  { day: 'Jour 15', lcp: 3.2, fid: 78, cls: 0.14 },
  { day: 'Jour 30', lcp: 2.8, fid: 65, cls: 0.10 },
  { day: 'Jour 45', lcp: 2.4, fid: 52, cls: 0.08 },
  { day: 'Jour 60', lcp: 2.1, fid: 42, cls: 0.06 },
  { day: 'Jour 75', lcp: 1.9, fid: 35, cls: 0.04 },
  { day: 'Jour 90', lcp: 1.7, fid: 28, cls: 0.02 },
]

// Milestones
const milestones = [
  { date: 'Jour 5', event: 'Premier audit execute', type: 'audit', completed: true },
  { date: 'Jour 18', event: '10 pages optimisees en SEO', type: 'optimization', completed: true },
  { date: 'Jour 35', event: 'Score technique atteint 65+', type: 'goal', completed: true },
  { date: 'Jour 52', event: 'Premiers backlinks obtenus', type: 'milestone', completed: true },
  { date: 'Jour 70', event: 'Score SEO atteint 80', type: 'goal', completed: true },
  { date: 'Jour 90', event: 'Objectif cible atteint: 87', type: 'goal', completed: true },
]

// Monthly comparison
const monthlyComparisonData = [
  {
    metric: 'Score SEO',
    thiMonth: 87,
    lastMonth: 64,
    delta: 23,
    trend: 'up',
  },
  {
    metric: 'Mots-cles Ranks',
    thiMonth: 8240,
    lastMonth: 5680,
    delta: 2560,
    trend: 'up',
  },
  {
    metric: 'Trafic Organique',
    thiMonth: 142350,
    lastMonth: 89200,
    delta: 53150,
    trend: 'up',
  },
  {
    metric: 'Backlinks',
    thiMonth: 11450,
    lastMonth: 8200,
    delta: 3250,
    trend: 'up',
  },
  {
    metric: 'Position Moyenne',
    thiMonth: 10.4,
    lastMonth: 18.6,
    delta: -8.2,
    trend: 'up',
  },
]

// Projection data
const projectionData = [
  { day: 'Jour 90', score: 87, projected: 87 },
  { day: 'Jour 105', score: null, projected: 89.5 },
  { day: 'Jour 120', score: null, projected: 91.2 },
  { day: 'Jour 135', score: null, projected: 92.1 },
  { day: 'Jour 150', score: null, projected: 92.8 },
]

type DateRange = '7d' | '30d' | '90d'

export default function EvolutionPage() {
  const { checkAccess } = usePlan()
  const [dateRange, setDateRange] = useState<DateRange>('90d')

  if (!checkAccess('auditsPerMonth')) {
    return (
      <div className="space-y-8 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">
              Suivi d'Evolution
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Suivi et analyse de l'evolution de votre SEO au fil du temps
          </p>
        </div>
        <UpgradePrompt feature="seoAnalysis" requiredPlan="professionnel" />
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Date Range Selector */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <TrendingUp className="h-6 w-6 text-brand-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Suivi d'Evolution
            </h1>
          </div>
          <p className="text-surface-400 mt-1 max-w-xl">
            Suivez l'evolution de vos metriques SEO et identifiez les tendances
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange('7d')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              dateRange === '7d'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-800 text-surface-400 hover:text-surface-300'
            )}
          >
            7 jours
          </button>
          <button
            onClick={() => setDateRange('30d')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              dateRange === '30d'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-800 text-surface-400 hover:text-surface-300'
            )}
          >
            30 jours
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors',
              dateRange === '90d'
                ? 'bg-brand-500 text-white'
                : 'bg-surface-800 text-surface-400 hover:text-surface-300'
            )}
          >
            90 jours
          </button>
        </div>
      </div>

      {/* KPI Cards for Monthly Comparison */}
      <div className="grid grid-cols-2 gap-6">
        {monthlyComparisonData.slice(0, 2).map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-surface-500 mb-1 font-medium uppercase">
                  {item.metric}
                </p>
                <p className="text-3xl font-bold text-surface-100">
                  {typeof item.thiMonth === 'number' && item.thiMonth > 100
                    ? formatNumber(item.thiMonth)
                    : item.thiMonth}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-green-400 font-semibold">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>+{formatNumber(item.delta)}</span>
                </div>
                <p className="text-xs text-surface-500 mt-1">
                  vs mois dernier
                </p>
              </div>
            </div>
            <div className="w-full h-1 bg-surface-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400"
                style={{
                  width: `${Math.min(
                    (item.thiMonth / (item.thiMonth + item.lastMonth)) * 100 * 1.2,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Score Evolution Chart */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
            <Award className="h-5 w-5 text-brand-400" />
            Evolution du Score SEO
          </h2>
          <p className="text-sm text-surface-400 mt-1">
            Progression de votre score global avec objectif cible de 90
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={scoreEvolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="rgb(99, 102, 241)"
              strokeWidth={3}
              dot={false}
              name="Score SEO"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey={() => 90}
              stroke="rgb(74, 222, 128)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Objectif cible"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Category Evolution */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-brand-400" />
          Evolution par Categorie
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={scoreEvolutionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="technical"
              stroke="rgb(99, 102, 241)"
              strokeWidth={2}
              dot={false}
              name="SEO Technique"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="onpage"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2}
              dot={false}
              name="On-page"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="content"
              stroke="rgb(168, 85, 247)"
              strokeWidth={2}
              dot={false}
              name="Contenu"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="experience"
              stroke="rgb(59, 130, 246)"
              strokeWidth={2}
              dot={false}
              name="Experience Utilisateur"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Keyword Position Evolution */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Evolution de la Position des Mots-cles
        </h2>
        <p className="text-sm text-surface-400 mb-6">
          Position moyenne en baisse = amelioration (plus proche du top)
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={keywordPositionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              reversed
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Line
              type="monotone"
              dataKey="avgPosition"
              stroke="rgb(34, 197, 94)"
              strokeWidth={3}
              dot={false}
              name="Position Moyenne"
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Backlink Growth */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Croissance des Backlinks
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={backlinkGrowthData}>
            <defs>
              <linearGradient id="colorBacklinks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="rgb(99, 102, 241)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="rgb(99, 102, 241)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area
              type="monotone"
              dataKey="backlinks"
              stroke="rgb(99, 102, 241)"
              fillOpacity={1}
              fill="url(#colorBacklinks)"
              name="Backlinks Totaux"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="referring"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2}
              dot={false}
              name="Domaines Referents"
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Core Web Vitals Performance */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand-400" />
          Tendances Core Web Vitals
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={coreWebVitalsData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              yAxisId="left"
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              yAxisId="right"
              orientation="right"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="lcp"
              stroke="rgb(99, 102, 241)"
              strokeWidth={2}
              dot={false}
              name="LCP (secondes)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="fid"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2}
              dot={false}
              name="FID (ms)"
              isAnimationActive={false}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cls"
              stroke="rgb(168, 85, 247)"
              strokeWidth={2}
              dot={false}
              name="CLS"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Milestones Timeline */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">Chronologie des Jalons</h2>
        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2',
                    milestone.completed
                      ? 'bg-brand-500/20 border-brand-500'
                      : 'bg-surface-800 border-surface-700'
                  )}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-brand-400" />
                  ) : (
                    <Calendar className="h-5 w-5 text-surface-500" />
                  )}
                </div>
                {index < milestones.length - 1 && (
                  <div className="w-1 h-12 bg-surface-700 mt-2" />
                )}
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-surface-100">{milestone.event}</p>
                  <span className="text-xs text-surface-500 font-medium">
                    {milestone.date}
                  </span>
                </div>
                <p className="text-sm text-surface-500">
                  {milestone.type === 'audit' && 'Audit SEO execute'}
                  {milestone.type === 'optimization' && 'Pages optimisees'}
                  {milestone.type === 'goal' && 'Objectif atteint'}
                  {milestone.type === 'milestone' && 'Jalon important'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score Projection */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-brand-400" />
          Projection Estimee (IA)
        </h2>
        <p className="text-sm text-surface-400 mb-6">
          Projection basee sur la trajectoire actuelle de croissance
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="day"
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="rgb(107, 114, 128)"
              style={{ fontSize: '12px' }}
              domain={[80, 95]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgb(17, 24, 39)',
                border: '1px solid rgb(55, 65, 81)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgb(229, 231, 235)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="rgb(99, 102, 241)"
              strokeWidth={3}
              dot={false}
              name="Score Reel"
              isAnimationActive={false}
            />
            <Line
              type="linear"
              dataKey="projected"
              stroke="rgb(74, 222, 128)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Projection (IA)"
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Comparison Table */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur overflow-hidden shadow-sm">
        <div className="p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-surface-100">
            Comparaison Mensuelle
          </h2>
          <p className="text-sm text-surface-400 mt-1">
            Ce mois vs mois dernier
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Metrique
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Ce Mois
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Mois Dernier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Variation
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyComparisonData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                    {item.metric}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="text-surface-100 font-medium">
                      {typeof item.thiMonth === 'number' && item.thiMonth > 100
                        ? formatNumber(item.thiMonth)
                        : item.thiMonth}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    {typeof item.lastMonth === 'number' && item.lastMonth > 100
                      ? formatNumber(item.lastMonth)
                      : item.lastMonth}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      {item.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-400" />
                      )}
                      <span
                        className={
                          item.trend === 'up'
                            ? 'text-green-400 font-semibold'
                            : 'text-red-400 font-semibold'
                        }
                      >
                        {item.trend === 'up' ? '+' : ''}
                        {typeof item.delta === 'number' && item.delta > 100
                          ? formatNumber(item.delta)
                          : item.delta}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
