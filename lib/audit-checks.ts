/**
 * Audit Checks Engine — Rapports de référence en français
 * Chaque check produit un rapport complet (500+ mots) avec :
 * - Guide complet type article de référence
 * - Cas d'étude avant/après avec chiffres
 * - Tableaux comparatifs
 * - Checklist pré-publication
 * - Erreurs courantes vs corrections
 * - Outils recommandés
 * - Bonnes pratiques 2026
 * - Recommandations actionnables
 * - Impact SEO estimé
 * - Sources de référence
 */

import {
  getTitleTagReport,
  getMetaDescriptionReport,
  getCanonicalReport,
  getHTTPSReport,
  getStructuredDataReport,
  getLoadTimeReport,
  getOpenGraphReport,
  getH1Report,
  getImagesReport,
  getHeadingHierarchyReport,
  getWordCountReport,
  getViewportReport,
  getSecurityHeadersReport,
} from './audit-reports'

export interface DetailedCheck {
  id: string
  category: 'meta' | 'content' | 'technical' | 'performance' | 'security' | 'mobile'
  name: string
  status: 'passed' | 'warning' | 'error'
  score: number
  value: string
  summary: string         // Résumé court (1 phrase)
  report: string          // Rapport détaillé (multi-paragraphe)
  bestPractices: string[] // Liste des bonnes pratiques 2026
  impact: 'critical' | 'high' | 'medium' | 'low'
  sources: string[]       // Références
}

// ── TITLE TAG ─────────────────────────────────────────────────────────

export function checkTitleTag(title: string | null, url: string): DetailedCheck {
  const len = title?.length || 0
  const hasKeywordUpfront = title ? /^[A-ZÀ-Ü]/.test(title) : false

  let status: DetailedCheck['status'] = 'passed'
  let score = 100
  let summary = ''

  if (!title) {
    status = 'error'; score = 0
    summary = 'Balise title absente — impact critique sur le référencement.'
  } else if (len < 30) {
    status = 'warning'; score = 40
    summary = `Title trop courte (${len} car.) — visibilité et CTR réduits dans les SERP.`
  } else if (len > 60) {
    status = 'warning'; score = 65
    summary = `Title trop longue (${len} car.) — sera tronquée dans les résultats Google.`
  } else if (len >= 35 && len <= 55) {
    score = 100
    summary = `Title optimale (${len} car.) — longueur idéale pour les SERP 2026.`
  } else {
    score = 85
    summary = `Title acceptable (${len} car.) — dans les limites mais peut être améliorée.`
  }

  return {
    id: 'meta_title',
    category: 'meta',
    name: 'Balise Title',
    status,
    score,
    value: title || 'Absente',
    summary,
    report: getTitleTagReport(title, url),
    bestPractices: [
      'Longueur optimale : 35–55 caractères (zone de sécurité anti-troncature)',
      'Placez le mot-clé principal dans les 3 premiers mots',
      'Incluez des mots-clés secondaires sans sur-optimiser (keyword stuffing)',
      'Utilisez le Title Case pour maximiser la lisibilité et le CTR',
      'Chaque page doit avoir une title unique — aucun doublon',
      'Réduisez les stop words (le, la, de, en) pour maximiser la densité',
      'Ajoutez le nom de marque stratégiquement (homepage, pages à fort branding)',
      'Testez les emojis pour booster le CTR (📊, ✅, 🔥) — A/B testez avant de généraliser',
      'Utilisez des power words (Ultime, Secret, Exclusif, Meilleur) pour attirer l\'attention',
      'Ajoutez des modificateurs (Guide, Avis, Comparatif, 2026) pour capter le trafic longue traîne',
      'Utilisez des caractères spéciaux (• / ★ ™) pour un pattern interrupt visuel dans les SERP',
      'A/B testez régulièrement vos titles et itérez en fonction du CTR et des positions',
    ],
    impact: !title ? 'critical' : len < 30 || len > 65 ? 'high' : 'medium',
    sources: [
      'Google Search Central — Title Links (2025)',
      'Moz — Title Tag Optimization Guide (2026)',
      'Ahrefs — How to Write Title Tags for SEO (2026)',
      'Google SERP Display Study — Portent (2025)',
    ],
  }
}

// ── META DESCRIPTION ──────────────────────────────────────────────────

