import { describe, it, expect } from 'vitest'
import { analyzeHtml } from '@/lib/audit/page-analyzer'

const html = `<!doctype html><html><head>
<title>Plombier à Lyon | Dupont</title>
<meta name="description" content="Dépannage plomberie à Lyon 7j/7.">
<meta name="robots" content="index, follow">
<meta property="og:title" content="Dupont plomberie">
<link rel="canonical" href="/plombier-lyon/">
<link rel="alternate" hreflang="fr" href="https://dupont.fr/">
<script type="application/ld+json">{"@type":"LocalBusiness"}</script>
<svg><title>logo</title></svg>
</head><body>
<h1>Plombier à Lyon</h1>
<h3>Sauté</h3>
<p>Intervention <a href="/tarifs">tarifs</a> rapide <a href="https://autre.fr/x" rel="nofollow">ailleurs</a>.</p>
<a href="mailto:a@b.c">mail</a><a href="#top">haut</a>
<img src="a.jpg" alt="Camion"><img src="b.jpg"><img src="c.jpg" alt="">
<script>var x = "pas du contenu";</script>
<noscript><h1>Pas compté</h1></noscript>
</body></html>`

describe('analyzeHtml', () => {
  const page = analyzeHtml(html, 'https://dupont.fr/plombier-lyon/', 200, 120)

  it('extrait les métadonnées du head', () => {
    expect(page.title).toBe('Plombier à Lyon | Dupont')
    expect(page.metaDescription).toBe('Dépannage plomberie à Lyon 7j/7.')
    expect(page.robotsMeta).toBe('index, follow')
    expect(page.ogTitle).toBe('Dupont plomberie')
    expect(page.canonical).toBe('/plombier-lyon/')
    expect(page.hreflangTags).toEqual(['fr'])
    expect(page.hasStructuredData).toBe(true)
  })

  it('ignore le title du svg et le h1 dans noscript', () => {
    expect(page.h1s).toEqual(['Plombier à Lyon'])
    expect(page.headingOrder).toEqual([1, 3])
  })

  it('résout, dédoublonne et classe les liens', () => {
    expect(page.links).toHaveLength(2)
    const internal = page.links.find((l) => l.isInternal)!
    expect(internal.targetUrl).toBe('https://dupont.fr/tarifs')
    expect(internal.anchor).toBe('tarifs')
    const external = page.links.find((l) => !l.isInternal)!
    expect(external.isNofollow).toBe(true)
  })

  it('compte les images et les mots hors scripts', () => {
    expect(page.images).toHaveLength(3)
    expect(page.images.filter((i) => i.alt === null)).toHaveLength(1)
    expect(page.bodyText).not.toContain('pas du contenu')
    expect(page.wordCount).toBeGreaterThan(5)
  })

  it('retombe sur tout le texte hors head quand il n’y a pas de body', () => {
    const fragment = analyzeHtml('<h1>Titre</h1> <p>Un deux trois</p>', 'https://x.fr/', 200, 1)
    expect(fragment.wordCount).toBe(4)
  })
})
