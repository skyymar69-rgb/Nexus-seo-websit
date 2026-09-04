'use client'

import { Check, ArrowRight, Sparkles, ExternalLink } from 'lucide-react'
import Link from 'next/link'

const features = [
  'Audits SEO illimités',
  'Crawl multipage avec correctifs',
  'Suivi de mots-clés, national et local',
  'Sites web illimités',
  'Scores GEO, AEO, LLMO',
  'Visibilité IA (10 moteurs)',
  'Profil de backlinks',
  'Générateur de contenu SEO',
  'Serveur MCP pour vos agents',
  'Export PDF et JSON',
]

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-24 bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="pricing-title">
      <div className="mx-auto max-w-4xl px-6">

        <div className="mb-12 text-center">
          <span className="section-badge mb-4">100 % gratuit</span>
          <h2 id="pricing-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            Tous les outils. <span className="gradient-text">Zéro euro.</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            50 outils SEO et IA sans aucune limitation. Aucune carte bancaire.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="card relative overflow-hidden border-2 border-navy-600 p-8 shadow-elevation-lg sm:p-10">
            <span className="absolute right-0 top-0 rounded-bl-2xl bg-navy-600 px-4 py-1.5 font-display text-xs font-bold text-white">
              Accès complet
            </span>

            <div className="mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-accent-600" aria-hidden="true" />
              <h3 className="text-title-lg text-ink dark:text-white">Nexus SEO</h3>
            </div>

            <p className="mb-2 flex items-baseline gap-2">
              <span className="font-display text-5xl font-extrabold text-navy-600 dark:text-white">0 €</span>
              <span className="text-lg text-ink-muted dark:text-surface-400">par mois, pour toujours</span>
            </p>
            <p className="mb-8 text-ink-muted dark:text-surface-400">Aucune carte bancaire. Aucune limitation.</p>

            <Link href="/signup" className="btn-primary w-full">
              Commencer gratuitement <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-200 dark:bg-accent-900/40">
                    <Check className="h-3 w-3 text-accent-800 dark:text-accent-200" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-ink dark:text-surface-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card mt-12 p-8 text-center">
          <p className="mb-2 text-title-lg text-ink dark:text-white">Besoin d’un site web performant ?</p>
          <p className="mx-auto mb-5 max-w-xl text-ink-muted dark:text-surface-400">
            L’agence Kayzen crée des sites optimisés SEO, livrés en 2 à 10 semaines.
          </p>
          <a href="https://kayzen-lyon.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            Découvrir l’agence Kayzen
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-10 text-center text-sm text-ink-muted dark:text-surface-500">
          Hébergé en Europe · Conforme RGPD · Support inclus
        </p>
      </div>
    </section>
  )
}
