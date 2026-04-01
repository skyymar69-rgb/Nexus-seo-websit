import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { Features } from '@/components/landing/Features'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Services — GEO, AEO, LLMO, SEO Technique | Nexus SEO',
  description: 'Découvrez toutes les fonctionnalités de Nexus : GEO pour Google SGE, AEO pour les featured snippets, LLMO pour ChatGPT et Claude, et audit SEO technique complet.',
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-white dark:bg-surface-950">
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="section-badge mx-auto mb-4">Nos services</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 dark:text-white mb-6">
              La plateforme SEO{' '}
              <span className="gradient-text">complète pour 2026</span>
            </h1>
            <p className="text-xl text-surface-500 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
              GEO · AEO · LLMO · SEO Technique · Analytics — tout ce dont vous avez besoin pour dominer la recherche IA.
            </p>
            <Link href="/signup" className="btn-primary px-10 py-4 text-base rounded-2xl inline-flex items-center gap-2">
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        <Features />
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
              Prêt à découvrir votre score de visibilité IA ?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Audit gratuit en 5 minutes. Sans carte bancaire.
            </p>
            <Link href="/signup" className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2">
              Lancer mon audit gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
