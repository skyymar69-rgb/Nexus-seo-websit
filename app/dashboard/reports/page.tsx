'use client'

import { useState } from 'react'
import {
  BarChart3,
  Plus,
  Download,
  Trash2,
  Clock,
  Printer,
  Share2,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Filter,
  Calendar,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

type ReportType = 'complete' | 'audit' | 'keywords' | 'backlinks' | 'performance' | 'ai'
type DateRange = '7j' | '30j' | '90j' | 'custom'
type ReportFormat = 'pdf' | 'markdown' | 'csv' | 'json' | 'html'

interface ReportSection {
  id: string
  label: string
  selected: boolean
}

interface GeneratedReport {
  id: string
  name: string
  type: ReportType
  format: ReportFormat
  date: string
  status: 'completed' | 'in_progress'
}

// Demo data
const demoKeywordData = [
  { name: 'SEO strategy', position: 3, change: 1, volume: 8900 },
  { name: 'Digital marketing', position: 5, change: -2, volume: 12100 },
  { name: 'Content marketing', position: 2, change: 2, volume: 18200 },
  { name: 'Link building', position: 7, change: 0, volume: 4400 },
  { name: 'Technical SEO', position: 1, change: 0, volume: 9900 },
]

const demoPerformanceData = [
  { week: 'W1', traffic: 4200, clicks: 2400, impressions: 9200 },
  { week: 'W2', traffic: 4800, clicks: 2210, impressions: 9800 },
  { week: 'W3', traffic: 5100, clicks: 2290, impressions: 10200 },
  { week: 'W4', traffic: 5800, clicks: 2000, impressions: 10800 },
]

const demoBacklinkData = [
  { domain: 'techcrunch.com', authority: 92, type: 'Industry News' },
  { domain: 'medium.com', authority: 91, type: 'Blog' },
  { domain: 'github.com', authority: 90, type: 'Developer' },
  { domain: 'linkedin.com', authority: 88, type: 'Social' },
]

const demoIssues = [
  { id: 1, title: 'Missing meta descriptions', severity: 'high', count: 12 },
  { id: 2, title: 'Slow page speed (>3s)', severity: 'high', count: 8 },
  { id: 3, title: 'Missing alt text on images', severity: 'medium', count: 34 },
  { id: 4, title: 'Duplicate content detected', severity: 'medium', count: 5 },
  { id: 5, title: 'Mobile usability issues', severity: 'low', count: 2 },
]

const reportTemplates = [
  {
    id: 'template1',
    name: 'Client Report',
    description: 'Executive summary + key metrics + recommendations',
  },
  {
    id: 'template2',
    name: 'Technical Audit',
    description: 'Detailed technical issues + performance + fixes',
  },
  {
    id: 'template3',
    name: 'Monthly Progress',
    description: 'Trends + changes + next steps',
  },
]

const generatedReports: GeneratedReport[] = [
  {
    id: '1',
    name: 'Rapport SEO Complet - Mars 2026',
    type: 'complete',
    format: 'pdf',
    date: '28 mar 2026',
    status: 'completed',
  },
  {
    id: '2',
    name: 'Audit SEO S12',
    type: 'audit',
    format: 'pdf',
    date: '25 mar 2026',
    status: 'completed',
  },
  {
    id: '3',
    name: 'Keywords Performance Q1',
    type: 'keywords',
    format: 'csv',
    date: '20 mar 2026',
    status: 'completed',
  },
]

const scheduledReports = [
  {
    id: 'sched1',
    name: 'Rapport hebdomadaire',
    schedule: 'Chaque lundi à 09:00',
    format: 'PDF',
    enabled: true,
  },
  {
    id: 'sched2',
    name: 'Rapport mensuel',
    schedule: 'Le 1er du mois',
    format: 'PDF',
    enabled: true,
  },
  {
    id: 'sched3',
    name: 'Audit technique trimestriel',
    schedule: 'Le 1er de chaque trimestre',
    format: 'HTML',
    enabled: false,
  },
]

function ReportBuilder() {
  const [reportType, setReportType] = useState<ReportType>('complete')
  const [dateRange, setDateRange] = useState<DateRange>('30j')
  const [format, setFormat] = useState<ReportFormat>('pdf')
  const [sections, setSections] = useState<ReportSection[]>([
    { id: 'summary', label: 'Executive Summary', selected: true },
    { id: 'audit', label: 'Audit', selected: true },
    { id: 'keywords', label: 'Mots-clés', selected: true },
    { id: 'backlinks', label: 'Backlinks', selected: true },
    { id: 'performance', label: 'Performance', selected: true },
    { id: 'ai', label: 'AI Visibility', selected: true },
    { id: 'recommendations', label: 'Recommandations', selected: true },
    { id: 'action', label: 'Plan d\'action', selected: true },
  ])

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    )
  }

  return (
    <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-surface-100">Générateur de rapport</h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Report Type */}
        <div>
          <label className="text-sm font-semibold text-surface-200 mb-2 block">
            Type de rapport
          </label>
          <div className="space-y-2">
            {[
              { value: 'complete' as ReportType, label: 'Complet' },
              { value: 'audit' as ReportType, label: 'Audit' },
              { value: 'keywords' as ReportType, label: 'Mots-clés' },
              { value: 'backlinks' as ReportType, label: 'Backlinks' },
              { value: 'performance' as ReportType, label: 'Performance' },
              { value: 'ai' as ReportType, label: 'IA' },
            ].map((type) => (
              <label key={type.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="reportType"
                  value={type.value}
                  checked={reportType === type.value}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-surface-300">{type.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="text-sm font-semibold text-surface-200 mb-2 block">
            Période
          </label>
          <div className="space-y-2">
            {[
              { value: '7j' as DateRange, label: '7 derniers jours' },
              { value: '30j' as DateRange, label: '30 derniers jours' },
              { value: '90j' as DateRange, label: '90 derniers jours' },
              { value: 'custom' as DateRange, label: 'Personnalisé' },
            ].map((range) => (
              <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dateRange"
                  value={range.value}
                  checked={dateRange === range.value}
                  onChange={(e) => setDateRange(e.target.value as DateRange)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-surface-300">{range.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sections */}
      <div>
        <label className="text-sm font-semibold text-surface-200 mb-3 block">
          Sections à inclure
        </label>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((section) => (
            <label
              key={section.id}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-surface-700 hover:border-surface-600 transition-colors"
            >
              <input
                type="checkbox"
                checked={section.selected}
                onChange={() => toggleSection(section.id)}
                className="w-4 h-4"
              />
              <span className="text-sm text-surface-300">{section.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Format */}
      <div>
        <label className="text-sm font-semibold text-surface-200 mb-2 block">
          Format de sortie
        </label>
        <div className="flex gap-2">
          {['pdf', 'markdown', 'csv', 'json', 'html'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setFormat(fmt as ReportFormat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                format === fmt
                  ? 'bg-brand-500 text-white'
                  : 'bg-surface-800 text-surface-300 hover:bg-surface-700'
              )}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <button className="w-full px-6 py-3 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-semibold flex items-center justify-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Générer le rapport
      </button>
    </div>
  )
}

function ReportPreview() {
  return (
    <div className="rounded-xl border border-surface-700 bg-white dark:bg-surface-950 backdrop-blur p-8 shadow-lg space-y-8 mt-8">
      {/* Header */}
      <div className="border-b-2 border-surface-700 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
              Rapport SEO Complet
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-2">
              Période: 1-31 Mars 2026
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Généré le 31 mars 2026
            </p>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              www.example.com
            </p>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-4">
          Résumé exécutif
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'SEO Score', value: '78/100', color: 'bg-green-100 dark:bg-green-900/30' },
            { label: 'Mots-clés #1-3', value: '24', color: 'bg-blue-100 dark:bg-blue-900/30' },
            { label: 'Trafic organique', value: '+18%', color: 'bg-purple-100 dark:bg-purple-900/30' },
            { label: 'Backlinks', value: '1,847', color: 'bg-orange-100 dark:bg-orange-900/30' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={cn('p-4 rounded-lg', stat.color)}
            >
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* SEO Score Gauge */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Score SEO
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Score', value: 78 },
                    { name: 'Reste', value: 22 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  startAngle={90}
                  endAngle={450}
                  dataKey="value"
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center text-3xl font-bold text-green-600 dark:text-green-400 -mt-12">
              78%
            </p>
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Votre score SEO global est très bon. Continuez à améliorer les aspects techniques et à construire des backlinks de qualité.
            </p>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-600 dark:text-surface-400">Technique</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">85%</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-600 dark:text-surface-400">Contenu</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">72%</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-surface-600 dark:text-surface-400">Backlinks</span>
                <span className="font-semibold text-surface-900 dark:text-surface-100">68%</span>
              </div>
              <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Issues */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Problèmes prioritaires
        </h3>
        <div className="space-y-2 border border-surface-200 dark:border-surface-700 rounded-lg overflow-hidden">
          {demoIssues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-start gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors border-b border-surface-200 dark:border-surface-700 last:border-b-0"
            >
              <AlertCircle
                className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  issue.severity === 'high'
                    ? 'text-red-500'
                    : issue.severity === 'medium'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                )}
              />
              <div className="flex-1">
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {issue.title}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                  {issue.count} page{issue.count > 1 ? 's' : ''} affectée{issue.count > 1 ? 's' : ''}
                </p>
              </div>
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-md',
                issue.severity === 'high'
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  : issue.severity === 'medium'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              )}>
                {issue.severity === 'high' ? 'Élevée' : issue.severity === 'medium' ? 'Moyenne' : 'Basse'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Keywords Performance */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Performance des mots-clés
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700 dark:text-surface-400">
                  Mot-clé
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700 dark:text-surface-400">
                  Position
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700 dark:text-surface-400">
                  Changement
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-surface-700 dark:text-surface-400">
                  Volume
                </th>
              </tr>
            </thead>
            <tbody>
              {demoKeywordData.map((keyword, idx) => (
                <tr
                  key={idx}
                  className="border-b border-surface-200 dark:border-surface-700 last:border-b-0 hover:bg-surface-50 dark:hover:bg-surface-800/30"
                >
                  <td className="py-3 px-4 text-sm text-surface-900 dark:text-surface-100">
                    {keyword.name}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-surface-900 dark:text-surface-100">
                    #{keyword.position}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={cn(
                      'inline-flex items-center gap-1 font-medium',
                      keyword.change > 0
                        ? 'text-green-600 dark:text-green-400'
                        : keyword.change < 0
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-surface-600 dark:text-surface-400'
                    )}>
                      {keyword.change > 0 ? '+' : ''}{keyword.change}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-surface-900 dark:text-surface-100">
                    {keyword.volume.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Backlinks Summary */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Résumé des backlinks
        </h3>
        <div className="space-y-3">
          {demoBacklinkData.map((link, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-700 rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {link.domain}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {link.type}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-surface-900 dark:text-surface-100">
                  {link.authority}
                </p>
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  Autorité
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Métriques de performance
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={demoPerformanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="week" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#f3f4f6' }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="traffic"
              stroke="#3b82f6"
              name="Trafic"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#10b981"
              name="Clics"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Visibility */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Visibilité IA
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'ChatGPT Mentions', value: '127' },
            { label: 'Claude Citations', value: '89' },
            { label: 'Autres LLM', value: '156' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 border border-surface-200 dark:border-surface-700 rounded-lg">
              <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                {item.label}
              </p>
              <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Recommandations
        </h3>
        <div className="space-y-3">
          {[
            { title: 'Optimiser la vitesse de chargement', priority: 'high' },
            { title: 'Ajouter du contenu unique sur pages importantes', priority: 'high' },
            { title: 'Construire 50+ backlinks de qualité', priority: 'medium' },
            { title: 'Implémenter le balisage structuré complet', priority: 'medium' },
            { title: 'Tester et optimiser Core Web Vitals', priority: 'low' },
          ].map((rec, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 border border-surface-200 dark:border-surface-700 rounded-lg"
            >
              <CheckCircle2
                className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  rec.priority === 'high'
                    ? 'text-red-500'
                    : rec.priority === 'medium'
                    ? 'text-yellow-500'
                    : 'text-blue-500'
                )}
              />
              <div className="flex-1">
                <p className="font-medium text-surface-900 dark:text-surface-100">
                  {rec.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div>
        <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">
          Plan d'action
        </h3>
        <div className="space-y-4">
          {[
            {
              phase: 'Court terme (2-4 semaines)',
              actions: [
                'Corriger les 12 méta descriptions manquantes',
                'Optimiser les images pour mobile',
                'Implémenter le caching du navigateur',
              ],
            },
            {
              phase: 'Moyen terme (1-3 mois)',
              actions: [
                'Créer 20 articles de blog ciblant des keywords longue traîne',
                'Lancer une campagne de construction de backlinks',
                'Refondre la structure de l\'information du site',
              ],
            },
            {
              phase: 'Long terme (3-6 mois)',
              actions: [
                'Augmenter les backlinks à 2500+',
                'Atteindre 50+ mots-clés en top 3',
                'Tripler le trafic organique',
              ],
            },
          ].map((phase, idx) => (
            <div key={idx} className="border border-surface-200 dark:border-surface-700 rounded-lg p-4">
              <h4 className="font-semibold text-surface-900 dark:text-surface-100 mb-3">
                {phase.phase}
              </h4>
              <ul className="space-y-2">
                {phase.actions.map((action, actionIdx) => (
                  <li key={actionIdx} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-surface-700 dark:text-surface-300">
                      {action}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-surface-200 dark:border-surface-700 pt-4 text-center text-xs text-surface-600 dark:text-surface-400">
        <p>Rapport généré automatiquement. Les données sont basées sur les 30 derniers jours.</p>
      </div>
    </div>
  )
}

export default function ReportsPage() {
  const [enabledSchedules, setEnabledSchedules] = useState<Record<string, boolean>>(
    scheduledReports.reduce(
      (acc, r) => ({ ...acc, [r.id]: r.enabled }),
      {}
    )
  )
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-brand-500/15">
              <BarChart3 className="h-6 w-6 text-brand-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Rapports SEO</h1>
          </div>
          <p className="text-surface-400 mt-1 max-w-xl">
            Générez et consultez vos rapports SEO complets
          </p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm text-surface-400">
            Dernier rapport: 28 mars 2026
          </p>
        </div>
      </div>

      {/* Report Builder */}
      <ReportBuilder />

      {/* Show Preview Button */}
      <button
        onClick={() => setShowPreview(!showPreview)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-surface-300 hover:bg-surface-700 transition-colors"
      >
        <Eye className="h-4 w-4" />
        {showPreview ? 'Masquer' : 'Aperçu'} du rapport
      </button>

      {/* Report Preview */}
      {showPreview && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors font-medium">
              <Download className="h-4 w-4" />
              Télécharger
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-surface-300 hover:bg-surface-700 transition-colors font-medium">
              <Printer className="h-4 w-4" />
              Imprimer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-800 text-surface-300 hover:bg-surface-700 transition-colors font-medium">
              <Share2 className="h-4 w-4" />
              Partager
            </button>
          </div>
          <ReportPreview />
        </div>
      )}

      {/* Report Templates */}
      <div>
        <h2 className="text-lg font-bold text-surface-100 mb-4">
          Modèles de rapport
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {reportTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-lg border border-surface-700 bg-surface-900/50 p-5 hover:border-surface-600 hover:bg-surface-800/50 transition-all cursor-pointer group"
            >
              <h3 className="font-semibold text-surface-100 mb-2 group-hover:text-brand-400 transition-colors">
                {template.name}
              </h3>
              <p className="text-sm text-surface-400 mb-4">{template.description}</p>
              <button className="text-sm text-brand-400 hover:text-brand-300 font-medium">
                Utiliser ce modèle →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur overflow-hidden shadow-sm">
        <div className="p-6 border-b border-surface-700">
          <h2 className="text-lg font-bold text-surface-100">Rapports générés</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700 bg-surface-800/30">
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Format
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-surface-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {generatedReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-b border-surface-800 hover:bg-surface-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-surface-100 text-sm">{report.name}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    {report.type === 'complete' && 'Complet'}
                    {report.type === 'audit' && 'Audit'}
                    {report.type === 'keywords' && 'Mots-clés'}
                    {report.type === 'backlinks' && 'Backlinks'}
                    {report.type === 'performance' && 'Performance'}
                    {report.type === 'ai' && 'IA'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-md bg-surface-800 text-surface-300 text-xs font-semibold uppercase">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-400">
                    {report.date}
                  </td>
                  <td className="px-6 py-4">
                    {report.status === 'completed' ? (
                      <span className="px-2.5 py-1 rounded-md bg-accent-500/15 text-accent-400 text-xs font-semibold">
                        Terminé
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-400 text-xs font-semibold flex items-center gap-1 w-fit">
                        <Clock className="h-3 w-3" />
                        En cours
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button className="p-1.5 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all" title="Télécharger">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-surface-500 hover:text-brand-400 hover:bg-brand-500/10 transition-all" title="Partager">
                      <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all" title="Supprimer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="rounded-xl border border-surface-700 bg-surface-900/50 backdrop-blur p-6 shadow-sm">
        <h2 className="text-lg font-bold text-surface-100 mb-6">Rapports planifiés</h2>
        <div className="space-y-3">
          {scheduledReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 rounded-lg border border-surface-700 bg-surface-800/20 hover:border-surface-600 transition-colors"
            >
              <div>
                <p className="font-semibold text-surface-100 text-sm">{report.name}</p>
                <p className="text-xs text-surface-500 mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {report.schedule} • Format: {report.format}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn(
                  'px-2.5 py-1 rounded-md text-xs font-semibold',
                  enabledSchedules[report.id]
                    ? 'bg-accent-500/15 text-accent-400'
                    : 'bg-surface-700 text-surface-400'
                )}>
                  {enabledSchedules[report.id] ? 'Actif' : 'Inactif'}
                </span>
                <button
                  onClick={() =>
                    setEnabledSchedules((prev) => ({
                      ...prev,
                      [report.id]: !prev[report.id],
                    }))
                  }
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                    enabledSchedules[report.id]
                      ? 'bg-brand-500'
                      : 'bg-surface-700'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      enabledSchedules[report.id]
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    )}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add Scheduled Report */}
        <button className="w-full mt-6 px-4 py-3 rounded-lg border border-surface-700 text-surface-300 hover:bg-surface-800/50 transition-colors font-medium flex items-center justify-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un rapport planifié
        </button>
      </div>
    </div>
  )
}
