'use client'

import { useSession } from 'next-auth/react'
import { useState, useMemo } from 'react'
import { cn, formatNumber, formatPercent, getScoreColor, getScoreBg } from '@/lib/utils'
import { useWebsite } from '@/contexts/WebsiteContext'
import { ExportMenu } from '@/components/shared/ExportMenu'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as PieChartComponent,
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Gauge,
  Target,
  Link,
  Sparkles,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Activity,
  Clock,
  Calendar,
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
  Grid3x3,
  Lightbulb,
  ListTodo,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

// ============================================
// DEMO DATA GENERATORS
// ============================================

function generateScoreHistory(days: number = 30) {
  const data = []
  const baseScore = 72
  for (let i = 0; i < days; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (days - i))
    const variation = Math.sin(i / 3) * 5 + Math.random() * 3
    data.push({
      date: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      score: Math.max(50, Math.min(95, baseScore + variation + i * 0.3)),
      fullDate: date,
    })
  }
  return data
}

function generateKeywordDistribution() {
  return [
    { position: '1-3', count: 24, fill: '#10b981' },
    { position: '4-10', count: 35, fill: '#3b82f6' },
    { position: '11-20', count: 52, fill: '#f59e0b' },
    { position: '21-50', count: 89, fill: '#ef4444' },
  ]
}

function generateActivityFeed() {
  const activities = [
    {
      id: 1,
      type: 'audit',
      title: 'Audit complet du site',
      description: 'Score: 72/100',
      time: 'Il y a 2 heures',
      icon: CheckCircle2,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      id: 2,
      type: 'ranking',
      title: 'Nouveau classement détecté',
      description: 'Position 5 pour "agence web"',
      time: 'Il y a 6 heures',
      icon: TrendingUp,
      color: 'bg-green-500/10 text-green-600',
    },
    {
      id: 3,
      type: 'backlink',
      title: 'Nouveau lien retour',
      description: 'De blog.example.com',
      time: 'Il y a 1 jour',
      icon: Link,
      color: 'bg-purple-500/10 text-purple-600',
    },
    {
      id: 4,
      type: 'issue',
      title: 'Problème détecté',
      description: '3 URLs non indexées',
      time: 'Il y a 2 jours',
      icon: AlertCircle,
      color: 'bg-amber-500/10 text-amber-600',
    },
    {
      id: 5,
      type: 'update',
      title: 'Contenu mis à jour',
      description: '12 pages modifiées',
      time: 'Il y a 3 jours',
      icon: RefreshCw,
      color: 'bg-indigo-500/10 text-indigo-600',
    },
  ]
  return activities
}

function generateRecentAudits() {
  return [
    {
      id: 1,
      date: '31 mars 2024',
      score: 72,
      grade: 'B',
      issues: { critical: 2, high: 5, medium: 12 },
      time: 'Il y a 2 heures',
    },
    {
      id: 2,
      date: '30 mars 2024',
      score: 70,
      grade: 'B',
      issues: { critical: 2, high: 6, medium: 14 },
      time: 'Il y a 1 jour',
    },
    {
      id: 3,
      date: '29 mars 2024',
      score: 68,
      grade: 'C',
      issues: { critical: 3, high: 7, medium: 16 },
      time: 'Il y a 2 jours',
    },
    {
      id: 4,
      date: '28 mars 2024',
      score: 65,
      grade: 'C',
      issues: { critical: 4, high: 8, medium: 18 },
      time: 'Il y a 3 jours',
    },
    {
      id: 5,
      date: '27 mars 2024',
      score: 62,
      grade: 'C',
      issues: { critical: 5, high: 10, medium: 20 },
      time: 'Il y a 4 jours',
    },
  ]
}

