import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// vi.mock est hissé au-dessus des déclarations : les doubles doivent l'être aussi.
const { aggregate, create } = vi.hoisted(() => ({ aggregate: vi.fn(), create: vi.fn() }))
vi.mock('@/lib/prisma', () => ({
  prisma: { dataProviderUsage: { aggregate, create, groupBy: vi.fn() } },
}))

import { getBudgetStatus, meterDataforseoCall, startOfMonthUtc, usdToMicros } from '@/lib/dataforseo/budget'
import { DataforseoChargedTaskError } from '@/lib/dataforseo/envelope'
import { DataforseoError } from '@/lib/dataforseo/errors'

describe('budget DataForSEO', () => {
  beforeEach(() => {
    aggregate.mockReset().mockResolvedValue({ _sum: { costMicros: 0 } })
    create.mockReset().mockResolvedValue({})
    process.env.DATAFORSEO_MONTHLY_BUDGET_USD = '10'
  })
  afterEach(() => {
    delete process.env.DATAFORSEO_MONTHLY_BUDGET_USD
  })

  it('convertit en micro-dollars entiers', () => {
    expect(usdToMicros(0.0025)).toBe(2500)
    expect(usdToMicros(1)).toBe(1_000_000)
  })

  it('calcule le début du mois en UTC', () => {
    expect(startOfMonthUtc(new Date('2026-09-04T22:00:00Z')).toISOString()).toBe('2026-09-01T00:00:00.000Z')
  })

  it('journalise le coût réel après un appel réussi et notifie onCost', async () => {
    const onCost = vi.fn()
    const data = await meterDataforseoCall({ userId: 'u1', onCost }, 'serp', async () => ({
      data: 'ok',
      billing: { path: ['v3', 'serp'], costUsd: 0.005 },
    }))
    expect(data).toBe('ok')
    expect(create).toHaveBeenCalledWith({
      data: expect.objectContaining({ userId: 'u1', feature: 'serp', path: 'v3/serp', costMicros: 5000, status: 'ok' }),
    })
    expect(onCost).toHaveBeenCalledWith(5000)
  })

  it('refuse l’appel quand la dépense du mois atteint le plafond', async () => {
    aggregate.mockResolvedValue({ _sum: { costMicros: 10_000_000 } })
    const execute = vi.fn()
    await expect(meterDataforseoCall({}, 'serp', execute)).rejects.toMatchObject({ code: 'BUDGET_EXCEEDED' })
    expect(execute).not.toHaveBeenCalled()
  })

  it('journalise en « failed » une tâche facturée mais échouée, puis relance', async () => {
    const error = new DataforseoChargedTaskError('boom', { path: ['v3', 'x'], costUsd: 0.01 })
    await expect(meterDataforseoCall({}, 'backlinks', async () => { throw error })).rejects.toBe(error)
    expect(create).toHaveBeenCalledWith({ data: expect.objectContaining({ status: 'failed', costMicros: 10000 }) })
  })

  it('transforme une requête mal formée non facturée en VALIDATION_ERROR sans ligne', async () => {
    const error = new DataforseoChargedTaskError("Invalid Field: 'x'", { path: ['v3', 'x'], costUsd: 0 }, true)
    await expect(meterDataforseoCall({}, 'serp', async () => { throw error })).rejects.toSatisfy(
      (e: unknown) => e instanceof DataforseoError && e.code === 'VALIDATION_ERROR',
    )
    expect(create).not.toHaveBeenCalled()
  })

  it('expose le statut du budget', async () => {
    aggregate.mockResolvedValue({ _sum: { costMicros: 2_500_000 } })
    expect(await getBudgetStatus()).toEqual({ budgetUsd: 10, spentUsd: 2.5, remainingUsd: 7.5, ratio: 0.25 })
  })
})
