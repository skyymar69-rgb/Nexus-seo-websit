'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { WebsiteProvider, useWebsite } from '@/contexts/WebsiteContext'
import { WebsiteSelector } from '@/components/shared/WebsiteSelector'
import {
  Search,
  Link as LinkIcon,
  TrendingUp,
  Sparkles,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  User,
  CreditCard,
  LogOut,
  Command,
  Gauge,
  Wand2,
  Lightbulb,
  FileText,
  LineChart,
  Zap,
  X,
  Menu,
  Home,
  Globe,
  FolderOpen,
  Users,
} from 'lucide-react'

interface CategoryItem {
  category: string
  label: string
  href: string
  icon: any
  badge?: 'PRO' | 'NEW'
}

// Define navigation categories with their tools
const navigationCategories = [
  {
    id: 'home',
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    isCategory: false,
  },
  {
    id: 'technical-seo',
    label: 'SEO Technique',
    icon: Gauge,
    isCategory: true,
    items: [
      { label: 'Audit de Site', href: '/dashboard/audit', icon: Search, badge: undefined },
      { label: 'Crawleur Web', href: '/dashboard/crawl', icon: Globe, badge: undefined },
      { label: 'Performance', href: '/dashboard/performance', icon: Zap, badge: undefined },
      { label: 'Analyse Sémantique', href: '/dashboard/semantic', icon: FileText, badge: undefined },
      { label: 'Optimisation Contenu', href: '/dashboard/content-optimizer', icon: Wand2, badge: undefined },
    ],
  },
  {
    id: 'keywords',
    label: 'Mots-clés',
    icon: Search,
    isCategory: true,
    items: [
      { label: 'Suivi Mots-clés', href: '/dashboard/keywords', icon: Search, badge: undefined },
      { label: 'Classements', href: '/dashboard/rank-tracker', icon: TrendingUp, badge: undefined },
    ],
  },
  {
    id: 'backlinks',
    label: 'Backlinks',
    icon: LinkIcon,
    isCategory: true,
    items: [
      { label: 'Profil Backlinks', href: '/dashboard/backlinks', icon: LinkIcon, badge: undefined },
      { label: 'Concurrents', href: '/dashboard/competitors', icon: Users, badge: undefined },
    ],
  },
  {
    id: 'ai-geo',
    label: 'IA & GEO',
    icon: Sparkles,
    isCategory: true,
    badge: 'NEW' as const,
    items: [
      { label: 'Visibilité IA', href: '/dashboard/ai-visibility', icon: Sparkles, badge: 'NEW' as const },
      { label: 'Audit GEO', href: '/dashboard/geo-audit', icon: Globe, badge: 'NEW' as const },
      { label: 'Score AEO', href: '/dashboard/aeo-score', icon: Zap, badge: 'NEW' as const },
      { label: 'Score LLMO', href: '/dashboard/llmo-score', icon: TrendingUp, badge: 'PRO' as const },
      { label: 'AI Advisor', href: '/dashboard/ai-advisor', icon: Lightbulb, badge: undefined },
      { label: 'Génération Contenu', href: '/dashboard/ai-content', icon: Wand2, badge: undefined },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytique',
    icon: BarChart3,
    isCategory: true,
    items: [
      { label: "Vue d'ensemble", href: '/dashboard/analytics', icon: LineChart, badge: undefined },
      { label: 'Évolution', href: '/dashboard/evolution', icon: TrendingUp, badge: undefined },
      { label: 'Rapports', href: '/dashboard/reports', icon: FileText, badge: undefined },
    ],
  },
  {
    id: 'config',
    label: 'Configuration',
    icon: Settings,
    isCategory: true,
    items: [
      { label: 'Paramètres', href: '/dashboard/settings', icon: Settings, badge: undefined },
      { label: 'Mes Sites', href: '/dashboard/projects', icon: FolderOpen, badge: undefined },
    ],
  },
]

// Helper component for the sidebar content
function SidebarContent() {
  const pathname = usePathname()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['technical-seo']))
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) next.delete(categoryId)
      else next.add(categoryId)
      return next
    })
  }

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true
    if (href !== '/dashboard' && pathname.startsWith(href)) return true
    return false
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:relative inset-y-0 left-0 z-40 border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 transition-all duration-300 flex flex-col',
          sidebarOpen ? 'w-64' : 'w-20',
          !mobileMenuOpen && 'max-lg:-translate-x-full'
        )}
      >
        {/* Logo Section */}
        <div className="border-b border-surface-200 dark:border-surface-800 px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard"
              className={cn(
                'font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent transition-all',
                sidebarOpen ? 'text-2xl' : 'text-xl'
              )}
            >
              {sidebarOpen ? 'Nexus' : 'N'}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex rounded-md p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <ChevronLeft className="h-5 w-5 text-surface-500" />
              ) : (
                <ChevronRight className="h-5 w-5 text-surface-500" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden rounded-md p-1.5 hover:bg-surface-100 dark:hover:bg-surface-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-surface-500" />
            </button>
          </div>
        </div>

        {/* Website Selector */}
        {sidebarOpen && (
          <div className="border-b border-surface-200 dark:border-surface-800 px-3 py-3">
            <WebsiteSelector />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1 scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-surface-700">
          {navigationCategories.map((cat) => {
            if (!cat.isCategory) {
              // Simple link (Dashboard)
              const Icon = cat.icon
              const active = isActive(cat.href || '/dashboard')
              return (
                <Link
                  key={cat.id}
                  href={cat.href || '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                    active
                      ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                      : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                  )}
                  title={sidebarOpen ? undefined : cat.label}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span className="truncate">{cat.label}</span>}
                </Link>
              )
            }

            // Category with items
            const Icon = cat.icon
            const isExpanded = expandedCategories.has(cat.id)

            return (
              <div key={cat.id}>
                {sidebarOpen ? (
                  <button
                    onClick={() => toggleCategory(cat.id)}
                    className="flex items-center justify-between w-full rounded-lg px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{cat.label}</span>
                      {(cat as any).badge && (
                        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded whitespace-nowrap bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                          {(cat as any).badge}
                        </span>
                      )}
                    </div>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform flex-shrink-0',
                        isExpanded && 'rotate-180'
                      )}
                    />
                  </button>
                ) : (
                  <div
                    className="flex items-center justify-center rounded-lg px-3 py-2 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all cursor-help"
                    title={cat.label}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                )}

                {/* Sub-items */}
                {isExpanded && sidebarOpen && (
                  <div className="mt-1 space-y-0.5 ml-2 border-l border-surface-200 dark:border-surface-700 pl-3">
                    {cat.items?.map((item) => {
                      const ItemIcon = item.icon
                      const active = isActive(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                            active
                              ? 'bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-400'
                              : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ItemIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={cn(
                                'px-1.5 py-0.5 text-[8px] font-bold rounded whitespace-nowrap flex-shrink-0',
                                item.badge === 'PRO'
                                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400'
                                  : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400'
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom Section - intentionally minimal */}
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed left-4 top-4 z-50 rounded-lg p-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </>
  )
}

// Breadcrumb component
function Breadcrumb() {
  const pathname = usePathname()

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean)
    const breadcrumbs = []

    let path = ''
    for (const segment of segments) {
      path += `/${segment}`
      const label = segment.replace(/-/g, ' ').replace(/^\w/, c => c.toUpperCase())
      breadcrumbs.push({ label, path })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link href="/dashboard" className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100">
        Dashboard
      </Link>
      {breadcrumbs.slice(1).map((crumb, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-surface-400" />
          <Link href={crumb.path} className="text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100">
            {crumb.label}
          </Link>
        </div>
      ))}
    </nav>
  )
}

// Main layout component
function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-surface-50 dark:bg-surface-950 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto text-brand-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-surface-600 dark:text-surface-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  const userName = session.user?.name || 'User'
  const userEmail = session.user?.email || ''
  const userInitials = userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  const userPlan = (session.user as any)?.plan || 'pro'

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 text-surface-900 dark:text-surface-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <SidebarContent />

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          {/* Header */}
          <header className="border-b border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 px-4 lg:px-6 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Top row: Breadcrumb + Theme + User */}
            <div className="flex items-center justify-between gap-4">
              <Breadcrumb />
              <div className="flex items-center gap-2 lg:hidden">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="rounded-lg p-2 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="h-5 w-5 text-surface-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-surface-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Bottom row: Search + Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {/* Search */}
              <div className="flex-1 lg:flex-none lg:max-w-sm">
                <div className="flex items-center gap-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800 px-3 py-2 focus-within:border-brand-500 transition-all">
                  <Command className="h-4 w-4 text-surface-400" />
                  <input
                    type="text"
                    placeholder="Search tools... (Cmd+K)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent outline-none placeholder-surface-400 text-sm dark:text-surface-100"
                  />
                  <kbd className="ml-auto rounded border border-surface-300 dark:border-surface-600 bg-surface-100 dark:bg-surface-700 px-1.5 py-0.5 text-[10px] text-surface-500 font-medium hidden lg:inline-block">
                    Cmd+K
                  </kbd>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setNotificationMenuOpen(!notificationMenuOpen)}
                  className="relative rounded-lg p-2 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-surface-500 dark:text-surface-400" />
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                    3
                  </span>
                </button>

                {notificationMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-xl z-50">
                    <div className="border-b border-surface-200 dark:border-surface-700 px-4 py-3">
                      <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Notifications</h3>
                    </div>
                    <div className="py-2 max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700">
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Audit completed</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">5 minutes ago</p>
                      </div>
                      <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700">
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">Rank tracker updated</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">2 hours ago</p>
                      </div>
                      <div className="px-4 py-2 hover:bg-surface-50 dark:hover:bg-surface-700">
                        <p className="text-sm font-medium text-surface-900 dark:text-surface-100">New backlink detected</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden lg:flex rounded-lg p-2 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-surface-400" />
                ) : (
                  <Moon className="h-5 w-5 text-surface-600" />
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-xs font-semibold">
                    {userInitials}
                  </div>
                  <ChevronDown className="h-4 w-4 text-surface-500 hidden lg:block" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-xl z-50">
                    <div className="border-b border-surface-200 dark:border-surface-700 px-4 py-3">
                      <p className="text-sm font-semibold text-surface-900 dark:text-surface-100">{userName}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{userEmail}</p>
                      <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1 uppercase">{userPlan} Plan</p>
                    </div>
                    <nav className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        <User className="h-4 w-4" />
                        Profile Settings
                      </Link>
                      <Link
                        href="/dashboard/billing"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        <CreditCard className="h-4 w-4" />
                        Billing & Plans
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </nav>
                    <div className="border-t border-surface-200 dark:border-surface-700 py-1">
                      <button
                        onClick={async () => {
                          await signOut({ redirect: true, callbackUrl: '/login' })
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 lg:p-6">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

// Export main component
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WebsiteProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </WebsiteProvider>
  )
}
