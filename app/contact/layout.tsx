import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact — Parlons de Votre Visibilite IA',
  description:
    'Contactez l\'equipe Nexus SEO pour une demo personnalisee, un audit gratuit ou toute question sur le GEO, AEO et LLMO. Reponse sous 24h.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Nexus SEO',
    description:
      'Contactez l\'equipe Nexus SEO pour une demo personnalisee ou un audit gratuit. Reponse sous 24h.',
    images: ['/api/og?title=Contact&subtitle=Parlons%20de%20votre%20visibilite%20IA'],
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
