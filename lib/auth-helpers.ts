import { type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { JWT } from 'next-auth/jwt'

export type PlanHierarchy = 'free' | 'starter' | 'pro' | 'enterprise'

const planHierarchy: Record<PlanHierarchy, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
}

export async function getCurrentUser(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    return null
  }

  return {
    id: token.id as string,
    email: token.email as string,
    name: token.name as string,
    plan: token.plan as PlanHierarchy,
    role: token.role as string,
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getCurrentUser(request)

  if (!user) {
    throw new Error('Unauthorized: User must be authenticated')
  }

  return user
}

export async function requirePlan(
  request: NextRequest,
  minPlan: PlanHierarchy
) {
  const user = await requireAuth(request)

  const userPlanLevel = planHierarchy[user.plan]
  const minPlanLevel = planHierarchy[minPlan]

  if (userPlanLevel < minPlanLevel) {
    throw new Error(
      `Forbidden: This feature requires ${minPlan} plan or higher. You have ${user.plan} plan.`
    )
  }

  return user
}

export function getPlanHierarchy(plan: string): number {
  return planHierarchy[plan as PlanHierarchy] ?? -1
}

export function comparePlans(plan1: string, plan2: string): number {
  const level1 = getPlanHierarchy(plan1)
  const level2 = getPlanHierarchy(plan2)
  return level1 - level2
}

export const planLevels = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
} as const
