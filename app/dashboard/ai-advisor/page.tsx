'use client'

import { useState, useMemo } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  XAxis,
  YAxis,
  ComposedChart,
  Area,
  AreaChart,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Zap,
  Target,
  Clock,
  Gauge,
  Brain,
  RefreshCw,
  Download,
  ChevronDown,
  ChevronRight,
  Award,
  Flame,
  AlertTriangle,
  Check,
  Circle,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Settings,
} from 'lucide-react'

// ============= TYPES =============

type Priority = 'critique' | 'haute' | 'moyenne' | 'basse'
type Effort = 'faible' | 'moyen' | 'eleve'
type Category =
  | 'technique'
  | 'contenu'
  | 'performance'
  | 'backlinks'
  | 'ia-visibility'
  | 'ux'

interface CategoryScore {
  id: Category
  label: string
  score: number
  status: 'excellent' | 'bon' | 'correct' | 'faible' | 'critique'
  change: number
}

interface Recommendation {
  id: string
  category: Category
  priority: Priority
  title: string
  description: string
  impact: string
  effort: Effort
  estimatedTime: string
  howTo: string
  expanded?: boolean
}

interface ChecklistItem {
  id: string
  category: Category
  title: string
  description: string
  priority: Priority
  impact: number
  estimatedTime: string
  done: boolean
}

interface ActionItem {
  id: string
  title: string
  priority: Priority
  effort: Effort
  impact: number
  deadline: string
  category: Category
}

// ============= DEMO DATA GENERATOR =============

