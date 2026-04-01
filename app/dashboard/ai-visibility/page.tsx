'use client'

import { useState } from 'react'
import { cn, formatNumber, formatPercent, getScoreColor, getScoreBg } from '@/lib/utils'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import {
  Sparkles,
  TrendingUp,
  Lightbulb,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Calendar,
  ChevronDown,
} from 'lucide-react'
import { usePlan } from '@/hooks/usePlan'
import { UpgradePrompt } from '@/components/shared/UpgradePrompt'

// Mock data for 9 months of AI visibility
const aiVisibilityChartData = [
  { month: 'Jan', chatgpt: 45, perplexity: 28, claude: 12, gemini: 8 },
  { month: 'Fev', chatgpt: 52, perplexity: 35, claude: 18, gemini: 12 },
  { month: 'Mar', chatgpt: 68, perplexity: 42, claude: 28, gemini: 18 },
  { month: 'Avr', chatgpt: 85, perplexity: 54, claude: 32, gemini: 24 },
  { month: 'Mai', chatgpt: 98, perplexity: 64, claude: 35, gemini: 28 },
  { month: 'Juin', chatgpt: 112, perplexity: 72, claude: 38, gemini: 32 },
  { month: 'Juil', chatgpt: 125, perplexity: 81, claude: 40, gemini: 35 },
  { month: 'Aou', chatgpt: 118, perplexity: 75, claude: 38, gemini: 33 },
  { month: 'Sep', chatgpt: 127, perplexity: 86, claude: 42, gemini: 36 },
]

// Query mentions in AI responses
const mentionedQueries = [
  {
    id: '1',
    query: 'meilleur outil seo 2026',
    llm: 'ChatGPT',
    position: '2',
    sentiment: 'Positif',
    competitors: 'Semrush, Ahrefs',
    date: 'il y a 2h',
  },
  {
    id: '2',
    query: 'comment auditer un site web',
    llm: 'Perplexity',
    position: '1',
    sentiment: 'Positif',
    competitors: 'Screaming Frog',
    date: 'il y a 3h',
  },
  {
    id: '3',
    query: 'outils analyse backlinks',
    llm: 'Claude',
    position: '3',
    sentiment: 'Neutre',
    competitors: 'Ahrefs, Majestic',
    date: 'il y a 5h',
  },
  {
    id: '4',
    query: 'suivi positionnement google',
    llm: 'ChatGPT',
    position: '4',
    sentiment: 'Positif',
    competitors: 'SE Ranking, Monitorank',
    date: 'il y a 8h',
  },
  {
    id: '5',
    query: 'ai seo optimization tools',
    llm: 'Perplexity',
    position: '1',
    sentiment: 'Positif',
    competitors: 'Surfer SEO',
    date: 'il y a 12h',
  },
  {
    id: '6',
    query: 'alternative semrush gratuite',
    llm: 'ChatGPT',
    position: '2',
    sentiment: 'Positif',
    competitors: 'Ubersuggest, Mangools',
    date: 'il y a 1j',
  },
  {
    id: '7',
    query: 'seo tool for agencies',
    llm: 'Claude',
    position: null,
    sentiment: 'Négatif',
    competitors: 'Semrush, SE Ranking, Ahrefs',
    date: 'il y a 1j',
  },
  {
    id: '8',
    query: 'keyword research platform',
    llm: 'Gemini',
    position: '5',
    sentiment: 'Neutre',
    competitors: 'Ahrefs, Semrush, Mangools',
    date: 'il y a 2j',
  },
  {
    id: '9',
    query: 'rank tracking software',
    llm: 'ChatGPT',
    position: '3',
    sentiment: 'Positif',
    competitors: 'SE Ranking, Accuranker',
    date: 'il y a 2j',
  },
  {
    id: '10',
    query: 'meilleur logiciel referencement',
    llm: 'Perplexity',
    position: '2',
    sentiment: 'Positif',
    competitors: 'Semrush, Yooda',
    date: 'il y a 3j',
  },
  {
    id: '11',
    query: 'backlink checker free',
    llm: 'Claude',
    position: '4',
    sentiment: 'Neutre',
    competitors: 'Ahrefs, Moz, Majestic',
    date: 'il y a 3j',
  },
  {
    id: '12',
    query: 'content optimization seo',
    llm: 'Gemini',
    position: '2',
    sentiment: 'Positif',
    competitors: 'Surfer SEO, Clearscope',
    date: 'il y a 4j',
  },
]

