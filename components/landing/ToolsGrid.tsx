'use client'

import Link from 'next/link'
import { Search, TrendingUp, Link as LinkIcon, FileText, Sparkles, BarChart3, ArrowRight } from 'lucide-react'
import { SpotlightCard, FadeContent } from '@/components/bits'

const categories = [
  {
    name: 'SEO technique',
    icon: Search,
    tools: ['Audit de site', 'Crawl multipage', 'Performance', 'Vue d’ensemble de domaine', 'On-Page Checker'],
    count: 8,
  },
  {
    name: 'Mots-clés',
    icon: TrendingUp,
    tools: ['Suivi de positions', 'Suivi local par ville', 'Keyword Magic', 'Keyword Gap', 'Recherche sémantique'],
    count: 8,
  },
  {
    name: 'Backlinks',
    icon: LinkIcon,
    tools: ['Profil de liens', 'Domaines référents', 'Audit toxicité', 'Analyse concurrents'],
    count: 6,
  },
  {
    name: 'Contenu',
    icon: FileText,
    tools: ['Optimisation', 'Topic Research', 'Templates SEO', 'Générateur IA', 'Lisibilité'],
    count: 8,
  },
  {
    name: 'IA & GEO',
    icon: Sparkles,
    tools: ['Visibilité IA', 'Audit GEO', 'Score AEO', 'Score LLMO', 'AI Advisor', 'Prompt Tester'],
    count: 10,
  },
  {
    name: 'Rapports & agents',
    icon: BarChart3,
    tools: ['Analytics', 'Évolution', 'Rapports PDF', 'Export CSV', 'Serveur MCP'],
    count: 6,
  },
]

export function ToolsGrid() {
  return (
    <section className="scroll-mt-20 bg-white py-20 dark:bg-surface-950 lg:py-24" id="outils" aria-labelledby="tools-title">
      <div className="mx-auto max-w-container px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-badge mb-4">Boîte à outils</span>
          <h2 id="tools-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            <span className="gradient-text">50 outils</span> en une seule plateforme
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Tout ce dont vous avez besoin pour le SEO classique et l’optimisation IA, sans jongler entre cinq abonnements.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <FadeContent key={cat.name} delay={(i % 3) * 0.08}>
                <SpotlightCard as="article" className="h-full p-6" spotlightColor="rgba(31, 59, 97, 0.10)">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-700 dark:bg-navy-900/60 dark:text-navy-100">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-title-lg text-ink dark:text-white">{cat.name}</h3>
                      <span className="text-xs text-ink-muted dark:text-surface-400">{cat.count} outils</span>
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {cat.tools.map((tool) => (
                      <li key={tool} className="rounded-full bg-surface-200 px-2.5 py-1 text-xs text-ink dark:bg-surface-800 dark:text-surface-300">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </FadeContent>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary">
            Découvrir les 50 outils
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-sm text-ink-muted dark:text-surface-400">100 % gratuit, aucune carte bancaire</p>
        </div>
      </div>
    </section>
  )
}
