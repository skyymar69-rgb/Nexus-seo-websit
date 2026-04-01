import type { Metadata } from 'next'
import { Providers } from '@/app/providers'
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://nexus-seo.app'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Nexus SEO — La référence mondiale du SEO IA en 2026',
    template: '%s | Nexus SEO',
  },
  description:
    'Nexus est la plateforme SEO IA qui combine audit technique, suivi de mots-clés, analyse de backlinks et optimisation GEO·AEO·LLMO. Dominez Google, ChatGPT, Perplexity et tous les moteurs IA.',
  keywords: [
    'SEO', 'SEO IA', 'GEO', 'AEO', 'LLMO', 'audit SEO', 'suivi mots-clés',
    'backlinks', 'ChatGPT SEO', 'Perplexity SEO', 'plateforme SEO', 'outil SEO',
    'référencement naturel', 'visibilité IA', 'Google SGE',
  ],
  authors: [{ name: 'Nexus SEO' }],
  creator: 'Nexus SEO',
  publisher: 'Nexus SEO',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Nexus SEO',
    title: 'Nexus SEO — La référence mondiale du SEO IA en 2026',
    description:
      'Dominez Google, ChatGPT et tous les moteurs IA avec la seule plateforme SEO qui couvre GEO, AEO et LLMO.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Nexus SEO Dashboard' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus SEO — La référence mondiale du SEO IA en 2026',
    description: 'Dominez Google, ChatGPT et tous les moteurs IA.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Nexus SEO',
      url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
      sameAs: ['https://twitter.com/nexusseo', 'https://linkedin.com/company/nexusseo'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Nexus SEO',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Nexus SEO',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '99',
        highPrice: '499',
        priceCurrency: 'EUR',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '847',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-zinc-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