export function checkMetaDescription(desc: string | null): DetailedCheck {
  const len = desc?.length || 0

  let status: DetailedCheck['status'] = 'passed'
  let score = 100
  let summary = ''

  if (!desc) {
    status = 'error'; score = 0
    summary = 'Meta description absente — Google générera un extrait automatique souvent inadapté.'
  } else if (len < 120) {
    status = 'warning'; score = 50
    summary = `Meta description trop courte (${len} car.) — sous-utilise l'espace SERP.`
  } else if (len > 160) {
    status = 'warning'; score = 70
    summary = `Meta description trop longue (${len} car.) — sera tronquée dans les SERP.`
  } else {
    summary = `Meta description optimale (${len} car.) — bonne longueur pour les SERP.`
  }

  return {
    id: 'meta_description',
    category: 'meta',
    name: 'Meta Description',
    status,
    score,
    value: desc ? `${desc.substring(0, 80)}... (${len} car.)` : 'Absente',
    summary,
    report: getMetaDescriptionReport(desc),
    bestPractices: [
      'Longueur idéale : 120–155 caractères (safe zone desktop + mobile)',
      'Incluez le mot-clé principal naturellement (Google le met en gras dans les SERP)',
      'Ajoutez un appel à l\'action clair (Découvrez, Comparez, Essayez gratuitement)',
      'Chaque page doit avoir une description unique — pas de duplication',
      'Rédigez pour l\'humain, pas pour le robot — c\'est du copywriting SERP',
      'Utilisez des chiffres et données pour crédibiliser ("+340% de trafic", "98% de satisfaction")',
      'Testez les emojis et caractères Unicode pour augmenter le CTR',
      'Adaptez le ton à l\'intention de recherche (informationnelle vs transactionnelle)',
    ],
    impact: !desc ? 'high' : 'medium',
    sources: [
      'Google Search Central — Meta Description Best Practices (2025)',
      'Backlinko — Meta Description Study (2026)',
      'Search Engine Journal — SERP CTR Optimization (2025)',
    ],
  }
}

// ── CANONICAL TAG ─────────────────────────────────────────────────────

export function checkCanonical(canonical: string | null, url: string): DetailedCheck {
  const hasCanonical = !!canonical
  const isSelfReferencing = canonical === url || canonical === url + '/'

  let status: DetailedCheck['status'] = hasCanonical ? 'passed' : 'warning'
  let score = hasCanonical ? (isSelfReferencing ? 100 : 85) : 40

  return {
    id: 'meta_canonical',
    category: 'meta',
    name: 'Balise Canonical',
    status,
    score,
    value: canonical || 'Absente',
    summary: hasCanonical
      ? `Canonical définie${isSelfReferencing ? ' (auto-référencée ✅)' : ' — vérifiez qu\'elle pointe vers la bonne URL'}`
      : 'Balise canonical absente — risque de contenu dupliqué.',
    report: getCanonicalReport(canonical, url),
    bestPractices: [
      'Ajoutez une canonical auto-référencée sur chaque page',
      'Utilisez des URLs absolues (https://domaine.fr/page), jamais relatives',
      'Assurez-vous que la canonical est cohérente avec le sitemap.xml',
      'Pour les pages paginées, la canonical doit pointer vers elle-même (pas vers la page 1)',
      'Vérifiez qu\'il n\'y a pas de conflit entre canonical et meta robots noindex',
    ],
    impact: hasCanonical ? 'low' : 'high',
    sources: [
      'Google Search Central — Consolidate Duplicate URLs (2025)',
      'Yoast — Canonical URL Guide (2026)',
    ],
  }
}

// ── H1 HEADING ────────────────────────────────────────────────────────

