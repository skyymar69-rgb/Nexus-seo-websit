'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Menu, X, Sun, Moon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedLogo } from '@/components/shared/AnimatedLogo'

const navItems = [
  { label: 'Produit', href: '#', children: [
    { label: 'GEO — Generative Engine', href: '/services#geo' },
    { label: 'AEO — Answer Engine',      href: '/services#aeo' },
    { label: 'LLMO — LLM Optimization',  href: '/services#llmo' },
    { label: 'SEO Technique',            href: '/services#technical' },
    { label: 'Analytics & Rapports',     href: '/services#analytics' },
  ]},
  { label: 'Outils gratuits', href: '/#outils' },
  { label: 'Cas clients', href: '/cases' },
  { label: 'Tarifs',      href: '/pricing' },
  { label: 'Blog',        href: '/blog' },
  { label: 'Contact',     href: '/contact' },
]

function isActive(pathname: string, href: string): boolean {
  if (href === '#' || href === '/' || href.startsWith('/#')) return false
  const basePath = href.split('#')[0]
  return pathname === basePath || pathname.startsWith(basePath + '/')
}

/**
 * En-tête : blanc à 95 %, flou léger, ombre 0 1px 3px (DESIGN.md header).
 * Toujours opaque : le héros est clair, il n'y a plus de variante « texte blanc ».
 */
export function Header() {
  const [mobileOpen, setMobile]   = useState(false)
  const [dropdown, setDropdown]   = useState<string | null>(null)
  const [mounted, setMounted]     = useState(false)
  const { theme, setTheme }       = useTheme()
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  const closeAll = useCallback(() => {
    setDropdown(null)
    setMobile(false)
  }, [])

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeAll])

  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return
    const menu = mobileMenuRef.current
    menu.setAttribute('tabIndex', '-1')
    menu.focus()
    const handleTrapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first || document.activeElement === menu) {
          e.preventDefault()
          last.focus()
        }
      } else if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    menu.addEventListener('keydown', handleTrapFocus)
    return () => menu.removeEventListener('keydown', handleTrapFocus)
  }, [mobileOpen])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdown(null)
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) setMobile(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const linkBase = 'px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200'
  const linkIdle = 'text-ink hover:bg-surface-200 dark:text-surface-200 dark:hover:bg-surface-800'
  const linkActive = 'text-brand-500 bg-brand-50 dark:bg-brand-900/30 dark:text-brand-200'

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-surface-300/60 bg-white/95 shadow-header backdrop-blur-[10px] dark:border-surface-800 dark:bg-surface-950/95">
      <div className="mx-auto max-w-container px-6">
        <div className="flex h-16 items-center justify-between">

          <Link href="/" className="shrink-0 rounded-lg" aria-label="Nexus SEO, accueil">
            <AnimatedLogo size={36} />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {navItems.map((item) => (
              <div key={item.label} className="relative" ref={item.children ? dropdownRef : undefined}>
                {item.children ? (
                  <button
                    onMouseEnter={() => setDropdown(item.label)}
                    onMouseLeave={() => setDropdown(null)}
                    onClick={() => setDropdown(dropdown === item.label ? null : item.label)}
                    aria-expanded={dropdown === item.label}
                    aria-haspopup="true"
                    className={cn('flex items-center gap-1', linkBase, linkIdle)}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', dropdown === item.label && 'rotate-180')} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn('block', linkBase, isActive(pathname, item.href) ? linkActive : linkIdle)}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                )}

                {item.children && dropdown === item.label && (
                  <div
                    role="menu"
                    aria-label={`Sous-menu ${item.label}`}
                    onMouseEnter={() => setDropdown(item.label)}
                    onMouseLeave={() => setDropdown(null)}
                    className="absolute left-0 top-full mt-2 w-64 rounded-2xl border border-surface-300 bg-white p-2 shadow-elevation-lg animate-slide-down dark:border-surface-800 dark:bg-surface-900"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        role="menuitem"
                        className="block rounded-xl px-4 py-2.5 text-sm text-ink transition-colors duration-200 hover:bg-surface-150 hover:text-brand-500 dark:text-surface-300 dark:hover:bg-surface-800"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="rounded-full p-2 text-ink-muted transition-colors duration-200 hover:bg-surface-200 dark:text-surface-400 dark:hover:bg-surface-800"
                aria-label="Changer de thème"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            )}

            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="btn-ghost btn-sm">
                Connexion
              </Link>
              <Link href="/signup" className="btn-primary btn-sm">
                Démarrer gratuitement
              </Link>
            </div>

            <button
              onClick={() => setMobile(!mobileOpen)}
              aria-label="Menu de navigation"
              aria-expanded={mobileOpen}
              className="rounded-full p-3 text-ink transition-colors duration-200 hover:bg-surface-200 lg:hidden dark:text-surface-300 dark:hover:bg-surface-800"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div ref={mobileMenuRef} role="menu" aria-label="Navigation mobile" className="space-y-1 border-t border-surface-300 bg-white px-4 py-4 animate-slide-down lg:hidden dark:border-surface-800 dark:bg-surface-950">
          {navItems.map((item) => (
            <div key={item.label}>
              <Link
                href={item.href === '#' ? '/services' : item.href}
                onClick={() => setMobile(false)}
                aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                className={cn('block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors duration-200', isActive(pathname, item.href) ? linkActive : 'text-ink hover:bg-surface-150 dark:text-surface-200 dark:hover:bg-surface-800')}
              >
                {item.label}
              </Link>
              {item.children && (
                <div className="ml-4 mt-1 space-y-0.5">
                  {item.children.map((child) => (
                    <Link key={child.label} href={child.href} onClick={() => setMobile(false)} className="block rounded-lg px-4 py-2 text-xs text-ink-muted transition-colors duration-200 hover:text-ink dark:text-surface-500 dark:hover:text-surface-300">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-3 border-t border-surface-300 pt-4 dark:border-surface-800">
            <Link href="/login" className="btn-secondary btn-sm flex-1">Connexion</Link>
            <Link href="/signup" className="btn-primary btn-sm flex-1">Démarrer</Link>
          </div>
        </div>
      )}
    </header>
  )
}
