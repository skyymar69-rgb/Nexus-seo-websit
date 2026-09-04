/**
 * Persistance Prisma du crawl multipage et lecture du rapport.
 */
import { prisma } from '@/lib/prisma'
import type { CrawlResult } from './crawler'
import { getIssueDescriptor, getIssueSeverity, ISSUE_SEVERITY_ORDER, type IssueSeverity } from './issues'
import type { DetectedIssue } from './page-reporters'

/** Libellés français des constats d'une page, pour le champ `issues` historique. */
export function legacyIssueLabels(issues: DetectedIssue[], pageId: string): string[] {
  return issues
    .filter((issue) => issue.pageId === pageId)
    .map((issue) => getIssueDescriptor(issue.issueType)?.title ?? issue.issueType)
}

export async function createCrawlSession(websiteId: string, startUrl: string, maxPages: number): Promise<string> {
  const session = await prisma.crawlSession.create({
    data: { websiteId, status: 'running', startUrl, config: JSON.stringify({ startUrl, maxPages }) },
  })
  return session.id
}

export async function persistCrawlResult(crawlSessionId: string, result: CrawlResult): Promise<void> {
  await prisma.$transaction(async (tx) => {
    if (result.pages.length > 0) {
      await tx.crawledPage.createMany({
        data: result.pages.map((page) => ({
          id: page.id,
          crawlSessionId,
          url: page.url,
          statusCode: page.statusCode,
          contentType: page.contentType,
          contentLength: page.contentLength,
          responseTime: page.responseTimeMs,
          title: page.title || null,
          metaDescription: page.metaDescription || null,
          h1Count: page.h1Count,
          h2Count: page.h2Count,
          internalLinks: page.internalLinks,
          externalLinks: page.externalLinks,
          images: page.imagesTotal,
          imagesNoAlt: page.imagesMissingAlt,
          issues: JSON.stringify(legacyIssueLabels(result.issues, page.id)),
          fetchClass: page.fetchClass,
          redirectUrl: page.redirectUrl,
          canonicalUrl: page.canonicalUrl,
          headerCanonicalUrl: page.headerCanonicalUrl,
          robotsMeta: page.robotsMeta,
          xRobotsTag: page.xRobotsTag,
          isIndexable: page.isIndexable,
          wordCount: page.wordCount,
          contentHash: page.contentHash,
          headingOrder: JSON.stringify(page.headingOrder),
          crawlDepth: page.crawlDepth,
          inSitemap: page.inSitemap,
          hasStructuredData: page.hasStructuredData,
        })),
      })
    }
    if (result.issues.length > 0) {
      await tx.crawlIssue.createMany({
        data: result.issues.map((issue) => ({
          crawlSessionId,
          pageId: issue.pageId,
          pageUrl: issue.pageUrl,
          issueType: issue.issueType,
          severity: getIssueSeverity(issue.issueType),
          details: issue.details ? JSON.stringify(issue.details) : null,
          dedupeKey: issue.dedupeKey ?? '',
        })),
        skipDuplicates: true,
      })
    }
    await tx.crawlSession.update({
      where: { id: crawlSessionId },
      data: {
        status: 'completed',
        startUrl: result.startUrl,
        pagesFound: result.pages.length,
        pagesCrawled: result.pages.length,
        sitemapUrls: result.sitemapUrls,
        completedAt: new Date(),
      },
    })
  })
}

export async function markCrawlFailed(crawlSessionId: string, error: unknown): Promise<void> {
  const message = error instanceof Error ? error.message : String(error)
  await prisma.crawlSession
    .update({ where: { id: crawlSessionId }, data: { status: 'failed', error: message.slice(0, 500), completedAt: new Date() } })
    .catch(() => {})
}

export type IssueSummaryRow = { issueType: string; title: string; severity: IssueSeverity; count: number }

/** Regroupe des constats par type, du plus grave au plus fréquent. */
export function summarizeIssues(issues: Array<{ issueType: string }>): IssueSummaryRow[] {
  const counts = new Map<string, number>()
  for (const issue of issues) counts.set(issue.issueType, (counts.get(issue.issueType) ?? 0) + 1)
  return Array.from(counts.entries())
    .map(([issueType, count]) => ({
      issueType,
      title: getIssueDescriptor(issueType)?.title ?? issueType,
      severity: getIssueSeverity(issueType),
      count,
    }))
    .sort((a, b) => ISSUE_SEVERITY_ORDER[a.severity] - ISSUE_SEVERITY_ORDER[b.severity] || b.count - a.count)
}

export async function getLatestCrawlSession(websiteId: string) {
  return prisma.crawlSession.findFirst({
    where: { websiteId, status: 'completed' },
    orderBy: { startedAt: 'desc' },
  })
}

export async function getCrawlIssues(
  crawlSessionId: string,
  filters: { severity?: IssueSeverity; issueType?: string; limit?: number } = {},
) {
  const rows = await prisma.crawlIssue.findMany({
    where: {
      crawlSessionId,
      ...(filters.severity ? { severity: filters.severity } : {}),
      ...(filters.issueType ? { issueType: filters.issueType } : {}),
    },
    orderBy: [{ severity: 'asc' }, { issueType: 'asc' }],
  })
  // Tri par gravité réelle : "critical" < "info" < "warning" en ordre alphabétique.
  const sorted = rows.sort(
    (a, b) =>
      ISSUE_SEVERITY_ORDER[a.severity as IssueSeverity] - ISSUE_SEVERITY_ORDER[b.severity as IssueSeverity] ||
      a.issueType.localeCompare(b.issueType),
  )
  const limit = filters.limit ?? 200
  return {
    total: sorted.length,
    summary: summarizeIssues(sorted),
    issues: sorted.slice(0, limit).map((row) => {
      const descriptor = getIssueDescriptor(row.issueType)
      return {
        severity: row.severity as IssueSeverity,
        issueType: row.issueType,
        title: descriptor?.title ?? row.issueType,
        url: row.pageUrl,
        details: row.details ? (JSON.parse(row.details) as unknown) : null,
        howToFix: descriptor?.howToFix ?? null,
      }
    }),
  }
}

export async function getCrawlPages(crawlSessionId: string, limit = 500) {
  const pages = await prisma.crawledPage.findMany({
    where: { crawlSessionId },
    orderBy: [{ crawlDepth: 'asc' }, { url: 'asc' }],
    take: limit,
  })
  return pages.map((page) => ({
    id: page.id,
    url: page.url,
    statusCode: page.statusCode,
    fetchClass: page.fetchClass,
    redirectUrl: page.redirectUrl,
    responseTime: page.responseTime,
    title: page.title ?? '',
    metaDescription: page.metaDescription ?? '',
    h1Count: page.h1Count,
    h2Count: page.h2Count,
    internalLinks: page.internalLinks,
    externalLinks: page.externalLinks,
    imageCount: page.images,
    imagesWithoutAlt: page.imagesNoAlt,
    wordCount: page.wordCount,
    isIndexable: page.isIndexable,
    canonicalUrl: page.canonicalUrl,
    crawlDepth: page.crawlDepth,
    inSitemap: page.inSitemap,
    hasStructuredData: page.hasStructuredData,
    issues: page.issues ? (JSON.parse(page.issues) as string[]) : [],
  }))
}
