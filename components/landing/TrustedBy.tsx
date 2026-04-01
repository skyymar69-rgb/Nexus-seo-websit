'use client'

import { Star } from 'lucide-react'

const companies = [
  'Maison Lumière', 'FlowStack', 'Lefort & Associés', 'Studio K', 'DataPulse',
  'Hexagon Agency', 'Nova Commerce', 'PrimeConsult', 'Orbit Digital', 'Lyra Group',
  'Cascade Media', 'Vertex Studio', 'BlueWave SEO', 'Focal Point', 'Crest Analytics',
]

const badges = [
  { label: '4.9/5', sub: 'G2 Reviews', stars: 5 },
  { label: '#1', sub: 'Product Hunt', stars: 0 },
  { label: '4.8/5', sub: 'Trustpilot', stars: 5 },
]

export function TrustedBy() {
  const doubled = [...companies, ...companies]

  return (
    <section className="py-16 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <p className="text-center text-sm font-medium text-surface-400 dark:text-surface-500 mb-8 uppercase tracking-widest">
          Utilisé par 2 500+ équipes dans 45 pays
        </p>

        {/* Marquee */}
        <div className="relative overflow-hidden mask-fade-x mb-10">
          <div className="flex animate-marquee whitespace-nowrap">
            {doubled.map((name, i) => (
              <div key={i} className="flex items-center mx-8 shrink-0">
                <span className="text-sm font-semibold text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 transition-colors cursor-default">
                  {name}
                </span>
                <span className="mx-8 text-surface-200 dark:text-surface-700">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* Award badges */}
        <div className="flex flex-wrap items-center justify-center gap-6">
          {badges.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-sm"
            >
              <div>
                <p className="text-base font-black text-surface-900 dark:text-white">{b.label}</p>
                <p className="text-xs text-surface-400">{b.sub}</p>
              </div>
              {b.stars > 0 && (
                <div className="flex">
                  {[...Array(b.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
