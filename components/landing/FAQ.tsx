'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: "Qu'est-ce que le GEO, l'AEO et le LLMO ?",
    answer: "Le GEO (Generative Engine Optimization) optimise votre contenu pour apparaître dans les réponses générées par IA de Google SGE et Bing Copilot. L'AEO (Answer Engine Optimization) vous positionne sur les featured snippets et la voice search. Le LLMO (Large Language Model Optimization) fait en sorte que ChatGPT, Claude, Gemini et Perplexity recommandent naturellement votre marque dans leurs réponses.",
  },
  {
    question: "Nexus remplace-t-il Semrush ou Ahrefs ?",
    answer: "Nexus couvre tout ce que font Semrush et Ahrefs (audit technique, suivi mots-clés, backlinks, analyse concurrents) et va bien au-delà avec le GEO, l'AEO et le LLMO. Si vous utilisez déjà un de ces outils, Nexus peut soit le remplacer entièrement, soit s'y intégrer via notre API. La plupart de nos clients consolident en une seule plateforme et économisent en moyenne 180€/mois.",
  },
  {
    question: "Comment fonctionne l'essai gratuit ?",
    answer: "Vous bénéficiez de 14 jours d'accès complet au plan que vous choisissez, sans carte bancaire. À la fin de l'essai, vous êtes invité à souscrire ou votre compte passe automatiquement en plan Free (fonctionnalités limitées). Aucun prélèvement surpris, aucun engagement.",
  },
  {
    question: "En combien de temps voit-on les premiers résultats ?",
    answer: "Les premiers insights sont disponibles immédiatement après l'audit initial (5 minutes). Pour les résultats concrets — amélioration des positions, nouvelles mentions LLM — nos clients observent en moyenne des changements significatifs dès la 4ème semaine pour le SEO technique et l'AEO, et après 6 à 12 semaines pour le GEO et le LLMO (ces disciplines nécessitent que les moteurs IA re-crawlent et ré-indexent votre contenu).",
  },
  {
    question: "Nexus est-il compatible avec mon CMS (WordPress, Shopify, etc.) ?",
    answer: "Oui, Nexus est 100% compatible avec tous les CMS : WordPress, Shopify, Webflow, Squarespace, Wix, Prestashop, et les sites custom. L'intégration se fait en ajoutant votre domaine et en connectant Google Search Console en un clic. Aucune installation de plugin ou de code n'est requise pour commencer.",
  },
  {
    question: "Je suis une agence — puis-je gérer plusieurs clients sur Nexus ?",
    answer: "Absolument. Les plans Entreprise et Souveraine sont conçus pour les agences : sites illimités, rapports PDF white-label entièrement brandés aux couleurs de votre agence, accès multi-utilisateurs avec gestion des rôles, et API pour intégrer Nexus dans vos propres outils. Plusieurs agences gèrent plus de 50 clients sur Nexus.",
  },
  {
    question: "Comment Nexus surveille-t-il les mentions dans les LLMs ?",
    answer: "Nexus envoie régulièrement des requêtes automatisées aux APIs de ChatGPT, Claude, Gemini, Perplexity, Copilot et 5+ autres LLMs avec les questions-types de votre secteur. Il analyse si votre marque est citée, avec quel sentiment, et comment vous vous comparez à vos concurrents. Vous recevez des alertes en temps réel dès qu'une nouvelle mention (positive ou négative) est détectée.",
  },
  {
    question: "Mes données sont-elles sécurisées et conformes RGPD ?",
    answer: "Oui. Nexus est hébergé sur des serveurs en Europe (France/Allemagne), conforme RGPD, et certifié ISO 27001. Vos données ne sont jamais partagées avec des tiers ni utilisées pour entraîner des modèles IA. Le plan Souveraine offre un déploiement on-premise si vous souhaitez garder toutes les données dans votre infrastructure.",
  },
  {
    question: "Y a-t-il une API pour intégrer Nexus dans nos outils ?",
    answer: "Oui, une API REST complète est disponible sur les plans Entreprise et Souveraine. Elle vous permet de déclencher des audits, récupérer les scores, exporter les données et déclencher des alertes depuis vos propres systèmes (CRM, BI tools, Slack, Zapier, Make, etc.). La documentation complète est accessible dans votre dashboard.",
  },
  {
    question: "Que se passe-t-il si je veux changer de plan ou résilier ?",
    answer: "Vous pouvez upgrader, downgrader ou résilier à tout moment depuis votre dashboard, en un clic. Aucun frais de résiliation. Si vous résiliez avant la fin d'une période payée, vous continuez à bénéficier du service jusqu'à la fin de cette période. Vos données sont exportables et conservées 90 jours après résiliation.",
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  }

  return (
    <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-surface-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="section-badge mx-auto mb-4">FAQ</div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-900 dark:text-white mb-4">
            Questions fréquentes
          </h2>
          <p className="text-lg text-surface-500 dark:text-surface-400">
            Tout ce que vous voulez savoir sur Nexus, le GEO, l&apos;AEO et le LLMO.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={cn(
                'card rounded-2xl overflow-hidden transition-all duration-200',
                open === i && 'ring-1 ring-brand-500/30 dark:ring-brand-500/20'
              )}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left"
              >
                <span className={cn(
                  'text-sm font-semibold transition-colors',
                  open === i
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-surface-900 dark:text-white'
                )}>
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                    open === i
                      ? 'rotate-180 text-brand-500'
                      : 'text-surface-400'
                  )}
                />
              </button>

              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed border-t border-surface-100 dark:border-surface-800 pt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-surface-400 mt-10">
          Vous n&apos;avez pas trouvé votre réponse ?{' '}
          <a href="/contact" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
            Contactez-nous
          </a>
        </p>
      </div>
    </section>
  )
}
