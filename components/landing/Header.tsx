'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon, Zap, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Produit', href: '#', children: [
    { label: 'GEO — Generative Engine', href: '/services#geo' },
    { label: 'AEO — Answer Engine',      href: '/services#aeo' },
    { label: 'LLMO — LLM Optimization',  href: '/services#llmo' },
    { label: 'SEO Technique',            href: '/services#technical' },
    { label: 'Analytics & Rapports',     href: '/services#analytics' },
  ]},
  { label: 'Cas clients', href: '/cases' },
  { label: 'Tarifs',      href: '#pricing' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Contact',     href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled]   = useState(false)
  const [mobileOpen, setMobile]   = useState(false)
  const [dropdown, setDropdown]   = useState<string | null>(null)
  const [mounted, setMounted]     = useState(false)
  const { theme, setTheme }       = useTheme()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200/60 dark:border-surface-800/60 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shadow-brand/50 shadow-lg">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-surface-900 dark:text-white">
              NEXUS<span className="gradient-text">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <button
                    onMouseEnter={() => setDropdown(item.label)}
                    onMouseLeave={() => setDropdown(null)}
                    className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-all"
                  >
                    {item.label}
                    <ChevronDown className={cn('w-4 h-4 transition-transform', dropdown === item.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800/60 transition-all block"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && dropdown === item.label && (
                  <div
                    onMouseEnter={() => setDropdown(item.label)}
                    onMouseLeave={() => setDropdown(null)}
                    className="absolute top-full left-0 mt-1 w-60 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 p-2 animate-slide-down"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-surface-800 rounded-xl transition-all"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Changer de thème"
              >
                {theme === 'dark'
                  ? <Sun className="w-4.5 h-4.5" />
                  : <Moon className="w-4.5 h-4.5" />
                }
              </button>
            )}

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
              >
                Connexion
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-500 hover:to-violet-500 shadow-brand hover:shadow-brand-lg transition-all duration-200"
              >
                Démarrer gratuitement
              </Link>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobile(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 px-4 py-4 space-y-1 animate-slide-down">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href}
                onClick={() => setMobile(false)}
                className="block px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-all"
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobile(false)}
                      className="block px-4 py-2 text-xs text-surface-500 dark:text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 rounded-lg transition-all"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <Link href="/login" className="flex-1 text-center py-2.5 text-sm font-medium text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all">
              Connexion
            </Link>
            <Link href="/signup" className="flex-1 text-center py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-600 to-violet-600">
              Démarrer
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
