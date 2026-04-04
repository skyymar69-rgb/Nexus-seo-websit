import { Metadata } from 'next'
import { Header } from '@/components/landing/Header'
import { Footer } from '@/components/landing/Footer'
import Link from 'next/link'
import {
  ArrowRight,
  ExternalLink,
  Globe,
  MessageSquare,
  Bot,
  Wrench,
  BarChart3,
  Check,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Services — GEO, AEO, LLMO, SEO Technique | Nexus SEO',
  description:
    'Decouvrez toutes les fonctionnalites de Nexus : GEO pour Google SGE, AEO pour les featured snippets, LLMO pour ChatGPT et Claude, et audit SEO technique complet.',
}

const services = [
  {
    id: 'geo',
    icon: Globe,
    color: 'brand',
    title: 'GEO — Generative Engine Optimization',
    description:
      'Optimisez votre visibilite dans les reponses generees par Google SGE, Bing Copilot et les moteurs de recherche IA. Nexus analyse comment les LLMs interpretent votre contenu et vous donne des recommandations actionnables.',
    features: [
      'Score de visibilite GEO en temps reel',
      'Analyse des citations dans Google SGE',
      'Recommandations de contenu pour les reponses generatives',
      'Suivi de position dans les resultats IA',
      'Benchmarking concurrentiel GEO',
      'Alertes de changement de visibilite',
    ],
  },
  {
    id: 'aeo',
    icon: MessageSquare,
    color: 'violet',
    title: 'AEO — Answer Engine Optimization',
    description:
      'Dominez les featured snippets, les People Also Ask et les reponses vocales. Nexus identifie les opportunites de position zero et optimise votre contenu pour repondre directement aux questions des utilisateurs.',
    features: [
      'Detection des opportunites de featured snippets',
      'Optimisation People Also Ask (PAA)',
      'Score de reponse vocale (Voice Search)',
      'Analyse de la structure FAQ de vos pages',
      'Suggestions de schema markup',
      'Tracking des positions zero',
    ],
  },
  {
    id: 'llmo',
    icon: Bot,
    color: 'emerald',
    title: 'LLMO — LLM Optimization',
    description:
      'Mesurez et ameliorez la probabilite que ChatGPT, Claude, Gemini et Perplexity recommandent votre marque. Nexus interroge les principaux LLMs et analyse leur perception de votre site.',
    features: [
      'Monitoring multi-LLM (ChatGPT, Claude, Gemini, Perplexity)',
      'Score de recommandation par LLM',
      'Analyse du sentiment et de la perception de marque',
      'Identification des lacunes de contenu',
      'Rapports comparatifs concurrents vs LLMs',
      'Strategies d\'amelioration par modele',
    ],
  },
  {
    id: 'technical',
    icon: Wrench,
    color: 'amber',
    title: 'SEO Technique',
    description:
      'Audit technique complet de votre site : Core Web Vitals, indexation, structure, securite, accessibilite. Nexus detecte les erreurs critiques et vous guide pas a pas pour les corriger.',
    features: [
      'Audit Core Web Vitals (LCP, FID, CLS)',
      'Analyse de l\'indexation et du crawl',
      'Detection des erreurs 404, redirections, boucles',
      'Verification des balises meta et Open Graph',
      'Audit de la structure Hn et du maillage interne',
      'Score d\'accessibilite WCAG 2.1',
    ],
  },
  {
    id: 'analytics',
    icon: BarChart3,
    color: 'sky',
    title: 'Analytics & Rapports',
    description:
      'Tableaux de bord clairs, rapports exportables et suivi de progression. Visualisez l\'evolution de vos metriques SEO et IA en un coup d\'oeil, et partagez les resultats avec vos clients ou equipes.',
    features: [
      'Dashboard personnalisable',
      'Rapports PDF, Markdown et JSON',
      'Suivi de progression hebdomadaire',
      'Historique complet des audits',
      'Comparaison avant/apres optimisations',
      'Partage d\'equipe et white label (Expert)',
    ],
  },
]

