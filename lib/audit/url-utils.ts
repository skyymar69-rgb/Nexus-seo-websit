/**
 * Normalisation d'URL pour le crawler. Portage d'OpenSEO (MIT).
 */

/**
 * Normalise pour le dédoublonnage : résout contre une base, retire le
 * fragment, trie les paramètres, met l'hôte en minuscules. Conserve la barre
 * finale : c'est la forme canonique de la plupart des CMS, qui redirigent la
 * version sans barre vers elle ; la retirer créerait une boucle infinie.
 */
export function normalizeUrl(url: string, base?: string): string | null {
  try {
    const parsed = new URL(url, base)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null
    parsed.hash = ''
    parsed.searchParams.sort()
    parsed.hostname = parsed.hostname.toLowerCase()
    return parsed.toString()
  } catch {
    return null
  }
}

/**
 * Clé d'égalité qui survit aux redirections courantes vers la forme canonique
 * (barre finale, www, http vers https). Réservée aux comparaisons « est-ce la
 * même page que l'URL de départ », pas au dédoublonnage du crawl.
 */
export function canonicalUrlKey(url: string): string {
  try {
    const parsed = new URL(url)
    parsed.protocol = 'https:'
    parsed.hostname = parsed.hostname.toLowerCase().replace(/^www\./, '')
    parsed.hash = ''
    parsed.searchParams.sort()
    return parsed.toString()
  } catch {
    return url.toLowerCase()
  }
}

function effectivePort(parsed: URL): string {
  if (parsed.port) return parsed.port
  return parsed.protocol === 'https:' ? '443' : '80'
}

function areEquivalentHostnames(a: string, b: string): boolean {
  const hostA = a.toLowerCase()
  const hostB = b.toLowerCase()
  if (hostA === hostB) return true
  return hostA === `www.${hostB}` || hostB === `www.${hostA}`
}

/**
 * Même périmètre de crawl que la cible : hôte identique (www toléré), même
 * protocole et port, ou passage http vers https sur les ports par défaut.
 */
export function isSameOrigin(url: string, origin: string): boolean {
  try {
    const parsedUrl = new URL(url)
    const parsedOrigin = new URL(origin)
    if (!areEquivalentHostnames(parsedUrl.hostname, parsedOrigin.hostname)) return false
    const originProtocol = parsedOrigin.protocol.toLowerCase()
    const urlProtocol = parsedUrl.protocol.toLowerCase()
    const originPort = effectivePort(parsedOrigin)
    const urlPort = effectivePort(parsedUrl)
    if (originProtocol === urlProtocol) return originPort === urlPort
    return originProtocol === 'http:' && urlProtocol === 'https:' && originPort === '80' && urlPort === '443'
  } catch {
    return false
  }
}

/**
 * Gabarit d'URL : remplace les segments dynamiques (id, uuid, date, slug) par
 * un paramètre. /blog/mon-super-article -> /blog/:slug
 */
export function detectUrlTemplate(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)
  const normalized = segments.map((segment) => {
    if (/^\d+$/.test(segment)) return ':id'
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return ':uuid'
    if (/^\d{4}-\d{2}-\d{2}$/.test(segment)) return ':date'
    if (segment.includes('-') && segment.split('-').length > 2) return ':slug'
    return segment
  })
  return '/' + normalized.join('/')
}

export function getOrigin(url: string): string {
  return new URL(url).origin
}

/** Extensions de ressources qui ne sont jamais des pages à auditer. */
const ASSET_EXTENSION_RE =
  /\.(jpe?g|png|gif|svg|webp|avif|ico|css|js|mjs|map|json|xml|txt|zip|gz|rar|7z|mp4|mp3|webm|ogg|wav|woff2?|ttf|eot|otf|pdf|docx?|xlsx?|pptx?)$/i

export function looksLikeAsset(url: string): boolean {
  try {
    return ASSET_EXTENSION_RE.test(new URL(url).pathname)
  } catch {
    return false
  }
}

/** Lit un corps de réponse jusqu'à maxBytes ; null si dépassé. */
export async function readBodyCapped(response: Response, maxBytes: number): Promise<string | null> {
  if (!response.body) return ''
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  const joined = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    joined.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(joined)
}
