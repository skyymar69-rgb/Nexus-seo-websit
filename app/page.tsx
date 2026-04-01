import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { TrustedBy } from '@/components/landing/TrustedBy'
import { Stats } from '@/components/landing/Stats'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { AISection } from '@/components/landing/AISection'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { CaseStudies } from '@/components/landing/CaseStudies'
import { Comparison } from '@/components/landing/Comparison'
import { Testimonials } from '@/components/landing/Testimonials'
import { Pricing } from '@/components/landing/Pricing'
import { FAQ } from '@/components/landing/FAQ'
import { CTA } from '@/components/landing/CTA'
import { Footer } from '@/components/landing/Footer'

export const metadata = {
  title: 'Nexus SEO — GEO · AEO · LLMO | La référence SEO de l\'ère IA',
  description:
    "Nexus est le premier outil SEO conçu pour 2026 : optimisez votre présence dans ChatGPT, Perplexity, Google SGE et tous les LLMs. GEO, AEO, LLMO — une seule plateforme.",
  keywords: 'SEO IA, GEO, AEO, LLMO, ChatGPT SEO, Google SGE, optimisation LLM, visibilité IA',
  openGraph: {
    title: 'Nexus SEO — La référence SEO de l\'ère IA',
    description: 'GEO · AEO · LLMO : dominez ChatGPT, Google SGE, Perplexity et tous les moteurs IA.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* TOFU — Attirer & Capter */}
        <Hero />
        <TrustedBy />
        <Stats />

        {/* MOFU — Éduquer & Convaincre */}
        <Problem />
        <Features />
        <AISection />
        <HowItWorks />

        {/* Proof */}
        <CaseStudies />
        <Comparison />
        <Testimonials />

        {/* BOFU — Convertir */}
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