const generateDemoData = () => {
  const overallScore = 72
  const industryAverage = 68
  const trend = 'improving' as const

  const categoryScores: CategoryScore[] = [
    {
      id: 'technique',
      label: 'Technique',
      score: 78,
      status: 'bon',
      change: 5,
    },
    {
      id: 'contenu',
      label: 'Contenu',
      score: 68,
      status: 'correct',
      change: 3,
    },
    {
      id: 'performance',
      label: 'Performance',
      score: 62,
      status: 'faible',
      change: -2,
    },
    {
      id: 'backlinks',
      label: 'Backlinks',
      score: 71,
      status: 'bon',
      change: 4,
    },
    {
      id: 'ia-visibility',
      label: 'IA Visibility',
      score: 58,
      status: 'critique',
      change: -1,
    },
    {
      id: 'ux',
      label: 'UX',
      score: 75,
      status: 'bon',
      change: 2,
    },
  ]

  const recommendations: Recommendation[] = [
    {
      id: 'rec-1',
      category: 'performance',
      priority: 'critique',
      title: 'Optimiser les Core Web Vitals - LCP et CLS',
      description:
        'Vos Core Web Vitals sont sous les seuils recommandés. LCP est à 3.2s (seuil: 2.5s) et CLS à 0.15 (seuil: 0.1). Cela pénalise votre classement Google et votre expérience utilisateur.',
      impact: '+8-12 points',
      effort: 'moyen',
      estimatedTime: '2-3 semaines',
      howTo:
        '1. Lazy-load les images hors écran\n2. Minifier CSS/JS\n3. Utiliser le font-display: swap\n4. Réduire les layout shifts avec size attributes\n5. Optimiser les third-party scripts',
    },
    {
      id: 'rec-2',
      category: 'ia-visibility',
      priority: 'critique',
      title: 'Implémenter schema.org et structurer le contenu pour GEO',
      description:
        'ChatGPT, Perplexity et les moteurs génératifs préfèrent le contenu structuré. Vous manquez de markup schema.org et de structure sémantique.',
      impact: '+6-10 points + mentions IA',
      effort: 'moyen',
      estimatedTime: '2-3 semaines',
      howTo:
        '1. Ajouter schema Article, FAQPage, Product selon le contenu\n2. Créer des FAQ structurées en H2/H3\n3. Ajouter Author, datePublished, dateModified\n4. Structurer avec listes et définitions\n5. Valider avec Schema.org validator',
    },
    {
      id: 'rec-3',
      category: 'technique',
      priority: 'haute',
      title: 'Mettre à jour vers Next.js 15+ avec App Router',
      description:
        'Version Next.js 14, possibilité de gains importants de performance avec App Router et Server Components.',
      impact: '+3-5 points',
      effort: 'eleve',
      estimatedTime: '3-4 semaines',
      howTo:
        '1. Créer une branche migration\n2. Installer Next.js 15+\n3. Migrer le layout.tsx\n4. Convertir pages vers route handlers\n5. Tester à fond et déployer progressivement',
    },
    {
      id: 'rec-4',
      category: 'contenu',
      priority: 'haute',
      title: 'Créer 10 pillar pages de 3000+ mots',
      description:
        'Votre contenu est fragmenté. Consolidez en 10 pillar pages exhaustives par sujet principal avec clusters satellites.',
      impact: '+10-15 points',
      effort: 'eleve',
      estimatedTime: '8-10 semaines',
      howTo:
        '1. Identifier 10 piliers de votre marché\n2. Créer une MindMap de sous-sujets pour chaque\n3. Écrire 3000+ mots par pilier\n4. Interlier avec pages satellites\n5. Optimiser avec LSI keywords et entity linking',
    },
    {
      id: 'rec-5',
      category: 'backlinks',
      priority: 'haute',
      title: 'Lancer une campagne de guest posting ciblée',
      description:
        'Vous avez 120 backlinks, la concurrence moyenne 350+. Lancez une campagne de guest posting dans vos top 20 sites de référence.',
      impact: '+12-20 points',
      effort: 'eleve',
      estimatedTime: '10-12 semaines',
      howTo:
        '1. Scraper 100 sites avec backlink checker\n2. Identifier les 20 meilleurs par DA et relevance\n3. Créer 5 pitches d\'articles différentes\n4. Outreach personnalisé via email\n5. Tracker et rapporter les backlinks gagnés',
    },
    {
      id: 'rec-6',
      category: 'ux',
      priority: 'moyenne',
      title: 'Réduire les erreurs 404 et améliorer la navigation',
      description:
        'Vous avez 24 pages 404 crawlées. Cela gaspille le crawl budget et frustre les utilisateurs.',
      impact: '+2-3 points',
      effort: 'faible',
      estimatedTime: '3-5 jours',
      howTo:
        '1. Exporter tous les 404 de Google Search Console\n2. Créer des redirects 301 vers la page la plus proche\n3. Ajouter les pages manquantes si pertinentes\n4. Optimiser le sitemap\n5. Ajouter une custom 404 page avec navigation',
    },
    {
      id: 'rec-7',
      category: 'performance',
      priority: 'haute',
      title: 'Implémenter une CDN globale et la mise en cache',
      description:
        'Pas de CDN détecté. Temps de réponse serveur: 840ms. Utilisez Cloudflare ou AWS CloudFront.',
      impact: '+5-8 points',
      effort: 'moyen',
      estimatedTime: '1-2 semaines',
      howTo:
        '1. Configurer Cloudflare avec votre domaine\n2. Activer la mise en cache agressif\n3. Ajouter rules personnalisées par type de contenu\n4. Tester depuis différentes géographies\n5. Monitorer les métriques de performance',
    },
    {
      id: 'rec-8',
      category: 'ia-visibility',
      priority: 'haute',
      title: 'Enrichir le contenu avec données originales et recherche',
      description:
        'Les moteurs génératifs préfèrent les données primaires. Ajoutez des sondages, études, données exclusives.',
      impact: '+5-8 points',
      effort: 'moyen',
      estimatedTime: '4-6 semaines',
      howTo:
        '1. Planifier 3-4 recherches/sondages originaux\n2. Collecte des données (formulaires, tools)\n3. Analyser les résultats\n4. Créer des infographiques et visualisations\n5. Publier avec métadonnées complètes',
    },
    {
      id: 'rec-9',
      category: 'technique',
      priority: 'moyenne',
      title: 'Implémenter Progressive Web App (PWA)',
      description:
        'Service workers et manifest.json peuvent améliorer engagement et performance perçue.',
      impact: '+2-4 points',
      effort: 'moyen',
      estimatedTime: '2-3 semaines',
      howTo:
        '1. Créer manifest.json avec icons et metadata\n2. Implémenter service worker pour offline\n3. Ajouter install prompt\n4. Tester sur mobile avec devtools\n5. Monitorer les installations',
    },
    {
      id: 'rec-10',
      category: 'contenu',
      priority: 'moyenne',
      title: 'Optimiser les meta descriptions et title tags',
      description:
        '45% de vos pages manquent de meta descriptions uniques. CTR max à ~8%.',
      impact: '+3-5 points (CTR)',
      effort: 'faible',
      estimatedTime: '1-2 semaines',
      howTo:
        '1. Exporter tout le site via Screaming Frog\n2. Identifier les pages sans ou duplicate descriptions\n3. Écrire des descriptions uniques 155-160 chars\n4. Inclure CTA naturelle\n5. Tester dans Google Search Console',
    },
    {
      id: 'rec-11',
      category: 'backlinks',
      priority: 'moyenne',
      title: 'Désavouer les backlinks toxiques de spam domains',
      description:
        'Détecté 28 backlinks de domaines avec DA < 20 et spam score > 60. Peuvent pénaliser.',
      impact: '+1-3 points',
      effort: 'faible',
      estimatedTime: '2-3 jours',
      howTo:
        '1. Utiliser Moz Spam Score ou Semrush pour audit\n2. Créer une liste de domaines à désavouer\n3. Créer un fichier disavow.txt\n4. Upload via Google Search Console\n5. Monitorer après 2-3 mois',
    },
    {
      id: 'rec-12',
      category: 'performance',
      priority: 'moyenne',
      title: 'Compresser images et utiliser formats modernes (WebP)',
      description:
        'Images non optimisées: 3.2 MB. Passage à WebP + compression peut économiser 60-80%.',
      impact: '+4-6 points',
      effort: 'faible',
      estimatedTime: '1-2 semaines',
      howTo:
        '1. Auditer tailles d\'images actuelles\n2. Utiliser TinyPNG ou ImageOptim\n3. Convertir vers WebP avec fallback\n4. Implémenter lazy-loading\n5. Tester les temps de chargement',
    },
    {
      id: 'rec-13',
      category: 'contenu',
      priority: 'basse',
      title: 'Créer une stratégie de content repurposing',
      description:
        'Maximiser le ROI du contenu. Un article peut devenir 5+ formats.',
      impact: '+2-4 points',
      effort: 'faible',
      estimatedTime: '2-3 semaines',
      howTo:
        '1. Auditer top-10 articles par traffic\n2. Créer plans de repurposing (infos, vidéos, podcasts)\n3. Adapter pour chaque plateforme\n4. Ajouter backlinks entre formats\n5. Mesurer le multichannel impact',
    },
    {
      id: 'rec-14',
      category: 'ux',
      priority: 'basse',
      title: 'Implémenter une meilleure recherche interne',
      description:
        'Chercheurs internes abandonnent souvent. Une bonne recherche peut augmenter conversions de 10-20%.',
      impact: '+1-2 points + conversion',
      effort: 'moyen',
      estimatedTime: '2-3 semaines',
      howTo:
        '1. Installer Algolia ou Elasticsearch\n2. Configurer avec vos données produit/contenu\n3. Ajouter facettes pertinentes (catégorie, prix, etc)\n4. Améliorer les typos avec stemming\n5. A/B tester le placement',
    },
    {
      id: 'rec-15',
      category: 'ia-visibility',
      priority: 'basse',
      title: 'Créer une page FAQ structurée pour Google Featured Snippets',
      description:
        'FAQPage schema peut gagner des positions 0. Actuellement absent.',
      impact: '+2-4 positions 0',
      effort: 'faible',
      estimatedTime: '1-2 semaines',
      howTo:
        '1. Identifier 15-20 questions des users\n2. Créer FAQ page avec réponses courtes\n3. Ajouter FAQPage schema markup\n4. Interlier vers articles détaillés\n5. Monitorer positions 0',
    },
  ]

  const checklistItems: ChecklistItem[] = [
    // Technique
    {
      id: 'check-1',
      category: 'technique',
      title: 'Ajouter/mettre à jour robots.txt',
      description: 'Assurer que les crawlers n\'indexent pas les pages sensibles',
      priority: 'haute',
      impact: 70,
      estimatedTime: '30 min',
      done: true,
    },
    {
      id: 'check-2',
      category: 'technique',
      title: 'Configurer sitemap XML',
      description: 'Créer et soumettre sitemap.xml à Google Search Console',
      priority: 'critique',
      impact: 85,
      estimatedTime: '1 heure',
      done: true,
    },
    {
      id: 'check-3',
      category: 'technique',
      title: 'Implémenter HTTPS/SSL partout',
      description: 'Forcer HTTPS sur toutes les pages, activer HSTS',
      priority: 'critique',
      impact: 90,
      estimatedTime: '2 heures',
      done: true,
    },
    {
      id: 'check-4',
      category: 'technique',
      title: 'Configurer Canonical tags',
      description: 'Éviter le contenu dupliqué avec canonical URL structure',
      priority: 'haute',
      impact: 75,
      estimatedTime: '2 heures',
      done: false,
    },
    {
      id: 'check-5',
      category: 'technique',
      title: 'Implémenter Structured Data (JSON-LD)',
      description: 'Ajouter schema.org markup pour Article, Product, etc',
      priority: 'haute',
      impact: 80,
      estimatedTime: '4 heures',
      done: false,
    },
    // Contenu
    {
      id: 'check-6',
      category: 'contenu',
      title: 'Ajouter H1 unique par page',
      description: 'Une seule H1 bien optimisée par page',
      priority: 'critique',
      impact: 88,
      estimatedTime: '30 min par page',
      done: true,
    },
    {
      id: 'check-7',
      category: 'contenu',
      title: 'Optimiser target keywords par page',
      description: 'Chaque page doit viser 1-2 keywords principaux',
      priority: 'haute',
      impact: 82,
      estimatedTime: '3 heures',
      done: false,
    },
    {
      id: 'check-8',
      category: 'contenu',
      title: 'Enrichir avec contenu de 2000+ mots (piliers)',
      description: 'Au minimum 2000 mots pour le contenu principal',
      priority: 'haute',
      impact: 85,
      estimatedTime: '1-2 jours par article',
      done: false,
    },
    {
      id: 'check-9',
      category: 'contenu',
      title: 'Créer liens internes logiques',
      description: 'Interlier pages avec anchor text naturel et contextuel',
      priority: 'moyenne',
      impact: 70,
      estimatedTime: '2 heures',
      done: false,
    },
    // Performance
    {
      id: 'check-10',
      category: 'performance',
      title: 'Optimiser les images (compression + WebP)',
      description: 'Réduire taille des images, utiliser WebP',
      priority: 'haute',
      impact: 78,
      estimatedTime: '4 heures',
      done: false,
    },
    {
      id: 'check-11',
      category: 'performance',
      title: 'Minifier CSS/JS et activer la mise en cache',
      description: 'Réduire taille des assets, configurer expires headers',
      priority: 'haute',
      impact: 80,
      estimatedTime: '3 heures',
      done: false,
    },
    {
      id: 'check-12',
      category: 'performance',
      title: 'Lazy-loader les images hors écran',
      description: 'Charger images seulement quand visibles',
      priority: 'moyenne',
      impact: 72,
      estimatedTime: '2 heures',
      done: false,
    },
    // Backlinks
    {
      id: 'check-13',
      category: 'backlinks',
      title: 'Audit des backlinks actuels',
      description: 'Analyser profil avec Ahrefs, Semrush ou Moz',
      priority: 'haute',
      impact: 75,
      estimatedTime: '3 heures',
      done: true,
    },
    {
      id: 'check-14',
      category: 'backlinks',
      title: 'Identificar opportunités de broken link building',
      description: 'Trouver 404 links pointant vers competitors, créer alternative',
      priority: 'moyenne',
      impact: 65,
      estimatedTime: '2 jours',
      done: false,
    },
    // IA Visibility
    {
      id: 'check-15',
      category: 'ia-visibility',
      title: 'Ajouter FAQ schema markup',
      description: 'FAQPage JSON-LD pour chances de featured snippets',
      priority: 'haute',
      impact: 78,
      estimatedTime: '2 heures',
      done: false,
    },
    {
      id: 'check-16',
      category: 'ia-visibility',
      title: 'Structurer contenu avec definitions et listes',
      description: 'Améliore interprétation par moteurs génératifs',
      priority: 'moyenne',
      impact: 68,
      estimatedTime: '3 heures',
      done: false,
    },
    // UX
    {
      id: 'check-17',
      category: 'ux',
      title: 'Améliorer mobile responsiveness',
      description: 'Assurer design responsive sur tous appareils',
      priority: 'critique',
      impact: 92,
      estimatedTime: '4 heures',
      done: true,
    },
    {
      id: 'check-18',
      category: 'ux',
      title: 'Réduire les pop-ups intrusifs',
      description: 'Limiter interruptions utilisateur, respecter CLS',
      priority: 'moyenne',
      impact: 65,
      estimatedTime: '1 heure',
      done: false,
    },
  ]

  const actionPlans: Record<string, ActionItem[]> = {
    quickWins: [
      {
        id: 'qw-1',
        title: 'Ajouter FAQPage schema à 10 pages principales',
        priority: 'haute',
        effort: 'faible',
        impact: 78,
        deadline: 'Cette semaine',
        category: 'ia-visibility',
      },
      {
        id: 'qw-2',
        title: 'Créer disavow.txt pour spam backlinks',
        priority: 'moyenne',
        effort: 'faible',
        impact: 60,
        deadline: 'Cette semaine',
        category: 'backlinks',
      },
      {
        id: 'qw-3',
        title: 'Optimiser 5 meta descriptions manquantes',
        priority: 'moyenne',
        effort: 'faible',
        impact: 55,
        deadline: '3-4 jours',
        category: 'contenu',
      },
      {
        id: 'qw-4',
        title: 'Compresser images homepage (60% gain)',
        priority: 'haute',
        effort: 'faible',
        impact: 75,
        deadline: '1-2 jours',
        category: 'performance',
      },
    ],
    shortTerm: [
      {
        id: 'st-1',
        title: 'Implémenter CDN Cloudflare + caching',
        priority: 'haute',
        effort: 'moyen',
        impact: 80,
        deadline: '1-2 semaines',
        category: 'performance',
      },
      {
        id: 'st-2',
        title: 'Créer 3 pillar pages de 2500+ mots',
        priority: 'haute',
        effort: 'eleve',
        impact: 85,
        deadline: '2 semaines',
        category: 'contenu',
      },
      {
        id: 'st-3',
        title: 'Auditer et réparer les 24 pages 404',
        priority: 'moyenne',
        effort: 'moyen',
        impact: 65,
        deadline: '1 semaine',
        category: 'technique',
      },
    ],
    mediumTerm: [
      {
        id: 'mt-1',
        title: 'Lancer campagne de 20 guest posts',
        priority: 'critique',
        effort: 'eleve',
        impact: 95,
        deadline: '1-3 mois',
        category: 'backlinks',
      },
      {
        id: 'mt-2',
        title: 'Créer 10 pillar pages complètes',
        priority: 'haute',
        effort: 'eleve',
        impact: 90,
        deadline: '6-8 semaines',
        category: 'contenu',
      },
      {
        id: 'mt-3',
        title: 'Implémenter PWA avec service workers',
        priority: 'moyenne',
        effort: 'moyen',
        impact: 70,
        deadline: '2-3 mois',
        category: 'technique',
      },
    ],
    longTerm: [
      {
        id: 'lt-1',
        title: 'Mettre à jour vers Next.js 15+ avec optimisations',
        priority: 'moyenne',
        effort: 'eleve',
        impact: 75,
        deadline: '2-3 mois',
        category: 'technique',
      },
      {
        id: 'lt-2',
        title: 'Construire stratégie de content repurposing',
        priority: 'basse',
        effort: 'moyen',
        impact: 65,
        deadline: '3-6 mois',
        category: 'contenu',
      },
      {
        id: 'lt-3',
        title: 'Implémenter recherche interne (Algolia)',
        priority: 'moyenne',
        effort: 'moyen',
        impact: 70,
        deadline: '3-4 mois',
        category: 'ux',
      },
    ],
  }

  const evolutionData = [
    { month: 'Jan', actual: 58, goal: 65, industry: 65 },
    { month: 'Fév', actual: 62, goal: 68, industry: 66 },
    { month: 'Mar', actual: 65, goal: 71, industry: 67 },
    { month: 'Avr', actual: 68, goal: 74, industry: 68 },
    { month: 'Mai', actual: 70, goal: 77, industry: 68 },
    { month: 'Jun', actual: 72, goal: 80, industry: 69 },
  ]

  return {
    overallScore,
    industryAverage,
    trend,
    categoryScores,
    recommendations,
    checklistItems,
    actionPlans,
    evolutionData,
  }
}

