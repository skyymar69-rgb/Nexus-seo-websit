export type PlanId = 'free' | 'explorer' | 'professionnel' | 'entreprise' | 'souveraine'

export interface PlanConfig {
  id: PlanId
  name: string
  price: number | null  // null = gratuit/demo
  limits: {
    auditsPerMonth: number        // -1 = illimité
    keywordsTracked: number
    backlinkChecks: number
    sitesMax: number
    aiVisibility: boolean
    geoReports: boolean
    aeoReports: boolean
    llmoReports: boolean
    competitorAnalysis: number    // nb de concurrents
    exportPDF: boolean
    apiAccess: boolean
    whiteLabel: boolean
    llmMonitoring: number         // nb de LLMs suivis
    supportLevel: 'email' | 'priority' | 'dedicated' | '24/7'
    customDashboard: boolean
    onPremise: boolean
  }
}

const plansConfig: Record<PlanId, PlanConfig> = {
  free: {
    id: 'free',
    name: 'Gratuit',
    price: 0,
    limits: {
      auditsPerMonth: 1,
      keywordsTracked: 0,
      backlinkChecks: 0,
      sitesMax: 1,
      aiVisibility: false,
      geoReports: false,
      aeoReports: false,
      llmoReports: false,
      competitorAnalysis: 0,
      exportPDF: false,
      apiAccess: false,
      whiteLabel: false,
      llmMonitoring: 0,
      supportLevel: 'email',
      customDashboard: false,
      onPremise: false,
    },
  },
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    price: 99,
    limits: {
      auditsPerMonth: 4,
      keywordsTracked: 50,
      backlinkChecks: 10,
      sitesMax: 1,
      aiVisibility: true,
      geoReports: true,
      aeoReports: false,
      llmoReports: false,
      competitorAnalysis: 0,
      exportPDF: true,
      apiAccess: false,
      whiteLabel: false,
      llmMonitoring: 2,
      supportLevel: 'email',
      customDashboard: false,
      onPremise: false,
    },
  },
  professionnel: {
    id: 'professionnel',
    name: 'Professionnel',
    price: 199,
    limits: {
      auditsPerMonth: -1,
      keywordsTracked: 200,
      backlinkChecks: -1,
      sitesMax: 3,
      aiVisibility: true,
      geoReports: true,
      aeoReports: true,
      llmoReports: false,
      competitorAnalysis: 5,
      exportPDF: true,
      apiAccess: false,
      whiteLabel: false,
      llmMonitoring: 5,
      supportLevel: 'priority',
      customDashboard: false,
      onPremise: false,
    },
  },
  entreprise: {
    id: 'entreprise',
    name: 'Entreprise',
    price: 299,
    limits: {
      auditsPerMonth: -1,
      keywordsTracked: 500,
      backlinkChecks: -1,
      sitesMax: -1,
      aiVisibility: true,
      geoReports: true,
      aeoReports: true,
      llmoReports: true,
      competitorAnalysis: 20,
      exportPDF: true,
      apiAccess: true,
      whiteLabel: false,
      llmMonitoring: 10,
      supportLevel: 'dedicated',
      customDashboard: false,
      onPremise: false,
    },
  },
  souveraine: {
    id: 'souveraine',
    name: 'Souveraine',
    price: 499,
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
      supportLevel: '24/7',
      customDashboard: true,
      onPremise: true,
    },
  },
}

export function getPlan(planId: PlanId): PlanConfig {
  return plansConfig[planId]
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
  const plans: PlanId[] = ['free', 'explorer', 'professionnel', 'entreprise', 'souveraine']

  for (const planId of plans) {
    if (canAccess(planId, feature)) {
      return planId
    }
  }

  return 'souveraine'
}

export const allPlans: PlanConfig[] = Object.values(plansConfig)
