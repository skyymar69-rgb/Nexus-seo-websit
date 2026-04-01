'use client'

import { useMemo, useState } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'
import {
  Users,
  Plus,
  ChevronUp,
  ChevronDown,
  TrendingUp,
  Link2,
  Target,
  Zap,
} from 'lucide-react'
import {
  LineChart,
  Line,
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

interface Competitor {
  id: string
  domain: string
  da: number
  seoScore: number
  organicTraffic: number
  keywords: number
  backlinks: number
  commonKeywords: number
}

const competitors: Competitor[] = [
  {
    id: '1',
    domain: 'semrush.fr',
    da: 91,
    seoScore: 94,
    organicTraffic: 45200000,
    keywords: 28500000,
    backlinks: 142000,
    commonKeywords: 234,
  },
  {
    id: '2',
    domain: 'ahrefs-france.com',
    da: 89,
    seoScore: 91,
    organicTraffic: 32100000,
    keywords: 21300000,
    backlinks: 98000,
    commonKeywords: 198,
  },
  {
    id: '3',
    domain: 'moz-seo.fr',
    da: 85,
    seoScore: 87,
    organicTraffic: 12400000,
    keywords: 8700000,
    backlinks: 67000,
    commonKeywords: 156,
  },
  {
    id: '4',
    domain: 'seranking.fr',
    da: 72,
    seoScore: 78,
    organicTraffic: 3200000,
    keywords: 2100000,
    backlinks: 23000,
    commonKeywords: 89,
  },
]

const visibilityTrendData = [
  { month: 'Sep', nexus: 45000, semrush: 42000, ahrefs: 38000, moz: 28000, seranking: 12000 },
  { month: 'Oct', nexus: 48000, semrush: 44000, ahrefs: 40000, moz: 29000, seranking: 13000 },
  { month: 'Nov', nexus: 52000, semrush: 46000, ahrefs: 42000, moz: 31000, seranking: 14000 },
  { month: 'Dec', nexus: 58000, semrush: 48000, ahrefs: 44000, moz: 33000, seranking: 15500 },
  { month: 'Jan', nexus: 62000, semrush: 50000, ahrefs: 46000, moz: 35000, seranking: 17000 },
  { month: 'Fev', nexus: 68000, semrush: 52000, ahrefs: 48000, moz: 37000, seranking: 18500 },
]

const backlinksComparisonData = [
  { domain: 'Votre site', backlinks: 8500, dofollowPercentage: 72 },
  { domain: 'semrush.fr', backlinks: 142000, dofollowPercentage: 68 },
  { domain: 'ahrefs-france.com', backlinks: 98000, dofollowPercentage: 71 },
  { domain: 'moz-seo.fr', backlinks: 67000, dofollowPercentage: 65 },
  { domain: 'seranking.fr', backlinks: 23000, dofollowPercentage: 74 },
]

const contentGapData = [
  { topic: 'Technical SEO', nexus: 12, competitors: 45, gap: 33 },
  { topic: 'On-page SEO', nexus: 8, competitors: 38, gap: 30 },
  { topic: 'Link Building', nexus: 5, competitors: 42, gap: 37 },
  { topic: 'Content Marketing', nexus: 15, competitors: 28, gap: 13 },
  { topic: 'Local SEO', nexus: 3, competitors: 25, gap: 22 },
  { topic: 'International SEO', nexus: 2, competitors: 19, gap: 17 },
]

const keywordGapData = [
  {
    id: '1',
    keyword: 'outils seo',
    semrushRank: 5,
    ahrefinksRank: 8,
    yourRank: null,
    volume: 12100,
    difficulty: 45,
  },
  {
    id: '2',
    keyword: 'recherche de mots-cles',
    semrushRank: 3,
    ahrefinksRank: 2,
    yourRank: 15,
    volume: 14800,
    difficulty: 68,
  },
  {
    id: '3',
    keyword: 'outil d\'audit de site',
    semrushRank: 2,
    ahrefinksRank: 4,
    yourRank: null,
    volume: 7500,
    difficulty: 42,
  },
  {
    id: '4',
    keyword: 'analyse des backlinks',
    semrushRank: 4,
    ahrefinksRank: 6,
    yourRank: 7,
    volume: 8900,
    difficulty: 55,
  },
  {
    id: '5',
    keyword: 'verificateur seo',
    semrushRank: 1,
    ahrefinksRank: 3,
    yourRank: null,
    volume: 9200,
    difficulty: 38,
  },
  {
    id: '6',
    keyword: 'classement google',
    semrushRank: 6,
    ahrefinksRank: 7,
    yourRank: null,
    volume: 11300,
    difficulty: 55,
  },
  {
    id: '7',
    keyword: 'analyse de domaine',
    semrushRank: 2,
    ahrefinksRank: 5,
    yourRank: null,
    volume: 5600,
    difficulty: 48,
  },
  {
    id: '8',
    keyword: 'analyse seo concurrentielle',
    semrushRank: 3,
    ahrefinksRank: 4,
    yourRank: 18,
    volume: 4900,
    difficulty: 48,
  },
]

const serpOverlapData = [
  { position: 'Top 10', nexus: 8, competitors: 45 },
  { position: 'Top 20', nexus: 18, competitors: 78 },
  { position: 'Top 50', nexus: 42, competitors: 156 },
  { position: 'Top 100', nexus: 89, competitors: 312 },
]

type SortField = 'keyword' | 'volume' | 'difficulty'

export default function CompetitorsPage() {
  const { checkAccess } = usePlan()
  const [sortBy, setSortBy] = useState<SortField>('volume')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedCompetitor, setSelectedCompetitor] = useState<string>('1')
  const [newCompetitorInput, setNewCompetitorInput] = useState('')

  if (!checkAccess('competitorAnalysis')) {
    return (
      <div className="space-y-8 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">
              Analyse des Concurrents
            </h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Analysez et comparez votre performance avec vos concurrents
          </p>
        </div>
        <UpgradePrompt feature="competitorAnalysis" requiredPlan="professionnel" />
      </div>
    )
  }

  const sortedKeywordGap = useMemo(() => {
    return [...keywordGapData].sort((a, b) => {
      let aVal: number = 0
      let bVal: number = 0

      if (sortBy === 'volume') {
        aVal = a.volume
        bVal = b.volume
      } else if (sortBy === 'difficulty') {
        aVal = a.difficulty
        bVal = b.difficulty
      } else if (sortBy === 'keyword') {
        return sortDirection === 'asc'
          ? a.keyword.localeCompare(b.keyword)
          : b.keyword.localeCompare(a.keyword)
      }

      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [sortBy, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('desc')
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header with Add Competitor */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <Users className="h-6 w-6 text-brand-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Analyse des Concurrents
            </h1>
          </div>
          <p className="text-surface-400 mt-1 max-w-xl">
            Comparez vos performances avec vos concurrents et identifiez les opportunites
          </p>
        </div>
      </div>

      {/* Add Competitor Input */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Entrez un domaine concurrent (ex: exemple.com)"
              value={newCompetitorInput}
              onChange={(e) => setNewCompetitorInput(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-surface-800 border border-surface-700 text-surface-100 placeholder-surface-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>
          <button className="px-6 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Competitor Cards Grid */}
      <div className="grid grid-cols-2 gap-6">
        {competitors.map((competitor) => (
          <div
            key={competitor.id}
            onClick={() => setSelectedCompetitor(competitor.id)}
            className={cn(
              'rounded-xl border bg-surface-900/50 backdrop-blur p-6 shadow-sm hover:border-surface-600 transition-all cursor-pointer',
              selectedCompetitor === competitor.id
                ? 'border-brand-500 ring-2 ring-brand-500/20'
                : 'border-surface-700'
            )}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-surface-100 mb-1">
                  {competitor.domain}
                </h3>
                <p className="text-xs text-surface-500">
                  {competitor.commonKeywords} mots-cles en commun
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p className="text-xs text-surface-500 mb-1 font-medium">
                    SCORE SEO
                  </p>
                  <p className="text-2xl font-bold text-brand-400">
                    {competitor.seoScore}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-surface-500 mb-1 font-medium">
                  DOMAIN AUTHORITY
                </p>
                <p className="text-2xl font-bold text-surface-100">
                  {competitor.da}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1 font-medium">
                  TRAFIC ORGANIQUE
                </p>
                <p className="text-lg font-bold text-surface-100">
                  {formatNumber(competitor.organicTraffic)}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1 font-medium">
                  MOTS-CLES
                </p>
                <p className="text-lg font-bold text-surface-100">
                  {formatNumber(competitor.keywords)}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-500 mb-1 font-medium">
                  BACKLINKS
                </p>
                <p className="text-lg font-bold text-surface-100">
                  {formatNumber(competitor.backlinks)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm overflow-hidden">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Tableau Comparatif
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Metrique
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Votre site
                </th>
                {competitors.slice(0, 2).map((comp) => (
                  <th
                    key={comp.id}
                    className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide"
                  >
                    {comp.domain}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                  Domain Authority
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-bold">58</span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {competitors[0].da}
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {competitors[1].da}
                </td>
              </tr>
              <tr className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                  Score SEO
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-bold">72</span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {competitors[0].seoScore}
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {competitors[1].seoScore}
                </td>
              </tr>
              <tr className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                  Trafic Organique
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-bold">
                    {formatNumber(125600)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(45200000)}
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(32100000)}
                </td>
              </tr>
              <tr className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                  Mots-cles Ranks
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-bold">8500</span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(28500000)}
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(21300000)}
                </td>
              </tr>
              <tr className="hover:bg-surface-800/30 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-surface-100">
                  Backlinks
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className="text-green-400 font-bold">
                    {formatNumber(8500)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(142000)}
                </td>
                <td className="px-6 py-4 text-sm text-surface-400">
                  {formatNumber(98000)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Visibility Comparison Chart */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Comparaison de Visibilite Organique
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={visibilityTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="month"
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
            <Line
              type="monotone"
              dataKey="nexus"
              stroke="rgb(99, 102, 241)"
              strokeWidth={3}
              dot={false}
              name="Votre visibilite"
            />
            <Line
              type="monotone"
              dataKey="semrush"
              stroke="rgb(129, 140, 148)"
              strokeWidth={2}
              dot={false}
              name="Semrush.fr"
            />
            <Line
              type="monotone"
              dataKey="ahrefs"
              stroke="rgb(71, 85, 105)"
              strokeWidth={2}
              dot={false}
              name="Ahrefs-France"
            />
            <Line
              type="monotone"
              dataKey="moz"
              stroke="rgb(55, 65, 81)"
              strokeWidth={2}
              dot={false}
              name="Moz-Seo"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Backlinks Comparison */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <Link2 className="h-5 w-5 text-brand-400" />
          Comparaison des Backlinks
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={backlinksComparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="domain"
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
            <Bar
              dataKey="backlinks"
              fill="rgb(99, 102, 241)"
              name="Backlinks totaux"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Content Gap Analysis */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <Target className="h-5 w-5 text-brand-400" />
          Analyse des Lacunes de Contenu
        </h2>
        <p className="text-sm text-surface-400 mb-6">
          Sujets que vos concurrents couvrent mais pas vous
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={contentGapData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="topic"
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
            <Bar
              dataKey="nexus"
              fill="rgb(99, 102, 241)"
              name="Votre contenu"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="competitors"
              fill="rgb(148, 113, 113)"
              name="Concurrents"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SERP Overlap Analysis */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand-400" />
          Chevauchement SERP
        </h2>
        <p className="text-sm text-surface-400 mb-6">
          Mots-cles ou vous concourez directement avec vos concurrents
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={serpOverlapData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="position"
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
            <Bar
              dataKey="nexus"
              fill="rgb(99, 102, 241)"
              name="Votre site"
              radius={[8, 8, 0, 0]}
            />
            <Bar
              dataKey="competitors"
              fill="rgb(148, 113, 113)"
              name="Concurrents"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Keyword Gap Analysis Table */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur overflow-hidden shadow-sm">
        <div className="p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-surface-100">
            Analyse des Mots-cles Manquants
          </h2>
          <p className="text-sm text-surface-400 mt-1">
            Mots-cles ou vos concurrents ranken mais vous non
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/30">
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('keyword')}
                >
                  <div className="flex items-center gap-2">
                    Mot-cle
                    {sortBy === 'keyword' && (
                      <span className="text-brand-400">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Semrush
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Ahrefs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Votre rang
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('volume')}
                >
                  <div className="flex items-center gap-2">
                    Volume
                    {sortBy === 'volume' && (
                      <span className="text-brand-400">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('difficulty')}
                >
                  <div className="flex items-center gap-2">
                    Difficulte
                    {sortBy === 'difficulty' && (
                      <span className="text-brand-400">
                        {sortDirection === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedKeywordGap.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <a
                      href="#"
                      className="font-semibold text-surface-100 hover:text-brand-400 transition-colors text-sm"
                    >
                      {item.keyword}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    #{item.semrushRank}
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    #{item.ahrefinksRank}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {item.yourRank ? (
                      <span className="text-surface-100 font-medium">
                        #{item.yourRank}
                      </span>
                    ) : (
                      <span className="text-red-400 font-medium">
                        Non classe
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-surface-300">
                    {formatNumber(item.volume)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 rounded-full bg-surface-700 overflow-hidden">
                        <div
                          className={cn(
                            'h-full',
                            item.difficulty <= 30
                              ? 'bg-accent-500'
                              : item.difficulty <= 60
                                ? 'bg-amber-500'
                                : 'bg-red-500'
                          )}
                          style={{
                            width: `${item.difficulty}%`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-semibold',
                          item.difficulty <= 30
                            ? 'text-accent-400'
                            : item.difficulty <= 60
                              ? 'text-amber-400'
                              : 'text-red-400'
                        )}
                      >
                        {item.difficulty}
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
