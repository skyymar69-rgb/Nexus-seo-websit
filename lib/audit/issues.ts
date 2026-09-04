/**
 * Catalogue des constats d'audit multipage. Portage d'OpenSEO
 * (src/shared/audit-issues.ts, MIT), traduit et adapté.
 *
 * Partagé entre le moteur (page-reporters, multipage-checks), les routes et
 * le MCP. Chaque ligne `CrawlIssue` référence un type d'ici par identifiant.
 */

export type IssueSeverity = 'critical' | 'warning' | 'info'

export interface AuditIssueDescriptor {
  severity: IssueSeverity
  title: string
  explanation: string
  howToFix: string
}

export const AUDIT_ISSUE_TYPES = {
  'blocked-page': {
    severity: 'critical',
    title: 'Robot bloqué',
    explanation:
      'Le site a renvoyé un défi anti-robot ou un refus d’accès (défi Cloudflare, 403, 429) au lieu de la page. Nous le signalons tel quel plutôt que de faire passer la page pour cassée : cette page n’a pas pu être auditée, et d’autres robots (moteurs de recherche, assistants IA) peuvent rencontrer la même friction.',
    howToFix:
      'Si vous administrez ce site, autorisez le user-agent « NexusSEO-Audit » dans votre pare-feu ou votre protection anti-bot (sur Cloudflare : une règle WAF qui saute la protection quand le user-agent contient « NexusSEO-Audit »), puis relancez le crawl.',
  },
  'server-error': {
    severity: 'critical',
    title: 'Erreur serveur (5xx)',
    explanation:
      'La page renvoie une erreur serveur 5xx. Un moteur qui rencontre des erreurs serveur à répétition explore moins le site et peut retirer la page de l’index.',
    howToFix:
      'Consultez les journaux serveur pour cette URL et corrigez l’erreur. Si la page n’existe plus, renvoyez 404 ou 410, ou redirigez vers une page pertinente.',
  },
  'broken-internal-link': {
    severity: 'critical',
    title: 'Lien interne cassé',
    explanation:
      'Cette page pointe vers une URL interne qui renvoie une erreur (4xx/5xx). Les liens cassés gaspillent le budget d’exploration, perdent de la popularité interne et frustrent les visiteurs.',
    howToFix:
      'Corrigez le lien vers l’URL active, ou retirez-le. Si la cible a été déplacée, liez directement la nouvelle URL plutôt que de passer par une redirection.',
  },
  'missing-title': {
    severity: 'critical',
    title: 'Balise title manquante',
    explanation:
      'La page n’a pas de <title>. C’est le signal de pertinence le plus fort et le titre affiché dans les résultats ; sans lui, les moteurs en fabriquent un, généralement mauvais.',
    howToFix: 'Ajoutez un <title> unique et descriptif d’environ 50 à 60 caractères, contenant le sujet principal de la page.',
  },
  'broken-page': {
    severity: 'warning',
    title: 'Page en erreur (4xx)',
    explanation:
      'Cette URL renvoie une erreur client (404 par exemple). Si elle est référencée par le sitemap ou d’autres pages, les robots continuent d’y perdre des requêtes.',
    howToFix:
      'Si la page doit exister, restaurez-la. Si elle est volontairement supprimée, retirez-la du sitemap et des liens internes, et envisagez une redirection 301 vers la page la plus proche.',
  },
  'duplicate-title': {
    severity: 'warning',
    title: 'Title en double',
    explanation:
      'Plusieurs pages partagent le même title. Les moteurs s’en servent pour distinguer les pages ; des doublons les mettent en concurrence et font baisser le taux de clic.',
    howToFix:
      'Rédigez un title propre à chaque page. Pour les pages à gabarit, incluez l’attribut distinctif (nom, catégorie, ville) dans le gabarit.',
  },
  'duplicate-meta-description': {
    severity: 'warning',
    title: 'Meta description en double',
    explanation:
      'Plusieurs pages partagent la même meta description : les résultats affichent des extraits identiques et l’internaute ne peut pas les distinguer.',
    howToFix:
      'Rédigez une description propre à chaque page, ou supprimez celle qui est dupliquée : un extrait généré depuis le contenu vaut mieux qu’un doublon inexact.',
  },
  'duplicate-content': {
    severity: 'warning',
    title: 'Contenu en double',
    explanation:
      'Deux URL ou plus servent un texte visible strictement identique. Les moteurs n’en indexent qu’une et les signaux se répartissent entre les doublons.',
    howToFix:
      'Consolidez : choisissez l’URL canonique, ajoutez rel=canonical depuis les autres, et redirigez en 301 quand c’est possible (causes fréquentes : barre finale, paramètres, http/https, www).',
  },
  'missing-meta-description': {
    severity: 'warning',
    title: 'Meta description manquante',
    explanation:
      'La page n’a pas de meta description. Les moteurs assemblent un extrait depuis le texte, souvent moins convaincant, ce qui pénalise le taux de clic.',
    howToFix: 'Ajoutez une meta description d’environ 70 à 160 caractères qui résume la page et donne une raison de cliquer.',
  },
  'missing-h1': {
    severity: 'warning',
    title: 'H1 manquant',
    explanation:
      'La page n’a pas de H1. Il indique aux visiteurs et aux moteurs de quoi parle la page ; sans lui, la clarté thématique est plus faible.',
    howToFix: 'Ajoutez un H1 unique qui énonce le sujet principal, cohérent avec le title.',
  },
  'multiple-h1': {
    severity: 'warning',
    title: 'Plusieurs H1',
    explanation:
      'La page a plus d’un H1, ce qui dilue le signal de sujet principal et trahit souvent une erreur de gabarit (logo et titre tous deux en H1).',
    howToFix: 'Gardez un seul H1 pour le titre principal et rétrogradez les autres en H2/H3 (ou en éléments non-titres pour les logos).',
  },
  'redirect-chain': {
    severity: 'warning',
    title: 'Chaîne de redirections',
    explanation:
      'Atteindre la page finale demande deux redirections consécutives ou plus. Chaque saut ajoute de la latence, perd de la popularité et consomme du budget d’exploration ; les longues chaînes peuvent ne pas être suivies.',
    howToFix: 'Faites pointer la première URL (et les liens internes) directement vers la destination finale, avec au plus une redirection.',
  },
  'redirect-loop': {
    severity: 'warning',
    title: 'Boucle de redirections',
    explanation: 'Cette redirection finit par pointer sur elle-même : l’URL ne se résout jamais, navigateurs et robots abandonnent.',
    howToFix: 'Retracez les règles de redirection de cette URL et cassez le cycle pour aboutir à une vraie page 200.',
  },
  'canonical-conflict': {
    severity: 'warning',
    title: 'Signaux canoniques contradictoires',
    explanation:
      'La page déclare des URL canoniques différentes dans son <link rel=canonical> et dans son en-tête HTTP Link. En cas de conflit, les moteurs ignorent les deux et choisissent eux-mêmes.',
    howToFix: 'Choisissez une URL canonique et déclarez-la à un seul endroit (le <head> HTML le plus souvent) ; retirez ou alignez l’autre.',
  },
  'thin-content': {
    severity: 'warning',
    title: 'Contenu insuffisant',
    explanation:
      'La page a très peu de texte visible. Les pages pauvres se positionnent rarement, peuvent peser sur l’évaluation de qualité du site et, si le site s’affiche côté client, signalent un contenu invisible pour les robots sans JavaScript.',
    howToFix:
      'Enrichissez la page avec un contenu utile, passez-la en noindex, ou fusionnez-la dans une page plus forte. Si le contenu existe mais est rendu en JavaScript, servez-le dans le HTML initial.',
  },
  'images-missing-alt': {
    severity: 'warning',
    title: 'Images sans attribut alt',
    explanation:
      'Une ou plusieurs images n’ont pas d’attribut alt. C’est une exigence d’accessibilité et le principal moyen pour un moteur de comprendre une image.',
    howToFix: 'Ajoutez un alt descriptif aux images porteuses de sens ; réservez alt="" aux images purement décoratives.',
  },
  'orphan-page': {
    severity: 'warning',
    title: 'Page orpheline',
    explanation:
      'Aucune page explorée ne pointe vers cette URL : elle n’est découvrable que par le sitemap. Sans lien interne, elle reçoit peu d’attention des robots et aucune popularité interne.',
    howToFix: 'Ajoutez des liens vers cette page depuis des pages pertinentes (navigation, contenus liés, pages hub), ou retirez-la du sitemap si elle ne doit pas être indexée.',
  },
  'no-outgoing-links': {
    severity: 'warning',
    title: 'Page sans lien sortant',
    explanation:
      'La page ne contient aucun lien : une impasse. La popularité qui y entre s’y arrête, les robots n’ont nulle part où aller, le visiteur doit revenir en arrière.',
    howToFix: 'Ajoutez des liens vers des pages liées, la catégorie parente ou l’accueil. Si la navigation est rendue en JavaScript, assurez-vous qu’elle existe aussi dans le HTML initial.',
  },
  'title-too-long': {
    severity: 'info',
    title: 'Title trop long',
    explanation: 'Le title dépasse ~60 caractères : les résultats le tronqueront, parfois au milieu d’une phrase.',
    howToFix: 'Raccourcissez le title à environ 50–60 caractères, en plaçant les mots importants au début.',
  },
  'title-too-short': {
    severity: 'info',
    title: 'Title trop court',
    explanation: 'Le title fait moins de ~10 caractères, généralement trop générique pour décrire la page ou attirer le clic.',
    howToFix: 'Développez le title en une phrase descriptive (environ 30–60 caractères) qui dit ce que la page propose.',
  },
  'meta-description-too-long': {
    severity: 'info',
    title: 'Meta description trop longue',
    explanation: 'La meta description dépasse ~160 caractères : l’extrait sera tronqué.',
    howToFix: 'Ramenez la description à environ 70–160 caractères en gardant le message clé et l’appel à l’action.',
  },
  'meta-description-too-short': {
    severity: 'info',
    title: 'Meta description trop courte',
    explanation:
      'La meta description fait moins de ~70 caractères. Elle gaspille l’espace offert par les résultats, et les moteurs l’ignorent souvent au profit d’un extrait tiré de la page.',
    howToFix: 'Développez la description à environ 70–160 caractères qui résument la page et donnent une raison de cliquer.',
  },
  'heading-order-skip': {
    severity: 'info',
    title: 'Niveaux de titre sautés',
    explanation: 'La hiérarchie des titres saute des niveaux (un H4 directement après un H2), ce qui affaiblit la structure pour les outils d’accessibilité et l’analyse du contenu.',
    howToFix: 'Faites descendre les niveaux un par un (H1 → H2 → H3) sans en sauter.',
  },
  'slow-response': {
    severity: 'info',
    title: 'Réponse serveur lente',
    explanation: 'Le HTML a mis plus de 1,5 seconde à arriver. Un temps de premier octet élevé dégrade toutes les métriques de performance en aval et réduit le rythme d’exploration sur les grands sites.',
    howToFix: 'Examinez le temps serveur, la base de données et le cache pour cette route ; servir un HTML en cache ou généré statiquement règle généralement le problème.',
  },
  'noindex-page': {
    severity: 'info',
    title: 'Page en noindex',
    explanation: 'La page demande aux moteurs de ne pas l’indexer (meta robots ou en-tête X-Robots-Tag). C’est souvent voulu : un rappel, pas une erreur.',
    howToFix: 'Si la page doit se positionner, retirez la directive noindex. Si c’est intentionnel (admin, remerciement, filtres), rien à faire.',
  },
  'canonicalized-page': {
    severity: 'info',
    title: 'Canonique vers une autre URL',
    explanation: 'La page déclare une autre URL comme canonique, ce qui demande aux moteurs d’indexer celle-là. Normal quand c’est voulu ; un problème si cette page devait se positionner.',
    howToFix: 'Si cette page doit se positionner seule, pointez sa canonique vers elle-même. Sinon, rien à faire.',
  },
  'deep-page': {
    severity: 'info',
    title: 'Page profonde dans l’arborescence',
    explanation: 'La page est à 5 clics ou plus de l’accueil. Les pages profondes sont explorées moins souvent et reçoivent moins de popularité interne.',
    howToFix: 'Ajoutez des liens depuis des pages de niveau supérieur (hubs, catégories, navigation) pour raccourcir le chemin.',
  },
} as const satisfies Record<string, AuditIssueDescriptor>

export type AuditIssueType = keyof typeof AUDIT_ISSUE_TYPES

export const ISSUE_SEVERITY_ORDER: Record<IssueSeverity, number> = { critical: 0, warning: 1, info: 2 }

const issueRegistry: Record<string, AuditIssueDescriptor> = AUDIT_ISSUE_TYPES

export function getIssueDescriptor(issueType: string): AuditIssueDescriptor | null {
  return issueRegistry[issueType] ?? null
}

export function getIssueSeverity(issueType: string): IssueSeverity {
  return issueRegistry[issueType]?.severity ?? 'info'
}

export function listIssueTypes(): AuditIssueType[] {
  return Object.keys(AUDIT_ISSUE_TYPES) as AuditIssueType[]
}
