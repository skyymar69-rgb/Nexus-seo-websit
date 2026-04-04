import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import { FAQ } from '@/components/landing/FAQ'
import { Breadcrumb } from '@/components/shared/Breadcrumb'

export const metadata = {
  title: 'FAQ — Questions fréquentes sur Nexus SEO',
  description: 'Tout ce que vous devez savoir sur Nexus, le GEO, l\'AEO, le LLMO et notre plateforme SEO IA.',
}

export default function FAQPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="bg-white dark:bg-surface-950 pt-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <Breadcrumb items={[{ label: 'Accueil', href: '/' }, { label: 'FAQ' }]} />
          <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-surface-900 dark:text-white mb-4">
            Centre d&apos;aide
          </h1>
          <p className="text-lg text-surface-500 dark:text-surface-400">
            Toutes les réponses à vos questions sur Nexus et le SEO IA.
          </p>
          </div>
        </div>
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