export function checkH1(h1Count: number, h1Text: string | null): DetailedCheck {
  let status: DetailedCheck['status'] = 'passed'
  let score = 100

  if (h1Count === 0) { status = 'error'; score = 0 }
  else if (h1Count > 1) { status = 'warning'; score = 60 }

  const h1Len = h1Text?.length || 0

  return {
    id: 'content_h1',
    category: 'content',
    name: 'Balise H1',
    status,
    score,
    value: h1Count === 0 ? 'Absente' : h1Count > 1 ? `${h1Count} H1 détectées (trop)` : `"${h1Text?.substring(0, 60)}${h1Len > 60 ? '...' : ''}"`,
    summary: h1Count === 0
      ? 'Aucune balise H1 détectée — signal de pertinence manquant pour Google.'
      : h1Count > 1
        ? `${h1Count} balises H1 détectées — une seule H1 par page est recommandé.`
        : `H1 unique détectée (${h1Len} car.) — bonne structure.`,
    report: getH1Report(h1Count, h1Text),
    bestPractices: [
      'Une seule H1 par page — elle définit le sujet principal',
      'Incluez le mot-clé principal dans la H1',
      'La H1 doit être différente de la title tag (complémentaire, pas identique)',
      'Longueur recommandée : 20–70 caractères',
      'La H1 doit être le premier heading visible sur la page',
      'Suivez une hiérarchie logique : H1 > H2 > H3 (pas de saut de niveau)',
    ],
    impact: h1Count === 0 ? 'critical' : h1Count > 1 ? 'medium' : 'low',
    sources: [
      'Semrush — H1 Tag Study: Impact on Rankings (2025)',
      'Google Search Central — Headings Best Practices (2025)',
      'Moz — On-Page SEO: Heading Tags (2026)',
    ],
  }
}

// ── IMAGES ALT TEXT ───────────────────────────────────────────────────

export function checkImages(total: number, withAlt: number, withoutAlt: number): DetailedCheck {
  if (total === 0) {
    return {
      id: 'content_images',
      category: 'content',
      name: 'Images & Alt Text',
      status: 'warning',
      score: 70,
      value: 'Aucune image détectée',
      summary: 'Aucune image trouvée — le contenu visuel améliore l\'engagement et le SEO.',
      report: getImagesReport(total, withAlt),
      bestPractices: [
        'Ajoutez des images pertinentes pour enrichir le contenu',
        'Chaque image doit avoir un attribut alt descriptif',
        'Optimisez le poids des images (WebP, compression)',
        'Utilisez le lazy loading pour les images sous la ligne de flottaison',
      ],
      impact: 'low',
      sources: ['Google Search Central — Image Best Practices (2025)'],
    }
  }

  const ratio = withAlt / total
  const status: DetailedCheck['status'] = ratio >= 0.9 ? 'passed' : ratio >= 0.5 ? 'warning' : 'error'
  const score = Math.round(ratio * 100)

  return {
    id: 'content_images',
    category: 'content',
    name: 'Images & Alt Text',
    status,
    score,
    value: `${withAlt}/${total} images avec alt text (${Math.round(ratio * 100)}%)`,
    summary: ratio >= 0.9
      ? `${withAlt}/${total} images ont un alt text — excellent.`
      : `${withoutAlt} image(s) sans alt text — accessibilité et SEO impactés.`,
    report: getImagesReport(total, withAlt),
    bestPractices: [
      'Chaque image doit avoir un alt text descriptif et unique',
      'Incluez le mot-clé dans l\'alt de l\'image principale (naturellement)',
      'Alt text idéal : 5-15 mots décrivant le contenu de l\'image',
      'N\'utilisez pas "image de..." ou "photo de..." — soyez direct',
      'Les images décoratives peuvent avoir un alt="" vide',
      'Utilisez le format WebP pour réduire le poids de 25-35%',
      'Activez le lazy loading (loading="lazy") pour les images hors viewport',
      'Renseignez les dimensions (width/height) pour éviter le CLS',
    ],
    impact: ratio < 0.5 ? 'high' : ratio < 0.9 ? 'medium' : 'low',
    sources: [
      'Google Search Central — Image SEO Best Practices (2025)',
      'WebAIM — Alternative Text Guide (2026)',
      'Web.dev — Optimize Images (2025)',
    ],
  }
}

// ── HTTPS / SSL ───────────────────────────────────────────────────────

export function checkHTTPS(url: string): DetailedCheck {
  const isHttps = url.startsWith('https://')

  return {
    id: 'security_https',
    category: 'security',
    name: 'HTTPS / SSL',
    status: isHttps ? 'passed' : 'error',
    score: isHttps ? 100 : 0,
    value: isHttps ? 'HTTPS actif ✅' : 'HTTP non sécurisé ❌',
    summary: isHttps
      ? 'Connexion HTTPS sécurisée — facteur de ranking confirmé par Google.'
      : 'Site non sécurisé (HTTP) — bloquant pour le SEO et la confiance utilisateur.',
    report: getHTTPSReport(url),
    bestPractices: [
      'Utilisez HTTPS sur 100% de votre site',
      'Configurez une redirection 301 permanente de HTTP vers HTTPS',
      'Activez le header HSTS (Strict-Transport-Security: max-age=31536000)',
      'Vérifiez l\'absence de contenu mixte (Mixed Content)',
      'Renouvelez votre certificat SSL avant expiration',
      'Utilisez TLS 1.3 minimum (désactivez TLS 1.0 et 1.1)',
    ],
    impact: isHttps ? 'low' : 'critical',
    sources: [
      'Google — HTTPS as a Ranking Signal (2014, confirmé 2025)',
      'Let\'s Encrypt — Free SSL/TLS Certificates',
      'Mozilla — HTTPS Best Practices (2026)',
    ],
  }
}

