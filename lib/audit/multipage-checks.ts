/**
 * Vérifications multipages pures : doublons, chaînes et boucles de
 * redirections, liens internes cassés, pages orphelines.
 * Portage d'OpenSEO (MIT), avec les deux vérifications de liens qu'OpenSEO
 * faisait en base ramenées ici en mémoire (le crawl tient dans une requête).
 */
import type { DetectedIssue } from './page-reporters'
import type { CrawledPageResult } from './types'

const DUPLICATE_GROUP_SAMPLE = 3

export interface SlimPage {
  id: string
  url: string
  statusCode: number | null
  fetchClass: 'ok' | 'blocked' | 'error'
  title: string | null
  metaDescription: string | null
  contentHash: string | null
  redirectUrl: string | null
  wordCount: number
  isIndexable: boolean
  canonicalUrl: string | null
  headerCanonicalUrl: string | null
}

function isOkPage(page: SlimPage): boolean {
  return page.fetchClass === 'ok' && page.statusCode !== null && page.statusCode >= 200 && page.statusCode < 300
}

/** Les pages déjà dédoublonnées par le site (noindex, canonique ailleurs) ne comptent pas. */
function isDuplicateCandidate(page: SlimPage): boolean {
  if (!isOkPage(page) || !page.isIndexable) return false
  const effectiveCanonical = page.canonicalUrl ?? page.headerCanonicalUrl
  return !effectiveCanonical || effectiveCanonical === page.url
}

export function findDuplicates(pages: SlimPage[]): DetectedIssue[] {
  const okPages = pages.filter(isDuplicateCandidate)
  const groupBy = (keyOf: (page: SlimPage) => string | null): Map<string, SlimPage[]> => {
    const groups = new Map<string, SlimPage[]>()
    for (const page of okPages) {
      const key = keyOf(page)
      if (!key) continue
      const group = groups.get(key)
      if (group) group.push(page)
      else groups.set(key, [page])
    }
    return groups
  }

  const issues: DetectedIssue[] = []
  const emitGroups = (groups: Map<string, SlimPage[]>, issueType: DetectedIssue['issueType']) => {
    for (const group of Array.from(groups.values())) {
      if (group.length < 2) continue
      for (const page of group) {
        issues.push({
          issueType,
          pageId: page.id,
          pageUrl: page.url,
          details: {
            groupSize: group.length,
            otherUrls: group
              .filter((other) => other.id !== page.id)
              .slice(0, DUPLICATE_GROUP_SAMPLE)
              .map((other) => other.url),
          },
        })
      }
    }
  }

  emitGroups(groupBy((page) => page.title || null), 'duplicate-title')
  emitGroups(groupBy((page) => page.metaDescription || null), 'duplicate-meta-description')
  emitGroups(groupBy((page) => (page.wordCount > 0 ? page.contentHash : null)), 'duplicate-content')
  return issues
}

