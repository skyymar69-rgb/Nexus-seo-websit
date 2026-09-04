import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand : terracotta chaud (#b74831) — design Kayzen Web (DESIGN.md).
        // Réservé aux actions, aux liens et aux états de focus ; jamais en fond décoratif.
        brand: {
          50:  '#fbf3f0',
          100: '#f3e0d9',
          200: '#e8d5cf', // primary-container
          300: '#d4b8ad', // primary-fixed-dim
          400: '#c9846e',
          500: '#b74831', // primary
          600: '#a03d28', // primary hover
          700: '#8b3d24', // on-primary-fixed-variant
          800: '#5a2817', // on-primary-container
          900: '#3d1f0f', // on-primary-fixed
          950: '#2a1409',
        },
        // Navy : marine profond (#1f3b61) — titres, navigation, structure.
        navy: {
          50:  '#eef3fa',
          100: '#c5d9f1', // secondary-container
          200: '#a9c1dd', // secondary-fixed-dim
          300: '#7f9cc0',
          400: '#4f6f97',
          500: '#2d4f7a',
          600: '#1f3b61', // secondary
          700: '#182f4d',
          800: '#12243b',
          900: '#0f1f35', // on-secondary-container
          950: '#0a1526',
        },
        // Encre : texte sur surfaces claires.
        ink: {
          DEFAULT: '#1f2937', // on-surface
          muted: '#6c757d',   // on-surface-variant
          subtle: '#9ca3af',  // outline
          inverse: '#1a1a1a', // inverse-surface
        },
        // Gold — accent premium
        gold: {
          50:  '#fffdf0',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#FECD4D',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // Violet — gradient secondaire
        violet: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        // Cyan — accent IA/tech
        cyan: {
          50:  '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        // Surfaces : pile claire du design Kayzen Web, échelle sombre zinc conservée.
        surface: {
          50:  '#fafafa', // surface-container-lowest
          100: '#f5f5f5', // surface-dim / surface-container-low (#f0f0f0)
          150: '#e9ecef', // surface-container-high (survol)
          200: '#eeeeee', // surface-container
          300: '#d0d0d0', // outline-variant (bordures)
          400: '#9ca3af', // outline
          500: '#6c757d', // on-surface-variant
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          850: '#1c1c1f',
          900: '#18181b',
          950: '#09090b',
        },
        // Accent: Emerald — succès, métriques positives
        accent: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      // Outfit (titres, libellés d'action) + Plus Jakarta Sans (texte courant) — DESIGN.md.
      fontFamily: {
        sans:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      // Échelle typographique DESIGN.md (display 63,84 px … label-sm 12 px).
      fontSize: {
        'display':     ['3.99rem', { lineHeight: '4.5rem', letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline-lg': ['2.5rem',  { lineHeight: '3rem',   letterSpacing: '-0.02em', fontWeight: '700' }],
        'headline-md': ['1.75rem', { lineHeight: '2.25rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        'title-lg':    ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body-lg':     ['1.125rem', { lineHeight: '1.75rem' }],
        'body-md':     ['1rem',    { lineHeight: '1.5rem' }],
        'label-md':    ['1rem',    { lineHeight: '1.5rem', letterSpacing: '0.01em', fontWeight: '700' }],
        'label-sm':    ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      maxWidth: {
        container: '1400px',
      },
      backgroundImage: {
        'gradient-brand':  'linear-gradient(135deg, #1f3b61 0%, #2d4f7a 100%)',
        'gradient-gold':   'linear-gradient(135deg, #FECD4D 0%, #eab308 100%)',
        // Bandeau sombre des pages secondaires (texte blanc) : marine, plus bleu roi.
        'gradient-hero':   'linear-gradient(180deg, #1f3b61 0%, #182f4d 60%, #0f1f35 100%)',
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'grid-dot': 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        'grid-line': 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
        'grid-line-light': 'linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid':     '32px 32px',
        'grid-lg':  '48px 48px',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'slide-up':     'slideUp 0.6s ease-out forwards',
        'slide-down':   'slideDown 0.3s ease-out',
        'slide-left':   'slideLeft 0.6s ease-out forwards',
        'slide-right':  'slideRight 0.6s ease-out forwards',
        'scale-in':     'scaleIn 0.4s ease-out forwards',
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 8s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
        'marquee':      'marquee 30s linear infinite',
        'marquee-rev':  'marqueeRev 30s linear infinite',
        'count-up':     'countUp 1s ease-out forwards',
        'glow-pulse':   'glowPulse 3s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
        'bits-shine':   'bitsShine 3s linear infinite',
      },
      keyframes: {
        bitsShine:   { '0%': { backgroundPosition: '150% center' }, '100%': { backgroundPosition: '-50% center' } },
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown:   { '0%': { opacity: '0', transform: 'translateY(-12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideLeft:   { '0%': { opacity: '0', transform: 'translateX(30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        slideRight:  { '0%': { opacity: '0', transform: 'translateX(-30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        scaleIn:     { '0%': { opacity: '0', transform: 'scale(0.9)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        float:       { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        marquee:     { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        marqueeRev:  { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        countUp:     { '0%': { opacity: '0', transform: 'translateY(10px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        glowPulse:   { '0%, 100%': { boxShadow: '0 0 20px rgba(37,99,235,0.3)' }, '50%': { boxShadow: '0 0 40px rgba(37,99,235,0.6)' } },
        bounceSoft:  { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      // Profondeur retenue (DESIGN.md) : sm badges, md cartes et boutons, lg modales et héros.
      boxShadow: {
        'elevation-sm': '0 1px 2px rgba(0, 0, 0, 0.06)',
        'elevation-md': '0 4px 12px rgba(0, 0, 0, 0.10)',
        'elevation-lg': '0 16px 40px rgba(0, 0, 0, 0.12)',
        'header':       '0 1px 3px rgba(0, 0, 0, 0.08)',
        'focus':        '0 0 0 3px rgba(183, 72, 49, 0.10)',
        // Alias historiques du tableau de bord, adoucis.
        'brand':    '0 4px 12px rgba(183,72,49,0.18)',
        'brand-lg': '0 16px 40px rgba(183,72,49,0.16)',
        'gold':     '0 4px 12px rgba(254,205,77,0.25)',
        'glow':     '0 4px 12px rgba(0,0,0,0.10)',
        'card':     '0 4px 12px rgba(0,0,0,0.10)',
        'card-lg':  '0 16px 40px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