// ── PAGE SPEED / LOAD TIME ────────────────────────────────────────────

export function checkLoadTime(loadTime: number, htmlSize: number): DetailedCheck {
  const sizeKB = Math.round(htmlSize / 1024)
  const sizeMB = (htmlSize / (1024 * 1024)).toFixed(2)

  let status: DetailedCheck['status'] = 'passed'
  let score = 100

  if (loadTime > 5000) { status = 'error'; score = 20 }
  else if (loadTime > 3000) { status = 'warning'; score = 50 }
  else if (loadTime > 1500) { status = 'warning'; score = 75 }

  const loadSec = (loadTime / 1000).toFixed(2)

  return {
    id: 'performance_speed',
    category: 'performance',
    name: 'Temps de chargement',
    status,
    score,
    value: `${loadSec}s (HTML: ${sizeKB} KB)`,
    summary: loadTime <= 1500
      ? `Chargement rapide (${loadSec}s) — excellent pour l'UX et le SEO.`
      : loadTime <= 3000
        ? `Chargement acceptable (${loadSec}s) — peut être optimisé.`
        : `Chargement lent (${loadSec}s) — impact négatif sur le SEO et l'UX.`,
    report: getLoadTimeReport(loadTime, htmlSize),
    bestPractices: [
      'TTFB cible : < 800ms (Time to First Byte)',
      'Activez la compression Gzip/Brotli sur le serveur',
      'Utilisez un CDN pour réduire la latence géographique',
      'Configurez le cache navigateur (Cache-Control headers)',
      'Minifiez HTML, CSS et JavaScript',
      'Optimisez les requêtes base de données',
      'Utilisez HTTP/2 ou HTTP/3 pour le multiplexage',
      'Réduisez le nombre de redirections (chaque 301 ajoute ~100ms)',
    ],
    impact: loadTime > 3000 ? 'critical' : loadTime > 1500 ? 'high' : 'low',
    sources: [
      'Google — Core Web Vitals Thresholds (2025)',
      'Web.dev — Optimize Time to First Byte (2025)',
      'Portent — Site Speed & Conversion Study (2025)',
      'Google — Mobile Speed Benchmarks (2025)',
    ],
  }
}

// ── STRUCTURED DATA ───────────────────────────────────────────────────

export function checkStructuredData(count: number): DetailedCheck {
  const status: DetailedCheck['status'] = count >= 2 ? 'passed' : count >= 1 ? 'warning' : 'error'
  const score = count >= 3 ? 100 : count >= 2 ? 85 : count >= 1 ? 60 : 0

  return {
    id: 'technical_structured_data',
    category: 'technical',
    name: 'Données Structurées (Schema.org)',
    status,
    score,
    value: count > 0 ? `${count} bloc(s) JSON-LD détecté(s)` : 'Aucune donnée structurée',
    summary: count >= 2
      ? `${count} schemas JSON-LD détectés — bonne implémentation pour les rich snippets.`
      : count === 1
        ? '1 seul schema détecté — enrichissez avec d\'autres types (FAQ, Product, etc.).'
        : 'Aucune donnée structurée — manque d\'opportunité pour les rich snippets.',
    report: getStructuredDataReport(count),
    bestPractices: [
      'Utilisez le format JSON-LD (recommandé par Google vs Microdata)',
      'Au minimum : Organization + WebSite + BreadcrumbList',
      'Ajoutez FAQPage pour les pages avec des Q&A — excellent pour les PAA',
      'Testez avec le Rich Results Test (search.google.com/test/rich-results)',
      'Validez le JSON-LD avec Schema.org Validator',
      'Ne marquez que le contenu visible sur la page (pas de spam)',
      'Ajoutez AggregateRating si vous avez des avis clients',
      'Utilisez HowTo pour les tutoriels et guides pas-à-pas',
    ],
    impact: count === 0 ? 'high' : 'medium',
    sources: [
      'Google Search Central — Structured Data Guidelines (2025)',
      'Schema.org — Full Hierarchy (2026)',
      'Google — Rich Results Test Tool',
      'Merkle — Schema Markup Generator',
    ],
  }
}