export function findRedirectChainsAndLoops(pages: SlimPage[]): DetectedIssue[] {
  const redirects = new Map<string, SlimPage>()
  for (const page of pages) {
    const isRedirect = page.statusCode !== null && page.statusCode >= 300 && page.statusCode < 400 && page.redirectUrl
    if (isRedirect) redirects.set(page.url, page)
  }
  const redirectTargets = new Set(Array.from(redirects.values(), (page) => page.redirectUrl!))

  const issues: DetectedIssue[] = []
  const walked = new Set<string>()

  // On part des têtes de chaîne (redirections vers lesquelles rien ne redirige)
  // pour qu'une chaîne de 5 sauts produise un constat, pas cinq.
  for (const [url, head] of Array.from(redirects.entries())) {
    if (redirectTargets.has(url)) continue
    const hops: string[] = [url]
    const seen = new Set(hops)
    walked.add(url)
    let current = head.redirectUrl
    let isLoop = false
    while (current) {
      if (seen.has(current)) {
        isLoop = true
        hops.push(current)
        break
      }
      hops.push(current)
      seen.add(current)
      if (redirects.has(current)) walked.add(current)
      current = redirects.get(current)?.redirectUrl ?? null
    }
    if (isLoop) {
      issues.push({ issueType: 'redirect-loop', pageId: head.id, pageUrl: url, details: { hops } })
    } else if (hops.length > 2) {
      issues.push({
        issueType: 'redirect-chain',
        pageId: head.id,
        pageUrl: url,
        details: { hops, finalUrl: hops[hops.length - 1] },
      })
    }
  }

  // Cycles sans tête (a↔b, a→a) : jamais atteints depuis une tête.
  for (const [url, page] of Array.from(redirects.entries())) {
    if (walked.has(url)) continue
    const cycle: string[] = []
    let current: string | null = url
    while (current && !walked.has(current)) {
      walked.add(current)
      cycle.push(current)
      current = redirects.get(current)?.redirectUrl ?? null
    }
    issues.push({ issueType: 'redirect-loop', pageId: page.id, pageUrl: url, details: { hops: [...cycle, url] } })
  }

  return issues
}

/** Liens internes dont la cible crawlée a répondu en 4xx/5xx : un constat par (page, cible). */
export function findBrokenInternalLinks(pages: CrawledPageResult[]): DetectedIssue[] {
  const statusByUrl = new Map(pages.map((page) => [page.url, page]))
  const issues: DetectedIssue[] = []
  for (const page of pages) {
    // Seules les pages servies (2xx) portent des liens à vérifier : les liens
    // d'une page d'erreur ou de redirection sont du bruit.
    if (page.fetchClass !== 'ok' || page.statusCode >= 300) continue
    for (const link of page.links) {
      if (!link.isInternal) continue
      const target = statusByUrl.get(link.targetUrl)
      if (!target || target.fetchClass !== 'ok' || target.statusCode < 400) continue
      issues.push({
        issueType: 'broken-internal-link',
        pageId: page.id,
        pageUrl: page.url,
        dedupeKey: link.targetUrl,
        details: { targetUrl: link.targetUrl, statusCode: target.statusCode, anchor: link.anchor },
      })
    }
  }
  return issues
}

/** Pages issues du sitemap vers lesquelles aucune page crawlée ne pointe. */
export function findOrphanPages(pages: CrawledPageResult[], startUrl: string): DetectedIssue[] {
  const inbound = new Set<string>()
  for (const page of pages) {
    for (const link of page.links) if (link.isInternal) inbound.add(link.targetUrl)
    if (page.redirectUrl) inbound.add(page.redirectUrl)
  }
  return pages
    .filter(
      (page) =>
        page.inSitemap &&
        page.crawlDepth === null &&
        page.url !== startUrl &&
        page.fetchClass === 'ok' &&
        page.statusCode < 300 &&
        !inbound.has(page.url),
    )
    .map((page) => ({ issueType: 'orphan-page' as const, pageId: page.id, pageUrl: page.url }))
}

export function toSlimPage(page: CrawledPageResult): SlimPage {
  return {
    id: page.id,
    url: page.url,
    statusCode: page.statusCode,
    fetchClass: page.fetchClass,
    title: page.title || null,
    metaDescription: page.metaDescription || null,
    contentHash: page.contentHash,
    redirectUrl: page.redirectUrl,
    wordCount: page.wordCount,
    isIndexable: page.isIndexable,
    canonicalUrl: page.canonicalUrl,
    headerCanonicalUrl: page.headerCanonicalUrl,
  }
}

export function runMultipageChecks(pages: CrawledPageResult[], startUrl: string): DetectedIssue[] {
  const slim = pages.map(toSlimPage)
  return [
    ...findDuplicates(slim),
    ...findRedirectChainsAndLoops(slim),
    ...findBrokenInternalLinks(pages),
    ...findOrphanPages(pages, startUrl),
  ]
}
