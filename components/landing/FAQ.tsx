'use client'

import { useState, useCallback, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Qu’est-ce que le GEO, l’AEO et le LLMO ?',
    answer: 'Le GEO (Generative Engine Optimization) optimise votre contenu pour apparaître dans les réponses générées par IA de Google SGE et Bing Copilot. L’AEO (Answer Engine Optimization) vous positionne sur les featured snippets et la recherche vocale. Le LLMO (Large Language Model Optimization) fait en sorte que ChatGPT, Claude, Gemini et Perplexity recommandent naturellement votre marque dans leurs réponses.',
  },
  {
    question: 'Nexus est-il vraiment 100 % gratuit ?',
    answer: 'Oui. Tous les outils Nexus sont gratuits et sans limitation : audits illimités, suivi de mots-clés, backlinks, générateur de contenu SEO, scores GEO, AEO et LLMO. Aucune carte bancaire n’est demandée. L’inscription sert uniquement à sauvegarder vos sites et à suivre l’évolution de vos résultats.',
  },
  {
    question: 'Pourquoi Nexus est-il gratuit ?',
    answer: 'Nexus est développé par Kayzen Web, agence de création de sites à Lyon. L’outil gratuit permet aux entreprises de diagnostiquer leurs problèmes SEO. Pour aller plus loin avec une refonte ou une création de site optimisé, Kayzen Web propose ses services d’agence.',
  },
  {
    question: 'En combien de temps voit-on les premiers résultats ?',
    answer: 'Les premiers constats sont disponibles immédiatement après l’audit initial, en quelques minutes. Pour les résultats concrets, amélioration des positions et bonnes pratiques SEO, les changements significatifs arrivent généralement dès la quatrième semaine pour le SEO technique, et après six à douze semaines pour le GEO et le LLMO.',
  },
  {
    question: 'Nexus est-il compatible avec mon CMS (WordPress, Shopify, etc.) ?',
    answer: 'Oui. Nexus analyse n’importe quel site web, quel que soit le CMS : WordPress, Shopify, Webflow, Squarespace, Wix, PrestaShop ou les sites sur mesure en React et Next.js. Il suffit d’entrer votre domaine pour lancer un audit complet.',
  },
  {
    question: 'Comment Nexus surveille-t-il les mentions dans les LLM ?',
    answer: 'Nexus envoie des requêtes aux API officielles de ChatGPT, Claude, Gemini, Perplexity et d’autres LLM avec les questions types de votre secteur, et vérifie si votre marque est citée et comment vous vous comparez à vos concurrents. Pour une mesure répétée avec intervalle de confiance et preuve datée, Kayzen propose Synaptik.',
  },
  {
    question: 'Mes données sont-elles sécurisées ?',
    answer: 'Oui. Nexus est hébergé sur des serveurs en Europe et respecte le RGPD. Vos données ne sont jamais partagées avec des tiers ni utilisées pour entraîner des modèles IA.',
  },
  {
    question: 'Quel est le lien entre Nexus et Kayzen Web ?',
    answer: 'Nexus est un outil gratuit développé par Kayzen Web (kayzen-lyon.com), agence web lyonnaise spécialisée dans la création de sites performants et éco-responsables en React et Next.js. Nexus diagnostique les problèmes, Kayzen Web les résout avec des sites optimisés dès la conception.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const handleKeyDown = useCallback((e: React.KeyboardEvent, index: number) => {
    let target: number | null = null
    if (e.key === 'ArrowDown') { e.preventDefault(); target = (index + 1) % faqs.length }
    else if (e.key === 'ArrowUp') { e.preventDefault(); target = (index - 1 + faqs.length) % faqs.length }
    else if (e.key === 'Home') { e.preventDefault(); target = 0 }
    else if (e.key === 'End') { e.preventDefault(); target = faqs.length - 1 }
    if (target !== null) buttonRefs.current[target]?.focus()
  }, [])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }

  return (
    <section id="faq" className="bg-white py-20 dark:bg-surface-950 lg:py-24" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <span className="section-badge mb-4">FAQ</span>
          <h2 id="faq-title" className="text-headline-md text-navy-600 dark:text-white sm:text-headline-lg">Questions fréquentes</h2>
          <p className="mt-4 text-body-lg text-ink-muted dark:text-surface-400">
            Tout ce que vous voulez savoir sur Nexus, le GEO, l’AEO et le LLMO.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`
            const isOpen = open === i
            return (
              <div key={faq.question} className={cn('card overflow-hidden transition-[box-shadow] duration-200', isOpen && 'shadow-elevation-lg')}>
                <h3>
                  <button
                    id={buttonId}
                    ref={(el) => { buttonRefs.current[i] = el }}
                    onClick={() => setOpen(isOpen ? null : i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left font-sans"
                  >
                    <span className={cn('text-base font-semibold transition-colors duration-200', isOpen ? 'text-brand-500' : 'text-ink dark:text-white')}>
                      {faq.question}
                    </span>
                    <ChevronDown className={cn('h-4 w-4 shrink-0 transition-transform duration-200', isOpen ? 'rotate-180 text-brand-500' : 'text-ink-muted')} aria-hidden="true" />
                  </button>
                </h3>
                <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="px-5 pb-5">
                  <p className="border-t border-surface-300 pt-4 text-sm leading-relaxed text-ink-muted dark:border-surface-800 dark:text-surface-400">
                    {faq.answer}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <p className="mt-10 text-center text-sm text-ink-muted dark:text-surface-400">
          Vous n’avez pas trouvé votre réponse ?{' '}
          <a href="/contact" className="font-semibold text-brand-500 underline-offset-4 hover:underline">Contactez-nous</a>
        </p>
      </div>
    </section>
  )
}
