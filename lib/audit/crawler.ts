/**
 * Orchestrateur du crawl multipage.
 *
 * Ce fichier est propre à Nexus : OpenSEO orchestre son crawl dans un
 * Cloudflare Workflow (étapes durables, reprise). Ici le crawl tient dans une
 * requête bornée par un budget de temps et de pages, ce qui convient aux
 * fonctions Vercel et aux sites de PME. Les briques (politique d'URL, fenêtre
 * de concurrence, découverte, analyseur, rapporteurs) sont celles d'OpenSEO.
 *
 * Étapes :
 *  1. valider et résoudre l'URL de départ (SSRF, redirections d'origine) ;
 *  2. robots.txt + sitemaps (semences, respect des règles) ;
 *  3. exploration en largeur avec fenêtre glissante, jusqu'au budget ;
 *  4. constats par page puis multipages.
 */
import { createHash, randomUUID } from 'crypto'
import { adjustCrawlWindow, CRAWL_WINDOW, clampCrawlWindow } from './crawl-window'
import { discoverUrls, type DiscoveryResult } from './discovery'
import { runMultipageChecks } from './multipage-checks'
import { analyzeHtml } from './page-analyzer'
import { runPageReporters, type DetectedIssue } from './page-reporters'
import type { CrawledPageResult, CrawlProgress, PageFetchClass } from './types'
import { getOrigin, isSameOrigin, looksLikeAsset, normalizeUrl, readBodyCapped } from './url-utils'
import { isCrawlableUrl, normalizeAndValidateStartUrl, resolveStartUrlRedirects } from './url-policy'

export const CRAWLER_USER_AGENT = 'NexusSEO-Audit/1.0 (+https://nexus.kayzen-lyon.com/bot)'

const PAGE_FETCH_TIMEOUT_MS = 10_000
const MAX_HTML_BYTES = 2 * 1024 * 1024
const DISCOVERY_TIMEOUT_MS = 12_000
const DEFAULT_TIME_BUDGET_MS = 45_000
const MAX_CRAWL_DEPTH = 10

export interface CrawlOptions {
  startUrl: string
  maxPages: number
  /** Temps total alloué ; aucune nouvelle page n'est lancée au-delà. */
  timeBudgetMs?: number
  respectRobots?: boolean
  onProgress?: (progress: CrawlProgress) => void
}

export interface CrawlResult {
  startUrl: string
  origin: string
  pages: CrawledPageResult[]
  issues: DetectedIssue[]
  sitemapUrls: number
  robotsText: string | null
  /** Vrai si le budget (pages ou temps) a arrêté le crawl avant la fin de la file. */
  truncated: boolean
  durationMs: number
}

type QueueEntry = { url: string; depth: number | null; inSitemap: boolean }

function sha1(text: string): string {
  return createHash('sha1').update(text).digest('hex')
}

/** En-tête Link: <url>; rel="canonical" */
function parseHeaderCanonical(linkHeader: string | null, pageUrl: string): string | null {
  if (!linkHeader) return null
  for (const part of linkHeader.split(',')) {
    const match = part.match(/<([^>]+)>\s*;([^,]*)/)
    if (!match) continue
    if (/rel\s*=\s*"?canonical"?/i.test(match[2])) return normalizeUrl(match[1].trim(), pageUrl)
  }
  return null
}

function classifyFetch(status: number, headers: Headers): PageFetchClass {
  if (status === 403 || status === 429 || status === 503) {
    const server = headers.get('server')?.toLowerCase() ?? ''
    const mitigated = headers.get('cf-mitigated')
    if (mitigated || server.includes('cloudflare') || server.includes('akamai') || status === 429) return 'blocked'
  }
  return 'ok'
}

function isNoindex(...directives: Array<string | null>): boolean {
  return directives.some((value) => value?.toLowerCase().includes('noindex') ?? false)
}

