import { describe, it, expect } from 'vitest'
import { getPlan, canAccess, getLimit, isFeatureLocked, getMinPlanForFeature, allPlans } from '@/lib/plans'

describe('Plans configuration', () => {
  it('should have 5 plans defined', () => {
    expect(allPlans).toHaveLength(5)
  })

  it('should return correct plan by ID', () => {
    const free = getPlan('free')
    expect(free.id).toBe('free')
    expect(free.name).toBe('Gratuit')
    expect(free.price).toBe(0)

    const pro = getPlan('professionnel')
    expect(pro.id).toBe('professionnel')
    expect(pro.price).toBe(199)
  })

  it('should have ascending prices', () => {
    const prices = allPlans.map(p => p.price ?? 0)
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i - 1])
    }
  })
})

describe('canAccess', () => {
  it('free plan cannot access aiVisibility', () => {
    expect(canAccess('free', 'aiVisibility')).toBe(false)
  })

  it('explorer plan can access aiVisibility', () => {
    expect(canAccess('explorer', 'aiVisibility')).toBe(true)
  })

  it('free plan has 1 audit per month', () => {
    expect(canAccess('free', 'auditsPerMonth')).toBe(true) // 1 > 0
  })

  it('free plan cannot access geoReports', () => {
    expect(canAccess('free', 'geoReports')).toBe(false)
  })

  it('explorer can access geoReports', () => {
    expect(canAccess('explorer', 'geoReports')).toBe(true)
  })

  it('professionnel can access aeoReports', () => {
    expect(canAccess('professionnel', 'aeoReports')).toBe(true)
  })

  it('explorer cannot access aeoReports', () => {
    expect(canAccess('explorer', 'aeoReports')).toBe(false)
  })

  it('entreprise can access llmoReports', () => {
    expect(canAccess('entreprise', 'llmoReports')).toBe(true)
  })

  it('professionnel cannot access llmoReports', () => {
    expect(canAccess('professionnel', 'llmoReports')).toBe(false)
  })
})

describe('getLimit', () => {
  it('free plan has 1 audit per month', () => {
    expect(getLimit('free', 'auditsPerMonth')).toBe(1)
  })

  it('professionnel plan has unlimited audits', () => {
    expect(getLimit('professionnel', 'auditsPerMonth')).toBe(-1)
  })

  it('free plan has 1 site max', () => {
    expect(getLimit('free', 'sitesMax')).toBe(1)
  })

  it('souveraine plan has unlimited sites', () => {
    expect(getLimit('souveraine', 'sitesMax')).toBe(-1)
  })

  it('explorer tracks 50 keywords', () => {
    expect(getLimit('explorer', 'keywordsTracked')).toBe(50)
  })
})

describe('isFeatureLocked', () => {
  it('free plan locks aiVisibility', () => {
    expect(isFeatureLocked('free', 'aiVisibility')).toBe(true)
  })

  it('explorer plan does not lock aiVisibility', () => {
    expect(isFeatureLocked('explorer', 'aiVisibility')).toBe(false)
  })

  it('free plan locks exportPDF', () => {
    expect(isFeatureLocked('free', 'exportPDF')).toBe(true)
  })

  it('returns false for unknown features', () => {
    expect(isFeatureLocked('free', 'nonExistentFeature')).toBe(false)
  })
})

describe('getMinPlanForFeature', () => {
  it('auditsPerMonth available from free', () => {
    expect(getMinPlanForFeature('auditsPerMonth')).toBe('free')
  })

  it('aiVisibility requires explorer', () => {
    expect(getMinPlanForFeature('aiVisibility')).toBe('explorer')
  })

  it('aeoReports requires professionnel', () => {
    expect(getMinPlanForFeature('aeoReports')).toBe('professionnel')
  })

  it('llmoReports requires entreprise', () => {
    expect(getMinPlanForFeature('llmoReports')).toBe('entreprise')
  })

  it('whiteLabel requires souveraine', () => {
    expect(getMinPlanForFeature('whiteLabel')).toBe('souveraine')
  })
})