// ── OPEN GRAPH ────────────────────────────────────────────────────────

export function checkOpenGraph(ogTitle: string | null, ogDesc: string | null, ogImage: string | null): DetailedCheck {
  const tags = [ogTitle, ogDesc, ogImage].filter(Boolean).length
  const score = tags === 3 ? 100 : tags === 2 ? 70 : tags === 1 ? 40 : 0
  const status: DetailedCheck['status'] = tags === 3 ? 'passed' : tags > 0 ? 'warning' : 'error'

  return {
    id: 'meta_og',
    category: 'meta',
    name: 'Open Graph (Réseaux sociaux)',
    status,
    score,
    value: `og:title ${ogTitle ? '✅' : '❌'} | og:description ${ogDesc ? '✅' : '❌'} | og:image ${ogImage ? '✅' : '❌'}`,
    summary: tags === 3
      ? 'Balises Open Graph complètes — partage social optimisé.'
      : `${3 - tags} balise(s) OG manquante(s) — partage social sous-optimal.`,
    report: getOpenGraphReport(ogTitle, ogDesc, ogImage),
    bestPractices: [
      'og:title : 40-60 caractères, différent de la title tag',
      'og:description : 60-90 caractères, accrocheur et concis',
      'og:image : 1200×630px minimum, format PNG ou JPG',
      'Ajoutez og:type (website, article, product)',
      'Ajoutez og:url avec l\'URL canonique',
      'Testez avec le Facebook Sharing Debugger',
      'Ajoutez aussi les Twitter Card tags (twitter:card, twitter:image)',
    ],
    impact: tags === 0 ? 'high' : tags < 3 ? 'medium' : 'low',
    sources: [
      'Open Graph Protocol — ogp.me',
      'Facebook — Sharing Debugger',
      'Buffer — Social Media Image Study (2025)',
    ],
  }
}

// ── MOBILE VIEWPORT ───────────────────────────────────────────────────

export function checkViewport(viewport: string | null): DetailedCheck {
  const hasViewport = !!viewport
  const hasWidthDevice = viewport?.includes('width=device-width') || false

  return {
    id: 'mobile_viewport',
    category: 'mobile',
    name: 'Viewport Mobile',
    status: hasViewport && hasWidthDevice ? 'passed' : hasViewport ? 'warning' : 'error',
    score: hasViewport && hasWidthDevice ? 100 : hasViewport ? 60 : 0,
    value: viewport || 'Absente',
    summary: hasViewport && hasWidthDevice
      ? 'Viewport correctement configuré pour le responsive.'
      : 'Viewport manquant ou mal configuré — site non adapté au mobile.',
    report: getViewportReport(viewport),
    bestPractices: [
      'Ajoutez : <meta name="viewport" content="width=device-width, initial-scale=1">',
      'Ne bloquez pas le zoom utilisateur (évitez maximum-scale=1)',
      'Testez avec le Mobile-Friendly Test de Google',
      'Utilisez un design responsive (pas de site mobile séparé)',
    ],
    impact: hasViewport ? 'low' : 'critical',
    sources: [
      'Google — Mobile-First Indexing (2025)',
      'MDN — Viewport Meta Tag',
      'Web.dev — Responsive Design Basics',
    ],
  }
}

// ── WORD COUNT ─────────────────────────────────────────────────────────

