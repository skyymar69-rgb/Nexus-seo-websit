'use client'

import { useState } from 'react'
import { Check, ArrowRight, Zap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/useSession'

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Parfait pour démarrer',
    price: 99,
    color: 'from-brand-500 to-brand-600',
    features: [
      '1 site web',
      'Audit SEO IA complet',
      'Rapport GEO mensuel',
      'Suivi 50 mots-clés',
      'Monitoring 2 LLMs',
      'Support email',
    ],
    popular: false,
    cta: 'Commencer',
  },
  {
    id: 'professionnel',
    name: 'Professionnel',
    description: 'Pour les PME ambitieuses',
    price: 199,
    color: 'from-brand-600 to-violet-600',
    features: [
      '3 sites web',
      'Rapports GEO + AEO hebdomadaires',
      'Suivi 200 mots-clés',
      'Monitoring 5 LLMs',
      'Analyse 5 concurrents',
      'Optimisations contenu IA',
      'Support prioritaire',
    ],
    popular: true,
    cta: 'Commencer — le plus populaire',
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    description: 'Pour les équipes marketing',
    price: 299,
    color: 'from-violet-600 to-cyan-600',
    features: [
      'Sites illimités',
      'Rapports GEO + AEO + LLMO quotidiens',
      'Suivi 500 mots-clés',
      'Monitoring 10 LLMs',
      'Analyse 20 concurrents',
      'Rapports PDF white-label',
      'API complète',
      'Account manager dédié',
    ],
    popular: false,
    cta: 'Commencer',
  },
  {
    id: 'souveraine',
    name: 'Souveraine',
    description: 'Pour les grandes organisations',
    price: 499,
    color: 'from-cyan-600 to-brand-600',
    features: [
      'Tout Entreprise inclus',
      'Déploiement on-premise',
      'Intégration MCP & agents IA',
      'Dashboard 100% custom',
      'Mots-clés illimités',
      'Tous les LLMs (10+)',
      'SLA 99,9% garanti',
      'Support 24/7 dédié',
    ],
    popular: false,
    cta: 'Contacter les ventes',
  },
]

function PricingButton({ planId, isPopular, isAnnual }: { planId: string; isPopular: boolean; isAnnual: boolean }) {
  const { isAuthenticated } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  if (planId === 'souveraine') {
    return (
      <Link
        href="/contact"
        className={cn(
          'w-full py-2.5 rounded-xl text-sm font-semibold text-center mb-6 transition-all duration-200 flex items-center justify-center gap-2',
          'btn-primary'
        )}
      >
        Contacter les ventes
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
        // Stripe not configured — redirect to signup
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
          Commencer
          <ArrowRight className="w-3.5 h-3.5" />
        </>
      )}
    </button>
  )
}

export function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-y border-surface-200 dark:border-surface-800/60">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-badge mx-auto mb-4">Tarification</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Simple, transparent,{' '}
            <span className="gradient-text">sans surprise</span>
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400 mb-8">
            14 jours d&apos;essai gratuit · Sans carte bancaire · Résiliation à tout moment
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
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => {
            const displayPrice = isAnnual ? Math.round(plan.price * 0.8) : plan.price
            const isPopular = plan.popular

            return (
              <div
                key={plan.id}
                className={cn(
                  'relative rounded-2xl p-6 flex flex-col transition-all duration-300',
                  isPopular
                    ? 'bg-gradient-to-b from-brand-600 to-violet-600 text-white shadow-brand'
                    : 'card'
                )}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-white text-brand-600 flex items-center gap-1 shadow-sm whitespace-nowrap">
                      <Zap className="w-3 h-3" />
                      Plus populaire
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={cn('text-lg font-bold mb-1', isPopular ? 'text-white' : 'text-surface-900 dark:text-white')}>
                    {plan.name}
                  </h3>
                  <p className={cn('text-xs', isPopular ? 'text-white/70' : 'text-surface-400')}>
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className={cn('text-4xl font-black', isPopular ? 'text-white' : 'text-surface-900 dark:text-white')}>
                      {displayPrice}€
                    </span>
                    <span className={cn('text-sm', isPopular ? 'text-white/60' : 'text-surface-400')}>/mois</span>
                  </div>
                  {isAnnual && (
                    <p className={cn('text-xs mt-1', isPopular ? 'text-white/60' : 'text-surface-400')}>
                      Facturé {Math.round(plan.price * 0.8 * 12)}€/an
                    </p>
                  )}
                </div>

                <PricingButton planId={plan.id} isPopular={isPopular} isAnnual={isAnnual} />

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <div className={cn(
                        'w-4.5 h-4.5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        isPopular ? 'bg-white/20' : 'bg-brand-50 dark:bg-brand-950/40'
                      )}>
                        <Check className={cn('w-3 h-3', isPopular ? 'text-white' : 'text-brand-600 dark:text-brand-400')} />
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

        <p className="text-center text-surface-400 dark:text-surface-500 text-sm mt-10">
          Toutes taxes comprises · Facture TVA disponible · Support RGPD inclus
        </p>
      </div>
    </section>
  )
}
