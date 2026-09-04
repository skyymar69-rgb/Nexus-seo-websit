/**
 * Marchés (pays + langue) pris en charge et routage de la source de données
 * mots-clés. Portage d'OpenSEO (src/shared/keyword-locations.ts, MIT), réduit
 * aux marchés utiles à une plateforme française : la France par défaut, les
 * pays francophones, et les grands marchés européens et anglophones.
 *
 * DataForSEO Labs (difficulté, intention) couvre 94 pays ; les autres sont
 * servis par les endpoints Google Ads (volume, CPC, concurrence seulement).
 * Codes : https://api.dataforseo.com/v3/dataforseo_labs/locations_and_languages
 */

export const DEFAULT_LOCATION_CODE = 2250 // France
export const DEFAULT_LANGUAGE_CODE = 'fr'

export type KeywordDataProvider = 'labs' | 'google_ads'

export type LocationOption = {
  code: number
  label: string
  iso: string
  languageCode: string
  /** Pays non couvert par DataForSEO Labs : Google Ads seulement. */
  googleAdsOnly?: true
}

export const LOCATION_OPTIONS: readonly LocationOption[] = [
  { code: 2250, label: 'France', iso: 'FR', languageCode: 'fr' },
  { code: 2056, label: 'Belgique', iso: 'BE', languageCode: 'fr' },
  { code: 2756, label: 'Suisse', iso: 'CH', languageCode: 'fr' },
  { code: 2442, label: 'Luxembourg', iso: 'LU', languageCode: 'fr' },
  { code: 2124, label: 'Canada', iso: 'CA', languageCode: 'fr' },
  { code: 2504, label: 'Maroc', iso: 'MA', languageCode: 'fr' },
  { code: 2012, label: 'Algérie', iso: 'DZ', languageCode: 'fr' },
  { code: 2788, label: 'Tunisie', iso: 'TN', languageCode: 'fr' },
  { code: 2686, label: 'Sénégal', iso: 'SN', languageCode: 'fr' },
  { code: 2384, label: 'Côte d’Ivoire', iso: 'CI', languageCode: 'fr' },
  { code: 2492, label: 'Monaco', iso: 'MC', languageCode: 'fr', googleAdsOnly: true },
  { code: 2276, label: 'Allemagne', iso: 'DE', languageCode: 'de' },
  { code: 2724, label: 'Espagne', iso: 'ES', languageCode: 'es' },
  { code: 2380, label: 'Italie', iso: 'IT', languageCode: 'it' },
  { code: 2620, label: 'Portugal', iso: 'PT', languageCode: 'pt' },
  { code: 2528, label: 'Pays-Bas', iso: 'NL', languageCode: 'nl' },
  { code: 2826, label: 'Royaume-Uni', iso: 'GB', languageCode: 'en' },
  { code: 2372, label: 'Irlande', iso: 'IE', languageCode: 'en' },
  { code: 2840, label: 'États-Unis', iso: 'US', languageCode: 'en' },
  { code: 2036, label: 'Australie', iso: 'AU', languageCode: 'en' },
]

const SUPPORTED_LANGUAGE_CODES = new Set(['fr', 'en', 'de', 'es', 'it', 'pt', 'nl'])

export function isSupportedLanguageCode(code: string): boolean {
  return SUPPORTED_LANGUAGE_CODES.has(code)
}

export function getLocationOption(locationCode: number): LocationOption | undefined {
  return LOCATION_OPTIONS.find((option) => option.code === locationCode)
}

export function isSupportedLocationCode(locationCode: number): boolean {
  return getLocationOption(locationCode) !== undefined
}

export function getKeywordDataProvider(locationCode: number): KeywordDataProvider {
  return getLocationOption(locationCode)?.googleAdsOnly ? 'google_ads' : 'labs'
}

/** Code ISO 3166-1 alpha-2 en minuscules, format exigé par les endpoints par pays. */
export function getIsoCountryCode(locationCode: number): string {
  return (getLocationOption(locationCode)?.iso ?? 'FR').toLowerCase()
}

/**
 * Forme lisible d'un location_name canonique DataForSEO, dont les segments
 * sont séparés par des virgules à l'espacement irrégulier
 * ("Lyon,Auvergne-Rhone-Alpes,France"). `maxSegments` tronque pour l'affichage.
 */
export function formatLocationLabel(locationName: string, maxSegments?: number): string {
  const parts = locationName.split(',').map((part) => part.trim())
  return (maxSegments ? parts.slice(0, maxSegments) : parts).join(', ')
}

/** Résout (pays, langue) à partir d'une saisie partielle et du marché par défaut. */
export function resolveMarket(input: { locationCode?: number; languageCode?: string }): {
  locationCode: number
  languageCode: string
} {
  const locationCode = input.locationCode ?? DEFAULT_LOCATION_CODE
  const languageCode =
    input.languageCode ?? getLocationOption(locationCode)?.languageCode ?? DEFAULT_LANGUAGE_CODE
  return { locationCode, languageCode }
}
