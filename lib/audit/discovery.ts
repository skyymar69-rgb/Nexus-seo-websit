/**
 * Découverte robots.txt et sitemap.xml. Portage d'OpenSEO (MIT).
 */
import robotsParser from 'robots-parser'
import { XMLParser } from 'fast-xml-parser'
import { isSameOrigin, normalizeUrl, readBodyCapped } from './url-utils'

const ROBOTS_FETCH_TIMEOUT_MS = 10_000
const SITEMAP_FETCH_TIMEOUT_MS = 15_000
// RFC 9309 exige au moins 500 Kio et autorise à ignorer au-delà.
const MAX_ROBOTS_TXT_BYTES = 500 * 1024
const MAX_SITEMAP_DEPTH = 3
const MAX_SITEMAP_DOCS = 50
const SITEMAP_CONCURRENCY = 4
const SITEMAP_RETRIES = 1
const MAX_SITEMAP_BYTES = 10 * 1024 * 1024

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  isArray: (name) => name === 'sitemap' || name === 'url',
})

export interface RobotsResult {
  isAllowed: (url: string) => boolean
  sitemapUrls: string[]
}

export async function fetchRobotsTxtText(origin: string, userAgent: string): Promise<string | null> {
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': userAgent },
      signal: AbortSignal.timeout(ROBOTS_FETCH_TIMEOUT_MS),
    })
    if (!response.ok) return null
    return (await response.text()).slice(0, MAX_ROBOTS_TXT_BYTES)
  } catch {
    return null
  }
}

/** Déterministe : même texte, même résultat. null = tout autorisé. */
export function parseRobotsTxt(origin: string, text: string | null, userAgent: string): RobotsResult {
  if (text === null) return { isAllowed: () => true, sitemapUrls: [] }
  const robots = robotsParser(`${origin}/robots.txt`, text)
  return {
    isAllowed: (url: string) => robots.isAllowed(url, userAgent) ?? true,
    sitemapUrls: robots.getSitemaps(),
  }
}

function isProbablySitemapXml(contentType: string | null, body: string): boolean {
  if (contentType?.toLowerCase().includes('xml')) return true
  const trimmed = body.trimStart().toLowerCase()
  return trimmed.startsWith('<?xml') || trimmed.startsWith('<urlset') || trimmed.startsWith('<sitemapindex')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object'
}

function getSitemapLocations(input: unknown): string[] {
  if (!input) return []
  const entries = Array.isArray(input) ? input : [input]
  return entries
    .map((entry) => (isRecord(entry) && typeof entry['loc'] === 'string' ? (entry['loc'] as string) : null))
    .filter((loc): loc is string => typeof loc === 'string')
}

function getParsedSitemapSections(parsed: unknown): { sitemap: unknown; url: unknown } {
  if (!isRecord(parsed)) return { sitemap: undefined, url: undefined }
  const root = parsed as { sitemapindex?: { sitemap?: unknown }; urlset?: { url?: unknown } }
  return { sitemap: root.sitemapindex?.sitemap, url: root.urlset?.url }
}

function isTimeoutError(error: unknown): boolean {
  return !!error && typeof error === 'object' && 'name' in error && error.name === 'TimeoutError'
}

async function fetchSitemapDocument(
  sitemapUrl: string,
  userAgent: string,
): Promise<{ nestedSitemaps: string[]; pageUrls: string[]; timedOut: boolean }> {
  const empty = { nestedSitemaps: [], pageUrls: [], timedOut: false }
  const normalizedSitemapUrl = normalizeUrl(sitemapUrl)
  if (!normalizedSitemapUrl) return empty

  let lastError: unknown = null
  for (let attempt = 0; attempt <= SITEMAP_RETRIES; attempt++) {
    try {
      const response = await fetch(normalizedSitemapUrl, {
        headers: { 'User-Agent': userAgent },
        signal: AbortSignal.timeout(SITEMAP_FETCH_TIMEOUT_MS),
      })
      const finalUrl = normalizeUrl(response.url || normalizedSitemapUrl, normalizedSitemapUrl)
      if (!finalUrl || !isSameOrigin(finalUrl, normalizedSitemapUrl)) return empty
      if (!response.ok) return empty
      const body = await readBodyCapped(response, MAX_SITEMAP_BYTES)
      if (body === null || !isProbablySitemapXml(response.headers.get('content-type'), body)) return empty
      const sections = getParsedSitemapSections(xmlParser.parse(body) as unknown)
      const nestedSitemaps = getSitemapLocations(sections.sitemap)
        .map((loc) => normalizeUrl(loc, finalUrl))
        .filter((loc): loc is string => loc !== null)
      const pageUrls = getSitemapLocations(sections.url)
        .map((loc) => normalizeUrl(loc, finalUrl))
        .filter((loc): loc is string => loc !== null)
      return { nestedSitemaps, pageUrls, timedOut: false }
    } catch (error) {
      lastError = error
      if (!isTimeoutError(error) || attempt === SITEMAP_RETRIES) break
    }
  }
  return { nestedSitemaps: [], pageUrls: [], timedOut: isTimeoutError(lastError) }
}

export interface DiscoveryResult {
  urls: string[]
  robots: RobotsResult
  robotsText: string | null
}

/**
 * Découvre les URL du site via robots.txt et les sitemaps (index récursifs),
 * en essayant aussi /sitemap.xml par défaut. Plafonné au budget de pages.
 */
export async function discoverUrls(origin: string, maxPages: number, userAgent: string): Promise<DiscoveryResult> {
  const robotsText = await fetchRobotsTxtText(origin, userAgent)
  const robots = parseRobotsTxt(origin, robotsText, userAgent)

  const sitemapSources = new Set(robots.sitemapUrls)
  sitemapSources.add(`${origin}/sitemap.xml`)

  const maxDiscoveredUrls = Math.min(Math.max(maxPages * 10, 200), 5_000)
  const allUrls = new Set<string>()
  const queue: Array<{ url: string; depth: number }> = Array.from(sitemapSources)
    .map((url) => normalizeUrl(url, origin))
    .filter((url): url is string => url !== null)
    .filter((url) => isSameOrigin(url, origin))
    .map((url) => ({ url, depth: MAX_SITEMAP_DEPTH }))
  const seenDocs = new Set<string>()
  let fetchedDocs = 0

  while (queue.length > 0 && allUrls.size < maxDiscoveredUrls && fetchedDocs < MAX_SITEMAP_DOCS) {
    const batch = queue.splice(0, SITEMAP_CONCURRENCY)
    await Promise.all(
      batch.map(async ({ url, depth }) => {
        const normalizedUrl = normalizeUrl(url)
        if (!normalizedUrl || !isSameOrigin(normalizedUrl, origin) || depth <= 0 || seenDocs.has(normalizedUrl)) return
        seenDocs.add(normalizedUrl)
        fetchedDocs += 1
        const result = await fetchSitemapDocument(normalizedUrl, userAgent)
        for (const pageUrl of result.pageUrls) {
          if (!isSameOrigin(pageUrl, origin)) continue
          if (allUrls.size >= maxDiscoveredUrls) break
          allUrls.add(pageUrl)
        }
        if (depth <= 1) return
        for (const nested of result.nestedSitemaps) {
          if (isSameOrigin(nested, origin) && !seenDocs.has(nested)) queue.push({ url: nested, depth: depth - 1 })
        }
      }),
    )
  }

  return { urls: Array.from(allUrls).slice(0, maxPages), robots, robotsText }
}
