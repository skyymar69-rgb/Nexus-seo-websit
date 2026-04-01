'use client'

import { useState, useMemo } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import {
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronUp,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  Users,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Keyword {
  id: string
  keyword: string
  position: number
  previousPosition: number
  bestPosition: number
  url: string
  volume: number
  features: string[]
  lastUpdated: string
}

interface Alert {
  keywordId: string
  keyword: string
  change: number
  type: 'gain' | 'loss'
}

interface CompetitorData {
  keyword: string
  yourPosition: number
  competitors: {
    name: string
    position: number
  }[]
}

const mockKeywords: Keyword[] = [
  {
    id: '1',
    keyword: 'agence seo paris',
    position: 2,
    previousPosition: 5,
    bestPosition: 1,
    url: '/services/seo',
    volume: 12100,
    features: ['Featured Snippet'],
    lastUpdated: '28 mars',
  },
  {
    id: '2',
    keyword: 'audit seo en ligne',
    position: 1,
    previousPosition: 1,
    bestPosition: 1,
    url: '/outils/audit',
    volume: 8200,
    features: ['Rich Results'],
    lastUpdated: '28 mars',
  },
  {
    id: '3',
    keyword: 'analyse backlinks gratuite',
    position: 8,
    previousPosition: 6,
    bestPosition: 4,
    url: '/outils/backlinks',
    volume: 6800,
    features: [],
    lastUpdated: '28 mars',
  },
  {
    id: '4',
    keyword: 'suivi classement google',
    position: 15,
    previousPosition: 10,
    bestPosition: 8,
    url: '/outils/rank-tracker',
    volume: 5400,
    features: [],
    lastUpdated: '27 mars',
  },
  {
    id: '5',
    keyword: 'referencement naturel france',
    position: 4,
    previousPosition: 5,
    bestPosition: 3,
    url: '/blog/seo-guide',
    volume: 18500,
    features: ['Featured Snippet'],
    lastUpdated: '28 mars',
  },
  {
    id: '6',
    keyword: 'recherche mots cles seo',
    position: 7,
    previousPosition: 1,
    bestPosition: 1,
    url: '/outils/keywords',
    volume: 9300,
    features: [],
    lastUpdated: '28 mars',
  },
  {
    id: '7',
    keyword: 'checker backlinks site',
    position: 3,
    previousPosition: 3,
    bestPosition: 2,
    url: '/outils/backlinks/checker',
    volume: 4200,
    features: ['Rich Results'],
    lastUpdated: '27 mars',
  },
  {
    id: '8',
    keyword: 'keyword research tool',
    position: 18,
    previousPosition: 17,
    bestPosition: 11,
    url: '/outils/keywords/research',
    volume: 14800,
    features: [],
    lastUpdated: '27 mars',
  },
  {
    id: '9',
    keyword: 'analyse concurrents seo',
    position: 9,
    previousPosition: 6,
    bestPosition: 5,
    url: '/outils/competitors',
    volume: 3900,
    features: [],
    lastUpdated: '27 mars',
  },
  {
    id: '10',
    keyword: 'rapport seo automatique',
    position: 6,
    previousPosition: 1,
    bestPosition: 1,
    url: '/outils/reports',
    volume: 2800,
    features: ['Featured Snippet'],
    lastUpdated: '26 mars',
  },
  {
    id: '11',
    keyword: 'optimisation contenu web',
    position: 12,
    previousPosition: 11,
    bestPosition: 9,
    url: '/blog/content',
    volume: 6200,
    features: [],
    lastUpdated: '28 mars',
  },
  {
    id: '12',
    keyword: 'analyse serp google',
    position: 5,
    previousPosition: 4,
    bestPosition: 4,
    url: '/outils/serp',
    volume: 4500,
    features: ['Rich Results'],
    lastUpdated: '28 mars',
  },
  {
    id: '13',
    keyword: 'outil seo gratuit france',
    position: 11,
    previousPosition: 10,
    bestPosition: 9,
    url: '/blog/outils-gratuits',
    volume: 5600,
    features: [],
    lastUpdated: '27 mars',
  },
  {
    id: '14',
    keyword: 'suivi positionnement mots cles',
    position: 24,
    previousPosition: 19,
    bestPosition: 15,
    url: '/blog/rank-tracking',
    volume: 3200,
    features: [],
    lastUpdated: '26 mars',
  },
  {
    id: '15',
    keyword: 'strategie seo efficace',
    position: 13,
    previousPosition: 12,
    bestPosition: 10,
    url: '/blog/strategie-seo',
    volume: 7800,
    features: [],
    lastUpdated: '28 mars',
  },
]

const positionHistoryData = [
  { day: 'Mar 1', avgPosition: 12.4 },
  { day: 'Mar 5', avgPosition: 11.8 },
  { day: 'Mar 9', avgPosition: 11.2 },
  { day: 'Mar 13', avgPosition: 10.6 },
  { day: 'Mar 17', avgPosition: 10.1 },
  { day: 'Mar 21', avgPosition: 9.5 },
  { day: 'Mar 25', avgPosition: 8.9 },
  { day: 'Mar 28', avgPosition: 8.4 },
]

const distributionData = [
  { range: '1-3', count: 47, fill: 'rgb(34, 197, 94)' },
  { range: '4-10', count: 28, fill: 'rgb(59, 130, 246)' },
  { range: '11-20', count: 52, fill: 'rgb(251, 191, 36)' },
  { range: '21-50', count: 89, fill: 'rgb(239, 68, 68)' },
  { range: '51-100', count: 73, fill: 'rgb(107, 114, 128)' },
  { range: '100+', count: 155, fill: 'rgb(55, 65, 81)' },
]

const competitorComparison: CompetitorData[] = [
  {
    keyword: 'agence seo paris',
    yourPosition: 2,
    competitors: [
      { name: 'Competitor A', position: 1 },
      { name: 'Competitor B', position: 3 },
      { name: 'Competitor C', position: 4 },
    ],
  },
  {
    keyword: 'audit seo en ligne',
    yourPosition: 1,
    competitors: [
      { name: 'Competitor A', position: 2 },
      { name: 'Competitor B', position: 4 },
      { name: 'Competitor C', position: 5 },
    ],
  },
  {
    keyword: 'analyse backlinks gratuite',
    yourPosition: 8,
    competitors: [
      { name: 'Competitor A', position: 2 },
      { name: 'Competitor B', position: 5 },
      { name: 'Competitor C', position: 6 },
    ],
  },
  {
    keyword: 'referencement naturel france',
    yourPosition: 4,
    competitors: [
      { name: 'Competitor A', position: 1 },
      { name: 'Competitor B', position: 3 },
      { name: 'Competitor C', position: 6 },
    ],
  },
  {
    keyword: 'analyse concurrents seo',
    yourPosition: 9,
    competitors: [
      { name: 'Competitor A', position: 2 },
      { name: 'Competitor B', position: 4 },
      { name: 'Competitor C', position: 7 },
    ],
  },
]

type SortField = 'keyword' | 'position' | 'change' | 'volume' | 'best' | 'updated'
type PositionFilter = 'all' | 'top3' | 'top10' | 'top50'
type MovementFilter = 'all' | 'gain' | 'loss' | 'stable'

export default function RankTrackerPage() {
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords)
  const [newKeyword, setNewKeyword] = useState('')
  const [period, setPeriod] = useState('30j')
  const [sortBy, setSortBy] = useState<SortField>('position')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all')
  const [movementFilter, setMovementFilter] = useState<MovementFilter>('all')

  const handleAddKeyword = () => {
    if (newKeyword.trim()) {
      const newKw: Keyword = {
        id: String(keywords.length + 1),
        keyword: newKeyword.trim(),
        position: 101,
        previousPosition: 101,
        bestPosition: 101,
        url: '/tracking',
        volume: 0,
        features: [],
        lastUpdated: 'Aujourd\'hui',
      }
      setKeywords([...keywords, newKw])
      setNewKeyword('')
    }
  }

  const getPositionBadgeColor = (position: number) => {
    if (position >= 1 && position <= 3) return 'bg-emerald-900/40 text-emerald-300'
    if (position >= 4 && position <= 10) return 'bg-blue-900/40 text-blue-300'
    if (position >= 11 && position <= 20) return 'bg-amber-900/40 text-amber-300'
    return 'bg-red-900/40 text-red-300'
  }

  const getMovement = (current: number, previous: number) => {
    if (current < previous) return { direction: 'up', change: previous - current }
    if (current > previous) return { direction: 'down', change: current - previous }
    return { direction: 'stable', change: 0 }
  }

  const filteredKeywords = useMemo(() => {
    return keywords.filter((kw) => {
      const matchesSearch = searchTerm
        ? kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
        : true

      let matchesPosition = true
      if (positionFilter === 'top3') matchesPosition = kw.position >= 1 && kw.position <= 3
      if (positionFilter === 'top10') matchesPosition = kw.position >= 1 && kw.position <= 10
      if (positionFilter === 'top50') matchesPosition = kw.position >= 1 && kw.position <= 50

      let matchesMovement = true
      const movement = getMovement(kw.position, kw.previousPosition)
      if (movementFilter === 'gain') matchesMovement = movement.direction === 'up'
      if (movementFilter === 'loss') matchesMovement = movement.direction === 'down'
      if (movementFilter === 'stable') matchesMovement = movement.direction === 'stable'

      return matchesSearch && matchesPosition && matchesMovement
    })
  }, [keywords, searchTerm, positionFilter, movementFilter])

  const sortedKeywords = useMemo(() => {
    const sorted = [...filteredKeywords].sort((a, b) => {
      let aVal: number | string = 0
      let bVal: number | string = 0

      if (sortBy === 'keyword') {
        aVal = a.keyword
        bVal = b.keyword
      } else if (sortBy === 'position') {
        aVal = a.position
        bVal = b.position
      } else if (sortBy === 'change') {
        aVal = Math.abs(a.position - a.previousPosition)
        bVal = Math.abs(b.position - b.previousPosition)
      } else if (sortBy === 'volume') {
        aVal = a.volume
        bVal = b.volume
      } else if (sortBy === 'best') {
        aVal = a.bestPosition
        bVal = b.bestPosition
      } else if (sortBy === 'updated') {
        aVal = a.lastUpdated
        bVal = b.lastUpdated
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortDirection === 'asc'
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
    return sorted
  }, [filteredKeywords, sortBy, sortDirection])

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection('asc')
    }
  }

  const getAlerts = (): Alert[] => {
    return keywords
      .map((kw) => {
        const change = kw.previousPosition - kw.position
        if (Math.abs(change) >= 5) {
          return {
            keywordId: kw.id,
            keyword: kw.keyword,
            change: Math.abs(change),
            type: change > 0 ? 'gain' : 'loss',
          }
        }
        return null
      })
      .filter((alert) => alert !== null) as Alert[]
  }

  const alerts = getAlerts()

  const stats = {
    totalTracked: keywords.length,
    top3: keywords.filter((k) => k.position >= 1 && k.position <= 3).length,
    top10: keywords.filter((k) => k.position >= 1 && k.position <= 10).length,
    avgPosition:
      (keywords.reduce((sum, k) => sum + k.position, 0) / keywords.length).toFixed(1),
  }

  const getSortIndicator = (field: SortField) => {
    if (sortBy !== field) return null
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    )
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <TrendingUp className="h-6 w-6 text-brand-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              Suivi de Positionnement
            </h1>
          </div>
          <p className="text-surface-400 mt-1 max-w-xl">
            Suivez vos positions quotidiennement sur Google
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2 bg-surface-900/50 border border-surface-700 rounded-lg p-1">
            {['7j', '30j', '90j'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all',
                  period === p
                    ? 'bg-brand-500 text-white'
                    : 'text-surface-400 hover:text-surface-300'
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add Keyword Input */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-4">Ajouter des mots-cles</h2>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Entrez un mot-cle a tracker..."
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
            className="flex-1 bg-surface-900 border border-surface-700 rounded-lg px-4 py-3 text-surface-100 placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all"
          />
          <button
            onClick={handleAddKeyword}
            className="px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border border-surface-700 bg-surface-900/50 p-5 backdrop-blur shadow-sm">
          <p className="text-sm text-surface-400 mb-2 font-medium">Mots-cles suivis</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-surface-100">{stats.totalTracked}</p>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-surface-500 mt-2">En suivi actif</p>
        </div>

        <div className="rounded-lg border border-surface-700 bg-surface-900/50 p-5 backdrop-blur shadow-sm">
          <p className="text-sm text-surface-400 mb-2 font-medium">Top 3</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-surface-100">{stats.top3}</p>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-surface-500 mt-2">Au top 3</p>
        </div>

        <div className="rounded-lg border border-surface-700 bg-surface-900/50 p-5 backdrop-blur shadow-sm">
          <p className="text-sm text-surface-400 mb-2 font-medium">Top 10</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-surface-100">{stats.top10}</p>
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-surface-500 mt-2">Dans le top 10</p>
        </div>

        <div className="rounded-lg border border-surface-700 bg-surface-900/50 p-5 backdrop-blur shadow-sm">
          <p className="text-sm text-surface-400 mb-2 font-medium">Position moyenne</p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-surface-100">{stats.avgPosition}</p>
            <TrendingDown className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-xs text-surface-500 mt-2">Plus bas = mieux</p>
        </div>
      </div>

      {/* Position Distribution Chart */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Distribution des positions
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={distributionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgb(71, 85, 105)" />
            <XAxis
              dataKey="range"
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
              formatter={(value) => [value, 'Mots-cles']}
            />
            <Bar dataKey="count" fill="rgb(99, 102, 241)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Position History Chart */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">
          Historique de position (30 jours)
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={positionHistoryData}>
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
              formatter={(value) => [Number(value).toFixed(1), 'Position moyenne']}
            />
            <Line
              type="monotone"
              dataKey="avgPosition"
              stroke="rgb(34, 197, 94)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <h2 className="text-lg font-bold text-surface-100">
              Alertes de positionnement
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {alerts.slice(0, 6).map((alert) => (
              <div
                key={alert.keywordId}
                className={cn(
                  'p-3 rounded-lg border flex items-center justify-between',
                  alert.type === 'gain'
                    ? 'bg-emerald-900/20 border-emerald-800 text-emerald-300'
                    : 'bg-red-900/20 border-red-800 text-red-300'
                )}
              >
                <span className="font-medium text-sm">{alert.keyword}</span>
                <div className="flex items-center gap-2">
                  {alert.type === 'gain' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span className="font-bold">+{alert.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitor Comparison */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-bold text-surface-100">
            Comparaison avec concurrents (Top 5)
          </h2>
        </div>
        <div className="space-y-4">
          {competitorComparison.map((comp) => (
            <div
              key={comp.keyword}
              className="p-4 rounded-lg border border-surface-700 bg-surface-800/20"
            >
              <p className="text-sm font-semibold text-surface-100 mb-3">
                {comp.keyword}
              </p>
              <div className="grid grid-cols-4 gap-2">
                <div className="p-2 rounded bg-brand-900/30 border border-brand-700">
                  <p className="text-xs text-surface-400 mb-1">Votre position</p>
                  <p className="text-lg font-bold text-brand-300">#{comp.yourPosition}</p>
                </div>
                {comp.competitors.map((competitor, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-surface-700/30 border border-surface-600"
                  >
                    <p className="text-xs text-surface-400 mb-1 truncate">
                      {competitor.name}
                    </p>
                    <p className="text-lg font-bold text-surface-300">
                      #{competitor.position}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords Table */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur overflow-hidden shadow-sm">
        <div className="p-6 border-b border-surface-700 space-y-4">
          <div>
            <h2 className="text-lg font-bold text-surface-100 mb-4">
              Suivi des mots-cles
            </h2>
            <input
              type="text"
              placeholder="Rechercher un mot-cle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-900 border border-surface-700 rounded-lg px-4 py-2 text-surface-100 placeholder:text-surface-500 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                onClick={() => setPositionFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  positionFilter === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Tous
              </button>
              <button
                onClick={() => setPositionFilter('top3')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  positionFilter === 'top3'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Top 3
              </button>
              <button
                onClick={() => setPositionFilter('top10')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  positionFilter === 'top10'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Top 10
              </button>
              <button
                onClick={() => setPositionFilter('top50')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  positionFilter === 'top50'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Top 50
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMovementFilter('all')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  movementFilter === 'all'
                    ? 'bg-brand-500 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Tous mouvements
              </button>
              <button
                onClick={() => setMovementFilter('gain')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  movementFilter === 'gain'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Gains
              </button>
              <button
                onClick={() => setMovementFilter('loss')}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  movementFilter === 'loss'
                    ? 'bg-red-600 text-white'
                    : 'bg-surface-800 text-surface-400 hover:text-surface-300'
                )}
              >
                Pertes
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/30">
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('keyword')}
                >
                  <div className="flex items-center gap-2">
                    Mot-cle
                    {getSortIndicator('keyword') && (
                      <span className="text-brand-400">{getSortIndicator('keyword')}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('position')}
                >
                  <div className="flex items-center gap-2">
                    Position
                    {getSortIndicator('position') && (
                      <span className="text-brand-400">{getSortIndicator('position')}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Precedente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Changement
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('best')}
                >
                  <div className="flex items-center gap-2">
                    Meilleure
                    {getSortIndicator('best') && (
                      <span className="text-brand-400">{getSortIndicator('best')}</span>
                    )}
                  </div>
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('volume')}
                >
                  <div className="flex items-center gap-2">
                    Volume
                    {getSortIndicator('volume') && (
                      <span className="text-brand-400">{getSortIndicator('volume')}</span>
                    )}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  URL
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Features SERP
                </th>
                <th
                  className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide cursor-pointer hover:text-surface-300 transition-colors"
                  onClick={() => toggleSort('updated')}
                >
                  <div className="flex items-center gap-2">
                    Maj.
                    {getSortIndicator('updated') && (
                      <span className="text-brand-400">{getSortIndicator('updated')}</span>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedKeywords.map((kw) => {
                const movement = getMovement(kw.position, kw.previousPosition)
                return (
                  <tr
                    key={kw.id}
                    className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-semibold text-surface-100 hover:text-brand-400 transition-colors"
                      >
                        {kw.keyword}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                          getPositionBadgeColor(kw.position)
                        )}
                      >
                        #{kw.position}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-surface-400 font-medium">
                      #{kw.previousPosition}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={cn(
                          'flex items-center gap-1.5 font-semibold',
                          movement.direction === 'up'
                            ? 'text-emerald-400'
                            : movement.direction === 'down'
                              ? 'text-red-400'
                              : 'text-surface-400'
                        )}
                      >
                        {movement.direction === 'up' ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : movement.direction === 'down' ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <span className="text-lg">-</span>
                        )}
                        {movement.change > 0 ? `+${movement.change}` : '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-surface-400 font-medium">
                      #{kw.bestPosition}
                    </td>
                    <td className="px-6 py-4 font-medium text-surface-300">
                      {formatNumber(kw.volume)}
                    </td>
                    <td className="px-6 py-4 text-surface-400 truncate max-w-xs">
                      {kw.url}
                    </td>
                    <td className="px-6 py-4">
                      {kw.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {kw.features.map((feature) => (
                            <span
                              key={feature}
                              className="inline-block px-2 py-1 rounded text-xs bg-brand-900/30 text-brand-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-surface-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-surface-500 text-xs">
                      {kw.lastUpdated}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-surface-700 bg-surface-800/20 flex items-center justify-between text-sm">
          <p className="text-surface-400">
            Affichage{' '}
            <span className="font-semibold text-surface-300">
              1-{Math.min(15, sortedKeywords.length)}
            </span>{' '}
            sur{' '}
            <span className="font-semibold text-surface-300">
              {sortedKeywords.length}
            </span>{' '}
            resultats
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-900 hover:bg-surface-800 transition-colors text-surface-400">
              Precedent
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors">
              1
            </button>
            {Math.ceil(sortedKeywords.length / 15) > 1 && (
              <button className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-900 hover:bg-surface-800 transition-colors text-surface-400">
                2
              </button>
            )}
            <button className="px-3 py-1.5 rounded-lg border border-surface-700 bg-surface-900 hover:bg-surface-800 transition-colors text-surface-400">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
