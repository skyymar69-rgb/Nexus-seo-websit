'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    quote: "Nexus a transformé notre approche SEO. En 6 mois, notre trafic organique a plus que quadruplé. L'IA GEO de Nexus nous a positionnés sur toutes les AI Overviews Google de notre secteur.",
    author: 'Sophie Renard',
    role: 'CMO',
    company: 'Maison Lumière',
    initials: 'SR',
    stars: 5,
    metric: '+420% trafic',
    color: 'from-brand-500 to-violet-500',
  },
  {
    quote: "La stratégie LLMO de Nexus nous a permis de devenir la référence que ChatGPT recommande dans notre secteur. ROI exceptionnel dès le 3ème mois. Aucun autre outil n'offre cette visibilité IA.",
    author: 'Thomas Lefort',
    role: 'CEO',
    company: 'FlowStack',
    initials: 'TL',
    stars: 5,
    metric: '×4 mentions LLM',
    color: 'from-violet-500 to-cyan-500',
  },
  {
    quote: "Grâce à l'AEO Nexus, notre cabinet est maintenant la réponse suggérée sur toutes les requêtes juridiques stratégiques. Nos leads qualifiés ont explosé dès le 2ème mois.",
    author: 'Camille Dumont',
    role: 'Directrice Marketing',
    company: 'Lefort & Associés',
    initials: 'CD',
    stars: 5,
    metric: '+260% leads',
    color: 'from-cyan-500 to-brand-500',
  },
  {
    quote: "On avait essayé Semrush, Ahrefs, et même quelques outils IA. Rien de comparable à Nexus. La différence c'est le LLMO : on est cités dans les réponses IA là où nos concurrents n'existent pas.",
    author: 'Marc Bellamy',
    role: 'Head of Growth',
    company: 'TechFlow SaaS',
    initials: 'MB',
    stars: 5,
    metric: '#1 sur 67 requêtes',
    color: 'from-brand-500 to-cyan-500',
  },
  {
    quote: "Nexus nous a permis d'auditer 45 sites clients en une journée. Les rapports white-label sont bluffants. Nos clients voient enfin des résultats concrets sur les requêtes IA.",
    author: 'Julie Martin',
    role: 'Fondatrice',
    company: 'Agence Digitale Lyon',
    initials: 'JM',
    stars: 5,
    metric: '45 audits / jour',
    color: 'from-violet-500 to-brand-500',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <div className="section-badge mx-auto mb-4">Témoignages clients</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Ils ont fait confiance à Nexus.
            <br />
            <span className="gradient-text">Voici ce qu&apos;ils en pensent.</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400">
            847 avis vérifiés · Note moyenne 4,9/5 sur G2 &amp; Trustpilot
          </p>
        </div>

        {/* Main 3 testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {testimonials.slice(0, 3).map((t) => (
            <div key={t.author} className="card-hover p-7 flex flex-col gap-5 relative overflow-hidden">
              {/* Quote icon */}
              <Quote className="absolute top-5 right-5 w-8 h-8 text-surface-100 dark:text-surface-800" />

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Metric pill */}
              <div className={`inline-flex self-start px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${t.color}`}>
                {t.metric}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-surface-100 dark:border-surface-800">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.author}</p>
                  <p className="text-xs text-surface-400">{t.role} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Secondary 2 testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.slice(3).map((t) => (
            <div key={t.author} className="card p-6 flex flex-col sm:flex-row gap-5 relative overflow-hidden">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-bold text-white flex-shrink-0`}>
                {t.initials}
              </div>
              <div className="flex-1">
                <div className="flex gap-1 mb-2">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className={`ml-2 text-xs font-bold bg-gradient-to-r ${t.color} bg-clip-text text-transparent`}>{t.metric}</span>
                </div>
                <p className="text-surface-600 dark:text-surface-300 text-sm leading-relaxed mb-3">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.author} <span className="text-surface-400 font-normal">· {t.role}, {t.company}</span></p>
              </div>
            </div>
          ))}
        </div>

        {/* G2 / Trustpilot badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 pt-10 border-t border-surface-200 dark:border-surface-800">
          {[
            { platform: 'G2', rating: '4.9/5', reviews: '523 avis', color: 'text-orange-500' },
            { platform: 'Trustpilot', rating: '4.8/5', reviews: '324 avis', color: 'text-accent-500' },
            { platform: 'Product Hunt', rating: '#1 Product of the Day', reviews: '', color: 'text-amber-500' },
          ].map((b) => (
            <div key={b.platform} className="flex items-center gap-3 px-5 py-3 card rounded-xl">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <div>
                <span className={`font-bold text-sm ${b.color}`}>{b.platform}</span>
                <span className="text-surface-400 text-xs ml-1.5">{b.rating} {b.reviews && `· ${b.reviews}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
