import dynamic from 'next/dynamic'
import { Header } from '@/components/landing/Header'
import { Hero } from '@/components/landing/Hero'
import { TrustedBy } from '@/components/landing/TrustedBy'
import { Stats } from '@/components/landing/Stats'
import { Problem } from '@/components/landing/Problem'
import { Features } from '@/components/landing/Features'
import { AISection } from '@/components/landing/AISection'
import { HowItWorks } from '@/components/landing/HowItWorks'
// Pricing supprimé — tout est 100% gratuit
import { ToolsGrid } from '@/components/landing/ToolsGrid'
import { EcoImpact } from '@/components/landing/EcoImpact'
import { Footer } from '@/components/landing/Footer'

// Below-the-fold components — lazy-loaded for performance
const CaseStudies = dynamic(() => import('@/components/landing/CaseStudies').then(m => m.CaseStudies), { ssr: true })
const Comparison = dynamic(() => import('@/components/landing/Comparison').then(m => m.Comparison), { ssr: true })
const Testimonials = dynamic(() => import('@/components/landing/Testimonials').then(m => m.Testimonials), { ssr: true })
const FAQ = dynamic(() => import('@/components/landing/FAQ').then(m => m.FAQ), { ssr: true })
const CTA = dynamic(() => import('@/components/landing/CTA').then(m => m.CTA), { ssr: true })
const ExitIntent = dynamic(() => import('@/components/shared/ExitIntent'), { ssr: false })

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
      <main id="main-content">
        {/* TOFU — Attirer & Capter */}
        <Hero />
        <TrustedBy />
        <Stats />

        {/* MOFU — Éduquer & Convaincre */}
        <Problem />
        <Features />
        <AISection />
        <ToolsGrid />
        <HowItWorks />

        {/* Eco / Raison d'etre */}
        <EcoImpact />

        {/* Proof */}
        <CaseStudies />
        <Comparison />
        <Testimonials />

        {/* BOFU — Convertir — 100% Gratuit */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-brand-950 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-gold-400 text-sm font-bold uppercase tracking-widest">100% Gratuit</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">Tous les outils SEO, sans aucune limite</h2>
            <p className="text-white/70 text-lg mb-8">Audit technique, GEO, AEO, LLMO, mots-clés, backlinks, contenu IA — tout est accessible gratuitement. Aucune carte bancaire requise.</p>
            <a href="/dashboard/audit" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-400 text-brand-950 font-bold text-base hover:bg-gold-300 transition-all">
              Lancer mon audit gratuit
            </a>
          </div>
        </section>
        <FAQ />
        <CTA />
      </main>
      <ExitIntent />
      <Footer />
    </>
  )
}
