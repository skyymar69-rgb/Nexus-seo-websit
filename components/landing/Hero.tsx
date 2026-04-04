'use client'

import Link from 'next/link'
import { ArrowRight, Play, TrendingUp, Globe, Zap } from 'lucide-react'

/* ─────────────────────────────────────────────
   Particle positions — spread across the hero
   ───────────────────────────────────────────── */
const particles = [
  { top: '5%',  left: '10%', size: 3, dur: 18, delay: 0,   color: 'rgba(124,58,237,0.6)' },
  { top: '12%', left: '85%', size: 4, dur: 22, delay: 2,   color: 'rgba(254,205,77,0.5)' },
  { top: '20%', left: '30%', size: 2, dur: 25, delay: 4,   color: 'rgba(124,58,237,0.4)' },
  { top: '8%',  left: '55%', size: 5, dur: 20, delay: 1,   color: 'rgba(254,205,77,0.4)' },
  { top: '35%', left: '5%',  size: 3, dur: 28, delay: 3,   color: 'rgba(124,58,237,0.5)' },
  { top: '45%', left: '92%', size: 2, dur: 16, delay: 5,   color: 'rgba(254,205,77,0.6)' },
  { top: '55%', left: '18%', size: 6, dur: 24, delay: 0.5, color: 'rgba(124,58,237,0.3)' },
  { top: '65%', left: '75%', size: 3, dur: 19, delay: 2.5, color: 'rgba(254,205,77,0.5)' },
  { top: '75%', left: '40%', size: 4, dur: 27, delay: 1.5, color: 'rgba(124,58,237,0.4)' },
  { top: '80%', left: '60%', size: 2, dur: 21, delay: 4.5, color: 'rgba(254,205,77,0.3)' },
  { top: '15%', left: '70%', size: 3, dur: 30, delay: 3.5, color: 'rgba(124,58,237,0.5)' },
  { top: '90%', left: '15%', size: 5, dur: 17, delay: 0.8, color: 'rgba(254,205,77,0.4)' },
  { top: '25%', left: '95%', size: 2, dur: 23, delay: 2.2, color: 'rgba(124,58,237,0.6)' },
  { top: '50%', left: '50%', size: 3, dur: 26, delay: 1.8, color: 'rgba(254,205,77,0.5)' },
  { top: '70%', left: '88%', size: 4, dur: 15, delay: 3.2, color: 'rgba(124,58,237,0.4)' },
  { top: '40%', left: '25%', size: 2, dur: 29, delay: 4.8, color: 'rgba(254,205,77,0.6)' },
  { top: '60%', left: '8%',  size: 6, dur: 20, delay: 0.3, color: 'rgba(124,58,237,0.3)' },
  { top: '85%', left: '45%', size: 3, dur: 22, delay: 2.8, color: 'rgba(254,205,77,0.4)' },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-hero">

      {/* ── Inline keyframes ── */}
      <style>{`
        @keyframes hero-float {
          0%, 100% { transform: translate(0, 0); }
          25%  { transform: translate(12px, -18px); }
          50%  { transform: translate(-8px, 14px); }
          75%  { transform: translate(16px, 8px); }
        }

        @keyframes hero-orbit {
          0%   { transform: rotate(0deg)   translateX(var(--orbit-r)) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(var(--orbit-r)) rotate(-360deg); }
        }

        @keyframes hero-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes hero-draw-line {
          from { stroke-dashoffset: 300; }
          to   { stroke-dashoffset: 0; }
        }

        @keyframes hero-grow-bar {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }

        @keyframes hero-pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(124,58,237,0.4)); }
          50%      { filter: drop-shadow(0 0 28px rgba(124,58,237,0.8)); }
        }

        @keyframes hero-pulse-glow-gold {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(254,205,77,0.3)); }
          50%      { filter: drop-shadow(0 0 24px rgba(254,205,77,0.7)); }
        }

        @keyframes hero-count-fade {
          0%   { opacity: 0; transform: translateY(14px); }
          60%  { opacity: 1; transform: translateY(-2px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes hero-score-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.08); }
        }

        @keyframes hero-ring-dash {
          from { stroke-dashoffset: 0; }
          to   { stroke-dashoffset: 60; }
        }

        .hero-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: hero-float var(--dur) ease-in-out infinite;
          animation-delay: var(--delay);
        }

        .hero-orbit-item {
          position: absolute;
          top: 50%; left: 50%;
          margin: -14px 0 0 -14px;
          animation: hero-orbit var(--orbit-dur) linear infinite;
          --orbit-r: 120px;
        }

        @media (max-width: 1023px) {
          .hero-orbit-item { --orbit-r: 80px; }
        }

        .hero-illustration {
          animation: hero-pulse-glow 4s ease-in-out infinite;
        }

        .hero-bar {
          transform-origin: bottom;
          animation: hero-grow-bar 1.2s ease-out forwards;
          animation-delay: var(--bar-delay);
          transform: scaleY(0);
        }

        .hero-line-draw {
          stroke-dasharray: 300;
          stroke-dashoffset: 300;
          animation: hero-draw-line 2.5s ease-out 0.8s forwards;
        }

        .hero-spin-ring {
          animation: hero-spin-slow 20s linear infinite;
          transform-origin: center;
        }

        .hero-dashed-ring {
          animation: hero-ring-dash 8s linear infinite;
        }

        .hero-score-text {
          animation: hero-score-pulse 3s ease-in-out infinite;
        }

        .hero-stat-value {
          animation: hero-count-fade 1s ease-out forwards;
          animation-delay: var(--stat-delay);
          opacity: 0;
        }
      `}</style>

      {/* ── Particles ── */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="hero-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            '--dur': `${p.dur}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}

      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-grid-line bg-grid opacity-40 pointer-events-none" />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-brand-500/10 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gold-400/5 blur-[120px] pointer-events-none" />

      {/* ── Content grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-center">

        {/* ─── LEFT COLUMN — text (3/5 on desktop) ─── */}
        <div className="lg:col-span-3 text-center lg:text-left">

          {/* Badge */}
          <div className="flex justify-center lg:justify-start mb-8">
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-gold-400/30 bg-gold-400/5 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
              <span className="text-sm font-semibold text-gold-400 tracking-wide">
                Agence SEO IA — GEO &middot; AEO &middot; LLMO
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            La plateforme SEO qui{' '}
            <span className="text-gold-400 drop-shadow-[0_0_30px_rgba(254,205,77,0.3)]">
              domine les moteurs IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-10">
            Nexus combine SEO classique et optimisation IA en une seule plateforme.
            Soyez visible sur Google, ChatGPT, Perplexity et tous les LLMs{' '}
            <span className="text-white/90 font-medium">avant vos concurrents.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-14">
            <Link
              href="/audit-gratuit"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold-400 text-brand-950 font-bold text-sm hover:bg-gold-300 transition-all duration-300 shadow-gold hover:shadow-[0_0_40px_rgba(254,205,77,0.4)] hover:scale-[1.02]"
            >
              Audit SEO gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#demo"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
            >
              <Play className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
              Voir la demo
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mb-10">
            <div className="inline-flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-10 px-8 py-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              {[
                { value: '+340%', label: 'trafic organique', icon: TrendingUp, delay: '0.2s' },
                { value: '2.4\u00d7', label: 'visibilite IA', icon: Globe, delay: '0.5s' },
                { value: '98%', label: 'satisfaction', icon: Zap, delay: '0.8s' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gold-400/60 hidden sm:block" />
                    <div className="text-center sm:text-left">
                      <p
                        className="text-2xl sm:text-3xl font-black text-gold-400 hero-stat-value"
                        style={{ '--stat-delay': stat.delay } as React.CSSProperties}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-white/40 uppercase tracking-wider font-medium">{stat.label}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Trust signal */}
          <p className="text-sm text-white/30 font-medium">
            Utilise par <span className="text-white/50">+2 500 equipes</span> dans 45 pays
          </p>
        </div>

        {/* ─── RIGHT COLUMN — SVG Illustration (2/5 on desktop) ─── */}
        <div className="hidden lg:flex lg:col-span-2 items-center justify-center hero-illustration">
          <svg
            viewBox="0 0 400 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-[420px] h-auto"
          >
            {/* ── Outer rotating ring ── */}
            <g className="hero-spin-ring">
              <circle cx="200" cy="200" r="170" stroke="rgba(124,58,237,0.15)" strokeWidth="1" />
              <circle
                cx="200" cy="200" r="170"
                stroke="rgba(124,58,237,0.3)"
                strokeWidth="1.5"
                strokeDasharray="8 12"
                className="hero-dashed-ring"
              />
            </g>

            {/* ── Inner ring ── */}
            <circle cx="200" cy="200" r="120" stroke="rgba(254,205,77,0.12)" strokeWidth="1" />

            {/* ── Center pulsing circle ── */}
            <circle cx="200" cy="200" r="44" fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.4)" strokeWidth="1.5">
              <animate attributeName="r" values="44;48;44" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="200" r="32" fill="rgba(43,18,76,0.9)" stroke="rgba(124,58,237,0.5)" strokeWidth="1">
              <animate attributeName="r" values="32;34;32" dur="3s" repeatCount="indefinite" />
            </circle>

            {/* Center score text */}
            <text x="200" y="196" textAnchor="middle" className="hero-score-text" fill="#FECD4D" fontSize="22" fontWeight="800" fontFamily="system-ui">94</text>
            <text x="200" y="214" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontWeight="600" fontFamily="system-ui" letterSpacing="1.5">SCORE GEO</text>

            {/* ── Orbiting icons ── */}
            {/* Search icon — orbit 1 */}
            <g className="hero-orbit-item" style={{ '--orbit-dur': '12s', '--orbit-r': '120px' } as React.CSSProperties}>
              <circle cx="14" cy="14" r="14" fill="rgba(43,18,76,0.9)" stroke="rgba(124,58,237,0.5)" strokeWidth="1" />
              {/* magnifier */}
              <circle cx="12" cy="12" r="5" stroke="#FECD4D" strokeWidth="1.5" fill="none" />
              <line x1="16" y1="16" x2="20" y2="20" stroke="#FECD4D" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Chart icon — orbit 2 */}
            <g className="hero-orbit-item" style={{ '--orbit-dur': '16s', '--orbit-r': '120px', animationDelay: '-5.3s' } as React.CSSProperties}>
              <circle cx="14" cy="14" r="14" fill="rgba(43,18,76,0.9)" stroke="rgba(254,205,77,0.4)" strokeWidth="1" />
              {/* bar chart */}
              <rect x="7"  y="14" width="3" height="6"  rx="0.5" fill="rgba(124,58,237,0.8)" />
              <rect x="11" y="10" width="3" height="10" rx="0.5" fill="#7c3aed" />
              <rect x="15" y="12" width="3" height="8"  rx="0.5" fill="rgba(124,58,237,0.8)" />
              <rect x="19" y="8"  width="3" height="12" rx="0.5" fill="#FECD4D" />
            </g>

            {/* AI brain icon — orbit 3 */}
            <g className="hero-orbit-item" style={{ '--orbit-dur': '20s', '--orbit-r': '120px', animationDelay: '-10s' } as React.CSSProperties}>
              <circle cx="14" cy="14" r="14" fill="rgba(43,18,76,0.9)" stroke="rgba(124,58,237,0.5)" strokeWidth="1" />
              {/* brain shape (simplified) */}
              <path d="M10 17 C10 12, 12 9, 14 9 C16 9, 18 12, 18 17" stroke="#FECD4D" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <path d="M11 15 C11 11, 13 8, 14 8 C15 8, 17 11, 17 15" stroke="rgba(124,58,237,0.7)" strokeWidth="1" fill="none" />
              <circle cx="14" cy="12" r="1.5" fill="#FECD4D" />
              <line x1="14" y1="13.5" x2="14" y2="18" stroke="#FECD4D" strokeWidth="0.8" />
              <line x1="12" y1="15" x2="16" y2="15" stroke="rgba(124,58,237,0.6)" strokeWidth="0.8" />
            </g>

            {/* Globe icon — orbit 4 */}
            <g className="hero-orbit-item" style={{ '--orbit-dur': '14s', '--orbit-r': '120px', animationDelay: '-3.5s' } as React.CSSProperties}>
              <circle cx="14" cy="14" r="14" fill="rgba(43,18,76,0.9)" stroke="rgba(254,205,77,0.4)" strokeWidth="1" />
              <circle cx="14" cy="14" r="6" stroke="rgba(124,58,237,0.7)" strokeWidth="1" fill="none" />
              <ellipse cx="14" cy="14" rx="3" ry="6" stroke="rgba(254,205,77,0.5)" strokeWidth="0.8" fill="none" />
              <line x1="8" y1="14" x2="20" y2="14" stroke="rgba(124,58,237,0.4)" strokeWidth="0.8" />
            </g>

            {/* ── Bar chart (bottom left area) ── */}
            <g transform="translate(55, 260)">
              <text x="0" y="-6" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="system-ui" fontWeight="600" letterSpacing="1">TRAFIC</text>
              {[
                { x: 0,  h: 40, delay: '0.2s', color: 'rgba(124,58,237,0.6)' },
                { x: 14, h: 55, delay: '0.4s', color: 'rgba(124,58,237,0.7)' },
                { x: 28, h: 35, delay: '0.6s', color: 'rgba(124,58,237,0.6)' },
                { x: 42, h: 70, delay: '0.8s', color: '#7c3aed' },
                { x: 56, h: 50, delay: '1.0s', color: 'rgba(124,58,237,0.7)' },
                { x: 70, h: 85, delay: '1.2s', color: '#FECD4D' },
              ].map((bar, i) => (
                <rect
                  key={i}
                  x={bar.x}
                  y={90 - bar.h}
                  width="10"
                  height={bar.h}
                  rx="2"
                  fill={bar.color}
                  className="hero-bar"
                  style={{ '--bar-delay': bar.delay } as React.CSSProperties}
                />
              ))}
              {/* baseline */}
              <line x1="0" y1="90" x2="80" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </g>

            {/* ── Line chart (bottom right area) ── */}
            <g transform="translate(220, 270)">
              <text x="0" y="-6" fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="system-ui" fontWeight="600" letterSpacing="1">VISIBILITE IA</text>
              <polyline
                points="0,65 20,55 40,50 60,35 80,40 100,20 120,10"
                stroke="#FECD4D"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hero-line-draw"
              />
              {/* glow duplicate */}
              <polyline
                points="0,65 20,55 40,50 60,35 80,40 100,20 120,10"
                stroke="#FECD4D"
                strokeWidth="4"
                fill="none"
                opacity="0.15"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hero-line-draw"
                style={{ animationDelay: '1s' }}
              />
              {/* area fill */}
              <polygon
                points="0,65 20,55 40,50 60,35 80,40 100,20 120,10 120,75 0,75"
                fill="url(#hero-area-grad)"
                opacity="0.3"
                className="hero-line-draw"
                style={{ animationDelay: '1.2s' }}
              />
              <line x1="0" y1="75" x2="120" y2="75" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </g>

            {/* ── Small floating data cards ── */}
            {/* Top-right card */}
            <g transform="translate(290, 60)">
              <rect width="80" height="36" rx="8" fill="rgba(43,18,76,0.85)" stroke="rgba(124,58,237,0.3)" strokeWidth="1">
                <animate attributeName="y" values="0;-4;0" dur="4s" repeatCount="indefinite" />
              </rect>
              <text x="10" y="15" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="system-ui">LLM mentions</text>
              <text x="10" y="28" fill="#FECD4D" fontSize="13" fontWeight="800" fontFamily="system-ui">+128</text>
              <animateTransform attributeName="transform" type="translate" values="290,60;290,56;290,60" dur="4s" repeatCount="indefinite" />
            </g>

            {/* Top-left card */}
            <g>
              <rect x="30" y="90" width="72" height="36" rx="8" fill="rgba(43,18,76,0.85)" stroke="rgba(254,205,77,0.2)" strokeWidth="1" />
              <text x="40" y="105" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="system-ui">Mots-cles</text>
              <text x="40" y="118" fill="white" fontSize="13" fontWeight="800" fontFamily="system-ui">847</text>
              <animateTransform attributeName="transform" type="translate" values="0,0;0,-5;0,0" dur="5s" repeatCount="indefinite" />
            </g>

            {/* ── Gradient definitions ── */}
            <defs>
              <linearGradient id="hero-area-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FECD4D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FECD4D" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ─── Mobile illustration (simplified) ─── */}
        <div className="flex lg:hidden justify-center mt-4">
          <svg
            viewBox="0 0 320 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-sm h-auto"
          >
            {/* Mini bar chart */}
            <g transform="translate(20, 10)">
              {[
                { x: 0,  h: 50, delay: '0.2s', color: 'rgba(124,58,237,0.6)' },
                { x: 18, h: 70, delay: '0.4s', color: 'rgba(124,58,237,0.7)' },
                { x: 36, h: 45, delay: '0.6s', color: 'rgba(124,58,237,0.6)' },
                { x: 54, h: 85, delay: '0.8s', color: '#7c3aed' },
                { x: 72, h: 60, delay: '1.0s', color: 'rgba(124,58,237,0.7)' },
                { x: 90, h: 95, delay: '1.2s', color: '#FECD4D' },
              ].map((bar, i) => (
                <rect
                  key={i}
                  x={bar.x}
                  y={100 - bar.h}
                  width="12"
                  height={bar.h}
                  rx="3"
                  fill={bar.color}
                  className="hero-bar"
                  style={{ '--bar-delay': bar.delay } as React.CSSProperties}
                />
              ))}
              <line x1="0" y1="100" x2="102" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </g>

            {/* Mini line chart */}
            <g transform="translate(160, 15)">
              <polyline
                points="0,80 25,65 50,55 75,35 100,25 125,10"
                stroke="#FECD4D"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="hero-line-draw"
              />
              <polygon
                points="0,80 25,65 50,55 75,35 100,25 125,10 125,90 0,90"
                fill="url(#hero-area-grad-m)"
                opacity="0.25"
                className="hero-line-draw"
                style={{ animationDelay: '1s' }}
              />
              <line x1="0" y1="90" x2="125" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
            </g>

            <defs>
              <linearGradient id="hero-area-grad-m" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FECD4D" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FECD4D" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

      </div>
    </section>
  )
}
