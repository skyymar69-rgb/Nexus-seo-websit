import { describe, it, expect } from 'vitest'
import {
  findBrokenInternalLinks,
  findDuplicates,
  findOrphanPages,
  findRedirectChainsAndLoops,
  type SlimPage,
} from '@/lib/audit/multipage-checks'
import { runPageReporters } from '@/lib/audit/page-reporters'
import type { CrawledPageResult } from '@/lib/audit/types'

function slim(overrides: Partial<SlimPage> & { id: string; url: string }): SlimPage {
  return {
    statusCode: 200,
    fetchClass: 'ok',
    title: null,
    metaDescription: null,
    contentHash: null,
    redirectUrl: null,
    wordCount: 100,
    isIndexable: true,
    canonicalUrl: null,
    headerCanonicalUrl: null,
    ...overrides,
  }
}

function page(overrides: Partial<CrawledPageResult> & { id: string; url: string }): CrawledPageResult {
  return {
    statusCode: 200,
    fetchClass: 'ok',
    redirectUrl: null,
    contentType: 'text/html',
    contentLength: 1000,
    title: 'Un titre assez long',
    metaDescription: 'Une description assez longue pour passer la borne basse de soixante-dix caractères.',
    canonicalUrl: null,
    robotsMeta: null,
    xRobotsTag: null,
    headerCanonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    h1Count: 1,
    h2Count: 0,
    h3Count: 0,
    headingOrder: [1],
    wordCount: 300,
    contentHash: 'h',
    isHtml: true,
    htmlBytes: 1000,
    imagesTotal: 0,
    imagesMissingAlt: 0,
    links: [{ targetUrl: 'https://ex.fr/b', anchor: 'b', isInternal: true, isNofollow: false }],
    internalLinks: 1,
    externalLinks: 0,
    hasStructuredData: false,
    hreflangTags: [],
    isIndexable: true,
    responseTimeMs: 100,
    crawlDepth: 0,
    inSitemap: false,
    ...overrides,
  }
}

describe('findDuplicates', () => {
  it('groupe les titles identiques et ignore les pages déjà canonicalisées', () => {
    const issues = findDuplicates([
      slim({ id: '1', url: 'https://ex.fr/a', title: 'Même' }),
      slim({ id: '2', url: 'https://ex.fr/b', title: 'Même' }),
      slim({ id: '3', url: 'https://ex.fr/c', title: 'Même', canonicalUrl: 'https://ex.fr/a' }),
    ])
    expect(issues.map((i) => i.pageId).sort()).toEqual(['1', '2'])
    expect(issues[0].issueType).toBe('duplicate-title')
    expect(issues[0].details?.otherUrls).toEqual(['https://ex.fr/b'])
  })
})

describe('findRedirectChainsAndLoops', () => {
  it('signale une chaîne une seule fois, depuis sa tête', () => {
    const issues = findRedirectChainsAndLoops([
      slim({ id: 'a', url: 'https://ex.fr/a', statusCode: 301, redirectUrl: 'https://ex.fr/b' }),
      slim({ id: 'b', url: 'https://ex.fr/b', statusCode: 301, redirectUrl: 'https://ex.fr/c' }),
      slim({ id: 'c', url: 'https://ex.fr/c' }),
    ])
    expect(issues).toHaveLength(1)
    expect(issues[0].issueType).toBe('redirect-chain')
    expect(issues[0].details?.finalUrl).toBe('https://ex.fr/c')
  })

  it('détecte une boucle sans tête', () => {
    const issues = findRedirectChainsAndLoops([
      slim({ id: 'a', url: 'https://ex.fr/a', statusCode: 302, redirectUrl: 'https://ex.fr/b' }),
      slim({ id: 'b', url: 'https://ex.fr/b', statusCode: 302, redirectUrl: 'https://ex.fr/a' }),
    ])
    expect(issues).toHaveLength(1)
    expect(issues[0].issueType).toBe('redirect-loop')
  })
})

describe('liens cassés et pages orphelines', () => {
  it('signale un lien interne vers une page en 404, avec une clé par cible', () => {
    const issues = findBrokenInternalLinks([
      page({ id: 'a', url: 'https://ex.fr/a' }),
      page({ id: 'b', url: 'https://ex.fr/b', statusCode: 404 }),
    ])
    expect(issues).toHaveLength(1)
    expect(issues[0]).toMatchObject({ issueType: 'broken-internal-link', pageId: 'a', dedupeKey: 'https://ex.fr/b' })
  })

  it('signale une page du sitemap vers laquelle rien ne pointe', () => {
    const issues = findOrphanPages(
      [
        page({ id: 'a', url: 'https://ex.fr/', links: [] }),
        page({ id: 'o', url: 'https://ex.fr/orpheline', crawlDepth: null, inSitemap: true, links: [] }),
      ],
      'https://ex.fr/',
    )
    expect(issues.map((i) => i.pageId)).toEqual(['o'])
  })
})

describe('runPageReporters', () => {
  it('ne produit aucun constat sur une page saine', () => {
    expect(runPageReporters(page({ id: 'ok', url: 'https://ex.fr/ok' }))).toEqual([])
  })

  it('signale le blocage et s’arrête là', () => {
    const issues = runPageReporters(page({ id: 'b', url: 'https://ex.fr/b', fetchClass: 'blocked', statusCode: 403, title: '' }))
    expect(issues.map((i) => i.issueType)).toEqual(['blocked-page'])
  })

  it('signale title manquant, contenu insuffisant et noindex', () => {
    const issues = runPageReporters(
      page({ id: 'c', url: 'https://ex.fr/c', title: '', wordCount: 10, robotsMeta: 'noindex', isIndexable: false }),
    )
    const types = issues.map((i) => i.issueType)
    expect(types).toContain('missing-title')
    expect(types).toContain('noindex-page')
    // Une page non indexable n'est pas jugée sur la longueur de son contenu.
    expect(types).not.toContain('thin-content')
  })
})
