import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface AuditCheck {
  id: string
  category: 'meta' | 'content' | 'technical' | 'performance' | 'security' | 'mobile'
  name: string
  status: 'passed' | 'warning' | 'error'
  score: number
  value: string
  recommendation: string
}

interface AuditResult {
  success: boolean
  data?: {
    url: string
    score: number
    loadTime: number
    htmlSize: number
    checks: AuditCheck[]
    summary: {
      passed: number
      warnings: number
      errors: number
      totalChecks: number
    }
    meta: {
      title: string | null
      description: string | null
      canonical: string | null
      ogTitle: string | null
      ogDescription: string | null
      ogImage: string | null
    }
    content: {
      wordCount: number
      h1Count: number
      h2Count: number
      h3Count: number
      imageCount: number
      imagesWithAlt: number
      internalLinks: number
      externalLinks: number
    }
  }
  error?: string
}

// Cheerio-based HTML parsing helpers
function parseHTML($: cheerio.CheerioAPI) {
  return {
    getMetaTag: (name: string): string | null => {
      // Try property attribute first (Open Graph)
      let value = $(`meta[property="${name}"]`).attr('content')
      if (value) return value

      // Try name attribute
      value = $(`meta[name="${name}"]`).attr('content')
      return value || null
    },

    getTitle: (): string | null => {
      return $('title').text() || null
    },

    getCanonical: (): string | null => {
      return $('link[rel="canonical"]').attr('href') || null
    },

    getH1Count: (): number => {
      return $('h1').length
    },

    getH2Count: (): number => {
      return $('h2').length
    },

    getH3Count: (): number => {
      return $('h3').length
    },

    getHeadingHierarchy: (): { h1: string[]; h2: string[]; h3: string[] } => {
      return {
        h1: $('h1')
          .map((_, el) => $(el).text())
          .get(),
        h2: $('h2')
          .map((_, el) => $(el).text())
          .get(),
        h3: $('h3')
          .map((_, el) => $(el).text())
          .get(),
      }
    },

    getWordCount: (): number => {
      // Remove script and style tags
      const text = $('body')
        .clone()
        .find('script, style')
        .remove()
        .end()
        .text()

      // Count words
      const words = text
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0)
      return words.length
    },

    getImages: (): { total: number; withAlt: number; withoutWidthHeight: number } => {
      const images = $('img')
      let total = images.length
      let withAlt = 0
      let withoutWidthHeight = 0

      images.each((_, el) => {
        const $img = $(el)
        if ($img.attr('alt')) {
          withAlt++
        }
        if (!$img.attr('width') || !$img.attr('height')) {
          withoutWidthHeight++
        }
      })

      return { total, withAlt, withoutWidthHeight }
    },

    getLinks: (baseUrl: string): { internal: number; external: number } => {
      const links = $('a[href]')
      const baseHost = new URL(baseUrl).hostname
      let internal = 0
      let external = 0

      links.each((_, el) => {
        const href = $(el).attr('href')
        if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
          return
        }

        try {
          const linkUrl = new URL(href, baseUrl)
          if (linkUrl.hostname === baseHost) {
            internal++
          } else {
            external++
          }
        } catch {
          // Relative link
          if (!href.startsWith('http')) {
            internal++
          } else {
            external++
          }
        }
      })

      return { internal, external }
    },

    getFaviconPresent: (): boolean => {
      return $('link[rel*="icon"]').length > 0 || $('link[rel="shortcut icon"]').length > 0
    },

    getHreflangTags: (): number => {
      return $('link[rel="alternate"][hreflang]').length
    },

    getStructuredData: (): number => {
      return $('script[type="application/ld+json"]').length
    },

    getExternalScripts: (): number => {
      return $('script[src]').length
    },

    getExternalStylesheets: (): number => {
      return $('link[rel="stylesheet"]').length
    },

    getInlineScripts: (): number => {
      return $('script:not([src])').length
    },

    getInlineStyles: (): number => {
      return $('style').length + $('[style]').length
    },

    getViewportTag: (): string | null => {
      return $('meta[name="viewport"]').attr('content') || null
    },

    getCharset: (): string | null => {
      return $('meta[charset]').attr('charset') || $('meta[http-equiv="Content-Type"]').attr('content') || null
    },

    getDoctype: (html: string): boolean => {
      return /<!DOCTYPE\s+html/i.test(html)
    },

    getTouchIcons: (): number => {
      return $('link[rel*="apple-touch-icon"]').length
    },

    getLazyLoadImages: (): number => {
      return $('img[loading="lazy"]').length
    },
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<AuditResult>> {
  try {
    const body = await request.json()
    const { url, websiteId } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid or missing URL provided',
        },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
    }

    // Validate and normalize URL
    let normalizedUrl = url
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl
    }

    let urlObj: URL
    try {
      urlObj = new URL(normalizedUrl)
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid URL format',
        },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
    }

    // Fetch the URL with 15-second timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    const fetchStartTime = Date.now()

    let response: Response
    try {
      response = await fetch(normalizedUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      })
    } finally {
      clearTimeout(timeoutId)
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status} error loading URL`,
        },
        { status: 400, headers: { 'Access-Control-Allow-Origin': '*' } }
      )
    }

    const html = await response.text()
    const loadTime = Date.now() - fetchStartTime
    const htmlSize = html.length

    // Parse HTML with cheerio
    const $ = cheerio.load(html)
    const parser = parseHTML($)

    // Extract metadata
    const title = parser.getTitle()
    const description = parser.getMetaTag('description')
    const canonical = parser.getCanonical()
    const ogTitle = parser.getMetaTag('og:title')
    const ogDescription = parser.getMetaTag('og:description')
    const ogImage = parser.getMetaTag('og:image')
    const robots = parser.getMetaTag('robots')
    const viewport = parser.getViewportTag()
    const twitterCard = parser.getMetaTag('twitter:card')
    const twitterTitle = parser.getMetaTag('twitter:title')
    const twitterDescription = parser.getMetaTag('twitter:description')
    const charset = parser.getCharset()

    // Count headings
    const h1Count = parser.getH1Count()
    const h2Count = parser.getH2Count()
    const h3Count = parser.getH3Count()

    // Count images and alt text
    const imageData = parser.getImages()

    // Count links
    const linkData = parser.getLinks(normalizedUrl)

    // Count word count
    const wordCount = parser.getWordCount()

    // Count scripts and styles
    const externalScripts = parser.getExternalScripts()
    const inlineScripts = parser.getInlineScripts()
    const externalStylesheets = parser.getExternalStylesheets()
    const inlineStyles = parser.getInlineStyles()

    // Other checks
    const faviconPresent = parser.getFaviconPresent()
    const hreflangCount = parser.getHreflangTags()
    const structuredDataCount = parser.getStructuredData()
    const doctype = parser.getDoctype(html)
    const touchIcons = parser.getTouchIcons()
    const lazyLoadImages = parser.getLazyLoadImages()

    // Extract response headers
    const contentType = response.headers.get('content-type')
    const contentEncoding = response.headers.get('content-encoding')
    const csp = response.headers.get('content-security-policy')
    const xFrameOptions = response.headers.get('x-frame-options')
    const xContentTypeOptions = response.headers.get('x-content-type-options')
    const contentLength = response.headers.get('content-length')

    // Build comprehensive checks array
    const checks: AuditCheck[] = []
    let totalScore = 0
    let checkCount = 0

    // ============================================
    // META & SEO CATEGORY
    // ============================================

    // Title tag check
    const titleStatus = !title ? 'error' : title.length < 30 ? 'warning' : title.length > 60 ? 'warning' : 'passed'
    const titleScore = !title ? 0 : title.length < 30 ? 50 : title.length > 60 ? 70 : 100
    checks.push({
      id: 'meta_title',
      category: 'meta',
      name: 'Title Tag',
      status: titleStatus,
      score: titleScore,
      value: title || 'Missing',
      recommendation: !title
        ? 'Add a unique title tag between 30-60 characters'
        : title.length < 30
          ? 'Title is too short (less than 30 characters)'
          : title.length > 60
            ? 'Title is too long (more than 60 characters)'
            : 'Title tag is well-optimized',
    })
    totalScore += titleScore
    checkCount++

    // Meta description check
    const descStatus = !description ? 'error' : description.length < 120 ? 'warning' : description.length > 160 ? 'warning' : 'passed'
    const descScore = !description ? 0 : description.length < 120 ? 50 : description.length > 160 ? 70 : 100
    checks.push({
      id: 'meta_description',
      category: 'meta',
      name: 'Meta Description',
      status: descStatus,
      score: descScore,
      value: description ? `${description.substring(0, 60)}... (${description.length} chars)` : 'Missing',
      recommendation: !description
        ? 'Add a meta description between 120-160 characters'
        : description.length < 120
          ? 'Description is too short'
          : description.length > 160
            ? 'Description is too long'
            : 'Meta description is well-optimized',
    })
    totalScore += descScore
    checkCount++

    // Canonical tag check
    const canonicalScore = canonical ? 100 : 50
    checks.push({
      id: 'meta_canonical',
      category: 'meta',
      name: 'Canonical Tag',
      status: canonical ? 'passed' : 'warning',
      score: canonicalScore,
      value: canonical || 'Not present',
      recommendation: canonical
        ? 'Canonical tag properly defined'
        : 'Add a canonical tag to prevent duplicate content issues',
    })
    totalScore += canonicalScore
    checkCount++

    // Open Graph tags check
    const ogScore = ogTitle && ogDescription && ogImage ? 100 : ogTitle || ogDescription || ogImage ? 60 : 0
    checks.push({
      id: 'meta_og',
      category: 'meta',
      name: 'Open Graph Tags',
      status: ogScore === 100 ? 'passed' : ogScore > 0 ? 'warning' : 'error',
      score: ogScore,
      value: `og:title ${ogTitle ? '✓' : '✗'}, og:description ${ogDescription ? '✓' : '✗'}, og:image ${ogImage ? '✓' : '✗'}`,
      recommendation:
        ogScore === 100
          ? 'All Open Graph tags configured'
          : 'Add og:title, og:description, and og:image for better social sharing',
    })
    totalScore += ogScore
    checkCount++

    // Twitter Card tags check
    const twitterScore = twitterCard && twitterTitle && twitterDescription ? 100 : twitterCard ? 50 : 0
    checks.push({
      id: 'meta_twitter',
      category: 'meta',
      name: 'Twitter Card Tags',
      status: twitterScore === 100 ? 'passed' : twitterScore > 0 ? 'warning' : 'error',
      score: twitterScore,
      value: `twitter:card ${twitterCard ? '✓' : '✗'}, twitter:title ${twitterTitle ? '✓' : '✗'}, twitter:description ${twitterDescription ? '✓' : '✗'}`,
      recommendation:
        twitterScore === 100
          ? 'Twitter Card tags configured'
          : 'Add Twitter Card meta tags for better Twitter sharing',
    })
    totalScore += twitterScore
    checkCount++

    // Robots meta tag check
    const robotsScore = robots ? 100 : 50
    checks.push({
      id: 'meta_robots',
      category: 'meta',
      name: 'Robots Meta Tag',
      status: robots ? 'passed' : 'warning',
      score: robotsScore,
      value: robots || 'Default (index, follow)',
      recommendation: robots
        ? 'Robots meta tag configured'
        : 'Consider configuring robots meta tag if you have specific indexing needs',
    })
    totalScore += robotsScore
    checkCount++

    // Favicon check
    const faviconScore = faviconPresent ? 100 : 50
    checks.push({
      id: 'meta_favicon',
      category: 'meta',
      name: 'Favicon',
      status: faviconScore === 100 ? 'passed' : 'warning',
      score: faviconScore,
      value: faviconPresent ? 'Present' : 'Not found',
      recommendation:
        faviconScore === 100 ? 'Favicon properly configured' : 'Add a favicon to improve branding and user experience',
    })
    totalScore += faviconScore
    checkCount++

    // Hreflang tags check
    const hreflangScore = hreflangCount > 0 ? 100 : 50
    checks.push({
      id: 'meta_hreflang',
      category: 'meta',
      name: 'Hreflang Tags',
      status: hreflangCount > 0 ? 'passed' : 'warning',
      score: hreflangScore,
      value: `${hreflangCount} hreflang tag(s)`,
      recommendation:
        hreflangCount > 0
          ? 'Hreflang tags configured for international SEO'
          : 'Add hreflang tags if your site targets multiple languages or regions',
    })
    totalScore += hreflangScore
    checkCount++

    // ============================================
    // CONTENT CATEGORY
    // ============================================

    // H1 check
    const h1Status = h1Count === 1 ? 'passed' : h1Count === 0 ? 'error' : 'warning'
    const h1Score = h1Count === 1 ? 100 : h1Count === 0 ? 0 : 50
    checks.push({
      id: 'content_h1',
      category: 'content',
      name: 'H1 Tag',
      status: h1Status,
      score: h1Score,
      value: `${h1Count} H1 tag(s) found`,
      recommendation:
        h1Count === 1
          ? 'Exactly one H1 tag - perfect'
          : h1Count === 0
            ? 'Add a unique H1 tag to structure your content'
            : 'Limit to a single H1 tag per page',
    })
    totalScore += h1Score
    checkCount++

    // Heading hierarchy check
    const h2h3Score = h2Count > 0 || h3Count > 0 ? 100 : 50
    checks.push({
      id: 'content_headings',
      category: 'content',
      name: 'Heading Hierarchy',
      status: h2h3Score === 100 ? 'passed' : 'warning',
      score: h2h3Score,
      value: `H2: ${h2Count}, H3: ${h3Count}`,
      recommendation:
        h2h3Score === 100
          ? 'Good heading hierarchy structure'
          : 'Use H2 and H3 tags to properly structure content',
    })
    totalScore += h2h3Score
    checkCount++

    // Word count check
    const wordCountScore = wordCount >= 300 ? 100 : wordCount >= 200 ? 80 : wordCount >= 100 ? 60 : 30
    checks.push({
      id: 'content_wordcount',
      category: 'content',
      name: 'Text Content',
      status: wordCount >= 300 ? 'passed' : wordCount >= 200 ? 'passed' : wordCount >= 100 ? 'warning' : 'error',
      score: wordCountScore,
      value: `${wordCount} words`,
      recommendation:
        wordCount >= 300
          ? 'Sufficient content length for SEO'
          : wordCount >= 200
            ? 'Consider adding more content'
            : 'Add more text content to improve SEO',
    })
    totalScore += wordCountScore
    checkCount++

    // Image optimization check
    const imageAltScore =
      imageData.total === 0 ? 50 : imageData.withAlt === imageData.total ? 100 : (imageData.withAlt / imageData.total) * 100
    checks.push({
      id: 'content_images_alt',
      category: 'content',
      name: 'Image Alt Text',
      status: imageAltScore === 100 ? 'passed' : imageAltScore >= 70 ? 'warning' : 'error',
      score: Math.round(imageAltScore),
      value: `${imageData.withAlt}/${imageData.total} images have alt text`,
      recommendation:
        imageAltScore === 100
          ? 'All images have descriptive alt text'
          : imageData.total === 0
            ? 'Consider adding images to enrich content'
            : `Add alt text to ${imageData.total - imageData.withAlt} images`,
    })
    totalScore += imageAltScore
    checkCount++

    // Image width/height attributes check
    const imageWidthHeightScore =
      imageData.total === 0 ? 50 : ((imageData.total - imageData.withoutWidthHeight) / imageData.total) * 100
    checks.push({
      id: 'content_images_dimensions',
      category: 'content',
      name: 'Image Dimensions',
      status: imageWidthHeightScore === 100 ? 'passed' : imageWidthHeightScore >= 70 ? 'warning' : 'error',
      score: Math.round(imageWidthHeightScore),
      value: `${imageData.total - imageData.withoutWidthHeight}/${imageData.total} images have width/height`,
      recommendation:
        imageWidthHeightScore === 100
          ? 'All images have width/height attributes'
          : 'Add width and height attributes to prevent layout shift',
    })
    totalScore += imageWidthHeightScore
    checkCount++

    // Lazy loading check
    const lazyLoadScore = lazyLoadImages > 0 ? 100 : 50
    checks.push({
      id: 'content_lazy_loading',
      category: 'content',
      name: 'Lazy Loading',
      status: lazyLoadScore === 100 ? 'passed' : 'warning',
      score: lazyLoadScore,
      value: `${lazyLoadImages} image(s) with lazy loading`,
      recommendation:
        lazyLoadScore === 100
          ? 'Lazy loading implemented for images'
          : 'Implement lazy loading for images to improve performance',
    })
    totalScore += lazyLoadScore
    checkCount++

    // Internal links check
    const internalLinksScore = linkData.internal >= 3 ? 100 : linkData.internal >= 1 ? 70 : 30
    checks.push({
      id: 'content_internal_links',
      category: 'content',
      name: 'Internal Links',
      status: internalLinksScore === 100 ? 'passed' : internalLinksScore >= 70 ? 'passed' : 'warning',
      score: internalLinksScore,
      value: `${linkData.internal} internal link(s), ${linkData.external} external link(s)`,
      recommendation:
        internalLinksScore === 100
          ? 'Good internal linking strategy'
          : 'Add more internal links to improve site structure',
    })
    totalScore += internalLinksScore
    checkCount++

    // ============================================
    // TECHNICAL CATEGORY
    // ============================================

    // HTTPS/SSL check
    const httpsScore = urlObj.protocol === 'https:' ? 100 : 0
    checks.push({
      id: 'tech_https',
      category: 'technical',
      name: 'HTTPS/SSL',
      status: httpsScore === 100 ? 'passed' : 'error',
      score: httpsScore,
      value: urlObj.protocol === 'https:' ? 'HTTPS' : 'HTTP',
      recommendation: httpsScore === 100 ? 'Site uses HTTPS' : 'Migrate to HTTPS for security and SEO benefits',
    })
    totalScore += httpsScore
    checkCount++

    // Response time check
    const responseTimeScore = loadTime < 2000 ? 100 : loadTime < 4000 ? 70 : loadTime < 6000 ? 50 : 20
    checks.push({
      id: 'tech_response_time',
      category: 'technical',
      name: 'Response Time',
      status: responseTimeScore === 100 ? 'passed' : responseTimeScore >= 70 ? 'passed' : responseTimeScore >= 50 ? 'warning' : 'error',
      score: responseTimeScore,
      value: `${loadTime}ms`,
      recommendation:
        responseTimeScore === 100
          ? 'Excellent server response time'
          : 'Optimize server and caching for faster response',
    })
    totalScore += responseTimeScore
    checkCount++

    // HTML size check
    const htmlSizeKB = htmlSize / 1024
    const htmlSizeScore = htmlSizeKB < 100 ? 100 : htmlSizeKB < 300 ? 70 : 40
    checks.push({
      id: 'tech_html_size',
      category: 'technical',
      name: 'HTML Size',
      status: htmlSizeScore === 100 ? 'passed' : htmlSizeScore >= 70 ? 'passed' : 'warning',
      score: htmlSizeScore,
      value: `${htmlSizeKB.toFixed(2)} KB`,
      recommendation:
        htmlSizeScore === 100 ? 'Optimal HTML size' : 'Reduce HTML size by minifying code',
    })
    totalScore += htmlSizeScore
    checkCount++

    // Content encoding check
    const compressionScore = contentEncoding && (contentEncoding.includes('gzip') || contentEncoding.includes('deflate')) ? 100 : 50
    checks.push({
      id: 'tech_compression',
      category: 'technical',
      name: 'Compression',
      status: compressionScore === 100 ? 'passed' : 'warning',
      score: compressionScore,
      value: contentEncoding || 'No compression detected',
      recommendation:
        compressionScore === 100
          ? 'Content properly compressed'
          : 'Enable gzip or deflate compression for better performance',
    })
    totalScore += compressionScore
    checkCount++

    // Charset check
    const charsetScore = charset ? 100 : 50
    checks.push({
      id: 'tech_charset',
      category: 'technical',
      name: 'Character Set',
      status: charsetScore === 100 ? 'passed' : 'warning',
      score: charsetScore,
      value: charset || 'Not declared',
      recommendation:
        charsetScore === 100 ? 'Character set properly declared' : 'Declare character set (UTF-8 recommended)',
    })
    totalScore += charsetScore
    checkCount++

    // DOCTYPE check
    const doctypeScore = doctype ? 100 : 50
    checks.push({
      id: 'tech_doctype',
      category: 'technical',
      name: 'DOCTYPE',
      status: doctypeScore === 100 ? 'passed' : 'warning',
      score: doctypeScore,
      value: doctype ? 'Present' : 'Missing',
      recommendation:
        doctypeScore === 100 ? 'DOCTYPE properly declared' : 'Add DOCTYPE declaration for HTML5',
    })
    totalScore += doctypeScore
    checkCount++

    // Content-Type header check
    const contentTypeScore = contentType && contentType.includes('text/html') ? 100 : 50
    checks.push({
      id: 'tech_content_type',
      category: 'technical',
      name: 'Content-Type Header',
      status: contentTypeScore === 100 ? 'passed' : 'warning',
      score: contentTypeScore,
      value: contentType || 'Not specified',
      recommendation:
        contentTypeScore === 100
          ? 'Content-Type header correctly set'
          : 'Ensure Content-Type is properly defined',
    })
    totalScore += contentTypeScore
    checkCount++

    // Structured data check
    const structuredDataScore = structuredDataCount > 0 ? 100 : 50
    checks.push({
      id: 'tech_structured_data',
      category: 'technical',
      name: 'Structured Data',
      status: structuredDataScore === 100 ? 'passed' : 'warning',
      score: structuredDataScore,
      value: `${structuredDataCount} JSON-LD block(s)`,
      recommendation:
        structuredDataScore === 100
          ? 'Structured data implemented'
          : 'Add JSON-LD structured data (schema.org) for better search visibility',
    })
    totalScore += structuredDataScore
    checkCount++

    // ============================================
    // PERFORMANCE CATEGORY
    // ============================================

    // External scripts check
    const externalScriptsScore = externalScripts <= 5 ? 100 : externalScripts <= 10 ? 70 : 40
    checks.push({
      id: 'perf_external_scripts',
      category: 'performance',
      name: 'External Scripts',
      status: externalScriptsScore === 100 ? 'passed' : externalScriptsScore >= 70 ? 'passed' : 'warning',
      score: externalScriptsScore,
      value: `${externalScripts} external script(s)`,
      recommendation:
        externalScriptsScore === 100
          ? 'Good number of external scripts'
          : 'Reduce the number of external scripts for better performance',
    })
    totalScore += externalScriptsScore
    checkCount++

    // Inline scripts check
    const inlineScriptsScore = inlineScripts === 0 ? 100 : inlineScripts <= 3 ? 70 : 40
    checks.push({
      id: 'perf_inline_scripts',
      category: 'performance',
      name: 'Inline Scripts',
      status: inlineScriptsScore === 100 ? 'passed' : inlineScriptsScore >= 70 ? 'passed' : 'warning',
      score: inlineScriptsScore,
      value: `${inlineScripts} inline script(s)`,
      recommendation:
        inlineScriptsScore === 100
          ? 'No inline scripts detected'
          : 'Externalize scripts to improve cache performance',
    })
    totalScore += inlineScriptsScore
    checkCount++

    // External stylesheets check
    const externalStylesheetsScore = externalStylesheets <= 5 ? 100 : externalStylesheets <= 10 ? 70 : 40
    checks.push({
      id: 'perf_external_stylesheets',
      category: 'performance',
      name: 'External Stylesheets',
      status: externalStylesheetsScore === 100 ? 'passed' : externalStylesheetsScore >= 70 ? 'passed' : 'warning',
      score: externalStylesheetsScore,
      value: `${externalStylesheets} external stylesheet(s)`,
      recommendation:
        externalStylesheetsScore === 100
          ? 'Good number of stylesheets'
          : 'Consolidate stylesheets for better performance',
    })
    totalScore += externalStylesheetsScore
    checkCount++

    // Inline styles check
    const inlineStylesScore = inlineStyles === 0 ? 100 : inlineStyles <= 5 ? 70 : 40
    checks.push({
      id: 'perf_inline_styles',
      category: 'performance',
      name: 'Inline Styles',
      status: inlineStylesScore === 100 ? 'passed' : inlineStylesScore >= 70 ? 'passed' : 'warning',
      score: inlineStylesScore,
      value: `${inlineStyles} inline style(s)`,
      recommendation:
        inlineStylesScore === 100
          ? 'No inline styles detected'
          : 'Externalize styles to improve cache and maintainability',
    })
    totalScore += inlineStylesScore
    checkCount++

    // ============================================
    // SECURITY CATEGORY
    // ============================================

    // CSP header check
    const cspScore = csp ? 100 : 50
    checks.push({
      id: 'security_csp',
      category: 'security',
      name: 'Content Security Policy',
      status: cspScore === 100 ? 'passed' : 'warning',
      score: cspScore,
      value: csp ? 'Present' : 'Not set',
      recommendation:
        cspScore === 100
          ? 'CSP header configured'
          : 'Implement Content Security Policy to protect against XSS attacks',
    })
    totalScore += cspScore
    checkCount++

    // X-Frame-Options check
    const xFrameScore = xFrameOptions ? 100 : 50
    checks.push({
      id: 'security_x_frame_options',
      category: 'security',
      name: 'X-Frame-Options',
      status: xFrameScore === 100 ? 'passed' : 'warning',
      score: xFrameScore,
      value: xFrameOptions || 'Not set',
      recommendation:
        xFrameScore === 100
          ? 'X-Frame-Options header configured'
          : 'Set X-Frame-Options to prevent clickjacking attacks',
    })
    totalScore += xFrameScore
    checkCount++

    // X-Content-Type-Options check
    const xContentTypeScore = xContentTypeOptions ? 100 : 50
    checks.push({
      id: 'security_x_content_type',
      category: 'security',
      name: 'X-Content-Type-Options',
      status: xContentTypeScore === 100 ? 'passed' : 'warning',
      score: xContentTypeScore,
      value: xContentTypeOptions || 'Not set',
      recommendation:
        xContentTypeScore === 100
          ? 'X-Content-Type-Options header configured'
          : 'Set X-Content-Type-Options: nosniff to prevent MIME-type attacks',
    })
    totalScore += xContentTypeScore
    checkCount++

    // ============================================
    // MOBILE CATEGORY
    // ============================================

    // Viewport meta tag check
    const viewportScore = viewport ? 100 : 0
    checks.push({
      id: 'mobile_viewport',
      category: 'mobile',
      name: 'Viewport Meta Tag',
      status: viewportScore === 100 ? 'passed' : 'error',
      score: viewportScore,
      value: viewport || 'Missing',
      recommendation:
        viewportScore === 100
          ? 'Viewport meta tag properly configured'
          : 'Add viewport meta tag for mobile responsiveness',
    })
    totalScore += viewportScore
    checkCount++

    // Touch icons check
    const touchIconScore = touchIcons > 0 ? 100 : 50
    checks.push({
      id: 'mobile_touch_icons',
      category: 'mobile',
      name: 'Touch Icons',
      status: touchIconScore === 100 ? 'passed' : 'warning',
      score: touchIconScore,
      value: `${touchIcons} touch icon(s)`,
      recommendation:
        touchIconScore === 100
          ? 'Touch icons configured for mobile devices'
          : 'Add apple-touch-icon for home screen bookmarks',
    })
    totalScore += touchIconScore
    checkCount++

    // Calculate overall weighted score
    const overallScore = Math.round(totalScore / checkCount)

    // Count summary by status
    const summary = {
      passed: checks.filter((c) => c.status === 'passed').length,
      warnings: checks.filter((c) => c.status === 'warning').length,
      errors: checks.filter((c) => c.status === 'error').length,
      totalChecks: checks.length,
    }

    const result: AuditResult = {
      success: true,
      data: {
        url: normalizedUrl,
        score: overallScore,
        loadTime,
        htmlSize,
        checks,
        summary,
        meta: {
          title: title || null,
          description: description || null,
          canonical: canonical || null,
          ogTitle: ogTitle || null,
          ogDescription: ogDescription || null,
          ogImage: ogImage || null,
        },
        content: {
          wordCount,
          h1Count,
          h2Count,
          h3Count,
          imageCount: imageData.total,
          imagesWithAlt: imageData.withAlt,
          internalLinks: linkData.internal,
          externalLinks: linkData.external,
        },
      },
    }

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage.includes('AbortError')
          ? 'Request timeout exceeded 15 seconds. Ensure the URL is correct and the server is responsive.'
          : `Audit analysis error: ${errorMessage}`,
      },
      { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } }
    )
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(): Promise<NextResponse> {
  return NextResponse.json(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
