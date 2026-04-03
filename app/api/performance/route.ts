import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { prisma } from '@/lib/prisma';
import { corsHeaders, corsOptionsResponse } from '@/lib/cors';

interface PerformanceMetrics {
  url: string;
  score: number;
  grade: string;
  coreWebVitals: {
    lcp: { value: number; unit: string; rating: 'good' | 'needs-improvement' | 'poor' };
    inp: { value: number; unit: string; rating: 'good' | 'needs-improvement' | 'poor' };
    cls: { value: number; unit: string; rating: 'good' | 'needs-improvement' | 'poor' };
  };
  metrics: {
    ttfb: number;
    fcp: number;
    lcp: number;
    tti: number;
    speedIndex: number;
    tbt: number;
  };
  resources: {
    scripts: number;
    stylesheets: number;
    images: number;
    fonts: number;
    totalSize: number;
    breakdown: Array<{ type: string; size: number; percentage: number }>;
  };
  opportunities: Array<{ title: string; description: string; savings: string }>;
  technical: {
    https: boolean;
    ttfb: number;
    responseTime: number;
    contentLength: number;
    contentType: string;
  };
}

interface HTMLAnalysis {
  scripts: number;
  stylesheets: number;
  images: {
    count: number;
    lazyLoaded: number;
    withDimensions: number;
    withoutDimensions: number;
    withoutAlt: number;
    estimatedSize: number;
  };
  inlineCss: number;
  inlineJs: number;
  hasViewportMeta: boolean;
  renderBlockingResources: number;
  minificationScore: number;
  jsonLd: boolean;
  fontPreconnects: number;
  fontPreloads: number;
  externalResources: {
    scripts: Array<{ src: string; async: boolean; defer: boolean }>;
    stylesheets: string[];
  };
}

// CORS headers initialized from lib/cors

export async function OPTIONS() {
  return corsOptionsResponse();
}

function parseUrl(urlString: string): URL {
  try {
    return new URL(urlString);
  } catch {
    // Add protocol if missing
    const withProtocol = urlString.startsWith('http') ? urlString : `https://${urlString}`;
    return new URL(withProtocol);
  }
}

