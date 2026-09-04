import type { Metadata } from 'next'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { Providers } from '@/app/providers'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

// Design Kayzen Web (DESIGN.md) : Outfit pour les titres et les libellés
// d'action, Plus Jakarta Sans pour le texte courant. Auto-hébergées par
// next/font : aucune requête vers Google Fonts au chargement.
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
  variable: '--font-outfit',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-jakarta',
})

const CookieBanner = dynamic(() => import('@/components/shared/CookieBanner'), { ssr: false })
const AccessibilityToggle = dynamic(() => import('@/components/shared/AccessibilityToggle'), { ssr: false })
const ScrollProgress = dynamic(() => import('@/components/shared/ScrollProgress'), { ssr: false })
const AIChatWidget = dynamic(() => import('@/components/shared/AIChatWidget'), { ssr: false })
import './globals.css'

const BASE_URL = process.env.NEXT_PUBLIC_URL || 'https://nexus.kayzen-lyon.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Nexus SEO — Audit SEO gratuit et visibilité IA, par Kayzen',
    template: '%s | Nexus SEO',
  },
  description:
    'Nexus est la plateforme SEO gratuite de Kayzen : audit technique, suivi de mots-clés, analyse de backlinks et optimisation GEO, AEO et LLMO pour Google, ChatGPT et Perplexity.',
  keywords: [
    'SEO', 'SEO IA', 'GEO', 'AEO', 'LLMO', 'audit SEO', 'suivi mots-clés',
    'backlinks', 'ChatGPT SEO', 'Perplexity SEO', 'plateforme SEO', 'outil SEO',
    'référencement naturel', 'visibilité IA', 'Google SGE', 'Lyon',
  ],
  authors: [{ name: 'Kayzen Web', url: 'https://kayzen-lyon.com' }],
  creator: 'Kayzen Web',
  publisher: 'KAYZEN LYON',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: {
    canonical: BASE_URL,
    languages: { fr: BASE_URL },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BASE_URL,
    siteName: 'Nexus SEO',
    title: 'Nexus SEO — Audit SEO gratuit et visibilité IA',
    description:
      'Audit technique, mots-clés, backlinks et présence dans les moteurs IA. 50 outils gratuits, sans carte bancaire, par Kayzen Web à Lyon.',
    images: [{ url: `${BASE_URL}/og-image.png`, width: 1200, height: 630, alt: 'Nexus SEO by Kayzen — plateforme SEO et visibilité IA gratuite' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nexus SEO — Audit SEO gratuit et visibilité IA',
    description: 'Audit technique, mots-clés, backlinks et présence dans les moteurs IA. 50 outils gratuits.',
    images: ['/og-image.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: 'Kayzen Web',
      alternateName: 'KAYZEN LYON',
      url: 'https://kayzen-lyon.com',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` },
      sameAs: ['https://kayzen-lyon.com', 'https://synaptik.kayzen-lyon.com'],
      address: {
        '@type': 'PostalAddress',
        streetAddress: '6, rue Pierre Termier',
        addressLocality: 'Lyon',
        postalCode: '69009',
        addressCountry: 'FR',
      },
      telephone: '+33487776861',
      email: 'contact@kayzen-lyon.fr',
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: BASE_URL,
      name: 'Nexus SEO',
      inLanguage: 'fr-FR',
      publisher: { '@id': `${BASE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/blog?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'Nexus SEO',
      url: BASE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      inLanguage: 'fr-FR',
      publisher: { '@id': `${BASE_URL}/#organization` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'EUR',
        description: 'Tous les outils SEO gratuits et sans limitation',
      },
      featureList: 'Audit SEO, crawl multipage, recherche de mots-clés, suivi de positions, analyse de backlinks, audit GEO, score AEO, score LLMO, serveur MCP',
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${BASE_URL}/#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
        { '@type': 'ListItem', position: 3, name: 'Tarifs', item: `${BASE_URL}/pricing` },
        { '@type': 'ListItem', position: 4, name: 'Blog', item: `${BASE_URL}/blog` },
      ],
    },
    {
      '@type': 'Service',
      name: 'GEO — Generative Engine Optimization',
      description: 'Optimisez votre visibilité dans les réponses de ChatGPT, Claude, Gemini et Perplexity.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: 'FR',
      serviceType: 'SEO Optimization',
    },
    {
      '@type': 'Service',
      name: 'AEO — Answer Engine Optimization',
      description: 'Optimisez votre contenu pour les featured snippets, les réponses vocales et les People Also Ask.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: 'FR',
      serviceType: 'SEO Optimization',
    },
    {
      '@type': 'Service',
      name: 'LLMO — LLM Optimization',
      description: 'Mesurez et améliorez la probabilité que les LLM recommandent votre marque.',
      provider: { '@id': `${BASE_URL}/#organization` },
      areaServed: 'FR',
      serviceType: 'SEO Optimization',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
        <meta name="color-scheme" content="light dark" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Nexus SEO" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${outfit.variable} ${jakarta.variable} min-h-screen bg-white dark:bg-surface-950 text-ink dark:text-surface-100 antialiased`}>
        <a href="#main-content" className="skip-to-main">
          Aller au contenu principal
        </a>
        <Providers>
          {children}
          <ErrorBoundary><ScrollProgress /></ErrorBoundary>
          <ErrorBoundary><CookieBanner /></ErrorBoundary>
          <ErrorBoundary><AccessibilityToggle /></ErrorBoundary>
          <ErrorBoundary><AIChatWidget /></ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
