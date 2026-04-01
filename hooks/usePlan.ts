'use client'

import { useState, useCallback } from 'react'
import { type PlanId, canAccess, getLimit, isFeatureLocked, getMinPlanForFeature, type PlanConfig } from '@/lib/plans'

// Simulated user plan - in production this would come from auth/DB
// Default to 'free' to demonstrate feature gating
const DEFAULT_PLAN: PlanId = 'free'

export function usePlan() {
  const [currentPlan, setCurrentPlan] = useState<PlanId>(DEFAULT_PLAN)

  const checkAccess = useCallback(
    (feature: keyof PlanConfig['limits']) => canAccess(currentPlan, feature),
    [currentPlan]
  )

  const checkLimit = useCallback(
    (feature: keyof PlanConfig['limits']) => getLimit(currentPlan, feature),
    [currentPlan]
  )

  const checkLocked = useCallback(
    (feature: string) => isFeatureLocked(currentPlan, feature),
    [currentPlan]
  )

  const getRequiredPlan = useCallback(
    (feature: keyof PlanConfig['limits']) => getMinPlanForFeature(feature),
    []
  )

  return {
    currentPlan,
    setCurrentPlan,
    checkAccess,
    checkLimit,
    checkLocked,
    getRequiredPlan,
  }
}
