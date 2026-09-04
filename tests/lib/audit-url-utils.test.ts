import { describe, it, expect } from 'vitest'
import { canonicalUrlKey, detectUrlTemplate, isSameOrigin, looksLikeAsset, normalizeUrl } from '@/lib/audit/url-utils'
import { isBlockedHost, isCrawlableUrl, isPrivateIpv4, isPrivateIpv6 } from '@/lib/audit/url-policy'

describe('normalizeUrl', () => {
  it('résout, retire le fragment, trie les paramètres, garde la barre finale', () => {
    expect(normalizeUrl('/a?z=1&a=2#frag', 'https://Ex.fr/base/')).toBe('https://ex.fr/a?a=2&z=1')
    expect(normalizeUrl('https://ex.fr/services/')).toBe('https://ex.fr/services/')
    expect(normalizeUrl('mailto:a@b.c')).toBeNull()
  })

  it('canonicalUrlKey rapproche www, http et https', () => {
    expect(canonicalUrlKey('http://www.ex.fr/a')).toBe(canonicalUrlKey('https://ex.fr/a'))
  })
})

describe('isSameOrigin', () => {
  it('tolère www et le passage http vers https', () => {
    expect(isSameOrigin('https://www.ex.fr/x', 'https://ex.fr')).toBe(true)
    expect(isSameOrigin('https://ex.fr/x', 'http://ex.fr')).toBe(true)
    expect(isSameOrigin('http://ex.fr/x', 'https://ex.fr')).toBe(false)
    expect(isSameOrigin('https://blog.ex.fr/x', 'https://ex.fr')).toBe(false)
  })
})

describe('detectUrlTemplate / looksLikeAsset', () => {
  it('remplace les segments dynamiques', () => {
    expect(detectUrlTemplate('/blog/mon-super-article')).toBe('/blog/:slug')
    expect(detectUrlTemplate('/produits/12345')).toBe('/produits/:id')
    expect(detectUrlTemplate('/mon-compte')).toBe('/mon-compte')
  })
  it('reconnaît les ressources', () => {
    expect(looksLikeAsset('https://ex.fr/style.css')).toBe(true)
    expect(looksLikeAsset('https://ex.fr/doc.pdf')).toBe(true)
    expect(looksLikeAsset('https://ex.fr/page')).toBe(false)
  })
})

describe('politique SSRF', () => {
  it('bloque les adresses privées et hôtes internes', () => {
    expect(isPrivateIpv4('10.0.0.1')).toBe(true)
    expect(isPrivateIpv4('192.168.1.1')).toBe(true)
    expect(isPrivateIpv4('8.8.8.8')).toBe(false)
    expect(isPrivateIpv6('::1')).toBe(true)
    expect(isPrivateIpv6('::ffff:127.0.0.1')).toBe(true)
    expect(isBlockedHost('localhost')).toBe(true)
    expect(isBlockedHost('intranet.local')).toBe(true)
    expect(isBlockedHost('169.254.169.254')).toBe(true)
    expect(isBlockedHost('kayzen-lyon.com')).toBe(false)
  })
  it('isCrawlableUrl refuse les schémas non http et les cibles bloquées', () => {
    expect(isCrawlableUrl('ftp://ex.fr/')).toBe(false)
    expect(isCrawlableUrl('http://127.0.0.1/')).toBe(false)
    expect(isCrawlableUrl('https://ex.fr/')).toBe(true)
  })
})
