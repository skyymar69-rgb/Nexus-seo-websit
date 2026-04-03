import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe, isStripeEnabled } from '@/lib/stripe'
import Stripe from 'stripe'

export const runtime = 'nodejs'

// Disable body parsing — we need the raw body for signature verification
export const dynamic = 'force-dynamic'

async function getRawBody(request: NextRequest): Promise<Buffer> {
  const reader = request.body?.getReader()
  if (!reader) throw new Error('No request body')

  const chunks: Uint8Array[] = []
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function POST(request: NextRequest) {
  try {
    if (!isStripeEnabled() || !stripe) {
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 })
    }

    const rawBody = await getRawBody(request)
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invalid signature'
      console.error('Webhook signature verification failed:', message)
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 })
    }

    // Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId

        if (userId && planId) {
          // Update user plan
          await prisma.user.update({
            where: { id: userId },
            data: { plan: planId },
          })

          // Update subscription
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              plan: planId,
              status: 'active',
              stripeSubscriptionId: session.subscription as string,
              currentPeriodEnd: session.expires_at
                ? new Date(session.expires_at * 1000)
                : null,
            },
            create: {
              userId,
              plan: planId,
              status: 'active',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
            },
          })

          // Create notification
          await prisma.notification.create({
            data: {
              userId,
              type: 'billing',
              title: 'Abonnement activé',
              message: `Votre plan ${planId} est maintenant actif. Bienvenue !`,
            },
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          const planId = subscription.metadata?.planId || 'free'
          const status = subscription.status === 'active' ? 'active' : subscription.status

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              plan: planId,
              status,
              currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
            },
          })

          await prisma.user.update({
            where: { id: userId },
            data: { plan: planId },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Downgrade to free
          await prisma.user.update({
            where: { id: userId },
            data: { plan: 'free' },
          })

          await prisma.subscription.updateMany({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              plan: 'free',
              status: 'canceled',
            },
          })

          await prisma.notification.create({
            data: {
              userId,
              type: 'billing',
              title: 'Abonnement annulé',
              message: 'Votre abonnement a été annulé. Vous êtes passé au plan gratuit.',
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Find user by Stripe customer ID
        const sub = await prisma.subscription.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (sub) {
          await prisma.notification.create({
            data: {
              userId: sub.userId,
              type: 'billing',
              title: 'Échec de paiement',
              message: 'Le paiement de votre abonnement a échoué. Veuillez mettre à jour vos informations de paiement.',
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