function emptyPage(url: string, entry: QueueEntry, overrides: Partial<CrawledPageResult>): CrawledPageResult {
  return {
    id: randomUUID(),
    url,
    statusCode: 0,
    fetchClass: 'error',
    redirectUrl: null,
    contentType: null,
    contentLength: 0,
    title: '',
    metaDescription: '',
    canonicalUrl: null,
    robotsMeta: null,
    xRobotsTag: null,
    headerCanonicalUrl: null,
    ogTitle: null,
    ogDescription: null,
    ogImage: null,
    h1Count: 0,
    h2Count: 0,
    h3Count: 0,
    headingOrder: [],
    wordCount: 0,
    contentHash: null,
    isHtml: false,
    htmlBytes: 0,
    imagesTotal: 0,
    imagesMissingAlt: 0,
    links: [],
    internalLinks: 0,
    externalLinks: 0,
    hasStructuredData: false,
    hreflangTags: [],
    isIndexable: true,
    responseTimeMs: 0,
    crawlDepth: entry.depth,
    inSitemap: entry.inSitemap,
    ...overrides,
  }
}

export async function fetchAndAnalyzePage(entry: QueueEntry): Promise<CrawledPageResult> {
  const url = entry.url
  const started = Date.now()
  let response: Response
  try {
    response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': CRAWLER_USER_AGENT, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5' },
      signal: AbortSignal.timeout(PAGE_FETCH_TIMEOUT_MS),
    })
  } catch {
    return emptyPage(url, entry, { fetchClass: 'error', responseTimeMs: Date.now() - started })
  }
  const responseTimeMs = Date.now() - started
  const status = response.status
  const contentType = response.headers.get('content-type')
  const xRobotsTag = response.headers.get('x-robots-tag')
  const headerCanonicalUrl = parseHeaderCanonical(response.headers.get('link'), url)

  if (status >= 300 && status < 400) {
    const location = response.headers.get('location')
    const redirectUrl = location ? normalizeUrl(location, url) : null
    await response.body?.cancel().catch(() => {})
    return emptyPage(url, entry, {
      statusCode: status,
      fetchClass: 'ok',
      redirectUrl,
      contentType,
      responseTimeMs,
      xRobotsTag,
      headerCanonicalUrl,
    })
  }

  const fetchClass = classifyFetch(status, response.headers)
  const isHtml = (contentType ?? '').toLowerCase().includes('html')
  if (!isHtml || fetchClass !== 'ok') {
    const body = await readBodyCapped(response, MAX_HTML_BYTES).catch(() => null)
    return emptyPage(url, entry, {
      statusCode: status,
      fetchClass,
      contentType,
      contentLength: body ? Buffer.byteLength(body, 'utf8') : 0,
      responseTimeMs,
      xRobotsTag,
      headerCanonicalUrl,
      isIndexable: !isNoindex(xRobotsTag),
    })
  }

  const html = (await readBodyCapped(response, MAX_HTML_BYTES).catch(() => null)) ?? ''
  const analysis = analyzeHtml(html, url, status, responseTimeMs)
  const canonicalUrl = analysis.canonical ? normalizeUrl(analysis.canonical, url) : null
  const headingCounts = analysis.headingOrder.reduce<Record<number, number>>((acc, level) => {
    acc[level] = (acc[level] ?? 0) + 1
    return acc
  }, {})
  const imagesMissingAlt = analysis.images.filter((image) => image.alt === null || image.alt.trim() === '').length
  const htmlBytes = Buffer.byteLength(html, 'utf8')

  return {
    id: randomUUID(),
    url,
    statusCode: status,
    fetchClass,
    redirectUrl: null,
    contentType,
    contentLength: htmlBytes,
    title: analysis.title,
    metaDescription: analysis.metaDescription,
    canonicalUrl,
    robotsMeta: analysis.robotsMeta,
    xRobotsTag,
    headerCanonicalUrl,
    ogTitle: analysis.ogTitle,
    ogDescription: analysis.ogDescription,
    ogImage: analysis.ogImage,
    h1Count: analysis.h1s.length,
    h2Count: headingCounts[2] ?? 0,
    h3Count: headingCounts[3] ?? 0,
    headingOrder: analysis.headingOrder,
    wordCount: analysis.wordCount,
    contentHash: analysis.bodyText ? sha1(analysis.bodyText) : null,
    isHtml: true,
    htmlBytes,
    imagesTotal: analysis.images.length,
    imagesMissingAlt,
    links: analysis.links,
    internalLinks: analysis.links.filter((link) => link.isInternal).length,
    externalLinks: analysis.links.filter((link) => !link.isInternal).length,
    hasStructuredData: analysis.hasStructuredData,
    hreflangTags: analysis.hreflangTags,
    isIndexable: !isNoindex(analysis.robotsMeta, xRobotsTag),
    responseTimeMs,
    crawlDepth: entry.depth,
    inSitemap: entry.inSitemap,
  }
}

