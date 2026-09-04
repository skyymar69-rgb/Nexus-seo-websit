'use client'

import { useState } from 'react'
import { Globe, Search, Loader2, ShieldCheck, Zap, LineChart } from 'lucide-react'
import { Waves, Magnet, ClickSpark, FadeContent, CountUp, TiltedCard } from '@/components/bits'

/**
 * Héros — fond blanc, lignes marine ondulantes (React Bits Waves) en décor.
 * Le H1 et le formulaire sont rendus statiquement : ce sont les éléments
 * LCP, ils ne s'animent pas. Seule la carte de droite apparaît en fondu.
 */
export function Hero() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  return (
    <section className="relative overflow-hidden bg-white pb-16 pt-32 dark:bg-surface-950 lg:pb-24 lg:pt-40">
      <Waves lineColor="rgba(31, 59, 97, 0.10)" xGap={14} yGap={40} waveAmpX={28} waveAmpY={14} className="opacity-90 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]" />

      <div className="relative z-10 mx-auto grid max-w-container grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:gap-10">

        <div className="text-center lg:col-span-7 lg:text-left">
          <div className="mb-6 flex justify-center lg:justify-start">
            <span className="section-badge">
              <span className="h-2 w-2 rounded-full bg-accent-500" aria-hidden="true" />
              Audit SEO gratuit · GEO · AEO · LLMO
            </span>
          </div>

          <h1 className="mb-5 text-4xl text-navy-600 sm:text-5xl lg:text-display dark:text-white">
            Votre site est-il visible sur Google <span className="text-brand-500">et dans ChatGPT</span> ?
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-body-lg text-ink-muted lg:mx-0 dark:text-surface-400">
            Analysez votre site en 30 secondes : diagnostic technique, mots-clés, backlinks et présence dans
            les moteurs IA. Des recommandations concrètes, pas de jargon.
          </p>

          <form
            aria-label="Lancer un audit SEO gratuit"
            onSubmit={(e) => {
              e.preventDefault()
              const input = (e.target as HTMLFormElement).querySelector('input') as HTMLInputElement
              const url = input?.value?.trim()
              if (url) {
                setIsAnalyzing(true)
                window.location.href = `/dashboard/audit?url=${encodeURIComponent(url)}`
              }
            }}
            className="mx-auto mb-4 flex w-full max-w-xl flex-col gap-3 sm:flex-row lg:mx-0"
          >
            <label className="relative flex-1">
              <span className="sr-only">URL du site web à analyser</span>
              <Globe className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle" aria-hidden="true" />
              <input
                type="url"
                name="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://www.monsite.fr"
                className="field pl-12"
              />
            </label>
            <ClickSpark className="inline-block">
              <Magnet>
                <button type="submit" disabled={isAnalyzing} className="btn-primary w-full whitespace-nowrap sm:w-auto">
                  {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Search className="h-5 w-5" aria-hidden="true" />}
                  {isAnalyzing ? 'Analyse en cours…' : 'Analyser mon site'}
                </button>
              </Magnet>
            </ClickSpark>
          </form>

          <p className="mb-10 text-sm text-ink-muted dark:text-surface-400">
            Sans inscription · Résultats immédiats · Export PDF, Markdown, JSON
          </p>

          <dl className="mb-8 grid grid-cols-3 gap-4 sm:max-w-lg lg:mx-0" aria-label="Chiffres clés">
            {[
              { value: 50, suffix: '+', label: 'outils gratuits', icon: Zap },
              { value: 10, suffix: '+', label: 'moteurs IA suivis', icon: LineChart },
              { value: 0, suffix: ' €', label: 'pour toujours', icon: ShieldCheck },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="rounded-2xl border border-surface-300 bg-white/90 p-4 text-left shadow-elevation-sm dark:border-surface-800 dark:bg-surface-900/90">
                  <Icon className="mb-2 h-4 w-4 text-navy-500 dark:text-navy-200" aria-hidden="true" />
                  <dt className="order-2 text-xs font-medium uppercase tracking-wider text-ink-muted dark:text-surface-400">{stat.label}</dt>
                  <dd className="font-display text-2xl font-extrabold text-navy-600 dark:text-white">
                    <CountUp to={stat.value} suffix={stat.suffix} duration={1.4} />
                  </dd>
                </div>
              )
            })}
          </dl>

          <p className="text-sm font-medium text-ink-muted dark:text-surface-400">
            Développé par{' '}
            <a href="https://kayzen-lyon.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-500 underline-offset-4 hover:underline">
              Kayzen Web
            </a>
            , agence web à Lyon
          </p>
        </div>

        <FadeContent className="lg:col-span-5" delay={0.15} direction="left">
          <TiltedCard className="mx-auto max-w-md">
            <AuditPreviewCard />
          </TiltedCard>
        </FadeContent>
      </div>
    </section>
  )
}

/** Aperçu d'un rapport d'audit : HTML statique, chiffres lisibles sans JavaScript. */
function AuditPreviewCard() {
  const score = 94
  const circumference = 2 * Math.PI * 44
  const rows = [
    { label: 'Performance', value: 96, tone: 'bg-accent-500' },
    { label: 'Accessibilité', value: 91, tone: 'bg-navy-500' },
    { label: 'Visibilité IA', value: 87, tone: 'bg-brand-500' },
  ]
  return (
    <div className="card overflow-hidden shadow-elevation-lg" role="img" aria-label="Aperçu d’un rapport d’audit Nexus : score SEO 94 sur 100, performance 96, accessibilité 91, visibilité IA 87">
      <div className="flex items-center gap-2 border-b border-surface-300 bg-surface-100 px-5 py-3 dark:border-surface-800 dark:bg-surface-850">
        <span className="h-2.5 w-2.5 rounded-full bg-surface-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-surface-300" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-surface-300" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-ink-muted">nexus.kayzen-lyon.com/audit</span>
      </div>
      <div className="p-6">
        <div className="mb-6 flex items-center gap-5">
          <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0" aria-hidden="true">
            <circle cx="50" cy="50" r="44" fill="none" stroke="#eeeeee" strokeWidth="8" />
            <circle
              cx="50" cy="50" r="44" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={circumference * (1 - score / 100)}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="54" textAnchor="middle" className="fill-navy-600 font-display" fontSize="26" fontWeight="800">{score}</text>
          </svg>
          <div>
            <p className="text-label-sm uppercase tracking-wider text-ink-muted">Score SEO</p>
            <p className="font-display text-headline-md text-navy-600 dark:text-white">Très bon</p>
            <p className="text-sm text-ink-muted">50 contrôles · 12 s</p>
          </div>
        </div>
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.label}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="text-ink dark:text-surface-200">{row.label}</span>
                <span className="font-semibold text-navy-600 dark:text-white">{row.value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-200 dark:bg-surface-800">
                <div className={`h-full rounded-full ${row.tone}`} style={{ width: `${row.value}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex items-center justify-between border-t border-surface-300 pt-4 text-xs text-ink-muted dark:border-surface-800">
          <span>3 actions prioritaires</span>
          <span className="section-badge-navy">Rapport prêt</span>
        </div>
      </div>
    </div>
  )
}
