'use client'

import { CountUp } from '@/components/bits'

const stats = [
  { value: 50,  suffix: '+', label: 'Outils IA & SEO' },
  { value: 10,  suffix: '+', label: 'Moteurs IA suivis' },
  { value: 6,   suffix: '',  label: 'Catégories d’analyse' },
  { value: 100, suffix: ' %', label: 'Gratuit, sans limite' },
]

export function Stats() {
  return (
    <section className="bg-white py-16 dark:bg-surface-950" aria-label="Chiffres clés de Nexus">
      <div className="mx-auto max-w-5xl px-6">
        <dl className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <dd className="mb-1.5 font-display text-headline-lg text-navy-600 dark:text-white sm:text-5xl">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </dd>
              <dt className="text-sm font-medium text-ink-muted dark:text-surface-400">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
