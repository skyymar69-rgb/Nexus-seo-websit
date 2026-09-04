'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'
import { AnimatedLogo } from '@/components/shared/AnimatedLogo'

const footerLinks = {
  Outils: [
    { label: 'Audit SEO gratuit', href: '/audit-gratuit' },
    { label: 'Audit GEO (IA)', href: '/dashboard/geo-audit' },
    { label: 'Score AEO', href: '/dashboard/aeo-score' },
    { label: 'Score LLMO', href: '/dashboard/llmo-score' },
    { label: 'Tous les outils', href: '/audit-gratuit#outils' },
  ],
  Ressources: [
    { label: 'Cas clients', href: '/cases' },
    { label: 'Blog SEO IA', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Services', href: '/services' },
  ],
  Kayzen: [
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Agence Kayzen Web', href: 'https://kayzen-lyon.com' },
    { label: 'Synaptik, mesure de citation IA', href: 'https://synaptik.kayzen-lyon.com' },
  ],
  Légal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'CGU', href: '/cgu' },
    { label: 'Accessibilité', href: '/accessibilite' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-ink-inverse text-surface-300">
      <div className="mx-auto max-w-container px-6">

        <div className="flex flex-col items-start justify-between gap-10 border-b border-white/10 py-12 lg:flex-row">
          <div className="max-w-xs">
            <Link href="/" className="mb-4 inline-block rounded-lg" aria-label="Nexus SEO, accueil">
              <AnimatedLogo size={36} lightText />
            </Link>
            <p className="mb-5 text-sm leading-relaxed text-surface-400">
              La plateforme SEO gratuite de Kayzen pour l’ère de l’IA. GEO, AEO, LLMO et 50 outils, en un seul endroit.
            </p>
            <a
              href="mailto:contact@kayzen-lyon.fr"
              aria-label="Nous contacter par e-mail"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-surface-300 transition-colors duration-200 hover:bg-white/10 hover:text-white"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="w-full max-w-sm lg:w-auto">
            <p className="mb-1 text-sm font-bold text-white">Newsletter SEO IA</p>
            <p className="mb-4 text-xs text-surface-400">Les tendances GEO, AEO et LLMO, chaque semaine.</p>
            <form onSubmit={(e) => e.preventDefault()} aria-label="Inscription à la newsletter" className="flex gap-2">
              <label className="relative flex-1">
                <span className="sr-only">Adresse e-mail</span>
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" aria-hidden="true" />
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  autoComplete="email"
                  required
                  className="h-11 w-full rounded-lg border border-white/15 bg-white/5 pl-9 pr-3 text-sm text-white placeholder:text-surface-500 focus:border-brand-400 focus:outline-none focus:shadow-focus"
                />
              </label>
              <button type="submit" className="btn-primary btn-sm h-11">
                S’abonner
              </button>
            </form>
            <p className="mt-2 text-xs text-surface-500">Pas de spam. Désabonnement en un clic.</p>
          </div>
        </div>

        <nav aria-label="Liens du pied de page" className="grid grid-cols-2 gap-8 border-b border-white/10 py-12 sm:grid-cols-4">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p id={`footer-${title.toLowerCase()}`} className="mb-4 font-display text-xs font-bold uppercase tracking-widest text-surface-500">
                {title}
              </p>
              <ul className="space-y-2.5" aria-labelledby={`footer-${title.toLowerCase()}`}>
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-surface-400 transition-colors duration-200 hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-surface-500">
            © {currentYear} Nexus SEO, un service de <a href="https://kayzen-lyon.com" className="text-surface-300 underline-offset-4 hover:underline">KAYZEN LYON</a>. Tous droits réservés.
          </p>
          <ul className="flex items-center gap-1.5">
            {['RGPD', 'Hébergé en Europe', '100 % gratuit'].map((badge) => (
              <li key={badge} className="rounded-full border border-white/15 px-2.5 py-1 text-xs font-semibold text-surface-300">
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
