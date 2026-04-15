import React from 'react';
import Link from 'next/link';
import { AnimatedLogo } from '@/components/shared/AnimatedLogo';

export const metadata = {
  title: 'Nexus SEO - Authentification',
  description: 'Connectez-vous ou créez un compte Nexus SEO',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left side - Branding & Illustration */}
      <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 p-8 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center max-w-md">
          {/* Logo linking to homepage */}
          <Link href="/" className="inline-block mb-8">
            <AnimatedLogo size={64} lightText />
          </Link>
          <p className="text-xl text-brand-100 mb-6">
            La plateforme SEO & IA 100% gratuite
          </p>

          {/* Free badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full mb-10">
            <span className="text-green-300 text-sm font-semibold">Tous les outils gratuits — sans carte bancaire</span>
          </div>

          {/* Illustration - Geometric shapes representing SEO growth */}
          <div className="space-y-8 my-8">
            <div className="flex items-end justify-center gap-3 h-32">
              <div className="w-8 h-16 bg-gradient-to-t from-brand-400 to-brand-300 rounded-t-lg opacity-80"></div>
              <div className="w-8 h-24 bg-gradient-to-t from-accent-400 to-accent-300 rounded-t-lg"></div>
              <div className="w-8 h-32 bg-gradient-to-t from-brand-300 to-brand-200 rounded-t-lg opacity-80"></div>
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-brand-50">50+ outils SEO gratuits et illimites</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-brand-50">Visibilite IA (GEO, AEO, LLMO)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-400 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-brand-50">Inscription pour sauvegarder vos suivis</span>
            </div>
          </div>

          {/* Back to home link */}
          <div className="mt-10">
            <Link
              href="/"
              className="text-brand-200 hover:text-white text-sm font-medium transition-colors inline-flex items-center gap-1"
            >
              ← Retour a l&apos;accueil
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-col items-center justify-center bg-white dark:bg-surface-950 p-8">
        <div className="w-full max-w-md">
          {/* Mobile: homepage link */}
          <div className="lg:hidden mb-6 text-center">
            <Link
              href="/"
              className="text-brand-600 hover:text-brand-700 text-sm font-medium inline-flex items-center gap-1"
            >
              ← Retour a l&apos;accueil
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
