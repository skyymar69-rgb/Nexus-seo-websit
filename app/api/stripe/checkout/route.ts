import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, PLAN_PRICE_MAP, isStripeEnabled } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    if (!isStripeEnabled() || !stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré. Contactez l\'administrateur.' },
        { status: 503 }
      )
    }

    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { planId, billing = 'monthly' } = body as {
      planId: string
      billing?: 'monthly' | 'annual'
    }

    // Validate plan
    const priceConfig = PLAN_PRICE_MAP[planId]
    if (!priceConfig) {
      return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
    }

    const priceId = billing === 'annual' ? priceConfig.annual : priceConfig.monthly
    if (!priceId) {
      return NextResponse.json(
        { error: `Prix Stripe non configuré pour ${planId} (${billing})` },
        { status: 500 }
      )
    }

    const userId = session.user.id
    const userEmail = session.user.email

    // Get or create Stripe customer
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    let customerId = subscription?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail || undefined,
        metadata: { userId },
      })
      customerId = customer.id

      // Create or update subscription record
      if (subscription) {
        await prisma.subscription.update({
          where: { userId },
          data: { stripeCustomerId: customerId },
        })
      } else {
        await prisma.subscription.create({
          data: {
            userId,
            plan: 'free',
            status: 'active',
            stripeCustomerId: customerId,
          },
        })
      }
    }

    // Create Checkout Session
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?checkout=success&plan=${planId}`,
      cancel_url: `${appUrl}/dashboard?checkout=cancel`,
      metadata: {
        userId,
        planId,
        billing,
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
        trial_period_days: 14,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    const message = error instanceof Error ? error.message : 'Erreur lors de la création du checkout'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
