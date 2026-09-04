import { describe, it, expect } from 'vitest'
import { getPlan, canAccess, getLimit, isFeatureLocked, getMinPlanForFeature, allPlans } from '@/lib/plans'

// Nexus est 100 % gratuit : un seul plan, aucune limite. Ces tests figent ce
// contrat pour que la réintroduction de plans payants soit un choix explicite.

describe('Plans configuration', () => {
  it('expose un seul plan, gratuit', () => {
    expect(allPlans).toHaveLength(1)
    const free = getPlan('free')
    expect(free.id).toBe('free')
    expect(free.name).toBe('Gratuit')
    expect(free.price).toBe(0)
  })
})

describe('canAccess', () => {
  it('donne accès à toutes les fonctionnalités', () => {
    expect(canAccess('free', 'aiVisibility')).toBe(true)
    expect(canAccess('free', 'llmoReports')).toBe(true)
    expect(canAccess('free', 'apiAccess')).toBe(true)
  })
})

describe('getLimit', () => {
  it('ne limite ni les audits, ni les sites, ni les mots-clés', () => {
    expect(getLimit('free', 'auditsPerMonth')).toBe(-1)
    expect(getLimit('free', 'sitesMax')).toBe(-1)
    expect(getLimit('free', 'keywordsTracked')).toBe(-1)
  })

  it('garde le white-label fermé', () => {
    expect(getLimit('free', 'whiteLabel')).toBe(false)
  })
})

describe('isFeatureLocked / getMinPlanForFeature', () => {
  it('ne verrouille rien', () => {
    expect(isFeatureLocked('free', 'exportPDF')).toBe(false)
    expect(isFeatureLocked('free', 'nonExistentFeature')).toBe(false)
  })

  it('renvoie toujours le plan gratuit', () => {
    expect(getMinPlanForFeature('auditsPerMonth')).toBe('free')
    expect(getMinPlanForFeature('agencyAccess')).toBe('free')
  })
})