// LLM scores breakdown
const llmScores = [
  { name: 'ChatGPT', score: 78, change: 5, color: 'red' },
  { name: 'Perplexity', score: 72, change: 3, color: 'blue' },
  { name: 'Claude', score: 55, change: 8, color: 'amber' },
  { name: 'Gemini', score: 48, change: -2, color: 'teal' },
]

// AI recommendations
const recommendations = [
  {
    priority: 'HIGH',
    title: 'Créer du contenu FAQ structuré pour augmenter vos citations dans ChatGPT',
    description: 'ChatGPT cite souvent les FAQs structurées. Ciblez les 20 questions les plus fréquentes de votre audience.',
  },
  {
    priority: 'HIGH',
    title: 'Ajouter des données structurées Schema.org sur vos pages clés',
    description: 'Les LLM utilisent davantage les pages avec Schema.org. Commencez par Product, Article, et FAQPage.',
  },
  {
    priority: 'MEDIUM',
    title: 'Publier des études de cas avec des données chiffrées',
    description: 'Les LLM adorent les statistiques concrètes. Créez 3 études de cas détaillées avec résultats mesurables.',
  },
  {
    priority: 'LOW',
    title: 'Optimiser vos titres H1 pour répondre directement aux questions utilisateurs',
    description: 'Structurez vos H1 sous forme de questions. Les LLM citent davantage les titres informatifs.',
  },
]

// Top competitors by AI mentions
const topCompetitors = [
  { name: 'Semrush', mentions: 342, score: 85 },
  { name: 'Ahrefs', mentions: 298, score: 81 },
  { name: 'Moz', mentions: 187, score: 68 },
  { name: 'SE Ranking', mentions: 134, score: 59 },
  { name: 'Vous (Nexus)', mentions: 258, score: 64 },
]

function getSentimentBadgeColor(sentiment: string) {
  switch (sentiment) {
    case 'Positif':
      return 'bg-accent-500/20 text-accent-700 border border-accent-200'
    case 'Neutre':
      return 'bg-surface-200 text-surface-700 border border-surface-300'
    case 'Négatif':
      return 'bg-red-100 text-red-700 border border-red-200'
    default:
      return 'bg-surface-200 text-surface-700'
  }
}

function getLLMBadgeColor(llm: string) {
  switch (llm) {
    case 'ChatGPT':
      return 'bg-green-100 text-green-700 border border-green-200'
    case 'Perplexity':
      return 'bg-purple-100 text-purple-700 border border-purple-200'
    case 'Claude':
      return 'bg-amber-100 text-amber-700 border border-amber-200'
    case 'Gemini':
      return 'bg-blue-100 text-blue-700 border border-blue-200'
    default:
      return 'bg-surface-200 text-surface-700'
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-500/10 text-red-700 border-red-200'
    case 'MEDIUM':
      return 'bg-orange-500/10 text-orange-700 border-orange-200'
    case 'LOW':
      return 'bg-blue-500/10 text-blue-700 border-blue-200'
    default:
      return 'bg-surface-200 text-surface-700'
  }
}

