'use client'

import { AlertTriangle, TrendingDown, BrainCircuit, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { SpotlightCard, FadeContent, BlurText } from '@/components/bits'

const problems = [
  {
    icon: TrendingDown,
    chip: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300',
    title: 'Google SGE vole vos clics',
    stat: '−40 %',
    statLabel: 'de clics organiques en 2025',
    desc: 'Les AI Overviews de Google absorbent jusqu’à 40 % du trafic sur les requêtes informationnelles. Votre contenu actuel n’est pas optimisé pour y apparaître.',
  },
  {
    icon: BrainCircuit,
    chip: 'bg-navy-100 text-navy-700 dark:bg-navy-900/60 dark:text-navy-100',
    title: 'ChatGPT répond à votre place',
    stat: '1 Md',
    statLabel: 'requêtes par jour sur ChatGPT',
    desc: 'ChatGPT, Perplexity et Claude reçoivent des milliards de questions par jour. Si votre marque n’est pas mentionnée dans leurs réponses, vous êtes invisible pour une génération entière.',
  },
  {
    icon: AlertTriangle,
    chip: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
    title: 'Vos concurrents s’adaptent déjà',
    stat: '23 %',
    statLabel: 'des leaders optimisent pour l’IA',
    desc: 'Les entreprises qui investissent maintenant dans le GEO, l’AEO et le LLMO creusent un fossé difficile à rattraper. Chaque semaine d’attente est un retard stratégique.',
  },
]

export function Problem() {
  return (
    <section className="bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="problem-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-badge-primary mb-4">Le problème</span>
          <BlurText as="h2" id="problem-title" text="Le SEO traditionnel ne suffit plus en 2026" className="justify-center text-headline-md text-navy-600 dark:text-white sm:text-headline-lg" delay={60} />
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Les règles du référencement ont changé. Les moteurs de recherche génératifs redistribuent le trafic. Êtes-vous prêt ?
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {problems.map((p, i) => {
            const Icon = p.icon
            return (
              <FadeContent key={p.title} delay={i * 0.08}>
                <SpotlightCard as="article" className="h-full p-8">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${p.chip}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="mb-4">
                    <span className="font-display text-5xl font-extrabold tracking-tight text-navy-600 dark:text-white">{p.stat}</span>
                    <span className="mt-1 block text-xs text-ink-muted dark:text-surface-400">{p.statLabel}</span>
                  </p>
                  <h3 className="mb-2 text-title-lg text-ink dark:text-white">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted dark:text-surface-400">{p.desc}</p>
                </SpotlightCard>
              </FadeContent>
            )
          })}
        </div>

        <div className="text-center">
          <div className="card inline-flex flex-wrap items-center justify-center gap-3 px-6 py-3">
            <span className="text-sm font-semibold text-ink dark:text-white">Nexus résout exactement ces trois problèmes</span>
            <Link href="#features" className="inline-flex items-center gap-1 text-sm font-bold text-brand-500 transition-[gap] duration-200 hover:gap-2">
              Voir comment <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
