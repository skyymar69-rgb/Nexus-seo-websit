/**
 * Localisations infra-nationales (villes, départements, régions) pour le
 * suivi de positions local. Portage d'OpenSEO (MIT) : le cache KV Cloudflare
 * est remplacé par lib/cache (Upstash ou mémoire).
 *
 * L'endpoint est gratuit mais renvoie plusieurs mégaoctets sans paramètre de
 * recherche : la liste allégée est mise en cache 30 jours.
 */
import { z } from 'zod'
import { cacheGet, cacheKey, cacheSet } from '@/lib/cache'
import { dataforseoGet } from './core'
import { assertOk } from './envelope'
import { formatLocationLabel } from './locations'

export interface SerpLocationResult {
  locationCode: number
  locationName: string
  locationType: string
  displayLabel: string
}

// Granularités réellement ciblées. Exclut les codes postaux (dizaines de
// milliers de lignes) et la longue traîne (aéroports, universités).
const INCLUDED_LOCATION_TYPES = new Set(['City', 'County', 'Municipality', 'DMA Region', 'Region', 'Department'])

const locationItemSchema = z.object({
  location_code: z.number(),
  location_name: z.string(),
  location_type: z.string().nullable().optional(),
})

const cachedSchema = z.array(
  z.object({
    locationCode: z.number(),
    locationName: z.string(),
    locationType: z.string(),
    displayLabel: z.string(),
  }),
)

const CACHE_TTL_SECONDS = 30 * 24 * 60 * 60

const inflight = new Map<string, Promise<SerpLocationResult[]>>()

/** Liste complète pour un pays (ISO 3166-1 alpha-2, ex. "fr"). */
export async function fetchSerpLocationsForCountry(countryCode: string): Promise<SerpLocationResult[]> {
  const iso = countryCode.toLowerCase()
  const key = cacheKey('serp-locations', iso)
  const cached = cachedSchema.safeParse(await cacheGet(key))
  if (cached.success) return cached.data

  const pending = inflight.get(iso)
  if (pending) return pending

  const fill = fetchFromDataforseo(iso)
    .then(async (fresh) => {
      await cacheSet(key, fresh, CACHE_TTL_SECONDS)
      return fresh
    })
    .finally(() => inflight.delete(iso))
  inflight.set(iso, fill)
  return fill
}

async function fetchFromDataforseo(iso: string): Promise<SerpLocationResult[]> {
  const response = await dataforseoGet(`/v3/serp/google/locations/${encodeURIComponent(iso)}`)
  const task = assertOk(response)
  return (task.result ?? [])
    .map((item) => locationItemSchema.safeParse(item))
    .flatMap((parsed) => (parsed.success ? [parsed.data] : []))
    .filter((item) => INCLUDED_LOCATION_TYPES.has(item.location_type ?? ''))
    .map((item) => ({
      locationCode: item.location_code,
      locationName: item.location_name,
      locationType: item.location_type ?? '',
      displayLabel: formatLocationLabel(item.location_name),
    }))
}

/** Recherche insensible aux accents et à la casse dans la liste d'un pays. */
export async function searchSerpLocations(countryCode: string, query: string, limit = 20): Promise<SerpLocationResult[]> {
  const normalize = (value: string) =>
    value
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
  const needle = normalize(query.trim())
  if (!needle) return []
  const all = await fetchSerpLocationsForCountry(countryCode)
  const starts: SerpLocationResult[] = []
  const contains: SerpLocationResult[] = []
  for (const location of all) {
    const haystack = normalize(location.locationName)
    if (haystack.startsWith(needle)) starts.push(location)
    else if (haystack.includes(needle)) contains.push(location)
    if (starts.length >= limit) break
  }
  return [...starts, ...contains].slice(0, limit)
}
