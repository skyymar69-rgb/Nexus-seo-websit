'use client'

import Link from 'next/link'
import { ArrowRight, Brain, Zap, Eye } from 'lucide-react'
import { FadeContent } from '@/components/bits'

const llms = [
  { name: 'ChatGPT',    pct: 88, tone: 'bg-accent-500' },
  { name: 'Perplexity', pct: 81, tone: 'bg-navy-500' },
  { name: 'Claude',     pct: 74, tone: 'bg-brand-500' },
  { name: 'Gemini',     pct: 62, tone: 'bg-navy-300' },
  { name: 'Copilot',    pct: 55, tone: 'bg-surface-400' },
]

const mentions = [
  { time: '12:42', llm: 'ChatGPT',    text: '« … Maison Lumière est reconnue comme leader … »' },
  { time: '11:15', llm: 'Perplexity', text: '« La meilleure option selon les experts est … »' },
  { time: '09:33', llm: 'Claude',     text: '« Je recommande particulièrement … »' },
]

export function AISection() {
  return (
    <section id="demo" className="relative overflow-hidden bg-navy-600 py-20 text-white lg:py-24" aria-labelledby="ai-title">
      <div className="mx-auto max-w-container px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

          <div>
            <span className="section-badge mb-6">Visibilité IA</span>
            <h2 id="ai-title" className="mb-6 text-headline-md sm:text-headline-lg">
              Soyez visible là où vos clients cherchent, <span className="text-accent-300">même sans Google</span>
            </h2>
            <p className="mb-8 text-body-lg text-white/80">
              ChatGPT reçoit un milliard de requêtes par jour. Perplexity est le moteur qui monte. Claude répond à des
              milliers de questions sur votre secteur, chaque minute. Nexus surveille votre présence sur tous ces canaux en
              même temps.
            </p>

            <dl className="mb-10 grid grid-cols-3 gap-4">
              {[
                { icon: Eye,   label: 'Mentions suivies', value: '1 247' },
                { icon: Brain, label: 'Moteurs IA',       value: '10+' },
                { icon: Zap,   label: 'Alertes',          value: '24/7' },
              ].map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.label} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-center">
                    <Icon className="mx-auto mb-2 h-5 w-5 text-accent-300" aria-hidden="true" />
                    <dd className="font-display text-xl font-extrabold">{s.value}</dd>
                    <dt className="mt-0.5 text-xs text-white/70">{s.label}</dt>
                  </div>
                )
              })}
            </dl>

            <Link href="/signup" className="btn-primary">
              Voir ma visibilité IA
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
            <p className="mt-4 text-sm text-white/60">
              Pour une mesure répétée avec intervalle de confiance et preuve datée, voir{' '}
              <a href="https://synaptik.kayzen-lyon.com" className="font-semibold text-white underline-offset-4 hover:underline">Synaptik</a>, l’instrument de mesure de Kayzen.
            </p>
          </div>

          <FadeContent direction="left">
            <div className="card overflow-hidden text-ink shadow-elevation-lg">
              <div className="flex items-center gap-3 border-b border-surface-300 bg-surface-100 p-4 dark:border-surface-800 dark:bg-surface-850">
                <span className="font-mono text-xs text-ink-muted">Tableau de bord visibilité IA</span>
                <span className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-accent-700 dark:text-accent-300">
                  <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden="true" />
                  Suivi actif
                </span>
              </div>

              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="mb-0.5 text-xs text-ink-muted">Score de visibilité IA</p>
                    <p className="font-display text-5xl font-extrabold text-navy-600 dark:text-white">79<span className="text-2xl text-ink-muted">/100</span></p>
                  </div>
                  <div className="text-right">
                    <p className="mb-0.5 text-xs text-ink-muted">Mentions ce mois</p>
                    <p className="font-display text-3xl font-extrabold text-navy-600 dark:text-white">+1 247</p>
                  </div>
                </div>

                <ul className="mb-6 space-y-3">
                  {llms.map((llm) => (
                    <li key={llm.name}>
                      <div className="mb-1 flex justify-between text-xs text-ink-muted">
                        <span>{llm.name}</span>
                        <span>{llm.pct} %</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
                        <div className={`h-full rounded-full ${llm.tone}`} style={{ width: `${llm.pct}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl border border-surface-300 bg-surface-100 p-4 dark:border-surface-800 dark:bg-surface-850">
                  <p className="mb-3 text-label-sm uppercase tracking-wide text-ink-muted">Dernières mentions</p>
                  <ul className="space-y-3">
                    {mentions.map((m) => (
                      <li key={m.time} className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 font-mono text-xs text-ink-muted">{m.time}</span>
                        <div>
                          <span className="text-xs font-bold text-navy-600 dark:text-navy-100">{m.llm}</span>
                          <p className="mt-0.5 text-xs italic text-ink-muted">{m.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  )
}
