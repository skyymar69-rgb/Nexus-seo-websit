'use client'

import { Leaf, Zap, Globe, Shield, Sparkles, ArrowRight } from 'lucide-react'

const reasons = [
  {
    icon: Sparkles,
    title: 'Premier outil GEO + AEO + LLMO',
    desc: 'Nexus est le seul outil qui combine l\'optimisation pour Google SGE, les featured snippets et les reponses des LLMs (ChatGPT, Claude, Gemini) en une seule plateforme.',
    color: 'from-brand-500 to-violet-500',
  },
  {
    icon: Zap,
    title: '30+ outils SEO gratuits',
    desc: 'Audit technique, suivi de positions, analyse de backlinks, generateur de contenu, keyword research — tout est inclus sans limitation et sans carte bancaire.',
    color: 'from-violet-500 to-cyan-500',
  },
  {
    icon: Leaf,
    title: 'SEO eco-responsable',
    desc: 'Un site rapide et bien reference consomme moins d\'energie. Nexus vous aide a reduire le poids de vos pages et a adopter les bonnes pratiques du web durable.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Globe,
    title: 'Concu par une agence web',
    desc: 'Nexus est developpe par Kayzen Web, agence lyonnaise de creation de sites React/Next.js performants. L\'outil est ne de l\'experience terrain avec de vrais clients.',
    color: 'from-cyan-500 to-brand-500',
  },
  {
    icon: Shield,
    title: 'Donnees hebergees en Europe',
    desc: 'Vos donnees sont hebergees en Europe via Vercel et Railway, dans le respect du RGPD. Aucune revente de donnees, aucune utilisation pour entrainer des modeles IA.',
    color: 'from-brand-500 to-cyan-500',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="section-badge mx-auto mb-4">Pourquoi Nexus</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Ce qui rend Nexus{' '}
            <span className="gradient-text">different.</span>
          </h2>
          <p className="text-lg text-surface-700 dark:text-surface-400">
            Un outil gratuit, honnete et concu pour le SEO de demain.
          </p>
        </div>

        {/* Reasons grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {reasons.slice(0, 3).map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="card-hover p-7 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-surface-900 dark:text-white">{r.title}</h3>
                <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{r.desc}</p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reasons.slice(3).map((r) => {
            const Icon = r.icon
            return (
              <div key={r.title} className="card p-6 flex items-start gap-5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-white mb-2">{r.title}</h3>
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed">{r.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Kayzen CTA */}
        <div className="text-center mt-12 pt-10 border-t border-surface-200 dark:border-surface-800">
          <p className="text-surface-700 dark:text-surface-400 mb-4">
            Besoin d&apos;aller plus loin ? Kayzen Web cree des sites optimises des la conception.
          </p>
          <a
            href="https://internet.kayzen-lyon.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:gap-3 transition-all"
          >
            Decouvrir Kayzen Web <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