// ============= COMPONENTS =============

interface HealthGaugeProps {
  score: number
  maxScore?: number
  size?: 'sm' | 'md' | 'lg'
}

const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  maxScore = 100,
  size = 'md',
}) => {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  const getColor = () => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 70) return 'from-blue-500 to-cyan-600'
    if (score >= 60) return 'from-yellow-500 to-amber-600'
    return 'from-red-500 to-rose-600'
  }

  const getGrade = () => {
    if (score >= 90) return 'A+'
    if (score >= 80) return 'A'
    if (score >= 70) return 'B'
    if (score >= 60) return 'C'
    return 'D'
  }

  const sizeMap = {
    sm: 'w-20 h-20',
    md: 'w-32 h-32',
    lg: 'w-48 h-48',
  }

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]}`}>
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-700"
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`gradient-${score}`}>
            <stop
              offset="0%"
              stopColor={score >= 80 ? '#10b981' : score >= 70 ? '#3b82f6' : score >= 60 ? '#f59e0b' : '#ef4444'}
            />
            <stop
              offset="100%"
              stopColor={score >= 80 ? '#059669' : score >= 70 ? '#0891b2' : score >= 60 ? '#d97706' : '#dc2626'}
            />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={`url(#gradient-${score})`}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={`text-3xl font-bold bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}
        >
          {score}
        </div>
        <div className="text-xs text-slate-400 font-semibold">/{maxScore}</div>
        <div className="text-lg font-bold text-slate-300 mt-1">{getGrade()}</div>
      </div>
    </div>
  )
}

