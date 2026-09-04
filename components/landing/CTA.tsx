'use client'

import Link from 'next/link'
import { ArrowRight, Leaf } from 'lucide-react'
import { ClickSpark, Magnet, FadeContent } from '@/components/bits'

export function CTA() {
  return (
    <section className="bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="cta-title">
      <div className="mx-auto max-w-4xl px-6">
        <FadeContent>
          <div className="card p-10 text-center shadow-elevation-lg sm:p-16">
            <span className="section-badge mb-6">100 % gratuit</span>

            <h2 id="cta-title" className="mb-6 text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
              Prêt à optimiser <span className="gradient-text">votre visibilité</span> ?
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-body-lg text-ink-muted dark:text-surface-400">
              Lancez votre audit SEO gratuit en 5 minutes. 50 outils, zéro euro, aucune carte bancaire.
            </p>

            <div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ClickSpark className="inline-block">
                <Magnet>
                  <Link href="/signup" className="btn-primary">
                    Créer mon compte gratuit
                    <ArrowRight className="h-5 w-5" aria-hidden="true" />
                  </Link>
                </Magnet>
              </ClickSpark>
              <a href="https://kayzen-lyon.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                Faire créer mon site par Kayzen
              </a>
            </div>

            <ul className="flex flex-col items-center justify-center gap-4 text-sm text-ink-muted sm:flex-row sm:gap-6 dark:text-surface-400">
              <li className="flex items-center gap-1.5">
                <Leaf className="h-4 w-4 text-accent-600" aria-hidden="true" />
                Web éco-responsable
              </li>
              <li className="hidden h-4 w-px bg-surface-300 sm:block dark:bg-surface-700" aria-hidden="true" />
              <li>Sans carte bancaire</li>
              <li className="hidden h-4 w-px bg-surface-300 sm:block dark:bg-surface-700" aria-hidden="true" />
              <li>Développé par Kayzen Web, Lyon</li>
            </ul>
          </div>
        </FadeContent>
      </div>
    </section>
  )
}
