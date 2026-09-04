/**
 * Fenêtre glissante de concurrence du crawl. Portage d'OpenSEO (MIT).
 *
 * Contrairement aux lots fixes, une page lente n'occupe qu'un créneau au lieu
 * de bloquer tout un lot. La fenêtre s'adapte au site : elle se resserre sur
 * les erreurs, blocages et lenteurs (politesse envers un site en difficulté
 * ou défensif) et s'élargit quand le site répond vite.
 */
import type { CrawledPageResult } from './types'

export interface CrawlWindowLimits {
  initial: number
  min: number
  max: number
  /** HTML total que la fenêtre en vol peut retenir à la fois. */
  budgetBytes: number
}

export const CRAWL_WINDOW: CrawlWindowLimits = {
  initial: 6,
  min: 3,
  max: 12,
  budgetBytes: 8 * 1024 * 1024,
}

const SLOW_RESPONSE_MS = 10_000
const FAST_RESPONSE_MS = 1_500
const MIN_ASSUMED_PAGE_BYTES = 64 * 1024
const GROWTH_MIN_SAMPLE = 10

export function clampCrawlWindow(size: number, limits: CrawlWindowLimits): number {
  return Math.min(Math.max(size, limits.min), limits.max)
}

/**
 * Adapte la fenêtre au dernier lot observé : rétrécit sur les ennuis, ne
 * grandit que sur un lot propre, rapide et de taille suffisante, et reste
 * bornée par le budget d'octets divisé par la taille moyenne des pages.
 */
export function adjustCrawlWindow(
  windowSize: number,
  recent: CrawledPageResult[],
  limits: CrawlWindowLimits = CRAWL_WINDOW,
): number {
  if (recent.length === 0) return windowSize
  const troubled = recent.filter(
    (page) => page.fetchClass !== 'ok' || (page.responseTimeMs ?? 0) >= SLOW_RESPONSE_MS,
  ).length
  let next = windowSize
  if (troubled * 3 >= recent.length) {
    next = Math.max(limits.min, Math.floor(windowSize / 2))
  } else {
    const fast = recent.filter(
      (page) => page.fetchClass === 'ok' && (page.responseTimeMs ?? Infinity) <= FAST_RESPONSE_MS,
    ).length
    if (troubled === 0 && fast * 2 >= recent.length && recent.length >= GROWTH_MIN_SAMPLE) {
      next = Math.min(limits.max, windowSize + 3)
    }
  }
  const avgPageBytes = Math.max(
    recent.reduce((sum, page) => sum + page.htmlBytes, 0) / recent.length,
    MIN_ASSUMED_PAGE_BYTES,
  )
  const byteBound = Math.max(limits.min, Math.floor(limits.budgetBytes / avgPageBytes))
  return Math.min(next, byteBound)
}
