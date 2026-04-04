'use client'

import Link from 'next/link'
import { Zap, Twitter, Linkedin, Github, Mail } from 'lucide-react'

const footerLinks = {
  Produit: [
    { label: 'Fonctionnalités', href: '/#features' },
    { label: 'Tarifs', href: '/#pricing' },
    { label: 'GEO', href: '/services#geo' },
    { label: 'AEO', href: '/services#aeo' },
    { label: 'LLMO', href: '/services#llmo' },
    { label: 'SEO Technique', href: '/services#technical' },
  ],
  Ressources: [
    { label: 'Cas clients', href: '/cases' },
    { label: 'Blog SEO IA', href: '/blog' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Documentation API', href: '/docs' },
    { label: 'Audit gratuit', href: '/signup' },
  ],
  Entreprise: [
    { label: 'À propos', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Partenaires', href: '/partners' },
    { label: 'Carrières', href: '/careers' },
    { label: 'Presse', href: '/press' },
  ],
  Légal: [
    { label: 'Mentions légales', href: '/mentions-legales' },
    { label: 'Politique de confidentialité', href: '/privacy' },
    { label: 'CGU', href: '/cgu' },
    { label: 'RGPD', href: '/rgpd' },
    { label: 'Sécurité', href: '/security' },
  ],
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface-50 dark:bg-surface-900 border-t border-surface-200 dark:border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: brand + newsletter */}
        <div className="py-12 flex flex-col lg:flex-row items-start justify-between gap-10 border-b border-surface-200 dark:border-surface-800">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-xl text-surface-900 dark:text-white tracking-tight">
                NEXUS<span className="gradient-text">.</span>
              </span>
            </Link>
            <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed mb-5">
              La référence mondiale des outils SEO pour l&apos;ère de l&apos;IA. GEO · AEO · LLMO — tout en une plateforme.
            </p>
            <div className="flex gap-2">
              {[
                { Icon: Twitter, href: '#', label: 'Twitter' },
                { Icon: Linkedin, href: '#', label: 'LinkedIn' },
                { Icon: Github, href: '#', label: 'GitHub' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-surface-700 dark:hover:text-white hover:bg-surface-200 dark:hover:bg-surface-800 transition-colors border border-surface-200 dark:border-surface-700"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="max-w-sm w-full lg:w-auto">
            <p className="text-sm font-bold text-surface-900 dark:text-white mb-1">Newsletter SEO IA</p>
            <p className="text-xs text-surface-400 mb-4">Les dernières tendances GEO, AEO et LLMO chaque semaine.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  placeholder="votre@email.fr"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold btn-primary"
              >
                S&apos;abonner
              </button>
            </form>
            <p className="text-xs text-surface-400 mt-2">Pas de spam. Désabonnement en un clic.</p>
          </div>
        </div>

        {/* Links grid */}
        <div className="py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 border-b border-surface-200 dark:border-surface-800">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-bold tracking-widest text-surface-400 uppercase mb-4">
                {title}
              </p>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-400">
            © {currentYear} Nexus SEO — un service de <a href="https://kayzen-lyon.fr" className="text-brand-500 hover:underline">Kayzen Lyon</a>. Tous droits réservés.
          </p>
          <div className="flex items-center gap-1.5">
            {[
              { label: 'RGPD', color: 'text-brand-500' },
              { label: 'ISO 27001', color: 'text-accent-500' },
              { label: 'Hébergé en France', color: 'text-violet-500' },
            ].map((badge) => (
              <span
                key={badge.label}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 ${badge.color}`}
              >
                {badge.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
