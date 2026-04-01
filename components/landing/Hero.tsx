'use client'

import Link from 'next/link'
import { ArrowRight, TrendingUp, MessageSquare, Search, Star, Users, Play } from 'lucide-react'

const trustedAvatars = ['MR', 'SA', 'JD', 'CL', 'PB']

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-surface-950">

      {/* Background: grid + radial glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-light dark:bg-grid" />
        {/* Glow indigo — haut centre */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-30 dark:opacity-20"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.25) 0%, transparent 70%)' }} />
        {/* Glow violet — droite */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-20 dark:opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)' }} />
        {/* Glow cyan — bas gauche */}
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.3) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="section-badge">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            Nouveau · GEO + AEO + LLMO intégré
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-black text-surface-900 dark:text-white leading-[1.05] tracking-tight mb-6 animate-slide-up">
          La plateforme SEO qui{' '}
          <span className="gradient-text">domine 2026</span>
        </h1>

        {/* Sub */}
        <p className="text-xl sm:text-2xl text-surface-500 dark:text-surface-400 max-w-3xl mx-auto leading-relaxed mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Nexus combine SEO classique et visibilité IA en une seule plateforme.
          Soyez présent sur Google, ChatGPT, Perplexity et tous les LLMs —{' '}
          <span className="text-surface-700 dark:text-surface-200 font-semibold">avant vos concurrents.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/audit-gratuit"
            className="btn-primary px-8 py-4 text-base rounded-2xl shadow-brand hover:shadow-brand-lg"
          >
            Audit SEO gratuit
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#demo"
            className="btn-outline px-8 py-4 text-base rounded-2xl group"
          >
            <Play className="w-4 h-4 text-brand-500" />
            Voir la démo
          </Link>
        </div>

        {/* Trust signals */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-14 text-sm text-surface-500 dark:text-surface-400">
          {/* Avatars */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {trustedAvatars.map((initials, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-surface-950 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: `hsl(${220 + i * 30}, 70%, 55%)` }}
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="font-medium"><span className="text-surface-700 dark:text-surface-200">2 500+</span> équipes actives</span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-surface-200 dark:bg-surface-700" />

          {/* Stars */}
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="font-medium"><span className="text-surface-700 dark:text-surface-200">4.9/5</span> sur G2</span>
          </div>

          <div className="hidden sm:block w-px h-4 bg-surface-200 dark:bg-surface-700" />

          <span>14 jours gratuits · Sans CB · Annulation libre</span>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          {/* Outer glow */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-brand-500/20 via-violet-500/10 to-cyan-500/20 blur-sm" />

          {/* Browser frame */}
          <div className="relative rounded-3xl overflow-hidden border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-2xl shadow-black/10 dark:shadow-black/60">

            {/* Browser bar */}
            <div className="flex items-center gap-3 px-5 py-3.5 bg-surface-50 dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-accent-400" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-4 py-1 bg-surface-100 dark:bg-surface-800 rounded-lg text-xs text-surface-400 font-mono">
                  nexus.app/dashboard
                </div>
              </div>
            </div>

            {/* Dashboard content */}
            <div className="p-6">
              {/* Header row */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-surface-400 mb-0.5">Mon espace SEO</p>
                  <p className="text-base font-bold text-surface-900 dark:text-white">maison-lumiere.fr</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-50 dark:bg-accent-950/30 border border-accent-200 dark:border-accent-800">
                  <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
                  <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">Analyse live</span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  { icon: TrendingUp, label: 'Score GEO', value: '94/100', delta: '+12', color: 'text-brand-500' },
                  { icon: MessageSquare, label: 'Mentions LLM', value: '+128', delta: 'ce mois', color: 'text-violet-500' },
                  { icon: Search, label: 'Mots-clés Top 3', value: '847', delta: '+34', color: 'text-cyan-500' },
                ].map((stat) => {
                  const Icon = stat.icon
                  return (
                    <div key={stat.label} className="rounded-2xl p-4 bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                      <Icon className={`w-5 h-5 mb-3 ${stat.color}`} />
                      <p className="text-xs text-surface-400 mb-1">{stat.label}</p>
                      <p className="text-xl font-black text-surface-900 dark:text-white">{stat.value}</p>
                      <p className="text-xs text-accent-500 mt-0.5 font-medium">{stat.delta}</p>
                    </div>
                  )
                })}
              </div>

              {/* Mini sparkline */}
              <div className="rounded-2xl p-4 bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wide">Trafic organique — 30 jours</p>
                  <span className="text-xs font-bold text-accent-500">+340%</span>
                </div>
                <div className="flex items-end gap-1.5 h-10">
                  {[20, 28, 25, 38, 42, 35, 50, 58, 55, 70, 72, 68, 80, 88, 85, 94].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-sm bg-gradient-to-t from-brand-500/60 to-brand-400/30 dark:from-brand-500/50 dark:to-brand-400/20"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
