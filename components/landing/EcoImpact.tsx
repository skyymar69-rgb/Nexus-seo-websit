'use client'

import { Leaf, Zap, Globe, Server, ArrowRight, TrendingDown, Gauge } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const stats = [
  { value: '1,76 g', unit: 'CO₂ par page vue', desc: 'Émission moyenne d’une page web standard. Les pages mal optimisées peuvent atteindre 5 à 10 g.', source: 'Website Carbon Calculator' },
  { value: '2 %', unit: 'des émissions mondiales', desc: 'Le numérique pèse autant que le transport aérien. Chaque page lourde y contribue.', source: 'The Shift Project' },
  { value: '×3', unit: 'poids moyen depuis 2010', desc: 'Le poids moyen d’une page est passé de 700 Ko à 2,2 Mo. Plus lourd, c’est plus de serveurs et plus d’énergie.', source: 'HTTP Archive' },
]

const optimizations = [
  { icon: Gauge, title: 'Core Web Vitals', problem: 'Un LCP supérieur à 4 s triple le rebond et surconsomme côté serveur', solution: 'Nexus identifie les éléments bloquants et recommande des corrections concrètes' },
  { icon: Zap, title: 'CSS et JS non différés', problem: '500 Ko de CSS et JS inutiles, c’est environ 0,5 g de CO₂ par visite', solution: 'Détectez le code mort et les ressources bloquantes pour alléger de 60 %' },
  { icon: Globe, title: 'Images non optimisées', problem: 'Un PNG de 2 Mo au lieu d’un WebP, c’est dix fois le transfert réseau', solution: 'Auditez toutes vos images : format, compression, chargement différé, dimensions' },
  { icon: Server, title: 'Pages mal indexées', problem: 'Les robots revisitent des pages inutiles : erreurs 404, redirections en chaîne', solution: 'Le crawl détecte les pages orphelines, les boucles de redirection et le budget d’exploration gaspillé' },
]

export function EcoImpact() {
  return (
    <section className="relative overflow-hidden bg-navy-700 py-20 text-white lg:py-24" id="eco" aria-labelledby="eco-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="section-badge mb-6">
            <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
            Notre raison d’être
          </span>
          <h2 id="eco-title" className="mb-6 text-headline-md sm:text-headline-lg">
            Optimiser le SEO, <span className="text-accent-300">c’est réduire l’empreinte carbone</span>
          </h2>
          <p className="text-body-lg text-white/80">
            Une page rapide, légère et bien référencée consomme moins d’énergie, sollicite moins les serveurs et offre une
            meilleure expérience. Le SEO technique et la performance ne sont pas que des leviers de croissance : ce sont
            des actes concrets pour un numérique plus sobre.
          </p>
        </div>

        <ul className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((s, i) => (
            <FadeContent key={s.unit} delay={i * 0.08}>
              <li className="h-full rounded-3xl border border-white/15 bg-white/10 p-8">
                <p className="mb-4">
                  <span className="font-display text-4xl font-extrabold text-accent-300">{s.value}</span>
                  <span className="mt-1 block text-sm text-white/70">{s.unit}</span>
                </p>
                <p className="mb-3 text-sm leading-relaxed text-white/80">{s.desc}</p>
                <p className="text-xs text-white/50">Source : {s.source}</p>
              </li>
            </FadeContent>
          ))}
        </ul>

        <div className="mb-14">
          <h3 className="mb-8 text-center text-headline-md">Comment Nexus réduit concrètement votre impact</h3>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {optimizations.map((opt) => {
              const Icon = opt.icon
              return (
                <li key={opt.title} className="rounded-3xl border border-white/15 bg-white/10 p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-500/20 text-accent-300">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="mb-2 font-bold">{opt.title}</h4>
                      <p className="mb-2 flex items-start gap-1.5 text-sm text-red-200">
                        <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {opt.problem}
                      </p>
                      <p className="flex items-start gap-1.5 text-sm text-accent-200">
                        <Leaf className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {opt.solution}
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mb-14 rounded-3xl border border-accent-400/30 bg-white/10 p-8 text-center sm:p-10">
          <p className="mb-4 text-title-lg">
            Site rapide + SEO optimisé = moins de requêtes serveur, moins de transfert, moins d’énergie
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <span className="rounded-full border border-red-300/30 bg-red-500/10 px-3 py-1.5 text-red-100">Page 3 Mo, LCP 6 s → ~4,5 g CO₂ par visite</span>
            <ArrowRight className="h-4 w-4 text-accent-300" aria-hidden="true" />
            <span className="rounded-full border border-accent-400/30 bg-accent-500/10 px-3 py-1.5 text-accent-100">Page 400 Ko, LCP 1,2 s → ~0,3 g CO₂ par visite</span>
          </div>
          <p className="mt-4 text-sm text-white/60">
            Sur 100 000 pages vues par mois, c’est l’équivalent de 500 km en voiture économisés chaque mois.
          </p>
        </div>

        <div className="rounded-3xl bg-white p-8 text-center text-ink shadow-elevation-lg sm:p-10 dark:bg-surface-900 dark:text-white">
          <h3 className="mb-4 text-headline-md text-navy-600 dark:text-white">Nexus diagnostique. Kayzen Web construit.</h3>
          <p className="mx-auto mb-6 max-w-2xl leading-relaxed text-ink-muted dark:text-surface-400">
            Nexus identifie les problèmes. Pour aller plus loin, <strong className="text-ink dark:text-white">Kayzen Web</strong> crée des sites React et Next.js
            ultra-légers, optimisés SEO dès la conception, avec un bilan carbone minimal. Et avec <strong className="text-ink dark:text-white">Kayzen Reconditionné</strong>,
            l’engagement va jusqu’au matériel.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="https://kayzen-lyon.com" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Découvrir Kayzen Web <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href="https://www.kayzen-lyon.fr" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <Leaf className="h-4 w-4" aria-hidden="true" /> Kayzen Reconditionné
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
