/**
 * Erreurs du client DataForSEO.
 *
 * Portage d'OpenSEO (every-app/open-seo, MIT) — voir THIRD_PARTY_NOTICES.md.
 * Vocabulaire fermé de codes pour que les routes et le MCP puissent choisir un
 * message utilisateur sans lire le texte brut du fournisseur.
 */

export type DataforseoErrorCode =
  | 'NOT_CONFIGURED'      // identifiants absents
  | 'BUDGET_EXCEEDED'     // plafond mensuel atteint (lib/dataforseo/budget.ts)
  | 'DATAFORSEO_AUTH_FAILED'
  | 'BILLING_ISSUE'       // solde ou accès à une API DataForSEO refusé
  | 'RATE_LIMITED'
  | 'UPSTREAM_UNAVAILABLE'
  | 'VALIDATION_ERROR'    // requête mal formée (Invalid Field), non facturée
  | 'INTERNAL_ERROR'

export class DataforseoError extends Error {
  constructor(
    public readonly code: DataforseoErrorCode,
    message?: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message ?? code)
    this.name = 'DataforseoError'
  }
}

/** Message utilisateur en français, sans détail technique. */
export function describeDataforseoError(error: unknown): string {
  if (!(error instanceof DataforseoError)) {
    return 'Erreur inattendue du fournisseur de données.'
  }
  switch (error.code) {
    case 'NOT_CONFIGURED':
      return 'DataForSEO n’est pas configuré (DATAFORSEO_LOGIN / DATAFORSEO_PASSWORD).'
    case 'BUDGET_EXCEEDED':
      return 'Le budget mensuel DataForSEO est atteint. Réessayez le mois prochain ou relevez DATAFORSEO_MONTHLY_BUDGET_USD.'
    case 'DATAFORSEO_AUTH_FAILED':
      return 'Identifiants DataForSEO refusés.'
    case 'BILLING_ISSUE':
      return 'Le compte DataForSEO a un problème de solde ou d’accès à cette API.'
    case 'RATE_LIMITED':
      return 'DataForSEO limite le débit. Réessayez dans quelques secondes.'
    case 'UPSTREAM_UNAVAILABLE':
      return 'DataForSEO est temporairement indisponible. Réessayez dans quelques minutes.'
    case 'VALIDATION_ERROR':
      return `Requête refusée par DataForSEO : ${error.message}`
    default:
      return 'Erreur DataForSEO.'
  }
}