export function checkWordCount(wordCount: number): DetailedCheck {
  let status: DetailedCheck['status'] = 'passed'
  let score = 100

  if (wordCount < 100) { status = 'error'; score = 20 }
  else if (wordCount < 300) { status = 'warning'; score = 50 }
  else if (wordCount < 600) { status = 'warning'; score = 75 }

  return {
    id: 'content_wordcount',
    category: 'content',
    name: 'Volume de Contenu',
    status,
    score,
    value: `${wordCount} mots`,
    summary: wordCount >= 600
      ? `${wordCount} mots — volume suffisant pour couvrir le sujet en profondeur.`
      : wordCount >= 300
        ? `${wordCount} mots — contenu court, envisagez d'approfondir.`
        : `${wordCount} mots — contenu insuffisant pour le SEO.`,
    report: getWordCountReport(wordCount),
    bestPractices: [
      'Adaptez la longueur à l\'intention de recherche et au type de page',
      'Privilégiez la qualité et la profondeur à la quantité',
      'Analysez la longueur des pages concurrentes en top 3 pour calibrer',
      'Utilisez des sous-titres (H2, H3) pour structurer les contenus longs',
      'Ajoutez des éléments multimédias (images, vidéos, tableaux) pour enrichir',
      'Évitez le contenu dupliqué ou généré automatiquement de faible qualité',
    ],
    impact: wordCount < 300 ? 'high' : wordCount < 600 ? 'medium' : 'low',
    sources: [
      'Backlinko — Content Length vs Rankings Study (2025)',
      'Google Search Central — Thin Content (2025)',
      'HubSpot — Ideal Blog Post Length Study (2026)',
    ],
  }
}

// ── HEADING HIERARCHY ─────────────────────────────────────────────────

export function checkHeadingHierarchy(h1: number, h2: number, h3: number): DetailedCheck {
  const good = h1 === 1 && h2 >= 2
  const score = good ? 100 : h1 === 1 ? 70 : h1 === 0 ? 30 : 50

  return {
    id: 'content_headings',
    category: 'content',
    name: 'Hiérarchie des Titres',
    status: good ? 'passed' : h1 === 1 && h2 >= 1 ? 'warning' : 'error',
    score,
    value: `H1: ${h1} | H2: ${h2} | H3: ${h3}`,
    summary: good
      ? `Hiérarchie correcte — 1 H1, ${h2} H2, ${h3} H3.`
      : h1 === 0
        ? 'Aucune H1 détectée — la hiérarchie de titres est incomplète.'
        : `Hiérarchie à améliorer — ${h1 > 1 ? 'trop de H1' : 'pas assez de H2'}.`,
    report: getHeadingHierarchyReport(h1, h2, h3),
    bestPractices: [
      '1 seul H1 par page (le titre principal)',
      'Au moins 2-3 H2 pour structurer les sous-sections',
      'Pas de saut de niveau (H1 → H3 sans H2)',
      'Incluez des mots-clés dans les H2 naturellement',
      'Les H2 sous forme de questions améliorent les chances d\'apparaître dans les PAA',
      'Utilisez les H3-H6 pour les sous-sous-sections',
    ],
    impact: h1 === 0 ? 'high' : good ? 'low' : 'medium',
    sources: [
      'Google Search Central — Heading Elements (2025)',
      'W3C — HTML Heading Specification',
      'WebAIM — Headings Accessibility Guide',
    ],
  }
}

// ── SECURITY HEADERS ──────────────────────────────────────────────────

export function checkSecurityHeaders(csp: string | null, xFrame: string | null, xContentType: string | null): DetailedCheck {
  const headers = [csp, xFrame, xContentType].filter(Boolean).length
  const score = headers === 3 ? 100 : headers === 2 ? 70 : headers === 1 ? 40 : 10

  return {
    id: 'security_headers',
    category: 'security',
    name: 'Headers de Sécurité',
    status: headers >= 2 ? 'passed' : headers >= 1 ? 'warning' : 'error',
    score,
    value: `CSP ${csp ? '✅' : '❌'} | X-Frame ${xFrame ? '✅' : '❌'} | X-Content-Type ${xContentType ? '✅' : '❌'}`,
    summary: headers >= 2
      ? `${headers}/3 headers de sécurité configurés — bonne protection.`
      : `${headers}/3 headers de sécurité — protection insuffisante.`,
    report: getSecurityHeadersReport(csp, xFrame, xContentType),
    bestPractices: [
      'Content-Security-Policy : définissez les sources autorisées pour scripts, styles, images',
      'X-Frame-Options : DENY ou SAMEORIGIN pour empêcher l\'embedding non autorisé',
      'X-Content-Type-Options : nosniff pour empêcher le MIME sniffing',
      'Strict-Transport-Security (HSTS) : max-age=31536000; includeSubDomains',
      'Referrer-Policy : strict-origin-when-cross-origin',
      'Permissions-Policy : désactivez caméra, micro, géoloc si non utilisés',
    ],
    impact: headers === 0 ? 'high' : 'medium',
    sources: [
      'OWASP — Secure Headers Project (2026)',
      'Mozilla — HTTP Security Headers',
      'SecurityHeaders.com — Header Analysis Tool',
    ],
  }
}
