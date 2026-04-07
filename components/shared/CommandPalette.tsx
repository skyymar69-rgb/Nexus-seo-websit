'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import {
  Search, Home, Gauge, Zap, Globe, FileSearch, FileText, TrendingUp,
  Wand2, Eye, BookOpen, Tag, LinkIcon, ShieldCheck, Users, ShoppingCart,
  Lightbulb, LayoutTemplate, Sparkles, LineChart, BarChart3, Settings,
  FolderOpen, X,
} from 'lucide-react'

interface Tool {
  label: string
  href: string
  icon: any
  category: string
  keywords: string[]
}

const tools: Tool[] = [
  { label: 'Dashboard', href: '/dashboard', icon: Home, category: 'SEO', keywords: ['accueil', 'tableau de bord'] },
  { label: 'Audit de Site', href: '/dashboard/audit', icon: Search, category: 'SEO', keywords: ['analyse', 'seo', 'audit'] },
  { label: 'Performance', href: '/dashboard/performance', icon: Zap, category: 'SEO', keywords: ['vitesse', 'core web vitals', 'pagespeed'] },
  { label: 'Domain Overview', href: '/dashboard/domain-overview', icon: Globe, category: 'SEO', keywords: ['domaine', 'apercu'] },
  { label: 'Top Pages', href: '/dashboard/top-pages', icon: FileSearch, category: 'SEO', keywords: ['meilleures pages'] },
  { label: 'On-Page Checker', href: '/dashboard/on-page-checker', icon: FileText, category: 'SEO', keywords: ['page', 'optimisation'] },
  { label: 'Suivi de Positions', href: '/dashboard/rank-tracker', icon: TrendingUp, category: 'Mots-cles', keywords: ['positions', 'classement', 'ranking'] },
  { label: 'Keyword Magic', href: '/dashboard/keyword-magic', icon: Wand2, category: 'Mots-cles', keywords: ['mots cles', 'recherche'] },
  { label: 'Keyword Gap', href: '/dashboard/keyword-gap', icon: Eye, category: 'Mots-cles', keywords: ['concurrent', 'ecart'] },
  { label: 'Recherche Semantique', href: '/dashboard/semantic', icon: BookOpen, category: 'Mots-cles', keywords: ['semantique', 'nlp'] },
  { label: 'Mes Mots-cles', href: '/dashboard/keywords', icon: Tag, category: 'Mots-cles', keywords: ['suivi', 'liste'] },
  { label: 'Profil Backlinks', href: '/dashboard/backlinks', icon: LinkIcon, category: 'Backlinks', keywords: ['liens', 'backlinks'] },
  { label: 'Backlink Audit', href: '/dashboard/backlink-audit', icon: ShieldCheck, category: 'Backlinks', keywords: ['qualite', 'spam'] },
  { label: 'Concurrents', href: '/dashboard/competitors', icon: Users, category: 'Backlinks', keywords: ['concurrence'] },
  { label: 'Optimisation Contenu', href: '/dashboard/content-optimizer', icon: Wand2, category: 'Contenu', keywords: ['contenu', 'optimiser'] },
  { label: 'Topic Research', href: '/dashboard/topic-research', icon: Lightbulb, category: 'Contenu', keywords: ['sujet', 'idees'] },
  { label: 'Content Template', href: '/dashboard/content-template', icon: LayoutTemplate, category: 'Contenu', keywords: ['template', 'modele'] },
  { label: 'Generation IA', href: '/dashboard/ai-content', icon: Sparkles, category: 'Contenu', keywords: ['ia', 'generer', 'article'] },
  { label: 'Crawleur Web', href: '/dashboard/crawl', icon: Globe, category: 'Contenu', keywords: ['crawl', 'spider'] },
  { label: 'Visibilite IA', href: '/dashboard/ai-visibility', icon: Sparkles, category: 'IA & GEO', keywords: ['chatgpt', 'claude', 'gemini', 'llm'] },
  { label: 'Audit GEO', href: '/dashboard/geo-audit', icon: Globe, category: 'IA & GEO', keywords: ['geo', 'sge'] },
  { label: 'Score AEO', href: '/dashboard/aeo-score', icon: Zap, category: 'IA & GEO', keywords: ['aeo', 'answer engine'] },
  { label: 'Score LLMO', href: '/dashboard/llmo-score', icon: TrendingUp, category: 'IA & GEO', keywords: ['llmo', 'llm optimization'] },
  { label: 'AI Advisor', href: '/dashboard/ai-advisor', icon: Lightbulb, category: 'IA & GEO', keywords: ['conseils', 'recommandations'] },
  { label: 'Comparaison de sites', href: '/dashboard/compare', icon: Eye, category: 'SEO', keywords: ['comparer', 'versus', 'vs'] },
  { label: 'Analytics', href: '/dashboard/analytics', icon: LineChart, category: 'Rapports', keywords: ['statistiques', 'donnees'] },
  { label: 'Evolution', href: '/dashboard/evolution', icon: TrendingUp, category: 'Rapports', keywords: ['historique', 'tendance'] },
  { label: 'Rapports', href: '/dashboard/reports', icon: BarChart3, category: 'Rapports', keywords: ['rapport', 'export'] },
  { label: 'Prompt Tester', href: '/dashboard/prompt-tester', icon: Sparkles, category: 'IA & GEO', keywords: ['prompt', 'tester', 'chatgpt'] },
  { label: 'Content Analyzer', href: '/dashboard/content-analyzer', icon: FileSearch, category: 'Contenu', keywords: ['analyser', 'citabilite', 'eeat'] },
  { label: 'Achat de Liens', href: '/dashboard/link-buying', icon: ShieldCheck, category: 'Backlinks', keywords: ['liens', 'marketplace', 'guest post'] },
  { label: 'Parametres', href: '/dashboard/settings', icon: Settings, category: 'Configuration', keywords: ['config', 'compte'] },
  { label: 'Mes Sites', href: '/dashboard/projects', icon: FolderOpen, category: 'Configuration', keywords: ['sites', 'projets'] },
  { label: 'Parrainage', href: '/dashboard/referral', icon: Users, category: 'Configuration', keywords: ['referral', 'ambassadeur', 'partager'] },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleSelect = useCallback((href: string) => {
    setOpen(false)
    router.push(href)
  }, [router])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <Command
          className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-2xl overflow-hidden"
          label="Navigation rapide"
        >
          <div className="flex items-center gap-3 px-4 border-b border-surface-200 dark:border-surface-700">
            <Search className="w-5 h-5 text-surface-400 shrink-0" />
            <Command.Input
              placeholder="Rechercher un outil..."
              className="w-full py-4 bg-transparent outline-none text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400"
              autoFocus
            />
            <button onClick={() => setOpen(false)} className="shrink-0 p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
              <X className="w-4 h-4 text-surface-400" />
            </button>
          </div>

          <Command.List className="max-h-80 overflow-y-auto py-2 px-2">
            <Command.Empty className="py-6 text-center text-sm text-surface-500">
              Aucun outil trouve.
            </Command.Empty>

            {['SEO', 'Mots-cles', 'Backlinks', 'Contenu', 'IA & GEO', 'Rapports', 'Configuration'].map(category => (
              <Command.Group key={category} heading={category} className="mb-1">
                {tools.filter(t => t.category === category).map(tool => {
                  const Icon = tool.icon
                  return (
                    <Command.Item
                      key={tool.href}
                      value={`${tool.label} ${tool.keywords.join(' ')}`}
                      onSelect={() => handleSelect(tool.href)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-surface-700 dark:text-surface-300 cursor-pointer data-[selected=true]:bg-brand-50 data-[selected=true]:text-brand-700 dark:data-[selected=true]:bg-brand-950 dark:data-[selected=true]:text-brand-300 transition-colors"
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{tool.label}</span>
                      <span className="text-[10px] text-surface-400 uppercase tracking-wider">{tool.category}</span>
                    </Command.Item>
                  )
                })}
              </Command.Group>
            ))}
          </Command.List>

          <div className="border-t border-surface-200 dark:border-surface-700 px-4 py-2 flex items-center gap-4 text-[10px] text-surface-400">
            <span><kbd className="px-1 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">↑↓</kbd> naviguer</span>
            <span><kbd className="px-1 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">↵</kbd> ouvrir</span>
            <span><kbd className="px-1 py-0.5 rounded bg-surface-100 dark:bg-surface-800 font-mono">esc</kbd> fermer</span>
          </div>
        </Command>
      </div>
    </div>
  )
}