const colorMap: Record<string, { bg: string; text: string; ring: string; icon: string }> = {
  brand: {
    bg: 'bg-brand-50 dark:bg-brand-950/30',
    text: 'text-brand-600 dark:text-brand-400',
    ring: 'ring-brand-200 dark:ring-brand-800/40',
    icon: 'text-brand-600 dark:text-brand-400',
  },
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-950/30',
    text: 'text-violet-600 dark:text-violet-400',
    ring: 'ring-violet-200 dark:ring-violet-800/40',
    icon: 'text-violet-600 dark:text-violet-400',
  },
  emerald: {
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-200 dark:ring-emerald-800/40',
    icon: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-200 dark:ring-amber-800/40',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  sky: {
    bg: 'bg-sky-50 dark:bg-sky-950/30',
    text: 'text-sky-600 dark:text-sky-400',
    ring: 'ring-sky-200 dark:ring-sky-800/40',
    icon: 'text-sky-600 dark:text-sky-400',
  },
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="bg-white dark:bg-surface-950">
        {/* Hero */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="section-badge mx-auto mb-4">Nos services</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-surface-900 dark:text-white mb-6">
              La plateforme SEO{' '}
              <span className="gradient-text">complete pour 2026</span>
            </h1>
            <p className="text-xl text-surface-500 dark:text-surface-400 mb-8 max-w-2xl mx-auto">
              GEO, AEO, LLMO, SEO Technique, Analytics — tout ce dont vous avez besoin pour dominer la recherche IA et classique.
            </p>
            <Link
              href="/audit-gratuit"
              className="btn-primary px-10 py-4 text-base rounded-2xl inline-flex items-center gap-2"
            >
              Demarrer mon audit gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        {/* Service Sections */}
        {services.map((service, index) => {
          const colors = colorMap[service.color]
          const Icon = service.icon
          const isEven = index % 2 === 0

          return (
            <section
              key={service.id}
              id={service.id}
              className={`py-20 px-4 sm:px-6 lg:px-8 ${
                isEven
                  ? 'bg-white dark:bg-surface-950'
                  : 'bg-surface-50 dark:bg-surface-900/50'
              } border-t border-surface-200 dark:border-surface-800/60 scroll-mt-20`}
            >
              <div className="max-w-5xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Text */}
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div
                      className={`w-12 h-12 rounded-2xl ${colors.bg} ring-1 ${colors.ring} flex items-center justify-center mb-6`}
                    >
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-surface-900 dark:text-white mb-4">
                      {service.title}
                    </h2>
                    <p className="text-surface-600 dark:text-surface-400 text-lg leading-relaxed mb-8">
                      {service.description}
                    </p>
                    <Link
                      href="/audit-gratuit"
                      className={`inline-flex items-center gap-2 text-sm font-semibold ${colors.text} hover:underline`}
                    >
                      Tester gratuitement
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Feature list */}
                  <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="card rounded-2xl p-6">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400 dark:text-surface-500 mb-5">
                        Fonctionnalites incluses
                      </h3>
                      <ul className="space-y-3">
                        {service.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-3">
                            <div
                              className={`w-5 h-5 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                            >
                              <Check className={`w-3 h-3 ${colors.icon}`} />
                            </div>
                            <span className="text-sm text-surface-700 dark:text-surface-300">
                              {feat}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })}

        {/* CTA Audit */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface-50 dark:bg-surface-900/50 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-4">
              Pret a decouvrir votre score de visibilite IA ?
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6">
              Audit gratuit en 5 minutes. Sans carte bancaire.
            </p>
            <Link
              href="/audit-gratuit"
              className="btn-primary px-8 py-3 rounded-xl inline-flex items-center gap-2"
            >
              Lancer mon audit gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Kayzen Agency CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-surface-200 dark:border-surface-800">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-brand-500/10 dark:from-amber-500/5 dark:to-brand-500/5 border border-amber-300/30 dark:border-amber-700/30 p-8 text-center">
              <p className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                Besoin d&apos;un accompagnement sur mesure ?
              </p>
              <p className="text-surface-600 dark:text-surface-400 mb-5 max-w-xl mx-auto">
                L&apos;Agence Kayzen Lyon concoit des sites web optimises SEO et vous accompagne dans votre strategie digitale complete.
              </p>
              <a
                href="https://internet.kayzen-lyon.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Decouvrir l&apos;Agence Kayzen
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
