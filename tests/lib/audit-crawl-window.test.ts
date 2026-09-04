import { describe, it, expect } from 'vitest'
import { adjustCrawlWindow, CRAWL_WINDOW } from '@/lib/audit/crawl-window'
import type { CrawledPageResult } from '@/lib/audit/types'

function sample(fetchClass: 'ok' | 'error', responseTimeMs: number, htmlBytes = 50_000): CrawledPageResult {
  return { fetchClass, responseTimeMs, htmlBytes } as CrawledPageResult
}

describe('adjustCrawlWindow', () => {
  it('se resserre quand un tiers des pages sont en erreur ou lentes', () => {
    const recent = [sample('error', 0), sample('ok', 100), sample('ok', 12_000)]
    expect(adjustCrawlWindow(12, recent)).toBe(6)
  })

  it('ne grandit que sur un lot propre, rapide et assez grand', () => {
    const small = Array.from({ length: 5 }, () => sample('ok', 200))
    expect(adjustCrawlWindow(6, small)).toBe(6)
    const large = Array.from({ length: 10 }, () => sample('ok', 200))
    expect(adjustCrawlWindow(6, large)).toBe(9)
  })

  it('reste bornée par le budget d’octets sur des pages lourdes', () => {
    const heavy = Array.from({ length: 10 }, () => sample('ok', 200, 4 * 1024 * 1024))
    expect(adjustCrawlWindow(12, heavy)).toBe(CRAWL_WINDOW.min)
  })
})