function generateAIRecommendations() {
  return [
    {
      id: 1,
      title: 'Optimiser les balises meta description',
      description: '23 pages sans description optimisée',
      priority: 'critical',
      impact: 15,
      effort: 'easy',
      category: 'On-page SEO',
    },
    {
      id: 2,
      title: 'Améliorer la vitesse du site',
      description: 'Réduire le FCP à moins de 1.8s',
      priority: 'high',
      impact: 12,
      effort: 'medium',
      category: 'Performance',
    },
    {
      id: 3,
      title: 'Créer du contenu pour mots-clés sans couverture',
      description: '45 opportunités identifiées',
      priority: 'high',
      impact: 25,
      effort: 'hard',
      category: 'Stratégie contenu',
    },
    {
      id: 4,
      title: 'Corriger les erreurs d\'indexation',
      description: '12 URLs bloquées par robots.txt',
      priority: 'high',
      impact: 8,
      effort: 'easy',
      category: 'Technique',
    },
    {
      id: 5,
      title: 'Développer une stratégie de backlinks',
      description: 'Acquérir 50 liens de qualité',
      priority: 'medium',
      impact: 20,
      effort: 'hard',
      category: 'Autorité',
    },
  ]
}

function generateChecklistItems() {
  return [
    { id: 1, title: 'Installer Google Analytics', completed: true },
    { id: 2, title: 'Configurer Google Search Console', completed: true },
    { id: 3, title: 'Mettre en place SSL/HTTPS', completed: true },
    { id: 4, title: 'Créer sitemap.xml', completed: true },
    { id: 5, title: 'Optimiser robots.txt', completed: false },
    { id: 6, title: 'Corriger les erreurs 404', completed: false },
    { id: 7, title: 'Ajouter données structurées', completed: false },
    { id: 8, title: 'Optimiser images', completed: false },
    { id: 9, title: 'Réduire CLS', completed: false },
    { id: 10, title: 'Améliorer LCP', completed: false },
  ]
}

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
        { id: 'ssl', name: 'SSL/Sécurité', isPro: false },
      ],
    },
    {
      id: 'keywords',
      name: 'Mots-clés',
      icon: Search,
      tools: [
        { id: 'keyword-research', name: 'Recherche Mots-clés', isPro: true },
        { id: 'rank-tracker', name: 'Classements', isPro: false },
        { id: 'long-tail', name: 'Longue traîne', isPro: true },
        { id: 'keyword-gap', name: 'Écart Mots-clés', isPro: true },
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
        { id: 'link-gap', name: 'Écart de Liens', isPro: true },
        { id: 'competitor-links', name: 'Liens Concurrents', isPro: true },
        { id: 'link-quality', name: 'Qualité des Liens', isPro: true },
        { id: 'anchor-text', name: 'Anchor Text', isPro: true },
        { id: 'link-building', name: 'Opportunités', isPro: true },
      ],
    },
    {
      id: 'content',
      name: 'Contenu',
      icon: Settings,
      tools: [
        { id: 'content-audit', name: 'Audit Contenu', isPro: false },
        { id: 'content-gap', name: 'Écart Contenu', isPro: true },
        { id: 'ai-content', name: 'Générateur IA', isPro: true },
        { id: 'readability', name: 'Lisibilité', isPro: false },
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
        { id: 'competitor-keywords', name: 'Mots-clés', isPro: true },
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
        { id: 'local-keywords', name: 'Mots-clés Locaux', isPro: true },
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
      name: 'Visibilité',
      icon: Eye,
      tools: [
        { id: 'ai-visibility', name: 'Visibilité IA', isPro: true },
        { id: 'featured-snippets', name: 'Featured Snippets', isPro: true },
        { id: 'serp-features', name: 'Fonctionnalités SERP', isPro: true },
        { id: 'brand-monitoring', name: 'Marque', isPro: true },
        { id: 'visibility-score', name: 'Score Visibilité', isPro: false },
        { id: 'visibility-history', name: 'Historique', isPro: false },
      ],
    },
    {
      id: 'utilities',
      name: 'Utilitaires',
      icon: Sparkles,
      tools: [
        { id: 'url-inspector', name: 'Inspecteur URL', isPro: false },
        { id: 'schema-validator', name: 'Schéma Validation', isPro: false },
        { id: 'redirect-checker', name: 'Redirections', isPro: false },
        { id: 'api-tools', name: 'API Tools', isPro: true },
        { id: 'bulk-tools', name: 'Outils Batch', isPro: true },
        { id: 'integrations', name: 'Intégrations', isPro: true },
      ],
    },
  ]
  return categories
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

