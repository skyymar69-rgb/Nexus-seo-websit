/**
 * Nexus SEO — Plans tarifaires
 * Stratégie : Tunnel de vente vers l'Agence Web Kayzen
 *
 * Gratuit → découverte (audit complet, outils de base)
 * Pro 49,99€ → professionnels autonomes (tous les outils IA)
 * Expert 99,99€ → entreprises + accès prioritaire agence Kayzen
 */

export type PlanId = 'free' | 'pro' | 'expert'

export interface PlanConfig {
  id: PlanId
  name: string
  price: number | null
  priceAnnual: number | null  // prix mensuel en facturation annuelle
  tagline: string
  limits: {
    auditsPerMonth: number        // -1 = illimité
    keywordsTracked: number
    backlinkChecks: number
    sitesMax: number
    aiVisibility: boolean
    geoReports: boolean
    aeoReports: boolean
    llmoReports: boolean
    competitorAnalysis: number
    exportPDF: boolean
    apiAccess: boolean
    whiteLabel: boolean
    llmMonitoring: number
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated'
    customDashboard: boolean
    aiChat: boolean
    agencyAccess: boolean         // accès services Agence Kayzen
  }
}

const plansConfig: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    priceAnnual: 0,
    tagline: 'Auditez votre site gratuitement',
    limits: {
      auditsPerMonth: 5,
      keywordsTracked: 10,
      backlinkChecks: 5,
      sitesMax: 1,
      aiVisibility: true,
      geoReports: true,
      aeoReports: true,
      llmoReports: false,
      competitorAnalysis: 1,
      exportPDF: false,
      apiAccess: false,
      whiteLabel: false,
      llmMonitoring: 2,
      supportLevel: 'community',
      customDashboard: false,
      aiChat: true,
      agencyAccess: false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 49.99,
    priceAnnual: 39.99,
    tagline: 'Pour les professionnels du SEO',
    limits: {
      auditsPerMonth: -1,
      keywordsTracked: 100,
      backlinkChecks: -1,
      sitesMax: 5,
      aiVisibility: true,
      geoReports: true,
      aeoReports: true,
      llmoReports: true,
      competitorAnalysis: 10,
      exportPDF: true,
      apiAccess: false,
      whiteLabel: false,
      llmMonitoring: 4,
      supportLevel: 'email',
      customDashboard: false,
      aiChat: true,
      agencyAccess: false,
    },
  },
  expert: {
    id: 'expert',
    name: 'Expert',
    price: 99.99,
    priceAnnual: 79.99,
    tagline: 'SEO avancé + accès Agence Kayzen',
    limits: {
      auditsPerMonth: -1,
      keywordsTracked: -1,
      backlinkChecks: -1,
      sitesMax: -1,
      aiVisibility: true,
      geoReports: true,
      aeoReports: true,
      llmoReports: true,
      competitorAnalysis: -1,
      exportPDF: true,
      apiAccess: true,
      whiteLabel: true,
      llmMonitoring: -1,
      supportLevel: 'dedicated',
      customDashboard: true,
      aiChat: true,
      agencyAccess: true,
    },
  },
}

export function getPlan(planId: PlanId): PlanConfig {
  return plansConfig[planId] || plansConfig.free
}

export function canAccess(planId: PlanId, feature: keyof PlanConfig['limits']): boolean {
  const plan = getPlan(planId)
  const value = plan.limits[feature]

  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  return false
}

export function getLimit(planId: PlanId, feature: keyof PlanConfig['limits']): number | boolean | string {
  const plan = getPlan(planId)
  return plan.limits[feature]
}

export function isFeatureLocked(planId: PlanId, feature: string): boolean {
  const plan = getPlan(planId)
  const limits = plan.limits as Record<string, unknown>
  const value = limits[feature]

  if (value === undefined) return false
  if (typeof value === 'boolean') return !value
  if (typeof value === 'number') return value === 0

  return false
}

export function getMinPlanForFeature(feature: keyof PlanConfig['limits']): PlanId {
  const plans: PlanId[] = ['free', 'pro', 'expert']

  for (const planId of plans) {
    if (canAccess(planId, feature)) {
      return planId
    }
  }

  return 'expert'
}

export const allPlans: PlanConfig[] = Object.values(plansConfig)
