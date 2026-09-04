/**
 * Types partagés du crawl multipage. Portage d'OpenSEO (MIT).
 */

/** Issue d'une récupération de page. "blocked" = pare-feu ou défi anti-robot. */
export type PageFetchClass = 'ok' | 'blocked' | 'error'

/** Un lien sortant, dédoublonné par URL cible au sein d'une page. */
export interface PageLink {
  targetUrl: string
  anchor: string | null
  isInternal: boolean
  isNofollow: boolean
}

/** Données extraites du HTML d'une page. */
export interface PageAnalysis {
  url: string
  statusCode: number
  redirectUrl: string | null
  responseTimeMs: number
  title: string
  metaDescription: string
  canonical: string | null
  robotsMeta: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  h1s: string[]
  headingOrder: number[]
  wordCount: number
  bodyText: string
  images: Array<{ src: string | null; alt: string | null }>
  links: PageLink[]
  hasStructuredData: boolean
  hreflangTags: string[]
}

/** Résultat complet du crawl d'une page, tel que persisté. */
export interface CrawledPageResult {
  id: string
  url: string
  statusCode: number
  fetchClass: PageFetchClass
  redirectUrl: string | null
  contentType: string | null
  contentLength: number
  title: string
  metaDescription: string
  canonicalUrl: string | null
  robotsMeta: string | null
  xRobotsTag: string | null
  headerCanonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  h1Count: number
  h2Count: number
  h3Count: number
  headingOrder: number[]
  wordCount: number
  contentHash: string | null
  /** Vrai quand un document HTML a été analysé (un PDF n'a pas de titre à manquer). */
  isHtml: boolean
  /** Taille HTML lue (plafonnée) : nourrit le signal de pression mémoire de la fenêtre. */
  htmlBytes: number
  imagesTotal: number
  imagesMissingAlt: number
  links: PageLink[]
  internalLinks: number
  externalLinks: number
  hasStructuredData: boolean
  hreflangTags: string[]
  isIndexable: boolean
  responseTimeMs: number
  /** null = atteinte hors liens (sitemap). */
  crawlDepth: number | null
  inSitemap: boolean
}

export interface CrawlProgress {
  pagesCrawled: number
  pagesQueued: number
  currentUrl: string | null
  maxPages: number
}
