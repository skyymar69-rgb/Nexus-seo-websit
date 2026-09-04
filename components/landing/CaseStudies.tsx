'use client'

import { Globe, ExternalLink } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const cases = [
  { category: 'Transport & tourisme', company: 'France Évasions', desc: 'Site vitrine optimisé pour le référencement local et national dans le transport touristique.', tags: ['SEO', 'Performance'] },
  { category: 'Commerce de proximité', company: 'Boucherie de l’Avenue', desc: 'Site vitrine rapide et éco-responsable pour un commerce lyonnais, optimisé pour le SEO local.', tags: ['SEO local', 'Éco-web'] },
  { category: 'Bâtiment & rénovation', company: 'Net Rénovation', desc: 'Site professionnel pour une entreprise de rénovation, avec structure SEO et pages de services optimisées.', tags: ['SEO technique', 'Contenu'] },
  { category: 'Photographie', company: 'Philippe Reynaud', desc: 'Portfolio photographe avec images WebP, chargement différé et performance maximale.', tags: ['Performance', 'Images'] },
  { category: 'Restauration', company: 'Grand Café du Commerce', desc: 'Site restaurant avec menu, horaires et fiche Google Business optimisée.', tags: ['SEO local', 'Mobile'] },
  { category: 'Culture & événementiel', company: 'Art Scenic', desc: 'Site événementiel avec contenu dynamique et SEO pour le secteur culturel.', tags: ['SEO', 'Contenu'] },
]

const tagClass: Record<string, string> = {
  'SEO': 'section-badge-navy',
  'SEO local': 'section-badge',
  'SEO technique': 'section-badge-navy',
  'Performance': 'section-badge',
  'Éco-web': 'section-badge',
  'Contenu': 'section-badge-primary',
  'Images': 'section-badge-primary',
  'Mobile': 'section-badge-navy',
}

export function CaseStudies() {
  return (
    <section id="cases" className="bg-white py-20 dark:bg-surface-950 lg:py-24" aria-labelledby="cases-title">
      <div className="mx-auto max-w-container px-6">

        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="section-badge-primary mb-4">Sites réalisés par Kayzen Web</span>
            <h2 id="cases-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
              Des sites optimisés <span className="gradient-text">dès la conception.</span>
            </h2>
          </div>
          <a href="https://kayzen-lyon.com/portfolio" target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm shrink-0">
            Voir le portfolio complet <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c, i) => (
            <FadeContent key={c.company} delay={(i % 3) * 0.08}>
              <li className="card-hover flex h-full flex-col p-7">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <p className="mb-1 text-xs text-ink-muted dark:text-surface-400">{c.category}</p>
                    <h3 className="text-title-lg text-ink dark:text-white">{c.company}</h3>
                  </div>
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-100 text-navy-700 dark:bg-navy-900/60 dark:text-navy-100">
                    <Globe className="h-4 w-4" aria-hidden="true" />
                  </div>
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-ink-muted dark:text-surface-400">{c.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <span key={tag} className={tagClass[tag] ?? 'section-badge-navy'}>{tag}</span>
                  ))}
                </div>
              </li>
            </FadeContent>
          ))}
        </ul>
      </div>
    </section>
  )
}
