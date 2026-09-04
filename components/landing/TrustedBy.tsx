'use client'

import { ExternalLink } from 'lucide-react'
import { LogoLoop } from '@/components/bits'

const clients = [
  'France Évasions', 'Boucherie de l’Avenue', 'Net Rénovation', 'Philippe Reynaud',
  'Grand Café du Commerce', 'Art Scenic', 'Resacar', 'Kayzen Lyon',
]

export function TrustedBy() {
  return (
    <section className="border-y border-surface-300 bg-surface-100 py-14 dark:border-surface-800 dark:bg-surface-900/60" aria-labelledby="trusted-title">
      <div className="mx-auto max-w-container px-6">
        <p id="trusted-title" className="mb-8 text-center text-label-sm uppercase tracking-widest text-ink-muted dark:text-surface-400">
          Sites optimisés par Kayzen Web — Lyon
        </p>

        <LogoLoop
          ariaLabel="Clients de Kayzen Web"
          fadeOutColor="#f5f5f5"
          speed={40}
          gap={56}
          className="mb-10"
          logos={clients.map((name) => ({
            node: <span className="font-display text-lg font-semibold text-ink-muted dark:text-surface-400">{name}</span>,
            title: name,
          }))}
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://kayzen-lyon.com/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover flex items-center gap-3 px-5 py-3"
          >
            <span>
              <span className="block text-sm font-bold text-navy-600 dark:text-white">Kayzen Web</span>
              <span className="block text-xs text-ink-muted dark:text-surface-400">Voir le portfolio</span>
            </span>
            <ExternalLink className="h-4 w-4 text-brand-500" aria-hidden="true" />
          </a>
          <div className="card flex items-center gap-2 px-5 py-3">
            <span>
              <span className="block text-sm font-bold text-navy-600 dark:text-white">100 % gratuit</span>
              <span className="block text-xs text-ink-muted dark:text-surface-400">Aucune carte bancaire</span>
            </span>
          </div>
          <div className="card flex items-center gap-2 px-5 py-3">
            <span>
              <span className="block text-sm font-bold text-navy-600 dark:text-white">50+ outils</span>
              <span className="block text-xs text-ink-muted dark:text-surface-400">SEO, GEO, AEO, LLMO</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
