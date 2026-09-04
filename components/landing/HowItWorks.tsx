'use client'

import Link from 'next/link'
import { ArrowRight, Plus, Search, TrendingUp } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const steps = [
  {
    number: '01',
    icon: Plus,
    title: 'Connectez votre site en 30 secondes',
    desc: 'Ajoutez votre domaine, connectez Google Search Console en un clic et choisissez vos mots-clés prioritaires. Aucune installation technique.',
    detail: 'Compatible avec tous les CMS : WordPress, Shopify, Webflow, sur mesure.',
  },
  {
    number: '02',
    icon: Search,
    title: 'Analyse complète en 5 minutes',
    desc: 'Nexus explore votre site, calcule vos scores GEO, AEO et LLMO, identifie vos opportunités de featured snippets et audite vos facteurs techniques.',
    detail: 'Rapport disponible immédiatement, comparé à vos cinq principaux concurrents.',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Corrigez et suivez',
    desc: 'Appliquez les recommandations prioritaires, mesurez l’effet de chaque action et suivez votre trafic organique et votre visibilité IA semaine après semaine.',
    detail: 'Rapports automatiques pour vous et vos clients, avec l’évolution des indicateurs.',
  },
]

export function HowItWorks() {
  return (
    <section className="bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="how-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="section-badge mb-4">Simple et rapide</span>
          <h2 id="how-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            Opérationnel en <span className="gradient-text">moins de 10 minutes</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Pas d’agence, pas de consultant. Nexus fait le travail et vous montre exactement quoi faire.
          </p>
        </div>

        <ol className="relative grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-surface-300 lg:block dark:bg-surface-800" aria-hidden="true" />
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <FadeContent key={step.number} delay={i * 0.1}>
                <li className="relative flex flex-col items-start">
                  <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-600 text-white shadow-elevation-md">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                    <span className="absolute -right-2 -top-2 rounded-full bg-white px-1.5 font-display text-xs font-extrabold text-navy-600 shadow-elevation-sm dark:bg-surface-900 dark:text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mb-3 text-title-lg text-ink dark:text-white">{step.title}</h3>
                  <p className="mb-4 leading-relaxed text-ink-muted dark:text-surface-400">{step.desc}</p>
                  <p className="rounded-xl bg-white px-3 py-2 text-xs font-medium text-ink-muted shadow-elevation-sm dark:bg-surface-900 dark:text-surface-400">
                    {step.detail}
                  </p>
                </li>
              </FadeContent>
            )
          })}
        </ol>

        <div className="mt-14 text-center">
          <Link href="/signup" className="btn-primary">
            Commencer maintenant, c’est gratuit
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-sm text-ink-muted dark:text-surface-400">Aucune carte bancaire · Configuration en 5 minutes</p>
        </div>
      </div>
    </section>
  )
}
