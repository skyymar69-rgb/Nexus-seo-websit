# Portage d'OpenSEO dans Nexus

> Décision D13 du dépôt Synaptik (4 septembre 2026) : les fonctionnalités
> d'[OpenSEO](https://github.com/every-app/open-seo) (MIT) sont portées dans
> Nexus, la plateforme SEO large de Kayzen, et non dans Synaptik, l'instrument
> de mesure de citation IA. L'analyse complète est dans
> `docs/portage-open-seo.md` du dépôt Synaptik ; ce document décrit ce qui a
> été porté ici, comment, et ce qui reste.

## Ce qui a été porté

| Lot | Contenu | Où |
|---|---|---|
| 1. Compteur DataForSEO | Plafond mensuel (`DATAFORSEO_MONTHLY_BUDGET_USD`, 50 $ par défaut) et journal append-only des appels avec leur coût réel en micro-dollars (table `DataProviderUsage`). Aucun appel payant ne contourne `meterDataforseoCall`. | `lib/dataforseo/budget.ts` |
| 2. Client DataForSEO | Un seul `fetch` authentifié (relances sur 5xx, délai partagé), enveloppe statut + coût, erreurs classifiées (`BUDGET_EXCEEDED`, `BILLING_ISSUE`, `UPSTREAM_UNAVAILABLE`…), sections Labs, Google Ads, SERP, backlinks, business, localisations. Marché par défaut : France / fr. L'ancienne façade `lib/dataforseo.ts` délègue au nouveau client. | `lib/dataforseo/**` |
| 3. Crawl multipage | Politique d'URL (SSRF, redirections d'origine), robots.txt et sitemaps comme semences, fenêtre de concurrence adaptative, analyseur HTML en flux (htmlparser2, pas de DOM), 27 types de constats en français avec explication et correctif, vérifications multipages (doublons, chaînes et boucles de redirections, liens internes cassés, pages orphelines). Persisté dans `CrawledPage` (colonnes ajoutées) et `CrawlIssue`. | `lib/audit/**`, `POST/GET /api/crawl` |
| 4. Suivi de positions local | Configuration par site (`RankTrackerConfig` : pays, langue, localisation canonique DataForSEO, appareil, profondeur), runs (`RankCheckRun`) avec coût réel, instantanés dans `KeywordTracking` (colonnes `runId`, `device`, `locationName`), recherche de villes, cron quotidien. | `lib/rank-tracking/service.ts`, `/api/rank-tracker`, `/api/rank-tracker/locations`, `/api/cron/rank-check` |
| 4 bis. Backlinks | Rafraîchissement depuis DataForSEO (résumé, 100 meilleurs liens, domaines référents), import dans `Backlink` (unicité `websiteId + sourceUrl + targetUrl`), instantané daté `BacklinkSnapshot`. | `lib/backlinks/service.ts`, `POST /api/backlinks/refresh`, `GET /api/backlinks` (champ `summary`) |
| 5. MCP + skills | Serveur MCP HTTP streamable sans session, authentifié par clé API utilisateur (hachage SHA-256 dans `User.apiKey`), 26 outils, plugin de skills pour Claude Code / Cursor. | `lib/mcp/**`, `/api/mcp`, `/api/settings/api-key`, `plugins/nexus/**` |

## Ce qui n'a pas été porté, et pourquoi

