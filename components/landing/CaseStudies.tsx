'use client'

import { ArrowRight, TrendingUp } from 'lucide-react'
import Link from 'next/link'

const cases = [
  {
    category: 'E-commerce Mode',
    company: 'Maison Lumière',
    challenge: 'Trafic en chute suite aux AI Overviews Google',
    result: '+420% trafic organique',
    detail: '3,2M → 15,6M visites/mois en 6 mois',
    tags: ['GEO', 'AEO'],
    duration: '6 mois',
    slug: 'maison-lumiere',
  },
  {
    category: 'SaaS B2B',
    company: 'FlowStack',
    challenge: 'Marque absente des réponses ChatGPT et Claude',
    result: '×4 mentions dans les LLMs',
    detail: '0 → 1 200 citations LLM/mois',
    tags: ['LLMO', 'GEO'],
    duration: '4 mois',
    slug: 'flowstack',
  },
  {
    category: 'Cabinet Juridique',
    company: 'Lefort & Associés',
    challenge: 'Concurrence féroce sur les requêtes à forte valeur',
    result: '#1 sur 89 requêtes clés',
    detail: '+260% leads qualifiés',
    tags: ['AEO', 'SEO Technique'],
    duration: '3 mois',
    slug: 'lefort-associes',
  },
]

const tagColors: Record<string, string> = {
  'GEO':           'bg-brand-50 text-brand-600 dark:bg-brand-950/40 dark:text-brand-400 border-brand-200 dark:border-brand-800/50',
  'AEO':           'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 border-violet-200 dark:border-violet-800/50',
  'LLMO':          'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50',
  'SEO Technique': 'bg-accent-50 text-accent-600 dark:bg-accent-950/40 dark:text-accent-400 border-accent-200 dark:border-accent-800/50',
}

export function CaseStudies() {
  return (
    <section id="cases" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <div className="section-badge mb-4">Résultats concrets</div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white">
              Ils ont choisi Nexus.
              <br />
              <span className="gradient-text">Voici leurs résultats.</span>
            </h2>
          </div>
          <Link
            href="/cases"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-3 transition-all shrink-0"
          >
            Voir tous les cas <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <Link
              key={c.company}
              href={`/cases/${c.slug}`}
              className="card-hover p-7 flex flex-col group"
            >
              {/* Category + icon */}
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs text-surface-400 mb-1">{c.category}</p>
                  <p className="text-base font-bold text-surface-900 dark:text-white">{c.company}</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/30 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-100 dark:group-hover:bg-brand-950/60 transition-colors">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                </div>
              </div>

              {/* Challenge */}
              <p className="text-xs text-surface-400 italic mb-4">&ldquo;{c.challenge}&rdquo;</p>

              {/* Result box */}
              <div className="rounded-2xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 p-4 mb-5">
                <p className="text-xl font-black text-surface-900 dark:text-white mb-0.5">{c.result}</p>
                <p className="text-xs text-surface-400">{c.detail}</p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold border ${tagColors[tag] || 'bg-surface-100 text-surface-600 border-surface-200'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-surface-400">{c.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
