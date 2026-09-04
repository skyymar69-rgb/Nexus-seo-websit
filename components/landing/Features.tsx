'use client'

import { useState } from 'react'
import { Globe, MessageCircle, Cpu, Wrench, BarChart3, Check, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const tabs = [
  {
    id: 'geo',
    label: 'GEO',
    icon: Globe,
    title: 'Generative Engine Optimization',
    subtitle: 'Soyez cité par Google SGE, Bing Copilot et Perplexity',
    desc: 'Nexus analyse votre contenu pour le rendre éligible aux réponses générées par IA. Le moteur GEO identifie les lacunes de structure, de crédibilité E-E-A-T et de balisage qui vous excluent des AI Overviews.',
    features: ['Analyse de compatibilité SGE', 'Optimisation du balisage Schema', 'Score E-E-A-T détaillé et recommandations', 'Suivi des apparitions SGE', 'Alertes de décrochage', 'Rapport GEO hebdomadaire'],
    mockup: { title: 'Score GEO', value: '94 / 100', bars: [{ label: 'Google SGE', pct: 94 }, { label: 'Bing Copilot', pct: 78 }, { label: 'Perplexity', pct: 86 }] },
  },
  {
    id: 'aeo',
    label: 'AEO',
    icon: MessageCircle,
    title: 'Answer Engine Optimization',
    subtitle: 'Devenez la réponse de référence pour vos prospects',
    desc: 'Structurez votre contenu pour les featured snippets, la recherche vocale et les People Also Ask. Nexus identifie les questions de votre audience et vous aide à y répondre.',
    features: ['Extraction des questions cibles', 'FAQ sémantique avec balisage', 'Rich snippets (étoiles, prix, FAQ)', 'Audit recherche vocale', 'Analyse Knowledge Graph et entités', 'Suivi des featured snippets gagnés'],
    mockup: { title: 'Featured snippets', value: '+47 ce mois', bars: [{ label: 'Paragraphes', pct: 58 }, { label: 'Listes', pct: 72 }, { label: 'Tableaux', pct: 34 }] },
  },
  {
    id: 'llmo',
    label: 'LLMO',
    icon: Cpu,
    title: 'Large Language Model Optimization',
    subtitle: 'ChatGPT, Claude et Gemini recommandent votre marque',
    desc: 'Nexus surveille vos mentions dans dix moteurs IA, montre comment les IA parlent de vous et de vos concurrents, et optimise votre corpus de contenu pour être cité.',
    features: ['Suivi de 10 moteurs IA', 'Suivi des mentions de marque', 'Analyse du corpus (autorité thématique)', 'Sources citées', 'Alertes de mentions', 'Tableau de bord comparatif'],
    mockup: { title: 'Mentions ce mois', value: '+1 247', bars: [{ label: 'ChatGPT', pct: 88 }, { label: 'Claude', pct: 74 }, { label: 'Gemini', pct: 62 }, { label: 'Perplexity', pct: 81 }] },
  },
  {
    id: 'technical',
    label: 'SEO technique',
    icon: Wrench,
    title: 'Audit technique complet',
    subtitle: 'Le socle technique pour se positionner',
    desc: 'Nexus explore votre site en profondeur pour détecter ce qui freine votre référencement : performance, indexation, architecture, liens cassés, redirections, Core Web Vitals.',
    features: ['Crawl multipage, robots.txt et sitemaps', 'Core Web Vitals (LCP, CLS, INP)', '27 types de constats avec correctifs', 'Liens internes cassés et pages orphelines', 'Canoniques, redirections, indexabilité', 'Rapport priorisé par gravité'],
    mockup: { title: 'Score technique', value: '87 / 100', bars: [{ label: 'Performance', pct: 92 }, { label: 'Indexation', pct: 88 }, { label: 'Core Web Vitals', pct: 79 }] },
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    title: 'Analytics et rapports',
    subtitle: 'Toutes vos données SEO au même endroit',
    desc: 'Connectez Google Search Console et vos outils. Nexus agrège tout et génère des rapports clairs et actionnables, pour vous et vos clients.',
    features: ['Import Google Search Console', 'Suivi de positions quotidien, par ville', 'Backlinks et domaines référents', 'Rapports PDF white-label', 'Alertes par e-mail', 'API et serveur MCP'],
    mockup: { title: 'Mots-clés top 3', value: '847 (+34)', bars: [{ label: 'Position 1', pct: 38 }, { label: 'Position 2', pct: 29 }, { label: 'Position 3', pct: 33 }] },
  },
]

const barTones = ['bg-accent-500', 'bg-navy-500', 'bg-brand-500', 'bg-navy-300']

export function Features() {
  const [active, setActive] = useState('geo')
  const tab = tabs.find((t) => t.id === active) || tabs[0]

  return (
    <section id="features" className="bg-white py-20 dark:bg-surface-950 lg:py-24" aria-labelledby="solution-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-badge mb-4">La solution</span>
          <h2 id="solution-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            Nexus couvre <span className="gradient-text">tout le spectre SEO</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            De l’audit technique au LLMO, en passant par les mots-clés et les backlinks : une seule plateforme pour tous les canaux de découverte.
          </p>
        </div>

        <div
          className="mb-12 flex flex-wrap justify-center gap-2"
          role="tablist"
          aria-label="Fonctionnalités Nexus"
          onKeyDown={(e) => {
            const ids = tabs.map((t) => t.id)
            const idx = ids.indexOf(active)
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setActive(ids[(idx + 1) % ids.length]) }
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setActive(ids[(idx - 1 + ids.length) % ids.length]) }
          }}
        >
          {tabs.map((t) => {
            const Icon = t.icon
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${t.id}`}
                id={`tab-${t.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActive(t.id)}
                className={cn(
                  'flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-colors duration-200',
                  isActive ? 'bg-navy-600 text-white shadow-elevation-md' : 'text-ink hover:bg-surface-200 dark:text-surface-300 dark:hover:bg-surface-800',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {t.label}
              </button>
            )
          })}
        </div>

        <div id={`tabpanel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 flex items-center gap-2 text-navy-600 dark:text-navy-100">
              <tab.icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-sm font-bold uppercase tracking-wider">{tab.label}</span>
            </div>
            <h3 className="mb-2 text-headline-md text-ink dark:text-white">{tab.title}</h3>
            <p className="mb-4 text-base font-medium text-ink-muted dark:text-surface-400">{tab.subtitle}</p>
            <p className="mb-8 leading-relaxed text-ink-muted dark:text-surface-400">{tab.desc}</p>

            <ul className="mb-8 space-y-3">
              {tab.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-200 dark:bg-accent-900/40">
                    <Check className="h-3 w-3 text-accent-800 dark:text-accent-200" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-ink dark:text-surface-300">{f}</span>
                </li>
              ))}
            </ul>

            <Link href={`/services#${tab.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 transition-[gap] duration-200 hover:gap-3">
              En savoir plus sur le {tab.label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="card p-6 sm:p-8">
            <p className="mb-2 text-label-sm uppercase tracking-wider text-ink-muted">{tab.mockup.title}</p>
            <p className="mb-8 font-display text-4xl font-extrabold text-navy-600 dark:text-white">{tab.mockup.value}</p>
            <ul className="space-y-5">
              {tab.mockup.bars.map((b, i) => (
                <li key={b.label}>
                  <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
                    <span>{b.label}</span>
                    <span>{b.pct} %</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
                    <div className={cn('h-full rounded-full transition-[width] duration-700', barTones[i % barTones.length])} style={{ width: `${b.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between border-t border-surface-300 pt-6 text-xs text-ink-muted dark:border-surface-800">
              <span>Mis à jour il y a 3 min</span>
              <span className="flex items-center gap-1.5 font-semibold text-accent-700 dark:text-accent-300">
                <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden="true" />
                Actif
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
