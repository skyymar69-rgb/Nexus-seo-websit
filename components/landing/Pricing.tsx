'use client'

import { useState } from 'react'
import { Check, ArrowRight, Zap, Loader2, Crown, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/useSession'

const plans = [
  {
    id: 'free',
    name: 'Gratuit',
    description: 'Auditez votre site gratuitement',
    priceMonthly: 0,
    priceAnnual: 0,
    features: [
      '5 audits / mois',
      '10 mots-cles suivis',
      '1 site web',
      'Visibilite IA (GEO/AEO)',
      'Rapports GEO & AEO',
      'Chat IA integre',
      'Monitoring 2 LLMs',
    ],
    popular: false,
    cta: 'Commencer gratuitement',
    badge: null,
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Pour les professionnels du SEO',
    priceMonthly: 49.99,
    priceAnnual: 39.99,
    features: [
      'Audits illimites',
      '100 mots-cles suivis',
      '5 sites web',
      'Rapports LLMO complets',
      'Export PDF',
      'Analyse 10 concurrents',
      'Monitoring 4 LLMs',
      'Support email prioritaire',
    ],
    popular: true,
    cta: "Commencer l'essai gratuit",
    badge: null,
  },
  {
    id: 'expert',
    name: 'Expert',
    description: "SEO avance + acces Agence Kayzen",
    priceMonthly: 99.99,
    priceAnnual: 79.99,
    features: [
      'Tout illimite',
      'Acces API complete',
      'White label',
      'Dashboard personnalise',
      'Support dedie',
      'Concurrents illimites',
      'Tous les LLMs (10+)',
      "Acces prioritaire Agence Kayzen",
    ],
    popular: false,
    cta: "Acces Agence Kayzen",
    badge: 'agency',
  },
]

function PricingButton({
  planId,
  cta,
  isPopular,
  isAnnual,
  isAgency,
}: {
  planId: string
  cta: string
  isPopular: boolean
  isAnnual: boolean
  isAgency: boolean
}) {
  const { isAuthenticated } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (isAgency) {
    return (
      <a
        href="https://internet.kayzen-lyon.fr"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all duration-200 flex items-center justify-center gap-2',
          'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 shadow-lg'
        )}
      >
        {cta}
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    )
  }

  if (planId === 'free') {
    return (
      <Link
        href="/signup"
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all duration-200 flex items-center justify-center gap-2',
          'btn-primary'
        )}
      >
        {cta}
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    )
  }

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push(`/signup?plan=${planId}`)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billing: isAnnual ? 'annual' : 'monthly' }),
      })
      const data = await res.json()

      if (data.url) {
        window.location.href = data.url
      } else if (data.error) {
        router.push(`/signup?plan=${planId}`)
      }
    } catch {
      router.push(`/signup?plan=${planId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={cn(
        'w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all duration-200 flex items-center justify-center gap-2',
        isPopular
          ? 'bg-white text-brand-600 hover:bg-white/90'
          : 'btn-primary',
        loading && 'opacity-70 cursor-not-allowed'
      )}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  )
}

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="scroll-mt-24 py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge mx-auto mb-4">Tarification</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Simple, transparent,{' '}
            <span className="gradient-text">sans surprise</span>
          </h2>
          <p className="text-lg text-surface-700 dark:text-surface-400 mb-8">
            Plan gratuit inclus &middot; Sans carte bancaire &middot; Annulation a tout moment
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center p-1 rounded-full bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                !isAnnual
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400'
              )}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn(
                'px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                isAnnual
                  ? 'bg-white dark:bg-surface-900 text-surface-900 dark:text-white shadow-sm'
                  : 'text-surface-500 dark:text-surface-400'
              )}
            >
              Annuel
              <span className="px-1.5 py-0.5 text-xs font-bold rounded bg-accent-500 text-white">
                -20%
              </span>
            </button>
          </div>

          {/* Urgency badge */}
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-300/50 dark:border-amber-700/40 text-sm font-semibold text-amber-700 dark:text-amber-300">
              <span aria-hidden="true">🔥</span>
              Offre de lancement — Tarifs bloqués pour les 500 premiers inscrits
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const displayPrice = isAnnual ? plan.priceAnnual : plan.priceMonthly
            const isPopular = plan.popular
            const isAgency = plan.badge === 'agency'

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl p-6 flex flex-col transition-all duration-300',
                  isPopular
                    ? 'bg-gradient-to-b from-brand-600 to-violet-600 text-white shadow-brand ring-2 ring-brand-400/30 scale-[1.03]'
                    : isAgency
                      ? 'card ring-1 ring-amber-400/30'
                      : 'card'
                )}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-brand-600 flex items-center gap-1 shadow-sm whitespace-nowrap">
                      <Zap className="w-3 h-3" />
                      Populaire
                    </span>
                  </div>
                )}

                {/* Agency badge */}
                {isAgency && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <a
                      href="https://internet.kayzen-lyon.fr"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white flex items-center gap-1 shadow-sm whitespace-nowrap hover:from-amber-600 hover:to-amber-700 transition-all"
                    >
                      <Crown className="w-3 h-3" />
                      Acces Agence
                    </a>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={cn('text-lg font-bold mb-1', isPopular ? 'text-white' : 'text-surface-900 dark:text-white')}>
                    {plan.name}
                  </h3>
                  <p className={cn('text-xs', isPopular ? 'text-white/70' : 'text-surface-600 dark:text-surface-400')}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn('text-4xl font-black', isPopular ? 'text-white' : 'text-surface-900 dark:text-white')}>
                      {displayPrice === 0 ? '0' : `${displayPrice.toFixed(2).replace('.', ',')}`}&euro;
                    </span>
                    <span className={cn('text-sm', isPopular ? 'text-white/60' : 'text-surface-600 dark:text-surface-400')}>/mois</span>
                  </div>
                  {isAnnual && displayPrice > 0 && (
                    <p className={cn('text-xs mt-1', isPopular ? 'text-white/60' : 'text-surface-600 dark:text-surface-400')}>
                      Facture {(plan.priceAnnual * 12).toFixed(2).replace('.', ',')}&euro;/an
                    </p>
                  )}
                  {!isAnnual && displayPrice > 0 && (
                    <p className={cn('text-xs mt-1', isPopular ? 'text-white/60' : 'text-surface-600 dark:text-surface-400')}>
                      ou {plan.priceAnnual.toFixed(2).replace('.', ',')}&euro;/mois en annuel
                    </p>
                  )}
                </div>

                <PricingButton
                  planId={plan.id}
                  cta={plan.cta}
                  isPopular={isPopular}
                  isAnnual={isAnnual}
                  isAgency={isAgency}
                />

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <div className={cn(
                        'w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        isPopular ? 'bg-white/20' : isAgency ? 'bg-amber-50 dark:bg-amber-950/40' : 'bg-brand-50 dark:bg-brand-950/40'
                      )}>
                        <Check className={cn(
                          'w-3 h-3',
                          isPopular ? 'text-white' : isAgency ? 'text-amber-600 dark:text-amber-400' : 'text-brand-600 dark:text-brand-400'
                        )} />
                      </div>
                      <span className={cn(isPopular ? 'text-white/80' : 'text-surface-600 dark:text-surface-400')}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Agency Banner */}
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-amber-500/10 to-brand-500/10 dark:from-amber-500/5 dark:to-brand-500/5 border border-amber-300/30 dark:border-amber-700/30 p-8 text-center">
          <p className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
            Besoin d&apos;un site web performant ?
          </p>
          <p className="text-surface-600 dark:text-surface-400 mb-5 max-w-xl mx-auto">
            L&apos;Agence Kayzen cree des sites optimises SEO des 1&nbsp;500&euro;
          </p>
          <a
            href="https://internet.kayzen-lyon.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Decouvrir l&apos;Agence Kayzen
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-center text-surface-600 dark:text-surface-500 text-sm mt-10">
          Toutes taxes comprises &middot; Facture TVA disponible &middot; Support RGPD inclus
        </p>
      </div>
    </section>
  )
}
