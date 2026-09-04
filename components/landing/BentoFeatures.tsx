'use client'

import Link from 'next/link'
import { Globe, MessageCircle, Cpu, Wrench, FileText, ArrowRight } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const features = [
  {
    id: 'geo',
    icon: Globe,
    title: 'GEO',
    subtitle: 'Generative Engine Optimization',
    desc: 'Soyez cité par Google SGE, Bing Copilot et Perplexity. Score E-E-A-T, schéma markup et monitoring quotidien.',
    size: 'large',
  },
  {
    id: 'aeo',
    icon: MessageCircle,
    title: 'AEO',
    subtitle: 'Answer Engine Optimization',
    desc: 'Capturez les featured snippets, les People Also Ask et les réponses vocales. Analysez votre position zéro.',
    size: 'large',
  },
  {
    id: 'llmo',
    icon: Cpu,
    title: 'LLMO',
    subtitle: 'LLM Optimization',
    desc: 'Suivez vos mentions dans ChatGPT, Claude, Gemini et Perplexity.',
    size: 'small',
  },
  {
    id: 'technique',
    icon: Wrench,
    title: 'SEO technique',
    subtitle: 'Crawl multipage',
    desc: 'Audit complet, Core Web Vitals, 27 types de constats avec correctifs, sécurité, mobile.',
    size: 'small',
  },
  {
    id: 'contenu',
    icon: FileText,
    title: 'Contenu & mots-clés',
    subtitle: 'Recherche et suivi',
    desc: 'Idées de mots-clés, volumes locaux, suivi de positions par ville, analyse de lisibilité.',
    size: 'small',
  },
]

function FeatureCard({ f, large }: { f: (typeof features)[number]; large: boolean }) {
  const Icon = f.icon
  return (
    <article className={`card-hover flex h-full flex-col ${large ? 'p-8' : 'p-6'}`}>
      <div className={`mb-5 flex items-center justify-center rounded-2xl bg-navy-100 text-navy-700 dark:bg-navy-900/60 dark:text-navy-100 ${large ? 'h-12 w-12' : 'h-10 w-10'}`}>
        <Icon className={large ? 'h-6 w-6' : 'h-5 w-5'} aria-hidden="true" />
      </div>
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2">
        <h3 className={`font-display font-extrabold text-navy-600 dark:text-white ${large ? 'text-headline-md' : 'text-title-lg'}`}>{f.title}</h3>
        <span className="text-xs text-ink-muted dark:text-surface-400">{f.subtitle}</span>
      </div>
      <p className={`leading-relaxed text-ink-muted dark:text-surface-400 ${large ? 'max-w-md text-body-md' : 'text-sm'}`}>{f.desc}</p>
    </article>
  )
}

export function BentoFeatures() {
  const largeItems = features.filter((f) => f.size === 'large')
  const smallItems = features.filter((f) => f.size === 'small')

  return (
    <section id="features" className="scroll-mt-20 bg-white py-20 dark:bg-surface-950 lg:py-24" aria-labelledby="features-title">
      <div className="mx-auto max-w-container px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="section-badge mb-4">Fonctionnalités</span>
          <h2 id="features-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            Tout ce qu’il faut pour <span className="gradient-text">être trouvé à l’ère de l’IA</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            GEO, AEO, LLMO : les trois piliers du référencement nouvelle génération, réunis dans une seule plateforme.
          </p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {largeItems.map((f, i) => (
            <FadeContent key={f.id} delay={i * 0.08}>
              <FeatureCard f={f} large />
            </FadeContent>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {smallItems.map((f, i) => (
            <FadeContent key={f.id} delay={0.16 + i * 0.08}>
              <FeatureCard f={f} large={false} />
            </FadeContent>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/signup" className="btn-primary">
            Commencer gratuitement <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