| Fonctionnalité OpenSEO | Décision |
|---|---|
| AI Visibility (mentions LLM via DataForSEO `llm_mentions`, `llm_responses`) | **Non porté.** Le lot 8 de Synaptik prévoit que le bloc de visibilité IA de Nexus consomme l'API Synaptik (mesure répétée, intervalle de confiance, disclaimer). Le serveur MCP le dit explicitement dans ses instructions. |
| SAM (agent de chat) et agent d'onboarding | **Différé.** Nexus a déjà `api/ai-advisor` (SDK OpenAI). À reprendre en dernier, pour la stratégie SEO classique uniquement. |
| Organisations multi-utilisateurs (Better-Auth) | **Différé.** Nexus est sur NextAuth 4 mono-utilisateur ; migrer l'authentification est un chantier à part. |
| Google Analytics 4, connexion Search Console par projet | **Différé.** `lib/search-console.ts` existe ; la connexion OAuth par site et les rapports GA4 viendront après les organisations. |
| File DataForSEO pour le suivi (task_post / task_get) | **Optimisation possible.** Le suivi utilise les appels live (résultat immédiat, environ 30 % plus cher). La file exige un état de tâche et un cron de collecte. |
| Lighthouse via DataForSEO | **Non porté.** Nexus utilise déjà l'API PageSpeed de Google (`api/performance`). |
| PostHog, Loops, Autumn | **Remplacés** par l'existant (pas de traceur ajouté, Resend, aucun paiement). |

## Mise en service

1. Variables : `DATAFORSEO_LOGIN` + `DATAFORSEO_PASSWORD` (ou `DATAFORSEO_API_KEY`), `DATAFORSEO_MONTHLY_BUDGET_USD`, `CRON_SECRET`.
2. Schéma : `npx prisma db push` (nouvelles tables `CrawlIssue`, `RankTrackerConfig`, `RankCheckRun`, `BacklinkSnapshot`, `DataProviderUsage` ; colonnes ajoutées à `CrawlSession`, `CrawledPage`, `KeywordTracking`, `Backlink`). La contrainte unique sur `Backlink` échoue si des doublons existent déjà : les dédoublonner avant.
3. Cron : `vercel.json` déclare `/api/cron/rank-check` à 5 h UTC.
4. MCP : Réglages → Clé API → configuration à coller dans `.mcp.json` :

```json
{
  "mcpServers": {
    "nexus": {
      "type": "http",
      "url": "https://nexus.kayzen-lyon.com/api/mcp",
      "headers": { "Authorization": "Bearer nxs_…" }
    }
  }
}
```

## Outils MCP

| Outil | Coût | Rôle |
|---|---|---|
| `whoami`, `get_data_budget`, `list_websites`, `create_website` | gratuit | compte, budget, sites |
| `research_keywords`, `get_keyword_metrics`, `get_serp_results`, `find_serp_competitors` | facturé | mots-clés et SERP |
| `get_domain_overview`, `get_ranked_keywords` | facturé | domaine |
| `get_backlinks_overview`, `get_backlinks_profile` | facturé | liens |
| `run_site_audit`, `get_audit_issues`, `get_audit_pages` | gratuit | audit multipage |
| `get_rank_tracker`, `configure_rank_tracker`, `add_rank_tracking_keywords`, `remove_rank_tracking_keywords`, `estimate_rank_tracker_cost`, `run_rank_tracker` | run facturé | suivi de positions |
| `search_local_locations`, `get_local_serp_results`, `search_local_businesses`, `get_business_profile`, `get_google_business_questions` | facturé sauf localisations | SEO local |

## Limites connues

- Le compteur lit le solde puis écrit sans transaction sérialisable : deux appels simultanés près du plafond peuvent passer tous les deux. C'est un garde-fou de dépense, pas une facturation client.
- Le crawl tient dans une requête (60 s max sur Vercel, budget de 45 s, 50 pages). Un site plus grand est exploré partiellement et le résultat le dit (`truncated`).
- La détection de blocage (WAF) repose sur les codes 403/429/503 et l'en-tête serveur ; un blocage silencieux en 200 n'est pas vu.
- Les tests unitaires couvrent les briques pures (enveloppe, budget, analyseur, vérifications multipages, fenêtre, résultats de position, aides MCP). Les routes et le crawler complet ne sont pas testés hors réseau.

## Licence

Code dérivé d'OpenSEO sous licence MIT, notice conservée dans `THIRD_PARTY_NOTICES.md`.
