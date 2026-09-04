'use client'

import { Check, X, Minus } from 'lucide-react'

const features = [
  { label: 'Audit SEO technique', nexus: true,  semrush: true,  ahrefs: true,  moz: true  },
  { label: 'Suivi de mots-clés, national et local',     nexus: true,  semrush: true,  ahrefs: true,  moz: true  },
  { label: 'Analyse de backlinks',   nexus: true,  semrush: true,  ahrefs: true,  moz: true  },
  { label: 'GEO (Google SGE)',    nexus: true,  semrush: false, ahrefs: false, moz: false },
  { label: 'AEO (featured snippets IA)', nexus: true, semrush: 'partial', ahrefs: false, moz: false },
  { label: 'LLMO (ChatGPT, Claude, Gemini)', nexus: true, semrush: false, ahrefs: false, moz: false },
  { label: 'Suivi de 10 moteurs IA', nexus: true, semrush: false, ahrefs: false, moz: false },
  { label: 'Serveur MCP pour les agents', nexus: true, semrush: false, ahrefs: false, moz: false },
  { label: 'Rapports white-label', nexus: true, semrush: true, ahrefs: false, moz: 'partial' },
  { label: 'API complète',         nexus: true, semrush: true,  ahrefs: true,  moz: true  },
  { label: 'Gratuit, sans limitation', nexus: true, semrush: false, ahrefs: false, moz: false },
]

const tools = [
  { name: 'Nexus',   price: 'Gratuit', highlight: true  },
  { name: 'Semrush', price: 'Dès 119 €', highlight: false },
  { name: 'Ahrefs',  price: 'Dès 99 €', highlight: false },
  { name: 'Moz',     price: 'Dès 99 €', highlight: false },
]

function Cell({ val }: { val: boolean | 'partial' }) {
  if (val === true) return <Check className="mx-auto h-5 w-5 text-accent-600" aria-label="Disponible" />
  if (val === 'partial') return <Minus className="mx-auto h-5 w-5 text-amber-500" aria-label="Partiel" />
  return <X className="mx-auto h-5 w-5 text-surface-400" aria-label="Non disponible" />
}

export function Comparison() {
  return (
    <section className="bg-surface-100 py-20 dark:bg-surface-900/50 lg:py-24" aria-labelledby="comparison-title">
      <div className="mx-auto max-w-5xl px-6">

        <div className="mb-12 text-center">
          <span className="section-badge mb-4">Pourquoi Nexus</span>
          <h2 id="comparison-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">
            La seule plateforme qui couvre <span className="gradient-text">l’ère de l’IA</span>
          </h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Semrush, Ahrefs, Moz : des outils pensés pour 2015. Nexus est conçu pour 2026.
          </p>
        </div>

        <div className="card overflow-hidden">
          <div className="relative">
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-white to-transparent md:hidden dark:from-surface-900" aria-hidden="true" />
            <div className="overflow-x-auto scrollbar-thin">
              <table className="w-full" aria-label="Comparaison des fonctionnalités entre Nexus et ses concurrents">
                <thead>
                  <tr className="border-b border-surface-300 dark:border-surface-800">
                    <th scope="col" className="w-1/2 p-5 text-left text-sm font-semibold text-ink-muted dark:text-surface-400">Fonctionnalité</th>
                    {tools.map((tool) => (
                      <th key={tool.name} scope="col" className={`p-5 text-center ${tool.highlight ? 'border-l-2 border-accent-500 bg-accent-50 dark:bg-accent-900/20' : ''}`}>
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className={`font-display text-sm font-extrabold ${tool.highlight ? 'text-navy-600 dark:text-white' : 'text-ink dark:text-surface-300'}`}>{tool.name}</span>
                          <span className={`text-xs ${tool.highlight ? 'font-semibold text-accent-700 dark:text-accent-300' : 'text-ink-muted dark:text-surface-400'}`}>{tool.price}</span>
                          {tool.highlight && <span className="section-badge">Recommandé</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((f, i) => (
                    <tr key={f.label} className={`border-b border-surface-200 last:border-0 dark:border-surface-800/60 ${i % 2 === 0 ? '' : 'bg-surface-50 dark:bg-surface-850/40'}`}>
                      <th scope="row" className="p-4 pl-5 text-left text-sm font-normal text-ink dark:text-surface-300">{f.label}</th>
                      {[f.nexus, f.semrush, f.ahrefs, f.moz].map((val, j) => (
                        <td key={j} className={`p-4 text-center ${j === 0 ? 'border-l-2 border-accent-500 bg-accent-50 dark:bg-accent-900/20' : ''}`}>
                          <Cell val={val as boolean | 'partial'} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-surface-300 p-5 text-xs text-ink-muted dark:border-surface-800 dark:text-surface-400">
            <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent-600" aria-hidden="true" /> Disponible</div>
            <div className="flex items-center gap-1.5"><Minus className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" /> Partiel</div>
            <div className="flex items-center gap-1.5"><X className="h-3.5 w-3.5 text-surface-400" aria-hidden="true" /> Non disponible</div>
          </div>
        </div>
      </div>
    </section>
  )
}