interface CategoryScoreCardProps {
  category: CategoryScore
}

const CategoryScoreCard: React.FC<CategoryScoreCardProps> = ({ category }) => {
  const getStatusColor = () => {
    switch (category.status) {
      case 'excellent':
        return 'text-green-400'
      case 'bon':
        return 'text-emerald-400'
      case 'correct':
        return 'text-blue-400'
      case 'faible':
        return 'text-yellow-400'
      case 'critique':
        return 'text-red-400'
      default:
        return 'text-slate-400'
    }
  }

  const getStatusLabel = () => {
    switch (category.status) {
      case 'excellent':
        return 'Excellent'
      case 'bon':
        return 'Bon'
      case 'correct':
        return 'Correct'
      case 'faible':
        return 'Faible'
      case 'critique':
        return 'Critique'
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">{category.label}</h3>
          <p className={`text-xs font-medium mt-1 ${getStatusColor()}`}>
            {getStatusLabel()}
          </p>
        </div>
        {category.change > 0 ? (
          <div className="flex items-center gap-1 text-green-400">
            <ArrowUpRight size={16} />
            <span className="text-xs font-medium">+{category.change}</span>
          </div>
        ) : category.change < 0 ? (
          <div className="flex items-center gap-1 text-red-400">
            <ArrowDownRight size={16} />
            <span className="text-xs font-medium">{category.change}</span>
          </div>
        ) : null}
      </div>

      {/* Mini gauge */}
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full transition-all duration-500 ${
            category.score >= 80
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : category.score >= 70
                ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                : category.score >= 60
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600'
                  : 'bg-gradient-to-r from-red-500 to-rose-600'
          }`}
          style={{ width: `${category.score}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-slate-100">{category.score}</span>
        <span className="text-xs text-slate-400">/100</span>
      </div>
    </div>
  )
}

interface RecommendationCardProps {
  recommendation: Recommendation
  isExpanded: boolean
  onToggleExpand: (id: string) => void
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  isExpanded,
  onToggleExpand,
}) => {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'critique':
        return 'bg-red-900/30 border-red-700 text-red-200'
      case 'haute':
        return 'bg-orange-900/30 border-orange-700 text-orange-200'
      case 'moyenne':
        return 'bg-yellow-900/30 border-yellow-700 text-yellow-200'
      case 'basse':
        return 'bg-blue-900/30 border-blue-700 text-blue-200'
    }
  }

  const getPriorityLabel = () => {
    switch (recommendation.priority) {
      case 'critique':
        return 'Critique'
      case 'haute':
        return 'Haute'
      case 'moyenne':
        return 'Moyenne'
      case 'basse':
        return 'Basse'
    }
  }

  const getEffortColor = () => {
    switch (recommendation.effort) {
      case 'faible':
        return 'text-green-400'
      case 'moyen':
        return 'text-yellow-400'
      case 'eleve':
        return 'text-red-400'
    }
  }

  const getEffortLabel = () => {
    switch (recommendation.effort) {
      case 'faible':
        return 'Faible'
      case 'moyen':
        return 'Moyen'
      case 'eleve':
        return 'Élevé'
    }
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-slate-600 transition-colors">
      <button
        onClick={() => onToggleExpand(recommendation.id)}
        className="w-full p-4 text-left hover:bg-slate-700/50 transition-colors flex items-start justify-between"
      >
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor()}`}
            >
              {getPriorityLabel()}
            </span>
            {recommendation.priority === 'critique' && (
              <AlertTriangle size={16} className="text-red-400" />
            )}
            {recommendation.priority === 'haute' && (
              <Flame size={16} className="text-orange-400" />
            )}
          </div>
          <h3 className="font-semibold text-slate-100 mb-1">
            {recommendation.title}
          </h3>
          <p className="text-sm text-slate-400 line-clamp-2">
            {recommendation.description}
          </p>
        </div>
        {isExpanded ? (
          <ChevronDown size={20} className="text-slate-400 ml-4 flex-shrink-0" />
        ) : (
          <ChevronRight size={20} className="text-slate-400 ml-4 flex-shrink-0" />
        )}
      </button>

      {isExpanded && (
        <div className="border-t border-slate-700 px-4 py-4 bg-slate-700/30 space-y-4">
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
              Description détaillée
            </h4>
            <p className="text-sm text-slate-300">{recommendation.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-400 mb-1">Impact estimé</p>
              <p className="font-semibold text-green-400">{recommendation.impact}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Effort</p>
              <p className={`font-semibold ${getEffortColor()}`}>
                {getEffortLabel()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-1">Temps estimé</p>
              <p className="font-semibold text-blue-400">{recommendation.estimatedTime}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-2">
              <Settings size={14} />
              Comment faire
            </h4>
            <div className="bg-slate-900/50 rounded p-3 text-sm text-slate-300 space-y-1 whitespace-pre-line">
              {recommendation.howTo}
            </div>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
            Voir les détails
          </button>
        </div>
      )}
    </div>
  )
}

interface ChecklistSectionProps {
  items: ChecklistItem[]
  onToggleDone: (id: string) => void
}

const ChecklistSection: React.FC<ChecklistSectionProps> = ({ items, onToggleDone }) => {
  const [activeCategory, setActiveCategory] = useState<Category>('technique')

  const categories: Category[] = [
    'technique',
    'contenu',
    'performance',
    'backlinks',
    'ia-visibility',
    'ux',
  ]

  const categoryLabels: Record<Category, string> = {
    technique: 'Technique',
    contenu: 'Contenu',
    performance: 'Performance',
    backlinks: 'Backlinks',
    'ia-visibility': 'IA Visibility',
    ux: 'UX',
  }

  const filteredItems = items.filter(item => item.category === activeCategory)
  const completedItems = filteredItems.filter(item => item.done).length
  const progress =
    filteredItems.length > 0 ? (completedItems / filteredItems.length) * 100 : 0

  const totalCompleted = items.filter(item => item.done).length
  const totalProgress = items.length > 0 ? (totalCompleted / items.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-100">Progression globale</h3>
          <span className="text-sm font-bold text-blue-400">
            {totalCompleted}/{items.length} items
          </span>
        </div>
        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {Math.round(totalProgress)}% complété
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Category progress */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-300">
            {categoryLabels[activeCategory]}
          </span>
          <span className="text-xs font-bold text-slate-400">
            {completedItems}/{filteredItems.length}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`border rounded-lg p-4 transition-colors ${
              item.done
                ? 'bg-slate-700/40 border-slate-700/50'
                : 'bg-slate-800 border-slate-700 hover:border-slate-600'
            }`}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={() => onToggleDone(item.id)}
                className="mt-1 flex-shrink-0"
              >
                {item.done ? (
                  <CheckCircle2 size={20} className="text-green-500" />
                ) : (
                  <Circle size={20} className="text-slate-500 hover:text-slate-400" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h4
                    className={`font-medium ${
                      item.done
                        ? 'text-slate-500 line-through'
                        : 'text-slate-100'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.priority === 'critique'
                        ? 'bg-red-900/30 text-red-300'
                        : item.priority === 'haute'
                          ? 'bg-orange-900/30 text-orange-300'
                          : 'bg-yellow-900/30 text-yellow-300'
                    }`}
                  >
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}
                  </span>
                </div>
                <p
                  className={`text-sm ${
                    item.done ? 'text-slate-600' : 'text-slate-400'
                  }`}
                >
                  {item.description}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {item.estimatedTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award size={14} />
                    {item.impact} pts d'impact
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface ActionPlanTabProps {
  plans: Record<string, ActionItem[]>
}

const ActionPlanTab: React.FC<ActionPlanTabProps> = ({ plans }) => {
  const [activeTab, setActiveTab] = useState<
    'quickWins' | 'shortTerm' | 'mediumTerm' | 'longTerm'
  >('quickWins')

  const tabLabels = {
    quickWins: 'Quick Wins',
    shortTerm: 'Court terme (1-2 sem)',
    mediumTerm: 'Moyen terme (1-3 mois)',
    longTerm: 'Long terme (3-12 mois)',
  }

  const currentPlan = plans[activeTab] || []

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case 'critique':
        return <AlertTriangle size={16} className="text-red-400" />
      case 'haute':
        return <Flame size={16} className="text-orange-400" />
      case 'moyenne':
        return <AlertCircle size={16} className="text-yellow-400" />
      default:
        return <Circle size={16} className="text-blue-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-700">
        {(Object.keys(tabLabels) as Array<keyof typeof tabLabels>).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Actions list */}
      <div className="space-y-3">
        {currentPlan.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Aucune action pour cette période</p>
          </div>
        ) : (
          currentPlan.map(action => (
            <div
              key={action.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {getPriorityIcon(action.priority)}
                  <div>
                    <h4 className="font-medium text-slate-100">
                      {action.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {action.category.charAt(0).toUpperCase() +
                        action.category.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400 mb-1">Effort</p>
                  <p className="font-medium text-slate-200">
                    {action.effort === 'faible'
                      ? 'Faible'
                      : action.effort === 'moyen'
                        ? 'Moyen'
                        : 'Élevé'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Impact</p>
                  <p className="font-medium text-green-400">{action.impact}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Délai</p>
                  <p className="font-medium text-blue-400">{action.deadline}</p>
                </div>
                <div className="text-right">
                  <button className="px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium text-slate-200 transition-colors">
                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// ============= MAIN PAGE COMPONENT =============

export default function AIAdvisorPage() {
  const data = useMemo(() => generateDemoData(), [])
  const [expandedRecommendations, setExpandedRecommendations] = useState<
    Set<string>
  >(new Set())
  const [checklist, setChecklist] = useState(data.checklistItems)

  const handleToggleExpand = (id: string) => {
    const newExpanded = new Set(expandedRecommendations)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedRecommendations(newExpanded)
  }

  const handleToggleDone = (id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? { ...item, done: !item.done } : item))
    )
  }

  const groupedRecommendations = data.recommendations.reduce(
    (acc, rec) => {
      if (!acc[rec.category]) {
        acc[rec.category] = []
      }
      acc[rec.category].push(rec)
      return acc
    },
    {} as Record<string, Recommendation[]>
  )

  const categoryLabels: Record<Category, string> = {
    technique: 'Technique',
    contenu: 'Contenu',
    performance: 'Performance',
    backlinks: 'Backlinks',
    'ia-visibility': 'IA Visibility',
    ux: 'UX',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Conseiller IA Nexus
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Optimisation SEO intelligente et recommandations personnalisées
                </p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
              <RefreshCw size={16} />
              Actualiser l'analyse
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Section 1: Overall Health Score */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Gauge size={28} className="text-blue-400" />
            État de santé SEO
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main gauge */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 flex flex-col items-center justify-center">
              <HealthGauge
                score={data.overallScore}
                maxScore={100}
                size="lg"
              />
              <div className="mt-6 text-center">
                <p className="text-slate-300 text-sm">Score global</p>
                <p className="text-slate-400 text-xs mt-2">
                  {data.trend === 'improving'
                    ? '📈 En amélioration'
                    : data.trend === 'stable'
                      ? '➡️ Stable'
                      : '📉 En déclin'}
                </p>
              </div>
            </div>

            {/* Comparison and stats */}
            <div className="lg:col-span-2 space-y-4">
              {/* Industry comparison */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">
                  Comparaison secteur
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">Votre score</span>
                      <span className="font-bold text-blue-400">
                        {data.overallScore}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-600"
                        style={{ width: `${(data.overallScore / 100) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-300">
                        Moyenne secteur
                      </span>
                      <span className="font-bold text-slate-400">
                        {data.industryAverage}
                      </span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-600"
                        style={{
                          width: `${(data.industryAverage / 100) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-700">
                    <p className="text-sm text-slate-300">
                      <span className="text-green-400 font-bold">
                        +{data.overallScore - data.industryAverage}
                      </span>{' '}
                      points au-dessus de la moyenne
                    </p>
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
                <h3 className="font-semibold text-slate-100 mb-4">
                  Métriques clés
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-400">Tendance</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">
                      📈 Amélioration
                    </p>
                  </div>
                  <div className="bg-slate-700/50 rounded p-3">
                    <p className="text-xs text-slate-400">Percentile</p>
                    <p className="text-sm font-bold text-blue-400 mt-1">
                      78e percentile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Category Scores Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <BarChart3 size={28} className="text-emerald-400" />
            Scores par catégorie
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.categoryScores.map(category => (
              <CategoryScoreCard key={category.id} category={category} />
            ))}
          </div>
        </section>

        {/* Section 3: Recommendations */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap size={28} className="text-yellow-400" />
            Recommandations prioritaires
          </h2>

          <div className="space-y-8">
            {Object.entries(groupedRecommendations).map(([category, recs]) => (
              <div key={category} className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                  <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-600 rounded-full" />
                  {categoryLabels[category as Category]}
                </h3>

                <div className="space-y-3">
                  {recs.map(rec => (
                    <RecommendationCard
                      key={rec.id}
                      recommendation={rec}
                      isExpanded={expandedRecommendations.has(rec.id)}
                      onToggleExpand={handleToggleExpand}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Checklist */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CheckCircle2 size={28} className="text-green-400" />
            Liste de contrôle d'optimisation
          </h2>

          <ChecklistSection items={checklist} onToggleDone={handleToggleDone} />
        </section>

        {/* Section 5: Action Plan */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Target size={28} className="text-purple-400" />
            Plan d'action
          </h2>

          <ActionPlanTab plans={data.actionPlans} />
        </section>

        {/* Section 6: Evolution Chart */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <TrendingUp size={28} className="text-rose-400" />
            Évolution du score SEO
          </h2>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={data.evolutionData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis domain={[40, 100]} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorActual)"
                  name="Score actuel"
                />
                <Area
                  type="monotone"
                  dataKey="goal"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorGoal)"
                  name="Objectif"
                  strokeDasharray="5 5"
                />
                <Line
                  type="monotone"
                  dataKey="industry"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  name="Moyenne secteur"
                  strokeDasharray="3 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Progression</p>
              <p className="text-2xl font-bold text-green-400">+14 pts</p>
              <p className="text-xs text-slate-500 mt-1">Depuis janvier</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Objectif</p>
              <p className="text-2xl font-bold text-blue-400">80</p>
              <p className="text-xs text-slate-500 mt-1">Cible juin 2026</p>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
              <p className="text-xs text-slate-400 mb-2">Temps estimé</p>
              <p className="text-2xl font-bold text-purple-400">4-6 mois</p>
              <p className="text-xs text-slate-500 mt-1">Pour atteindre l'objectif</p>
            </div>
          </div>
        </section>

        {/* Section 7: Industry Benchmarks */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Award size={28} className="text-amber-400" />
            Comparaison secteur
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Radar-like comparison */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-slate-100 mb-4">
                Analyse comparative par secteur
              </h3>
              <div className="space-y-4">
                {[
                  { sector: 'E-commerce', avg: 70, yours: 72 },
                  { sector: 'SaaS', avg: 76, yours: 72 },
                  { sector: 'Blog/Contenu', avg: 74, yours: 72 },
                  { sector: 'Business Local', avg: 65, yours: 72 },
                ].map(item => (
                  <div key={item.sector}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">
                        {item.sector}
                      </span>
                      <div className="flex gap-2">
                        <span className="text-xs font-medium text-slate-400">
                          Moy: {item.avg}
                        </span>
                        <span className="text-xs font-bold text-blue-400">
                          Vous: {item.yours}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-slate-600"
                          style={{ width: `${(item.avg / 100) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${(item.yours / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category comparison chart */}
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
              <h3 className="font-semibold text-slate-100 mb-4">
                Scores par catégorie vs secteur
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: 'Technique',
                      yours: 78,
                      industry: 72,
                    },
                    {
                      name: 'Contenu',
                      yours: 68,
                      industry: 75,
                    },
                    {
                      name: 'Performance',
                      yours: 62,
                      industry: 68,
                    },
                    {
                      name: 'Backlinks',
                      yours: 71,
                      industry: 65,
                    },
                    {
                      name: 'IA Visibility',
                      yours: 58,
                      industry: 60,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" angle={-45} height={80} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #475569',
                      borderRadius: '0.5rem',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Legend />
                  <Bar dataKey="yours" fill="#3b82f6" name="Votre score" />
                  <Bar dataKey="industry" fill="#94a3b8" name="Moyenne secteur" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Section 8: Export & Actions */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Download size={28} className="text-indigo-400" />
            Exporter & Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Exporter le plan d'action (PDF)
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Exporter la checklist (CSV)
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Download size={18} />
              Rapport complet (PDF)
            </button>
          </div>
        </section>

        {/* Footer */}
        <section className="border-t border-slate-800 pt-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              Prêt à optimiser votre SEO ?
            </h3>
            <p className="text-slate-300 mb-6">
              Commencez par les recommandations critiques pour des gains immédiats
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105">
              Démarrer l'optimisation
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
