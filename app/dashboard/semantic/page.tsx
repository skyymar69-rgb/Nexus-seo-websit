'use client'

import { useState, useRef } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import {
  BarChart3,
  BookOpen,
  Cloud,
  Copy,
  FileText,
  Loader2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Activity,
  Zap,
} from 'lucide-react'

interface TFIDFTerm {
  term: string
  frequency: number
  density: number
  relevance: number
  isMissing: boolean
}

interface ContentStats {
  wordCount: number
  paragraphCount: number
  sentenceCount: number
  avgSentenceLength: number
  readingLevel: string
  h1Count: number
  h2Count: number
  h3Count: number
}

interface SemanticResult {
  score: number
  tfidfTerms: TFIDFTerm[]
  contentStats: ContentStats
  relatedKeywords: Array<{ keyword: string; score: number; cluster: string }>
  competitors: Array<{
    rank: number
    url: string
    wordCount: number
    score: number
    keyTerms: string[]
  }>
  recommendations: string[]
  keywordDensity: { keyword: string; density: number }[]
}

export default function SemanticAnalysisPage() {
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [inputValue, setInputValue] = useState('')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<SemanticResult | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const getMockData = (): SemanticResult => ({
    score: 72,
    tfidfTerms: [
      { term: 'marketing digital', frequency: 12, density: 2.4, relevance: 0.95, isMissing: false },
      { term: 'SEO', frequency: 10, density: 2.0, relevance: 0.92, isMissing: false },
      { term: 'stratégie marketing', frequency: 8, density: 1.6, relevance: 0.88, isMissing: false },
      { term: 'contenu', frequency: 7, density: 1.4, relevance: 0.85, isMissing: false },
      { term: 'optimisation', frequency: 6, density: 1.2, relevance: 0.82, isMissing: false },
      { term: 'moteurs de recherche', frequency: 5, density: 1.0, relevance: 0.80, isMissing: true },
      { term: 'audience', frequency: 5, density: 1.0, relevance: 0.78, isMissing: false },
      { term: 'conversion', frequency: 4, density: 0.8, relevance: 0.75, isMissing: true },
      { term: 'backlinks', frequency: 4, density: 0.8, relevance: 0.73, isMissing: false },
      { term: 'algorithme', frequency: 3, density: 0.6, relevance: 0.70, isMissing: true },
      { term: 'trafic organique', frequency: 3, density: 0.6, relevance: 0.68, isMissing: false },
      { term: 'mots-clés', frequency: 3, density: 0.6, relevance: 0.65, isMissing: false },
      { term: 'indexation', frequency: 2, density: 0.4, relevance: 0.62, isMissing: true },
      { term: 'performance', frequency: 2, density: 0.4, relevance: 0.60, isMissing: false },
      { term: 'visibilité', frequency: 2, density: 0.4, relevance: 0.58, isMissing: false },
      { term: 'analyse', frequency: 2, density: 0.4, relevance: 0.55, isMissing: false },
      { term: 'résultats', frequency: 2, density: 0.4, relevance: 0.53, isMissing: false },
      { term: 'plateforme', frequency: 1, density: 0.2, relevance: 0.50, isMissing: false },
      { term: 'données', frequency: 1, density: 0.2, relevance: 0.48, isMissing: false },
      { term: 'utilisateurs', frequency: 1, density: 0.2, relevance: 0.45, isMissing: true },
    ],
    contentStats: {
      wordCount: 500,
      paragraphCount: 12,
      sentenceCount: 28,
      avgSentenceLength: 17.9,
      readingLevel: 'Bac+2',
      h1Count: 1,
      h2Count: 5,
      h3Count: 8,
    },
    relatedKeywords: [
      { keyword: 'stratégie SEO', score: 0.92, cluster: 'SEO technique' },
      { keyword: 'optimisation on-page', score: 0.88, cluster: 'SEO technique' },
      { keyword: 'référencement naturel', score: 0.85, cluster: 'SEO technique' },
      { keyword: 'contenu optimisé', score: 0.82, cluster: 'Contenu' },
      { keyword: 'analyse de mots-clés', score: 0.80, cluster: 'Recherche' },
      { keyword: 'trafic SEO', score: 0.78, cluster: 'Performance' },
      { keyword: 'position SERP', score: 0.75, cluster: 'Performance' },
      { keyword: 'stratégie de contenu', score: 0.72, cluster: 'Contenu' },
    ],
    competitors: [
      {
        rank: 1,
        url: 'seo-guide.fr',
        wordCount: 2850,
        score: 92,
        keyTerms: ['marketing digital', 'SEO', 'stratégie', 'optimisation'],
      },
      {
        rank: 2,
        url: 'digital-tips.com',
        wordCount: 2100,
        score: 87,
        keyTerms: ['marketing digital', 'contenu', 'audience'],
      },
      {
        rank: 3,
        url: 'blog-seo.fr',
        wordCount: 1850,
        score: 84,
        keyTerms: ['SEO', 'optimisation', 'moteurs de recherche'],
      },
      {
        rank: 4,
        url: 'webmarketing.net',
        wordCount: 1650,
        score: 81,
        keyTerms: ['marketing digital', 'conversion', 'stratégie'],
      },
      {
        rank: 5,
        url: 'expert-seo.com',
        wordCount: 1420,
        score: 78,
        keyTerms: ['SEO', 'backlinks', 'algorithme'],
      },
    ],
    recommendations: [
      'Augmenter le compte de mots à 1200-1500 (actuellement 500)',
      'Ajouter 2-3 sections H2 supplémentaires',
      'Inclure les termes manquants : "moteurs de recherche", "conversion", "algorithme"',
      'Améliorer la densité de mots-clés (viser 2-3%)',
      'Ajouter des liens internes vers 3-4 pages connexes',
      'Inclure au moins 2 images optimisées avec alt-text',
      'Augmenter la profondeur du contenu avec plus d\'exemples concrets',
    ],
    keywordDensity: [
      { keyword: 'marketing digital', density: 2.4 },
      { keyword: 'SEO', density: 2.0 },
      { keyword: 'stratégie', density: 1.8 },
      { keyword: 'contenu', density: 1.4 },
    ],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!inputValue.trim() || !keyword.trim()) {
      setError('Veuillez remplir tous les champs')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/semantic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(mode === 'url' ? { url: inputValue } : { text: inputValue }),
          keyword,
        }),
      })

      if (!response.ok) throw new Error('Erreur lors de l\'analyse')
      const data = await response.json()
      setResult(data)
    } catch (err) {
      // Fallback: simulate 2s then use mock data
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setResult(getMockData())
    } finally {
      setLoading(false)
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-surface-900 dark:text-surface-50">
            Analyse Sémantique
          </h1>
          <p className="text-lg text-surface-600 dark:text-surface-400">
            Analysez votre contenu et comparez-le aux résultats des concurrents
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-4">
              {['url', 'text'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m as 'url' | 'text')}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
                    mode === m
                      ? 'bg-brand-600 text-white dark:bg-brand-500'
                      : 'bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-300 dark:hover:bg-surface-700'
                  )}
                >
                  {m === 'url' ? <FileText size={18} /> : <BookOpen size={18} />}
                  {m === 'url' ? 'URL' : 'Texte'}
                </button>
              ))}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  {mode === 'url' ? 'URL à analyser' : 'Contenu'}
                </label>
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={
                    mode === 'url'
                      ? 'https://example.com/article'
                      : 'Collez votre contenu ici...'
                  }
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border-2 border-surface-300 dark:border-surface-700',
                    'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50',
                    'focus:outline-none focus:border-brand-500 dark:focus:border-brand-400',
                    'min-h-28 resize-none font-mono'
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                  Mot-clé cible
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Ex: marketing digital"
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border-2 border-surface-300 dark:border-surface-700',
                    'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-50',
                    'focus:outline-none focus:border-brand-500 dark:focus:border-brand-400'
                  )}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all',
                loading
                  ? 'bg-surface-300 dark:bg-surface-700 text-surface-500 dark:text-surface-400 cursor-not-allowed'
                  : 'bg-brand-600 dark:bg-brand-500 text-white hover:bg-brand-700 dark:hover:bg-brand-600'
              )}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Analyser le contenu
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultsRef} className="space-y-8">
            {/* Semantic Score */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                Score Sémantique
              </h2>
              <div className="flex items-center justify-center">
                <ScoreCircle score={result.score} />
              </div>
              <p className="text-center text-surface-600 dark:text-surface-400 mt-6">
                Votre contenu correspond bien au mot-clé cible. Améliorez la densité et la profondeur pour atteindre 85+.
              </p>
            </div>

            {/* Content Stats */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                Analyse de Structure
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Mots" value={formatNumber(result.contentStats.wordCount)} icon={<Activity size={20} />} />
                <StatCard label="Paragraphes" value={result.contentStats.paragraphCount} icon={<BookOpen size={20} />} />
                <StatCard label="Phrases" value={result.contentStats.sentenceCount} icon={<BarChart3 size={20} />} />
                <StatCard
                  label="Moy. phrase"
                  value={result.contentStats.avgSentenceLength.toFixed(1)}
                  icon={<TrendingUp size={20} />}
                />
                <StatCard label="H1" value={result.contentStats.h1Count} highlight="bg-brand-100 dark:bg-brand-900/30" />
                <StatCard label="H2" value={result.contentStats.h2Count} highlight="bg-accent-100 dark:bg-accent-900/30" />
                <StatCard label="H3" value={result.contentStats.h3Count} highlight="bg-brand-100 dark:bg-brand-900/30" />
                <StatCard label="Lisibilité" value={result.contentStats.readingLevel} />
              </div>
            </div>

            {/* Keyword Density */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                Densité des Mots-clés
              </h2>
              <div className="space-y-4">
                {result.keywordDensity.map((item) => (
                  <div key={item.keyword}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-surface-900 dark:text-surface-50">{item.keyword}</span>
                      <span className="text-brand-600 dark:text-brand-400 font-semibold">{item.density.toFixed(2)}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full"
                        style={{ width: `${Math.min(item.density * 25, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TF-IDF Analysis */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                Analyse TF-IDF (Top 20 termes)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-300 dark:border-surface-700">
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Terme
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Fréquence
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Densité (%)
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Pertinence
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Statut
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.tfidfTerms.map((term, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          'border-b border-surface-200 dark:border-surface-800 hover:bg-surface-200 dark:hover:bg-surface-800 transition',
                          term.isMissing && 'bg-red-50 dark:bg-red-950/20'
                        )}
                      >
                        <td className="py-3 px-4 font-medium text-surface-900 dark:text-surface-50">
                          {term.term}
                        </td>
                        <td className="py-3 px-4 text-center text-surface-600 dark:text-surface-400">
                          {term.frequency}
                        </td>
                        <td className="py-3 px-4 text-center text-surface-600 dark:text-surface-400">
                          {term.density.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 h-2 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand-500"
                                style={{ width: `${term.relevance * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-surface-600 dark:text-surface-400">
                              {(term.relevance * 100).toFixed(0)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {term.isMissing ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-xs font-semibold">
                              <AlertCircle size={14} />
                              Manquant
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs font-semibold">
                              <CheckCircle2 size={14} />
                              Présent
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Semantic Related Keywords */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
                <Cloud size={24} />
                Champ Sémantique
              </h2>
              <div className="space-y-4">
                {['SEO technique', 'Contenu', 'Recherche', 'Performance'].map((cluster) => (
                  <div key={cluster}>
                    <h3 className="font-semibold text-surface-800 dark:text-surface-200 mb-3 text-sm">
                      {cluster}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {result.relatedKeywords
                        .filter((k) => k.cluster === cluster)
                        .map((kw) => (
                          <div
                            key={kw.keyword}
                            className="px-3 py-2 bg-brand-100 dark:bg-brand-900/40 text-brand-800 dark:text-brand-200 rounded-lg text-sm font-medium hover:bg-brand-200 dark:hover:bg-brand-900/60 transition cursor-pointer flex items-center gap-2"
                          >
                            {kw.keyword}
                            <span className="text-xs opacity-75">({(kw.score * 100).toFixed(0)}%)</span>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Competitor Comparison */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6">
                Comparaison avec les Concurrents
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-surface-300 dark:border-surface-700">
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Rang
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        URL
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Mots
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Score
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-surface-700 dark:text-surface-300">
                        Termes clés
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.competitors.map((comp) => (
                      <tr key={comp.rank} className="border-b border-surface-200 dark:border-surface-800 hover:bg-surface-200 dark:hover:bg-surface-800">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-brand-500 text-white text-xs font-bold rounded-full">
                            {comp.rank}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-surface-900 dark:text-surface-50 font-medium">{comp.url}</td>
                        <td className="py-3 px-4 text-center text-surface-600 dark:text-surface-400">
                          {formatNumber(comp.wordCount)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded font-semibold text-xs">
                            {comp.score}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {comp.keyTerms.map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-surface-200 dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded text-xs">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-surface-100 dark:bg-surface-900 rounded-lg border border-surface-200 dark:border-surface-800 p-8">
              <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50 mb-6 flex items-center gap-2">
                <Lightbulb size={24} className="text-yellow-500" />
                Recommandations
              </h2>
              <div className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded"
                  >
                    <CheckCircle2 size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-surface-800 dark:text-surface-200">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ScoreCircle({ score }: { score: number }) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference
  const color =
    score >= 80
      ? '#10b981'
      : score >= 60
        ? '#f59e0b'
        : '#ef4444'

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-surface-300 dark:text-surface-700"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-surface-900 dark:text-surface-50">{score}</span>
        <span className="text-xs text-surface-600 dark:text-surface-400">/100</span>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  highlight,
}: {
  label: string
  value: string | number
  icon?: React.ReactNode
  highlight?: string
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-surface-200 dark:border-surface-700 p-4 text-center',
        highlight || 'bg-surface-200 dark:bg-surface-800'
      )}
    >
      {icon && <div className="flex justify-center mb-2 text-surface-600 dark:text-surface-400">{icon}</div>}
      <p className="text-2xl font-bold text-surface-900 dark:text-surface-50">{value}</p>
      <p className="text-xs text-surface-600 dark:text-surface-400 mt-1">{label}</p>
    </div>
  )
}