function ScoreGauge({ score = 72, grade = 'B' }: { score?: number; grade?: string }) {
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
      default:
        return 'bg-red-500/20 text-red-400'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgb(55, 65, 81)"
            strokeWidth="8"
          />
          {/* Progress circle */}
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
          <span className={cn('text-5xl font-bold', getColorForScore(score))}>{score}</span>
          <span className="text-surface-400 text-sm">/100</span>
        </div>
      </div>
      <div className={cn('px-4 py-2 rounded-full font-bold text-lg', getGradeBg(grade))}>
        Note: {grade}
      </div>
    </div>
  )
}

function AuditRow({
  audit,
}: {
  audit: {
    id: number
    date: string
    score: number
    grade: string
    issues: { critical: number; high: number; medium: number }
    time: string
  }
}) {
  const getTrendIcon = (current: number, index: number) => {
    if (index === 0) return null
    const prev = generateRecentAudits()[index + 1].score
    if (current > prev) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (current < prev) return <TrendingDown className="w-4 h-4 text-red-500" />
    return null
  }

  const getScoreColor = (s: number) => {
    if (s >= 80) return 'bg-emerald-500/10 text-emerald-400'
    if (s >= 60) return 'bg-amber-500/10 text-amber-400'
    if (s >= 40) return 'bg-orange-500/10 text-orange-400'
    return 'bg-red-500/10 text-red-400'
  }

  return (
    <tr className="border-b border-surface-700 hover:bg-surface-800/50 transition-colors">
      <td className="px-6 py-4 text-sm text-surface-200">{audit.date}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className={cn('px-3 py-1 rounded-full font-bold text-sm', getScoreColor(audit.score))}>
            {audit.score}
          </span>
          {getTrendIcon(audit.score, audit.id)}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-surface-300">
        <span className="px-2 py-1 bg-surface-700 rounded font-medium">{audit.grade}</span>
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center gap-3">
          <span className="text-red-400 font-semibold">{audit.issues.critical}</span>
          <span className="text-amber-400 font-semibold">{audit.issues.high}</span>
          <span className="text-blue-400 font-semibold">{audit.issues.medium}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-surface-400">{audit.time}</td>
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

function ActivityItem({
  activity,
}: {
  activity: {
    id: number
    type: string
    title: string
    description: string
    time: string
    icon: React.ComponentType<any>
    color: string
  }
}) {
  const Icon = activity.icon
  return (
    <div className="flex gap-4 pb-4 border-b border-surface-700 last:border-b-0 last:pb-0">
      <div className={cn('p-2 rounded-lg h-fit', activity.color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-surface-200">{activity.title}</h4>
        <p className="text-xs text-surface-400 mt-1">{activity.description}</p>
        <p className="text-xs text-surface-500 mt-2">{activity.time}</p>
      </div>
    </div>
  )
}

// ============================================
// MAIN DASHBOARD
// ============================================

export default function DashboardPage() {
  const { data: session } = useSession()
  const { selectedWebsite } = useWebsite()
  const [dateRange, setDateRange] = useState('30')

  const scoreHistory = useMemo(() => generateScoreHistory(30), [])
  const keywordDistribution = useMemo(() => generateKeywordDistribution(), [])
  const recentAudits = useMemo(() => generateRecentAudits(), [])
  const recommendations = useMemo(() => generateAIRecommendations(), [])
  const activityFeed = useMemo(() => generateActivityFeed(), [])
  const checklistItems = useMemo(() => generateChecklistItems(), [])
  const toolCategories = useMemo(() => generateToolsByCategory(), [])

  const completedChecklist = checklistItems.filter(item => item.completed).length
  const checklistPercent = Math.round((completedChecklist / checklistItems.length) * 100)

  const allTools = toolCategories.flatMap(cat => cat.tools).length

  // Demo data for KPIs
  const currentScore = 72
  const kpisData = [
    { title: 'Score SEO', value: currentScore, unit: '/100', trend: 'up', percent: 2.5, icon: Gauge, color: 'bg-blue-500' },
    { title: 'Mots-clés', value: 200, unit: 'tracés', trend: 'up', percent: 8.3, icon: Search, color: 'bg-green-500' },
    { title: 'Backlinks', value: '1.2K', unit: '', trend: 'up', percent: 5.2, icon: Link, color: 'bg-purple-500' },
    { title: 'Score Performance', value: 68, unit: '/100', trend: 'down', percent: -1.5, icon: Zap, color: 'bg-amber-500' },
    { title: 'Visibilité IA', value: 45, unit: '%', trend: 'up', percent: 12.1, icon: Sparkles, color: 'bg-indigo-500' },
    { title: 'Trafic Estimé', value: '12.5K', unit: '/mois', trend: 'up', percent: 18.7, icon: Users, color: 'bg-cyan-500' },
  ]

  if (!selectedWebsite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Globe className="w-16 h-16 text-surface-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-surface-200 mb-2">Aucun site sélectionné</h2>
          <p className="text-surface-400">Veuillez sélectionner ou ajouter un site pour commencer</p>
        </div>
      </div>
    )
  }

  const exportData = {
    title: 'Dashboard SEO Nexus',
    sections: [
      { title: 'KPIs', content: `Score: ${currentScore}/100` },
      { title: 'Auditist Récents', content: recentAudits.length + ' audits' },
      { title: 'Recommandations', content: recommendations.length + ' recommandations' },
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
                    Dernier audit: {formatDistanceToNow(new Date(recentAudits[0].time), { locale: fr, addSuffix: true })}
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
                <option value="365">1 année</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <ExportMenu
                data={exportData}
                variant="compact"
                label="Exporter"
              />
              <button className="p-2 hover:bg-surface-800 rounded-lg transition-colors text-surface-400 hover:text-surface-200">
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
                trend={kpi.trend as any}
                trendPercent={kpi.percent}
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
            <ScoreGauge score={currentScore} grade="B" />
          </div>

          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Évolution (30 jours)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreHistory}>
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
                  formatter={(value) => [`${Number(value).toFixed(1)}`, 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  dot={false}
                  strokeWidth={3}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
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

        {/* EVOLUTION CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Score Evolution */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Évolution du Score</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" />
                <XAxis
                  dataKey="date"
                  stroke="rgb(107, 114, 128)"
                  style={{ fontSize: '11px' }}
                />
                <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(55, 65, 81)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Keyword Positions Distribution */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6">
            <h2 className="text-lg font-bold text-surface-100 mb-6">Distribution Positions</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={keywordDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgb(55, 65, 81)" />
                <XAxis
                  dataKey="position"
                  stroke="rgb(107, 114, 128)"
                  style={{ fontSize: '11px' }}
                />
                <YAxis stroke="rgb(107, 114, 128)" style={{ fontSize: '11px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(17, 24, 39)',
                    border: '1px solid rgb(55, 65, 81)',
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {keywordDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT AUDITS TABLE */}
        <div className="bg-surface-800 rounded-lg border border-surface-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-700">
            <h2 className="text-lg font-bold text-surface-100">Audits Récents</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-900 border-b border-surface-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Note</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">
                    Problèmes <span className="text-red-500">(C)</span> <span className="text-amber-500">(H)</span> <span className="text-blue-500">(M)</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-surface-400 uppercase">Heure</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recentAudits.map((audit, idx) => (
                  <AuditRow key={audit.id} audit={audit} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI ADVISOR PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-surface-800 rounded-lg border border-surface-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                Recommandations IA (Top 5)
              </h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-semibold flex items-center gap-1">
                Voir tout <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <RecommendationCard key={rec.id} rec={rec} />
              ))}
            </div>
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
                {completedChecklist} sur {checklistItems.length} éléments complétés
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
                Voir les {checklistItems.length} éléments
              </p>
            </div>
          </div>
        </div>

        {/* TOOL GRID */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-surface-100">Accès Outils ({allTools})</h2>
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
              Activité Récente
            </h2>
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>

          {/* STATS SUMMARY */}
          <div className="bg-surface-800 rounded-lg border border-surface-700 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-surface-200 mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Pages indexées</span>
                  <span className="font-bold text-surface-200">1.247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Erreurs 404</span>
                  <span className="font-bold text-orange-400">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Redirections</span>
                  <span className="font-bold text-surface-200">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">Liens brisés</span>
                  <span className="font-bold text-red-400">8</span>
                </div>
              </div>
            </div>

            <div className="border-t border-surface-700 pt-6">
              <h3 className="text-sm font-bold text-surface-200 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-green-500" />
                Temps de Chargement
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">FCP</span>
                  <span className="font-bold text-surface-200">1.2s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">LCP</span>
                  <span className="font-bold text-surface-200">2.1s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-surface-400">CLS</span>
                  <span className="font-bold text-surface-200">0.05</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