async function discoverWithTimeout(origin: string, maxPages: number): Promise<DiscoveryResult> {
  const fallback: DiscoveryResult = { urls: [], robots: { isAllowed: () => true, sitemapUrls: [] }, robotsText: null }
  return Promise.race([
    discoverUrls(origin, maxPages, CRAWLER_USER_AGENT).catch(() => fallback),
    new Promise<DiscoveryResult>((resolve) => setTimeout(() => resolve(fallback), DISCOVERY_TIMEOUT_MS)),
  ])
}

export async function crawlSite(options: CrawlOptions): Promise<CrawlResult> {
  const started = Date.now()
  const timeBudgetMs = options.timeBudgetMs ?? DEFAULT_TIME_BUDGET_MS
  const respectRobots = options.respectRobots ?? true
  const maxPages = Math.max(1, options.maxPages)

  const validated = await normalizeAndValidateStartUrl(options.startUrl)
  const startUrl = normalizeUrl(await resolveStartUrlRedirects(validated, CRAWLER_USER_AGENT)) ?? validated
  const origin = getOrigin(startUrl)

  const discovery = await discoverWithTimeout(origin, maxPages)
  const isAllowed = (url: string) => !respectRobots || discovery.robots.isAllowed(url)

  const queue: QueueEntry[] = [{ url: startUrl, depth: 0, inSitemap: discovery.urls.includes(startUrl) }]
  const seen = new Set<string>([startUrl])
  for (const url of discovery.urls) {
    if (seen.has(url) || !isAllowed(url) || looksLikeAsset(url)) continue
    seen.add(url)
    queue.push({ url, depth: null, inSitemap: true })
  }

  const pages: CrawledPageResult[] = []
  const inflight = new Map<string, Promise<void>>()
  let windowSize = clampCrawlWindow(CRAWL_WINDOW.initial, CRAWL_WINDOW)
  let recentBatch: CrawledPageResult[] = []
  let truncated = false

  const enqueueLinks = (page: CrawledPageResult) => {
    const depth = page.crawlDepth === null ? null : page.crawlDepth + 1
    if (depth !== null && depth > MAX_CRAWL_DEPTH) return
    const candidates = page.redirectUrl ? [page.redirectUrl] : page.links.filter((l) => l.isInternal).map((l) => l.targetUrl)
    for (const target of candidates) {
      if (seen.has(target)) continue
      if (!isSameOrigin(target, origin) || !isCrawlableUrl(target) || looksLikeAsset(target) || !isAllowed(target)) continue
      seen.add(target)
      queue.push({ url: target, depth, inSitemap: false })
    }
  }

  const launch = (entry: QueueEntry) => {
    const task = fetchAndAnalyzePage(entry)
      .then((page) => {
        pages.push(page)
        recentBatch.push(page)
        enqueueLinks(page)
        options.onProgress?.({
          pagesCrawled: pages.length,
          pagesQueued: queue.length,
          currentUrl: entry.url,
          maxPages,
        })
        if (recentBatch.length >= 5) {
          windowSize = adjustCrawlWindow(windowSize, recentBatch, CRAWL_WINDOW)
          recentBatch = []
        }
      })
      .finally(() => inflight.delete(entry.url))
    inflight.set(entry.url, task)
  }

  while (true) {
    const outOfTime = Date.now() - started >= timeBudgetMs
    const budgetReached = pages.length + inflight.size >= maxPages
    if (!outOfTime && !budgetReached) {
      while (queue.length > 0 && inflight.size < windowSize && pages.length + inflight.size < maxPages) {
        launch(queue.shift()!)
      }
    }
    if (inflight.size === 0) {
      truncated = queue.length > 0
      break
    }
    if (outOfTime || budgetReached) {
      await Promise.all(inflight.values())
      truncated = queue.length > 0
      break
    }
    await Promise.race(inflight.values())
  }

  const ordered = pages.slice(0, maxPages)
  const issues: DetectedIssue[] = [...ordered.flatMap(runPageReporters), ...runMultipageChecks(ordered, startUrl)]

  return {
    startUrl,
    origin,
    pages: ordered,
    issues,
    sitemapUrls: discovery.urls.length,
    robotsText: discovery.robotsText,
    truncated,
    durationMs: Date.now() - started,
  }
}
