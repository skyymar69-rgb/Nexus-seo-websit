/**
 * Briques pour les expressions `filters` DataForSEO (mots-clés de domaine,
 * backlinks). Portage d'OpenSEO (MIT). Une clause est un tuple
 * ["champ", "ilike", "%terme%"] ou un groupe imbriqué.
 */
import { DataforseoError } from './errors'

/** DataForSEO accepte au plus 8 conditions de filtre par requête. */
export const MAX_FILTER_CONDITIONS = 8

export type FilterClause = unknown[]

export function escapeLikeTerm(term: string): string {
  return term.replace(/[\\%_]/g, (match) => `\\${match}`)
}

/** Découpe une chaîne de termes séparés par virgule ou plus, en minuscules. */
export function parseFilterTerms(value: string | undefined): string[] {
  if (!value) return []
  return value
    .toLowerCase()
    .split(/[,+]/)
    .map((term) => term.trim())
    .filter(Boolean)
}

export function collectNumericRange(out: FilterClause[], field: string, min?: number, max?: number) {
  if (typeof min === 'number' && Number.isFinite(min)) out.push([field, '>=', min])
  if (typeof max === 'number' && Number.isFinite(max)) out.push([field, '<=', max])
}

/** Une condition ilike par terme, jointes par "or" (sémantique « au moins un »). */
export function buildIncludeOrGroup(
  field: string,
  include: string | undefined,
): { clause: FilterClause; conditionCount: number } | null {
  const conditions = parseFilterTerms(include).map((term) => [field, 'ilike', `%${escapeLikeTerm(term)}%`])
  if (conditions.length === 0) return null
  if (conditions.length === 1) return { clause: conditions[0], conditionCount: 1 }
  return { clause: joinClauses(conditions, 'or'), conditionCount: conditions.length }
}

export function assertFilterConditionBudget(conditionCount: number): void {
  if (conditionCount > MAX_FILTER_CONDITIONS) {
    throw new DataforseoError(
      'VALIDATION_ERROR',
      `Trop de conditions de filtre (${conditionCount} sur ${MAX_FILTER_CONDITIONS} max).`,
    )
  }
}

export function joinClauses(clauses: FilterClause[], operator: 'and' | 'or'): unknown[] {
  const expressions: unknown[] = []
  for (const clause of clauses) {
    if (expressions.length > 0) expressions.push(operator)
    expressions.push(clause)
  }
  return expressions
}
