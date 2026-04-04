'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Star } from 'lucide-react'

const avatars = ['SR', 'TL', 'CD', 'MB', 'JM']

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
                Rejoignez 2 500+ équipes
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-surface-900 dark:text-white mb-6 leading-tight">
                Prêt à dominer{' '}
                <span className="gradient-text">les moteurs IA</span>{' '}
                de 2026 ?
              </h2>

              <p className="text-lg text-surface-500 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
                Obtenez votre audit SEO IA gratuit et complet en 5 minutes. Découvrez exactement pourquoi vos concurrents vous devancent dans ChatGPT et Google SGE.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link href="/signup" className="btn-primary px-10 py-4 text-base rounded-2xl">
                  Créer mon compte gratuit
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="btn-outline px-8 py-4 text-base rounded-2xl">
                  Parler à un expert
                </Link>
              </div>

              {/* Social proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {avatars.map((initials, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-white dark:ring-surface-950"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    <strong className="text-surface-900 dark:text-white">2 500+</strong> équipes actives
                  </span>
                </div>

                <div className="hidden sm:block w-px h-6 bg-surface-200 dark:bg-surface-700" />

                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((s) => <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <span className="text-sm text-surface-500 dark:text-surface-400">
                    <strong className="text-surface-900 dark:text-white">4,9/5</strong> sur G2 &amp; Trustpilot
                  </span>
                </div>

                <div className="hidden sm:block w-px h-6 bg-surface-200 dark:bg-surface-700" />

                <span className="text-sm text-surface-400">
                  Sans carte bancaire · Résiliation libre
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
