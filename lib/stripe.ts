import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY not set — Stripe features disabled')
}

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia' as any,
      typescript: true,
    })
  : null

// Map plan IDs to Stripe Price IDs (set via env vars)
export const PLAN_PRICE_MAP: Record<string, { monthly: string; annual: string }> = {
  explorer: {
    monthly: process.env.STRIPE_PRICE_EXPLORER_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_EXPLORER_ANNUAL || '',
  },
  professionnel: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL || '',
  },
  entreprise: {
    monthly: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_ENTERPRISE_ANNUAL || '',
  },
  souveraine: {
    monthly: process.env.STRIPE_PRICE_SOVEREIGN_MONTHLY || '',
    annual: process.env.STRIPE_PRICE_SOVEREIGN_ANNUAL || '',
  },
}

export function isStripeEnabled(): boolean {
  return !!stripe
}
