import { describe, it, expect } from 'vitest'
import {
  assertOk,
  buildTaskBilling,
  createBillingClassifier,
  DataforseoChargedTaskError,
  isNoResultsTask,
  isTaskInProgress,
  parseTaskItems,
} from '@/lib/dataforseo/envelope'
import { DataforseoError } from '@/lib/dataforseo/errors'
import { z } from 'zod'

const okTask = { status_code: 20000, status_message: 'Ok.', path: ['v3', 'x', 'live'], cost: 0.01, result: [{ items: [{ a: 1 }] }] }

describe('assertOk', () => {
  it('renvoie la tâche quand réponse et tâche sont en 20000', () => {
    expect(assertOk({ status_code: 20000, tasks: [okTask] })).toBe(okTask)
  })

  it('lève sur une réponse vide', () => {
    expect(() => assertOk(null)).toThrow(DataforseoError)
  })

  it('classe une tâche facturée mais échouée en DataforseoChargedTaskError avec son coût', () => {
    const task = { ...okTask, status_code: 40501, status_message: "Invalid Field: 'target'.", data: { target: 'x' } }
    try {
      assertOk({ status_code: 20000, tasks: [task] })
      throw new Error('devait lever')
    } catch (error) {
      expect(error).toBeInstanceOf(DataforseoChargedTaskError)
      const charged = error as DataforseoChargedTaskError
      expect(charged.billing.costUsd).toBe(0.01)
      expect(charged.isInvalidField).toBe(true)
      expect(charged.message).toContain('target="x"')
    }
  })

  it('traite « No Search Results » comme un succès vide quand demandé', () => {
    const task = { ...okTask, status_code: 40501, status_message: 'No Search Results.' }
    expect(assertOk({ status_code: 20000, tasks: [task] }, { treatNoResultsAsEmpty: true })).toBe(task)
    expect(() => assertOk({ status_code: 20000, tasks: [task] })).toThrow()
  })

  it('classe les pannes du backend fournisseur en UPSTREAM_UNAVAILABLE', () => {
    const task = { ...okTask, status_code: 40101, status_message: 'Internal SE Server Error.' }
    try {
      assertOk({ status_code: 20000, tasks: [task] })
      throw new Error('devait lever')
    } catch (error) {
      expect((error as DataforseoError).code).toBe('UPSTREAM_UNAVAILABLE')
    }
  })

  it('applique le classificateur de facturation sur les refus d’accès', () => {
    const classify = createBillingClassifier('/backlinks/', 'pas d’accès')
    const task = { ...okTask, status_code: 40201, status_message: 'Access denied.' }
    try {
      assertOk({ status_code: 20000, tasks: [task] }, { classify, classifyPath: '/v3/backlinks/summary/live' })
      throw new Error('devait lever')
    } catch (error) {
      expect((error as DataforseoError).code).toBe('BILLING_ISSUE')
    }
  })
})

describe('helpers', () => {
  it('buildTaskBilling exige path et cost', () => {
    expect(buildTaskBilling(okTask)).toEqual({ path: ['v3', 'x', 'live'], costUsd: 0.01 })
    expect(() => buildTaskBilling({ status_code: 20000 })).toThrow(DataforseoError)
  })

  it('parseTaskItems valide contre le schéma et lève sur une forme invalide', () => {
    expect(parseTaskItems('x', okTask, z.object({ a: z.number() }))).toEqual([{ a: 1 }])
    expect(() => parseTaskItems('x', okTask, z.object({ a: z.string() }))).toThrow(DataforseoError)
  })

  it('reconnaît les statuts en cours et les résultats vides', () => {
    expect(isTaskInProgress({ status_code: 20100 })).toBe(true)
    expect(isTaskInProgress({ status_code: 20000 })).toBe(false)
    expect(isNoResultsTask({ status_message: 'No Search Results.' })).toBe(true)
    expect(isNoResultsTask({ status_message: "Invalid Field: 'x'" })).toBe(false)
  })
})
