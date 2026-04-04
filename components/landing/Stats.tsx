'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp, Globe, Zap, Users, Star, Layers } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: 340,  suffix: '%',  label: 'Trafic organique moyen',          desc: "En 6 mois d'accompagnement" },
  { icon: Globe,      value: 2.4,  suffix: '×',  label: 'Visibilité dans les LLMs',         desc: 'vs avant Nexus' },
  { icon: Users,      value: 2500, suffix: '+',  label: 'Équipes qui nous font confiance',   desc: 'Dans 45 pays' },
  { icon: Zap,        value: 56,   suffix: '+',  label: 'Outils SEO intégrés',               desc: 'Tout en une plateforme' },
  { icon: Star,       value: 4.9,  suffix: '/5', label: 'Note G2 & Trustpilot',              desc: 'Sur 847 avis vérifiés' },
  { icon: Layers,     value: 98,   suffix: '%',  label: 'Clients satisfaits',                desc: 'Taux de rétention annuel' },
]

function Counter({ target, suffix, isFloat }: { target: number; suffix: string; isFloat?: boolean }) {
  const [current, setCurrent] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true
        const duration = 1400
        let start: number | null = null

        const animate = (timestamp: number) => {
          if (!start) start = timestamp
          const elapsed = timestamp - start
          const progress = Math.min(elapsed / duration, 1)
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          const val = target * eased
          setCurrent(isFloat ? parseFloat(val.toFixed(1)) : Math.round(val))
          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [target, isFloat])

  return (
    <span ref={ref} aria-live="polite" aria-atomic="true">
      {isFloat ? current.toFixed(1) : current.toLocaleString('fr-FR')}{suffix}
    </span>
  )
}

export function Stats() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-surface-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-badge mx-auto mb-4">Résultats prouvés</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white">
            Des chiffres qui parlent d&apos;eux-mêmes
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="card-hover p-6 sm:p-8 group">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-3xl sm:text-4xl font-black gradient-text mb-1">
                  <Counter target={stat.value} suffix={stat.suffix} isFloat={!Number.isInteger(stat.value)} />
                </p>
                <p className="font-semibold text-surface-700 dark:text-surface-200 mb-1">{stat.label}</p>
                <p className="text-sm text-surface-400 dark:text-surface-500">{stat.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
