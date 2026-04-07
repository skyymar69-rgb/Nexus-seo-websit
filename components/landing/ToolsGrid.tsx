'use client'

import Link from 'next/link'
import {
  Search, Globe, Zap, FileSearch, FileText, TrendingUp, Wand2, Eye, BookOpen, Tag,
  Link as LinkIcon, ShieldCheck, Users, ShoppingCart, Lightbulb, LayoutTemplate,
  Sparkles, LineChart, BarChart3, Settings, FolderOpen, Gauge, Home,
} from 'lucide-react'

const toolCategories = [
  {
    name: 'SEO',
    color: 'from-blue-500 to-blue-600',
    tools: [
      { name: 'Audit de Site', href: '/dashboard/audit', icon: Search, desc: 'Analyse complete de votre site en 30+ points' },
      { name: 'Performance', href: '/dashboard/performance', icon: Zap, desc: 'Core Web Vitals et vitesse de chargement' },
      { name: 'Domain Overview', href: '/dashboard/domain-overview', icon: Globe, desc: 'Vue d\'ensemble de votre domaine' },
      { name: 'Top Pages', href: '/dashboard/top-pages', icon: FileSearch, desc: 'Pages les plus performantes' },
      { name: 'On-Page Checker', href: '/dashboard/on-page-checker', icon: FileText, desc: 'Optimisation SEO page par page' },
    ],
  },
  {
    name: 'Mots-cles',
    color: 'from-purple-500 to-purple-600',
    tools: [
      { name: 'Suivi de Positions', href: '/dashboard/rank-tracker', icon: TrendingUp, desc: 'Suivez vos positions sur Google' },
      { name: 'Keyword Magic', href: '/dashboard/keyword-magic', icon: Wand2, desc: 'Trouvez des mots-cles a fort potentiel' },
      { name: 'Keyword Gap', href: '/dashboard/keyword-gap', icon: Eye, desc: 'Analysez les mots-cles de vos concurrents' },
      { name: 'Recherche Semantique', href: '/dashboard/semantic', icon: BookOpen, desc: 'Cocon semantique et mots-cles LSI' },
      { name: 'Mes Mots-cles', href: '/dashboard/keywords', icon: Tag, desc: 'Gerez votre portefeuille de mots-cles' },
    ],
  },
  {
    name: 'Backlinks',
    color: 'from-orange-500 to-orange-600',
    tools: [
      { name: 'Profil Backlinks', href: '/dashboard/backlinks', icon: LinkIcon, desc: 'Analysez votre profil de liens' },
      { name: 'Backlink Audit', href: '/dashboard/backlink-audit', icon: ShieldCheck, desc: 'Detectez les liens toxiques' },
      { name: 'Concurrents', href: '/dashboard/competitors', icon: Users, desc: 'Espionnez les backlinks concurrents' },
      { name: 'Achat de Liens', href: '/dashboard/link-buying', icon: ShoppingCart, desc: 'Opportunites de netlinking' },
    ],
  },
  {
    name: 'Contenu',
    color: 'from-emerald-500 to-emerald-600',
    tools: [
      { name: 'Optimisation Contenu', href: '/dashboard/content-optimizer', icon: Wand2, desc: 'Optimisez vos pages existantes' },
      { name: 'Topic Research', href: '/dashboard/topic-research', icon: Lightbulb, desc: 'Idees de contenu basees sur les tendances' },
      { name: 'Content Template', href: '/dashboard/content-template', icon: LayoutTemplate, desc: 'Briefs de contenu SEO structures' },
      { name: 'Generateur SEO', href: '/dashboard/ai-content', icon: Sparkles, desc: 'Generation de contenu optimise' },
      { name: 'Crawleur Web', href: '/dashboard/crawl', icon: Globe, desc: 'Crawlez votre site comme Google' },
    ],
  },
  {
    name: 'IA & GEO',
    color: 'from-brand-500 to-accent-500',
    tools: [
      { name: 'Visibilite IA', href: '/dashboard/ai-visibility', icon: Sparkles, desc: 'Votre presence dans ChatGPT, Gemini...' },
      { name: 'Audit GEO', href: '/dashboard/geo-audit', icon: Globe, desc: 'Optimisation pour Google SGE' },
      { name: 'Score AEO', href: '/dashboard/aeo-score', icon: Zap, desc: 'Optimisation pour les featured snippets' },
      { name: 'Score LLMO', href: '/dashboard/llmo-score', icon: TrendingUp, desc: 'Votre visibilite dans les LLMs' },
      { name: 'AI Advisor', href: '/dashboard/ai-advisor', icon: Lightbulb, desc: 'Recommandations SEO intelligentes' },
    ],
  },
  {
    name: 'Rapports',
    color: 'from-cyan-500 to-cyan-600',
    tools: [
      { name: 'Analytics', href: '/dashboard/analytics', icon: LineChart, desc: 'Tableaux de bord et metriques' },
      { name: 'Evolution', href: '/dashboard/evolution', icon: TrendingUp, desc: 'Suivi de progression dans le temps' },
      { name: 'Rapports', href: '/dashboard/reports', icon: BarChart3, desc: 'Rapports PDF et exports' },
    ],
  },
]

export function ToolsGrid() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-surface-950" id="outils">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-600 dark:text-brand-400 text-sm font-bold uppercase tracking-widest">
            30+ outils gratuits
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mt-3 mb-4">
            Tous les outils SEO dont vous avez besoin
          </h2>
          <p className="text-surface-600 dark:text-surface-400 text-lg max-w-2xl mx-auto">
            De l&apos;audit technique a la visibilite IA, chaque outil est 100% gratuit et sans limitation.
          </p>
        </div>

        {/* Categories grid */}
        <div className="space-y-12">
          {toolCategories.map((cat) => (
            <div key={cat.name}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${cat.color}`} />
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{cat.name}</h3>
                <span className="text-xs font-semibold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded-full">
                  {cat.tools.length} outils gratuits
                </span>
              </div>

              {/* Tools cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {cat.tools.map((tool) => {
                  const Icon = tool.icon
                  return (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="group p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-surface-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                            {tool.name}
                          </p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 line-clamp-2">
                            {tool.desc}
                          </p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-600 text-white font-bold text-base hover:from-brand-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Gauge className="w-5 h-5" />
            Acceder au dashboard gratuit
          </Link>
        </div>
      </div>
    </section>
  )
}
