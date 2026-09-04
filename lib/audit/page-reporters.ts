/**
 * Rapporteurs de constats par page : fonctions pures sur une page crawlée,
 * sans DOM. Portage d'OpenSEO (MIT). Les vérifications multipages
 * (doublons, redirections, liens cassés, orphelines) sont dans
 * multipage-checks.ts.
 */
import type { AuditIssueType } from './issues'
import type { CrawledPageResult } from './types'

export interface DetectedIssue {
  issueType: AuditIssueType
  pageId: string | null
  pageUrl: string
  details?: Record<string, unknown>
  /** Distingue plusieurs constats du même type sur la même page (un par lien cassé). */
  dedupeKey?: string
}

const TITLE_MAX_CHARS = 60
const TITLE_MIN_CHARS = 10
const META_DESCRIPTION_MAX_CHARS = 160
const META_DESCRIPTION_MIN_CHARS = 70
const THIN_CONTENT_WORDS = 150
const SLOW_RESPONSE_MS = 1500
const DEEP_PAGE_DEPTH = 5

export function hasHeadingLevelSkip(headingOrder: number[]): boolean {
  for (let i = 1; i < headingOrder.length; i++) {
    if (headingOrder[i] > headingOrder[i - 1] + 1) return true
  }
  return false
}

export function runPageReporters(page: CrawledPageResult): DetectedIssue[] {
  const issues: DetectedIssue[] = []
  const report = (issueType: AuditIssueType, details?: Record<string, unknown>) =>
    issues.push({ issueType, pageId: page.id, pageUrl: page.url, details })

  if (page.fetchClass === 'blocked') {
    report('blocked-page', { statusCode: page.statusCode })
    return issues
  }
  if (page.fetchClass === 'error') return issues

  if (page.statusCode >= 500) {
    report('server-error', { statusCode: page.statusCode })
    return issues
  }
  if (page.statusCode >= 400) {
    report('broken-page', { statusCode: page.statusCode })
    return issues
  }
  // Les redirections sont normales seules ; chaînes et boucles sont multipages.
  if (page.statusCode >= 300) return issues

  if (page.responseTimeMs > SLOW_RESPONSE_MS) report('slow-response', { responseTimeMs: page.responseTimeMs })

  // Les vérifications de contenu n'ont de sens que sur un document HTML.
  if (!page.isHtml) return issues

  if (!page.title) report('missing-title')
  else if (page.title.length > TITLE_MAX_CHARS) report('title-too-long', { length: page.title.length })
  else if (page.title.length < TITLE_MIN_CHARS) report('title-too-short', { length: page.title.length })

  if (!page.metaDescription) report('missing-meta-description')
  else if (page.metaDescription.length > META_DESCRIPTION_MAX_CHARS) {
    report('meta-description-too-long', { length: page.metaDescription.length })
  } else if (page.metaDescription.length < META_DESCRIPTION_MIN_CHARS) {
    report('meta-description-too-short', { length: page.metaDescription.length })
  }

  if (page.h1Count === 0) report('missing-h1')
  else if (page.h1Count > 1) report('multiple-h1', { h1Count: page.h1Count })
  if (hasHeadingLevelSkip(page.headingOrder)) report('heading-order-skip')

  if (!page.isIndexable) report('noindex-page', { robotsMeta: page.robotsMeta, xRobotsTag: page.xRobotsTag })
  if (page.canonicalUrl && page.headerCanonicalUrl && page.canonicalUrl !== page.headerCanonicalUrl) {
    report('canonical-conflict', { htmlCanonical: page.canonicalUrl, headerCanonical: page.headerCanonicalUrl })
  }
  const effectiveCanonical = page.canonicalUrl ?? page.headerCanonicalUrl
  if (effectiveCanonical && effectiveCanonical !== page.url) {
    report('canonicalized-page', { canonicalUrl: effectiveCanonical })
  }

  if (page.isIndexable && page.wordCount < THIN_CONTENT_WORDS) report('thin-content', { wordCount: page.wordCount })
  if (page.imagesMissingAlt > 0) {
    report('images-missing-alt', { imagesMissingAlt: page.imagesMissingAlt, imagesTotal: page.imagesTotal })
  }

  if (page.isIndexable && page.links.length === 0) report('no-outgoing-links')
  if (page.crawlDepth !== null && page.crawlDepth >= DEEP_PAGE_DEPTH) report('deep-page', { crawlDepth: page.crawlDepth })

  return issues
}
