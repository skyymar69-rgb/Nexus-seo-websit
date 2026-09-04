'use client'

import { Leaf, Zap, Globe, Shield, Sparkles, ArrowRight } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const reasons = [
  {
    icon: Sparkles,
    title: 'GEO, AEO et LLMO réunis',
    desc: 'Nexus combine l’optimisation pour Google SGE, les featured snippets et les réponses des LLM (ChatGPT, Claude, Gemini) en une seule plateforme.',
  },
  {
    icon: Zap,
    title: '50 outils SEO gratuits',
    desc: 'Audit technique, suivi de positions, analyse de backlinks, générateur de contenu, recherche de mots-clés : tout est inclus sans limitation et sans carte bancaire.',
  },
  {
    icon: Leaf,
    title: 'SEO éco-responsable',
    desc: 'Un site rapide et bien référencé consomme moins d’énergie. Nexus vous aide à alléger vos pages et à adopter les pratiques du web durable.',
  },
  {
    icon: Globe,
    title: 'Conçu par une agence web',
    desc: 'Nexus est développé par Kayzen Web, agence lyonnaise de création de sites React et Next.js performants. L’outil est né de l’expérience terrain avec de vrais clients.',
  },
  {
    icon: Shield,
    title: 'Données hébergées en Europe',
    desc: 'Vos données sont hébergées en Europe, dans le respect du RGPD. Aucune revente, aucune utilisation pour entraîner des modèles IA.',
  },
]

export function Testimonials() {
  return (
    <section className="bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="why-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mb-12 text-center">
          <span className="section-badge mb-4">Pourquoi Nexus</span>
          <h2 id="why-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            Ce qui rend Nexus <span className="gradient-text">différent.</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Un outil gratuit, honnête et conçu pour le SEO de demain.
          </p>
        </div>

        <ul className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          {reasons.slice(0, 3).map((r, i) => {
            const Icon = r.icon
            return (
              <FadeContent key={r.title} delay={i * 0.08}>
                <li className="card-hover flex h-full flex-col gap-4 p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-100 text-navy-700 dark:bg-navy-900/60 dark:text-navy-100">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-title-lg text-ink dark:text-white">{r.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-muted dark:text-surface-400">{r.desc}</p>
                </li>
              </FadeContent>
            )
          })}
        </ul>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {reasons.slice(3).map((r, i) => {
            const Icon = r.icon
            return (
              <FadeContent key={r.title} delay={0.24 + i * 0.08}>
                <li className="card flex h-full items-start gap-5 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent-200 text-accent-900 dark:bg-accent-900/40 dark:text-accent-200">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="mb-2 text-base font-bold text-ink dark:text-white">{r.title}</h3>
                    <p className="text-sm leading-relaxed text-ink-muted dark:text-surface-400">{r.desc}</p>
                  </div>
                </li>
              </FadeContent>
            )
          })}
        </ul>

        <div className="mt-12 border-t border-surface-300 pt-10 text-center dark:border-surface-800">
          <p className="mb-4 text-ink-muted dark:text-surface-400">
            Besoin d’aller plus loin ? Kayzen Web crée des sites optimisés dès la conception.
          </p>
          <a href="https://kayzen-lyon.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-brand-500 transition-[gap] duration-200 hover:gap-3">
            Découvrir Kayzen Web <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
