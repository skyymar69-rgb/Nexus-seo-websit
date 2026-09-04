import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withCors, corsOptionsResponse } from '@/lib/cors'
import { crawlSite, type CrawlResult } from '@/lib/audit/crawler'
import { CrawlTargetError } from '@/lib/audit/url-policy'
import {
  createCrawlSession,
  getCrawlIssues,
  getCrawlPages,
  getLatestCrawlSession,
  legacyIssueLabels,
  markCrawlFailed,
  persistCrawlResult,
  summarizeIssues,
} from '@/lib/audit/persist'

/**
 * Crawl multipage (portage OpenSEO).
 *
 * POST { url, maxPages?, websiteId? } — explore le site (robots.txt respecté,
 * sitemaps comme semences, fenêtre de concurrence adaptative), détecte les
 * constats par page et multipages, et persiste si websiteId est fourni.
 *
 * GET ?websiteId=… — dernier crawl terminé : pages et constats.
 *
 * La forme de réponse historique (stats, pages[].issues en libellés) est
 * conservée pour les écrans existants ; `issues` (résumé par type) et
 * `truncated` s'y ajoutent.
 */

export const maxDuration = 60

const DEFAULT_MAX_PAGES = 10
const MAX_PAGES_LIMIT = 50
const TIME_BUDGET_MS = 45_000

interface CrawlStats {
  totalPages: number
  statusCodes: { [key: string]: number }
  totalInternalLinks: number
  totalExternalLinks: number
  totalImages: number
  totalImagesWithoutAlt: number
  avgResponseTime: number
}

function buildStats(result: CrawlResult): CrawlStats {
  const statusCodes: { [key: string]: number } = {}
  let totalInternalLinks = 0
  let totalExternalLinks = 0
  let totalImages = 0
  let totalImagesWithoutAlt = 0
  let totalResponseTime = 0
  for (const page of result.pages) {
    const bucket = page.fetchClass === 'error' ? 'erreur' : `${Math.floor(page.statusCode / 100)}xx`
    statusCodes[bucket] = (statusCodes[bucket] || 0) + 1
    totalInternalLinks += page.internalLinks
    totalExternalLinks += page.externalLinks
    totalImages += page.imagesTotal
    totalImagesWithoutAlt += page.imagesMissingAlt
    totalResponseTime += page.responseTimeMs
  }
  return {
    totalPages: result.pages.length,
    statusCodes,
    totalInternalLinks,
    totalExternalLinks,
    totalImages,
    totalImagesWithoutAlt,
    avgResponseTime: result.pages.length > 0 ? Math.round(totalResponseTime / result.pages.length) : 0,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const websiteId = searchParams.get('websiteId')
    if (!websiteId) return NextResponse.json({ error: 'websiteId requis' }, { status: 400 })

    const session = await getLatestCrawlSession(websiteId)
    if (!session) {
      return NextResponse.json({ pages: [], message: 'Aucun crawl disponible. Lancez un crawl depuis la page Crawleur Web.' })
    }
    const [pages, issues] = await Promise.all([getCrawlPages(session.id), getCrawlIssues(session.id, { limit: 500 })])
    return NextResponse.json({
      crawlId: session.id,
      startUrl: session.startUrl,
      pages,
      issues,
      crawlDate: session.startedAt,
      totalPages: session.pagesFound,
      sitemapUrls: session.sitemapUrls,
    })
  } catch (error) {
    console.error('Crawl GET error:', error)
    return NextResponse.json({ error: 'Erreur lors du chargement' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return corsOptionsResponse()
}

export async function POST(request: NextRequest) {
  let crawlId: string | undefined
  try {
    const body = await request.json().catch(() => ({}))
    const { url, maxPages = DEFAULT_MAX_PAGES, websiteId } = body ?? {}

    if (!url || typeof url !== 'string') {
      return withCors(NextResponse.json({ error: 'URL manquante ou invalide' }, { status: 400 }))
    }
    const validatedMaxPages = Math.min(Math.max(Number(maxPages) || DEFAULT_MAX_PAGES, 1), MAX_PAGES_LIMIT)

    if (typeof websiteId === 'string' && websiteId) {
      const website = await prisma.website.findUnique({ where: { id: websiteId }, select: { id: true } }).catch(() => null)
      if (website) {
        crawlId = await createCrawlSession(website.id, url, validatedMaxPages).catch(() => undefined)
      }
    }

    const result = await crawlSite({ startUrl: url, maxPages: validatedMaxPages, timeBudgetMs: TIME_BUDGET_MS })

    if (crawlId) {
      await persistCrawlResult(crawlId, result).catch((error) => {
        console.error('Failed to save crawl results:', error)
      })
    }

    const pages = result.pages.map((page) => ({
      id: page.id,
      url: page.url,
      statusCode: page.statusCode,
      fetchClass: page.fetchClass,
      redirectUrl: page.redirectUrl,
      contentType: page.contentType ?? 'unknown',
      contentLength: page.contentLength,
      responseTime: page.responseTimeMs,
      title: page.title,
      description: page.metaDescription,
      h1Count: page.h1Count,
      h2Count: page.h2Count,
      internalLinks: page.internalLinks,
      externalLinks: page.externalLinks,
      imageCount: page.imagesTotal,
      imagesWithoutAlt: page.imagesMissingAlt,
      wordCount: page.wordCount,
      isIndexable: page.isIndexable,
      canonicalUrl: page.canonicalUrl,
      crawlDepth: page.crawlDepth,
      inSitemap: page.inSitemap,
      issues: legacyIssueLabels(result.issues, page.id),
    }))

    return withCors(
      NextResponse.json({
        ...(crawlId && { crawlId }),
        url: result.startUrl,
        stats: buildStats(result),
        pages,
        issues: { total: result.issues.length, summary: summarizeIssues(result.issues) },
        sitemapUrls: result.sitemapUrls,
        truncated: result.truncated,
        durationMs: result.durationMs,
      }),
    )
  } catch (error) {
    if (crawlId) await markCrawlFailed(crawlId, error)
    if (error instanceof CrawlTargetError) {
      return withCors(NextResponse.json({ error: error.message, code: error.code }, { status: 400 }))
    }
    console.error('Crawl POST error:', error)
    return withCors(
      NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur interne' }, { status: 500 }),
    )
  }
}
