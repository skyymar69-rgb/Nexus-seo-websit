import { describe, it, expect } from 'vitest'
import { buildRankCheckResult, clampSerpDepth } from '@/lib/dataforseo/serp'
import { estimateRunCostUsd } from '@/lib/rank-tracking/service'
import { normalizeBacklinksTarget } from '@/lib/dataforseo/backlinks'

const input = { keywordId: 'k1', keyword: 'plombier lyon', targetDomain: 'www.dupont.fr' }

describe('buildRankCheckResult', () => {
  it('prend la position organique du domaine ou d’un sous-domaine, pas des blocs SERP', () => {
    const result = buildRankCheckResult(input, [
      { type: 'local_pack', rank_absolute: 1, domain: 'dupont.fr' },
      { type: 'organic', rank_group: 1, rank_absolute: 2, domain: 'concurrent.fr' },
      { type: 'organic', rank_group: 2, rank_absolute: 3, domain: 'blog.dupont.fr', url: 'https://blog.dupont.fr/x' },
    ])
    expect(result.position).toBe(2)
    expect(result.url).toBe('https://blog.dupont.fr/x')
    expect(result.serpFeatures).toEqual(['local_pack', 'organic'])
  })

  it('renvoie null quand le domaine est absent', () => {
    expect(buildRankCheckResult(input, [{ type: 'organic', rank_group: 1, domain: 'autre.fr' }]).position).toBeNull()
  })
})

describe('bornes et estimations', () => {
  it('clampSerpDepth borne entre 10 et 100', () => {
    expect(clampSerpDepth(5)).toBe(10)
    expect(clampSerpDepth(150)).toBe(100)
  })
  it('estimateRunCostUsd est linéaire en mots-clés et pages', () => {
    expect(estimateRunCostUsd(10, 20)).toBeCloseTo(0.05)
  })
  it('normalizeBacklinksTarget nettoie protocole, www et chemin', () => {
    expect(normalizeBacklinksTarget('https://www.Dupont.fr/')).toBe('dupont.fr')
    expect(normalizeBacklinksTarget('www.dupont.fr/tarifs')).toBe('dupont.fr')
    expect(normalizeBacklinksTarget('https://dupont.fr/blog/post')).toBe('https://dupont.fr/blog/post')
  })
})