async function fetchAndAnalyzeUrl(
  urlString: string
): Promise<{
  html: string;
  ttfb: number;
  responseTime: number;
  contentLength: number;
  contentType: string;
  https: boolean;
}> {
  const url = parseUrl(urlString);
  const startTime = performance.now();
  let ttfb = 0;

  try {
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
      redirect: 'follow',
    });

    // TTFB is time from request start to first byte (status + headers)
    ttfb = performance.now() - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    const responseTime = performance.now() - startTime;
    const contentLength = new TextEncoder().encode(html).length;
    const contentType = response.headers.get('content-type') || 'text/html';

    return {
      html,
      ttfb,
      responseTime,
      contentLength,
      contentType,
      https: url.protocol === 'https:',
    };
  } catch (error) {
    throw new Error(`Failed to fetch ${urlString}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function analyzeHtml(html: string, baseUrl: string): HTMLAnalysis {
  const $ = cheerio.load(html);

  // ===== SCRIPTS ANALYSIS =====
  const scriptElements = $('script[src]');
  const scripts = scriptElements.length;

  const externalScripts = scriptElements
    .map((_, el) => ({
      src: $(el).attr('src') || '',
      async: $(el).attr('async') !== undefined,
      defer: $(el).attr('defer') !== undefined,
    }))
    .get()
    .filter((s) => s.src);

  // ===== STYLESHEETS ANALYSIS =====
  const stylesheetElements = $('link[rel="stylesheet"]');
  const stylesheets = stylesheetElements.length;

  const externalStylesheets = stylesheetElements
    .map((_, el) => $(el).attr('href') || '')
    .get()
    .filter((href) => href);

  // ===== IMAGES ANALYSIS =====
  const imgElements = $('img');
  const imageData = imgElements.map((_, el) => {
    const $img = $(el);
    return {
      src: $img.attr('src') || '',
      alt: $img.attr('alt') || '',
      width: $img.attr('width'),
      height: $img.attr('height'),
      loading: $img.attr('loading'),
    };
  }).get();

  const images = {
    count: imgElements.length,
    lazyLoaded: imageData.filter((img) => img.loading === 'lazy').length,
    withDimensions: imageData.filter((img) => img.width && img.height).length,
    withoutDimensions: imageData.filter((img) => !img.width || !img.height).length,
    withoutAlt: imageData.filter((img) => !img.alt).length,
    estimatedSize: imgElements.length * 65000, // 65KB average per image
  };

  // ===== INLINE CSS ANALYSIS =====
  const styleTags = $('style');
  const inlineCss = styleTags
    .map((_, el) => $(el).html() || '')
    .get()
    .join('')
    .length;

  // ===== INLINE JS ANALYSIS =====
  const inlineScriptTags = $('script:not([src])');
  const inlineJs = inlineScriptTags
    .map((_, el) => $(el).html() || '')
    .get()
    .join('')
    .length;

  // ===== META TAGS =====
  const hasViewportMeta = $('meta[name="viewport"]').length > 0;

  // ===== RENDER-BLOCKING RESOURCES =====
  const head = $('head');
  const renderBlockingStyles = head.find('link[rel="stylesheet"]').length;
  const renderBlockingScripts = head.find('script[src]:not([async]):not([defer])').length;
  const renderBlockingResources = renderBlockingStyles + renderBlockingScripts;

  // ===== MINIFICATION SCORE =====
  const whitespaceCount = (html.match(/\s+/g) || []).length;
  const totalChars = html.length;
  const whitespaceRatio = whitespaceCount / totalChars;
  const minificationScore = Math.max(0, Math.min(100, 100 - whitespaceRatio * 200));

  // ===== FONTS =====
  const fontPreconnects = $('link[rel="preconnect"][href*="font"]').length;
  const fontPreloads = $('link[rel="preload"][href*="font"]').length;
  const googleFonts = $('link[href*="fonts.googleapis"]').length;
  const fontFaceRules = (html.match(/@font-face/gi) || []).length;
  const totalFonts = fontPreconnects + fontPreloads + googleFonts + fontFaceRules;

  // ===== JSON-LD =====
  const hasJsonLd = $('script[type="application/ld+json"]').length > 0;

  return {
    scripts,
    stylesheets,
    images,
    inlineCss,
    inlineJs,
    hasViewportMeta,
    renderBlockingResources,
    minificationScore,
    jsonLd: hasJsonLd,
    fontPreconnects,
    fontPreloads,
    externalResources: {
      scripts: externalScripts,
      stylesheets: externalStylesheets,
    },
  };
}

function calculateMetrics(
  ttfb: number,
  responseTime: number,
  contentLength: number,
  analysis: HTMLAnalysis
): {
  metrics: PerformanceMetrics['metrics'];
  score: number;
  coreWebVitals: PerformanceMetrics['coreWebVitals'];
} {
  // TTFB is already measured from actual network request
  const ttfbValue = Math.round(ttfb);

  // FCP estimate: TTFB + render-blocking resources overhead
  const blockingOverhead = analysis.renderBlockingResources * 150;
  const fcp = Math.round(ttfbValue + blockingOverhead);

  // LCP estimate: FCP + largest content (images) loading time
  const largestImageFetch = analysis.images.count > 0 ? Math.max(500, (contentLength / 1000000) * 1000) : 0;
  const lcp = Math.round(fcp + largestImageFetch);

  // TTI estimate: LCP + JavaScript execution + main thread blocking time
  const jsExecutionTime = (analysis.inlineJs / 2000) * 100 + analysis.scripts * 150;
  const tti = Math.round(lcp + jsExecutionTime);

  // Speed Index: weighted average of visual completeness milestones
  const speedIndex = Math.round((ttfbValue + fcp * 2 + lcp * 3 + tti) / 7);

  // TBT (Total Blocking Time): estimate based on JS payload
  const inlineJsThrottled = Math.max(0, (analysis.inlineJs - 50000) / 200); // Only heavy inline JS blocks
  const externalScriptBlockTime = analysis.scripts * 20; // Each external script ~20ms
  const tbt = Math.round(inlineJsThrottled + externalScriptBlockTime);

  const metrics = {
    ttfb: ttfbValue,
    fcp,
    lcp,
    tti,
    speedIndex,
    tbt: Math.max(0, tbt),
  };

  // Calculate Core Web Vitals ratings
  const lcpRating = (lcp < 2500 ? 'good' : lcp < 4000 ? 'needs-improvement' : 'poor') as 'good' | 'needs-improvement' | 'poor';
  const inpRating = (metrics.tbt < 200 ? 'good' : metrics.tbt < 500 ? 'needs-improvement' : 'poor') as 'good' | 'needs-improvement' | 'poor';

  // CLS: estimate from images without dimensions and render-blocking resources
  const clsValue = (analysis.images.withoutDimensions * 0.05 + analysis.renderBlockingResources * 0.02).toFixed(3);
  const clsRating = (parseFloat(clsValue) < 0.1 ? 'good' : parseFloat(clsValue) < 0.25 ? 'needs-improvement' : 'poor') as 'good' | 'needs-improvement' | 'poor';

  const coreWebVitals = {
    lcp: { value: lcp, unit: 'ms', rating: lcpRating },
    inp: { value: metrics.tbt, unit: 'ms', rating: inpRating },
    cls: { value: parseFloat(clsValue), unit: '', rating: clsRating },
  };

  // Calculate performance score (0-100)
  let score = 100;

  // Deduct for TTFB
  if (ttfbValue > 1800) score -= 30;
  else if (ttfbValue > 600) score -= 20;
  else if (ttfbValue > 300) score -= 10;
  else if (ttfbValue > 100) score -= 5;

  // Deduct for page size
  const sizeInMb = contentLength / (1024 * 1024);
  if (sizeInMb > 10) score -= 25;
  else if (sizeInMb > 5) score -= 20;
  else if (sizeInMb > 3) score -= 15;
  else if (sizeInMb > 1) score -= 10;

  // Deduct for render-blocking resources
  if (analysis.renderBlockingResources > 10) score -= 20;
  else if (analysis.renderBlockingResources > 5) score -= 15;
  else if (analysis.renderBlockingResources > 2) score -= 10;

  // Deduct for images without dimensions (CLS issue)
  if (analysis.images.withoutDimensions > 10) score -= 15;
  else if (analysis.images.withoutDimensions > 5) score -= 10;
  else if (analysis.images.withoutDimensions > 0) score -= 5;

  // Deduct for missing viewport meta
  if (!analysis.hasViewportMeta) score -= 15;

  // Deduct for poor minification
  if (analysis.minificationScore < 50) score -= 12;
  else if (analysis.minificationScore < 70) score -= 7;

  // Deduct for excessive scripts
  if (analysis.scripts > 20) score -= 15;
  else if (analysis.scripts > 10) score -= 10;
  else if (analysis.scripts > 5) score -= 5;

  // Deduct for excessive stylesheets
  if (analysis.stylesheets > 10) score -= 10;
  else if (analysis.stylesheets > 5) score -= 5;

  // Deduct for poor font optimization
  if (analysis.fontPreconnects === 0 && analysis.fontPreloads === 0 && (analysis.externalResources.stylesheets.some((s) => s.includes('font')))) {
    score -= 5;
  }

  // Deduct for images without alt text
  if (analysis.images.withoutAlt > 10) score -= 5;

  // Bonus for optimization features
  if (analysis.jsonLd) score += 3;
  if (analysis.images.lazyLoaded > 0) score += Math.min(5, analysis.images.lazyLoaded);
  if (analysis.minificationScore > 90) score += 5;

  score = Math.max(0, Math.min(100, score));

  return { metrics, score, coreWebVitals };
}

function generateOpportunities(analysis: HTMLAnalysis, contentLength: number, metrics: PerformanceMetrics['metrics']): PerformanceMetrics['opportunities'] {
  const opportunities: Array<{ title: string; description: string; savings: string; priority: number }> = [];

  // Calculate potential savings
  const blockingResourcesSavings = analysis.renderBlockingResources > 2 ? analysis.renderBlockingResources * 150 : 0;
  const clsSavings = analysis.images.withoutDimensions * 75;
  const minificationSavings = Math.max(0, (100 - analysis.minificationScore) * contentLength * 0.0001);
  const stylesheetSavings = Math.max(0, (analysis.stylesheets - 3) * 120);
  const scriptSavings = Math.max(0, (analysis.scripts - 5) * 100);

  if (analysis.renderBlockingResources > 2) {
    opportunities.push({
      title: 'Eliminate render-blocking resources',
      description: `Found ${analysis.renderBlockingResources} render-blocking resources in head. Defer CSS loading and use async/defer on scripts.`,
      savings: `~${Math.round(blockingResourcesSavings)}ms`,
      priority: 1,
    });
  }

  if (analysis.images.withoutDimensions > 0) {
    opportunities.push({
      title: 'Add width and height to images',
      description: `${analysis.images.withoutDimensions} images missing dimensions. This causes Cumulative Layout Shift (CLS).`,
      savings: `Reduce CLS by ~${Math.round(clsSavings)}ms`,
      priority: 1,
    });
  }

  if (analysis.minificationScore < 70) {
    const minPercent = Math.round((100 - analysis.minificationScore) * 0.8);
    opportunities.push({
      title: 'Minify CSS and JavaScript',
      description: 'Enable minification to reduce file sizes. Use tools like terser, cssnano, or build tools.',
      savings: `~${minPercent}% size reduction`,
      priority: 2,
    });
  }

  if (contentLength > 5000000) {
    const sizeMb = (contentLength / 1048576).toFixed(1);
    opportunities.push({
      title: 'Reduce overall page size',
      description: `Page is ${sizeMb}MB, significantly over the 1-3MB target. Optimize images, defer non-critical resources.`,
      savings: '~500-1000ms load time',
      priority: 1,
    });
  }

  if (analysis.stylesheets > 5) {
    opportunities.push({
      title: 'Consolidate stylesheets',
      description: `Found ${analysis.stylesheets} stylesheets. Combine related files to reduce HTTP requests and improve parallelization.`,
      savings: `~${Math.round(stylesheetSavings)}ms`,
      priority: 2,
    });
  }

  if (analysis.scripts > 5) {
    opportunities.push({
      title: 'Optimize JavaScript loading',
      description: `${analysis.scripts} scripts found. Defer non-critical JS, use code splitting, and consider lazy loading.`,
      savings: `~${Math.round(scriptSavings)}ms`,
      priority: 2,
    });
  }

  if (!analysis.hasViewportMeta) {
    opportunities.push({
      title: 'Add viewport meta tag',
      description: 'Missing <meta name="viewport">. Required for proper mobile rendering and responsiveness.',
      savings: 'Mobile rendering fix',
      priority: 1,
    });
  }

  if (analysis.images.lazyLoaded === 0 && analysis.images.count > 5) {
    opportunities.push({
      title: 'Implement lazy loading for images',
      description: `Add loading="lazy" to off-screen images. ${analysis.images.count} images found, none lazy-loaded.`,
      savings: `~${Math.min(800, analysis.images.count * 100)}ms initial paint`,
      priority: 2,
    });
  }

  if (analysis.images.withoutAlt > 0) {
    opportunities.push({
      title: 'Add alt text to all images',
      description: `${analysis.images.withoutAlt} images missing alt attributes. Improves accessibility and SEO.`,
      savings: 'Accessibility & SEO improvement',
      priority: 3,
    });
  }

  if (analysis.fontPreconnects === 0 && analysis.fontPreloads === 0 && analysis.externalResources.stylesheets.some((s) => s.includes('font'))) {
    opportunities.push({
      title: 'Add font optimization hints',
      description: 'Add <link rel="preconnect"> and <link rel="preload"> for critical fonts to reduce font loading delay.',
      savings: '~100-300ms font rendering',
      priority: 2,
    });
  }

  if (!analysis.jsonLd && contentLength > 1000000) {
    opportunities.push({
      title: 'Add structured data (JSON-LD)',
      description: 'Include schema.org structured data to improve SEO and enable rich snippets.',
      savings: 'Enhanced search visibility',
      priority: 3,
    });
  }

  // Sort by priority and return top 8
  return opportunities
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 8)
    .map(({ priority, ...rest }) => rest);
}

function calculateResourceBreakdown(analysis: HTMLAnalysis): PerformanceMetrics['resources']['breakdown'] {
  // More realistic estimates for file sizes
  const stylesheetSize = analysis.stylesheets * 35 * 1024; // 35KB per stylesheet
  const scriptSize = analysis.scripts * 45 * 1024; // 45KB per script
  const fontSize = (analysis.fontPreconnects + analysis.fontPreloads + 1) * 80 * 1024; // 80KB per font family
  const htmlBase = 50 * 1024; // Base HTML

  const totalSize =
    analysis.images.estimatedSize +
    analysis.inlineCss +
    analysis.inlineJs +
    stylesheetSize +
    scriptSize +
    fontSize +
    htmlBase;

  const breakdown: PerformanceMetrics['resources']['breakdown'] = [];

  // Only include categories with significant size
  if (analysis.images.estimatedSize > 0) {
    breakdown.push({
      type: 'images',
      size: analysis.images.estimatedSize,
      percentage: Math.round((analysis.images.estimatedSize / totalSize) * 100),
    });
  }

  if (stylesheetSize > 0) {
    breakdown.push({
      type: 'stylesheets',
      size: stylesheetSize,
      percentage: Math.round((stylesheetSize / totalSize) * 100),
    });
  }

  if (scriptSize > 0) {
    breakdown.push({
      type: 'scripts',
      size: scriptSize,
      percentage: Math.round((scriptSize / totalSize) * 100),
    });
  }

  if (analysis.inlineCss > 0) {
    breakdown.push({
      type: 'inline-css',
      size: analysis.inlineCss,
      percentage: Math.round((analysis.inlineCss / totalSize) * 100),
    });
  }

  if (analysis.inlineJs > 0) {
    breakdown.push({
      type: 'inline-js',
      size: analysis.inlineJs,
      percentage: Math.round((analysis.inlineJs / totalSize) * 100),
    });
  }

  if (fontSize > 0) {
    breakdown.push({
      type: 'fonts',
      size: fontSize,
      percentage: Math.round((fontSize / totalSize) * 100),
    });
  }

  breakdown.push({
    type: 'other',
    size: htmlBase,
    percentage: Math.round((htmlBase / totalSize) * 100),
  });

  return breakdown.filter((item) => item.percentage > 0);
}

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, device = 'desktop', websiteId } = body;

    // Validation
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: url is required and must be a string' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (device && !['desktop', 'mobile'].includes(device)) {
      return NextResponse.json(
        { error: 'Invalid device: must be "desktop" or "mobile"' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Fetch and analyze the URL
    const { html, ttfb, responseTime, contentLength, contentType, https } = await fetchAndAnalyzeUrl(url);

    // Analyze HTML
    const analysis = analyzeHtml(html, url);

    // Calculate metrics
    const { metrics, score, coreWebVitals } = calculateMetrics(ttfb, responseTime, contentLength, analysis);

    // Generate opportunities
    const opportunities = generateOpportunities(analysis, contentLength, metrics);

    // Calculate resource breakdown
    const breakdown = calculateResourceBreakdown(analysis);

    const result: PerformanceMetrics = {
      url,
      score: Math.round(score),
      grade: getGrade(score),
      coreWebVitals,
      metrics,
      resources: {
        scripts: analysis.scripts,
        stylesheets: analysis.stylesheets,
        images: analysis.images.count,
        fonts: analysis.fontPreconnects + analysis.fontPreloads,
        totalSize: contentLength,
        breakdown,
      },
      opportunities,
      technical: {
        https,
        ttfb: Math.round(ttfb),
        responseTime: Math.round(responseTime),
        contentLength,
        contentType,
      },
    };

    // Save to database if websiteId provided
    if (websiteId) {
      try {
        await prisma.performanceData.create({
          data: {
            websiteId,
            device,
            url,
            score: Math.round(score),
            grade: getGrade(score),
            ttfb: Math.round(ttfb),
            lcp: metrics.lcp,
            fid: metrics.tbt, // Using TBT as proxy for FID/INP
            cls: parseFloat(coreWebVitals.cls.value.toString()),
            fcp: metrics.fcp,
            tti: metrics.tti,
            tbt: metrics.tbt,
            speedIndex: metrics.speedIndex,
            pageSize: contentLength,
            requests: analysis.scripts + analysis.stylesheets + analysis.images.count,
            resources: JSON.stringify(breakdown),
            opportunities: JSON.stringify(opportunities),
          },
        });
      } catch (dbError) {
        console.error('Failed to save performance data to database:', dbError);
        // Don't fail the request if DB save fails, just log it
      }
    }

    return NextResponse.json(result, {
      status: 200,
      headers: corsHeaders(),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Performance analysis failed: ${errorMessage}` },
      { status: 500, headers: corsHeaders() }
    );
  }
}
