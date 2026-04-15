'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Leaf } from 'lucide-react'

export function CTA() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-brand-600 via-violet-600 to-cyan-600 p-px">
          <div className="relative rounded-3xl bg-white dark:bg-surface-950 p-10 sm:p-16 text-center overflow-hidden">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-brand-500/10 dark:bg-brand-500/5 blur-3xl rounded-full" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-500/10 dark:bg-violet-500/5 blur-3xl rounded-full" />
            </div>

            <div className="relative z-10">
              <div className="section-badge mx-auto mb-6 flex items-center gap-1.5 w-fit">
                <Zap className="w-3.5 h-3.5" />
                100% gratuit
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 dark:text-white mb-6 leading-tight">
                Pret a optimiser{' '}
                <span className="gradient-text">votre visibilite</span>{' '}
                ?
              </h2>

              <p className="text-lg text-surface-700 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
                Lancez votre audit SEO gratuit en 5 minutes. 50+ outils, zero euro, aucune carte bancaire.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link href="/signup" className="btn-primary px-10 py-4 text-base rounded-2xl">
                  Creer mon compte gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="https://internet.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="btn-outline px-8 py-4 text-base rounded-2xl">
                  Faire creer mon site par Kayzen
                </a>
              </div>

              {/* Real info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-surface-600 dark:text-surface-400">
                <span className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-green-500" />
                  Web eco-responsable
                </span>
                <div className="hidden sm:block w-px h-4 bg-surface-200 dark:bg-surface-700" />
                <span>Sans carte bancaire</span>
                <div className="hidden sm:block w-px h-4 bg-surface-200 dark:bg-surface-700" />
                <span>Developpe par Kayzen Web — Lyon</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