export default function AIVisibilityPage() {
  const { checkAccess } = usePlan()
  const [timeRange, setTimeRange] = useState('90j')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date')

  // Feature gating: AI Visibility is Pro+ only
  if (!checkAccess('aiVisibility')) {
    return (
      <div className="space-y-8 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">AI Visibility</h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Suivez votre visibilite dans les reponses des IA generatives
          </p>
        </div>
        <UpgradePrompt feature="aiVisibility" requiredPlan="professionnel" />
      </div>
    )
  }

  const filteredQueries = mentionedQueries.filter((q) =>
    q.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.llm.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sortedQueries = [...filteredQueries].sort((a, b) => {
    if (sortBy === 'position') {
      if (!a.position) return 1
      if (!b.position) return -1
      return parseInt(a.position) - parseInt(b.position)
    }
    return 0
  })

  return (
    <div className="space-y-8 pb-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-brand-400 to-brand-600 rounded-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-surface-950 dark:text-surface-50">Visibilité IA</h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">
            Surveillez et optimisez votre présence dans les réponses des moteurs IA
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
            <Calendar className="h-4 w-4 text-surface-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent text-sm font-medium text-surface-900 dark:text-surface-50 outline-none cursor-pointer"
            >
              <option value="7j">7 derniers jours</option>
              <option value="30j">30 derniers jours</option>
              <option value="90j">90 derniers jours</option>
              <option value="6m">6 derniers mois</option>
              <option value="12m">12 derniers mois</option>
            </select>
          </div>
          <button className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 text-white font-medium hover:shadow-lg hover:from-brand-600 hover:to-brand-700 transition-all">
            Lancer une analyse
          </button>
        </div>
      </div>

      {/* Top Stats Row - 5 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Global Score Card */}
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-md transition-shadow">
          <div className="space-y-4">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Score Global</p>
            <div className="flex items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    className="text-surface-200 dark:text-surface-700"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${(64 / 100) * 282.7} 282.7`}
                    strokeLinecap="round"
                    className="text-brand-500 transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">64</p>
                    <p className="text-xs text-surface-500">/100</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Mentions Card */}
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Mentions Totales</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">258</p>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-accent-600" />
              <p className="text-xs font-medium text-accent-600 dark:text-accent-500">+34 cette semaine</p>
            </div>
          </div>
        </div>

        {/* Positive Sentiment Card */}
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Sentiment Positif</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">78%</p>
            <div className="w-full h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* LLM Coverage Card */}
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">LLM Couverts</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">4/4</p>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" title="ChatGPT" />
              <div className="w-2 h-2 rounded-full bg-purple-500" title="Perplexity" />
              <div className="w-2 h-2 rounded-full bg-amber-500" title="Claude" />
              <div className="w-2 h-2 rounded-full bg-blue-500" title="Gemini" />
            </div>
          </div>
        </div>

        {/* Monitored Queries Card */}
        <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 hover:shadow-md transition-shadow">
          <div className="space-y-3">
            <p className="text-sm font-medium text-surface-600 dark:text-surface-400">Requêtes Surveillées</p>
            <p className="text-3xl font-bold text-surface-900 dark:text-surface-50">156</p>
            <p className="text-xs text-accent-600 dark:text-accent-500 font-medium">Actives</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Evolution Chart Section */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
                  Évolution de la visibilité
                </h2>
                <p className="text-xs text-surface-500 mt-1">Mentions par LLM sur les 9 derniers mois</p>
              </div>
              <div className="flex gap-2">
                {['7j', '30j', '90j', '6m', '12m'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={cn(
                      'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                      timeRange === range
                        ? 'bg-brand-500 text-white'
                        : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-700'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={aiVisibilityChartData}>
                <defs>
                  <linearGradient id="colorChatGPT" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPerplexity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorClaude" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-surface-200 dark:text-surface-700"
                />
                <XAxis
                  dataKey="month"
                  stroke="currentColor"
                  className="text-surface-500 dark:text-surface-400"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="currentColor"
                  className="text-surface-500 dark:text-surface-400"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(229, 229, 229)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                  labelStyle={{ color: '#000' }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="line"
                />
                <Area
                  type="monotone"
                  dataKey="chatgpt"
                  stackId="1"
                  stroke="#22c55e"
                  fill="url(#colorChatGPT)"
                  name="ChatGPT"
                />
                <Area
                  type="monotone"
                  dataKey="perplexity"
                  stackId="1"
                  stroke="#a855f7"
                  fill="url(#colorPerplexity)"
                  name="Perplexity"
                />
                <Area
                  type="monotone"
                  dataKey="claude"
                  stackId="1"
                  stroke="#f59e0b"
                  fill="url(#colorClaude)"
                  name="Claude"
                />
                <Area
                  type="monotone"
                  dataKey="gemini"
                  stackId="1"
                  stroke="#06b6d4"
                  fill="url(#colorGemini)"
                  name="Gemini"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Queries Table Section */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6 overflow-hidden">
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
                  Requêtes où vous êtes mentionné
                </h2>
                <span className="text-xs text-surface-500 bg-surface-200 dark:bg-surface-800 px-2.5 py-1 rounded-full font-medium">
                  {sortedQueries.length} requêtes
                </span>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
                  <Search className="h-4 w-4 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Rechercher une requête..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-sm outline-none text-surface-900 dark:text-surface-50 placeholder-surface-400"
                  />
                </div>
                <button className="p-2.5 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                  <Filter className="h-4 w-4 text-surface-600 dark:text-surface-400" />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      Requête
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      LLM
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      Position
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      Sentiment
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      Concurrents
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-surface-900 dark:text-surface-100">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                  {sortedQueries.map((query) => (
                    <tr
                      key={query.id}
                      className="hover:bg-surface-100 dark:hover:bg-surface-800/50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-brand-600 dark:text-brand-400 hover:underline">
                          {query.query}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            getLLMBadgeColor(query.llm)
                          )}
                        >
                          {query.llm}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {query.position ? (
                          <span className="font-semibold text-surface-900 dark:text-surface-50">
                            #{query.position}
                          </span>
                        ) : (
                          <span className="text-surface-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
                            getSentimentBadgeColor(query.sentiment)
                          )}
                        >
                          {query.sentiment === 'Positif' && '👍'}
                          {query.sentiment === 'Neutre' && '→'}
                          {query.sentiment === 'Négatif' && '👎'}
                          {query.sentiment}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-surface-600 dark:text-surface-400">
                        {query.competitors}
                      </td>
                      <td className="py-3 px-4 text-xs text-surface-500">
                        {query.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Score par LLM */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">
              Score par LLM
            </h3>
            <div className="space-y-4">
              {llmScores.map((llm) => (
                <div key={llm.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          llm.color === 'red' && 'bg-green-500',
                          llm.color === 'blue' && 'bg-purple-500',
                          llm.color === 'amber' && 'bg-amber-500',
                          llm.color === 'teal' && 'bg-blue-500'
                        )}
                      />
                      <span className="font-medium text-surface-900 dark:text-surface-50">
                        {llm.name}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-surface-900 dark:text-surface-50">
                      {llm.score}/100
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        llm.color === 'red' && 'bg-green-500',
                        llm.color === 'blue' && 'bg-purple-500',
                        llm.color === 'amber' && 'bg-amber-500',
                        llm.color === 'teal' && 'bg-blue-500'
                      )}
                      style={{ width: `${llm.score}%` }}
                    />
                  </div>
                  <div className="flex justify-end">
                    {llm.change > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-accent-600 dark:text-accent-500 font-medium">
                        <ArrowUpRight className="h-3 w-3" />
                        +{llm.change}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-red-600 dark:text-red-500 font-medium">
                        <ArrowDownRight className="h-3 w-3" />
                        {llm.change}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">
              Recommandations IA
            </h3>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800/50 p-3 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold border',
                        getPriorityColor(rec.priority)
                      )}
                    >
                      {rec.priority}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-surface-900 dark:text-surface-100 leading-tight">
                        {rec.title}
                      </p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1.5 leading-snug">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Competitors */}
          <div className="rounded-lg border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 p-6">
            <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50 mb-4">
              Concurrents dans les IA
            </h3>
            <div className="space-y-3">
              {topCompetitors.map((competitor, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
                        {competitor.name}
                      </p>
                      <p className="text-xs text-surface-500">
                        {formatNumber(competitor.mentions)} mentions
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={cn('text-sm font-bold', getScoreColor(competitor.score))}>
                        {competitor.score}
                      </p>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-200 dark:bg-surface-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
                      style={{ width: `${(competitor.score / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
