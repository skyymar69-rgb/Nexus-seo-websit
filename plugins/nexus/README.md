# Plugin Nexus SEO pour agents

Skills et serveur MCP pour utiliser les données Nexus depuis Claude Code,
Cursor ou tout agent compatible MCP. Structure dérivée du plugin OpenSEO (MIT).

## Installation

1. Générez une clé API dans Nexus : Réglages → Clé API et serveur MCP.
2. Exportez-la : `export NEXUS_API_KEY=nxs_…`
3. Ajoutez le serveur à votre `.mcp.json` (voir `mcp.json`) ou installez le plugin :

```sh
npx skills add skyymar69-rgb/Nexus-seo-websit --skill seo-audit
```

## Skills

| Skill | Usage |
|---|---|
| `seo-project-setup` | Créer le site dans Nexus, poser le marché et les premiers mots-clés suivis |
| `keyword-research` | Idées de mots-clés, métriques, regroupement par intention |
| `competitor-analysis` | Empreinte organique et mots-clés d'un concurrent, écarts |
| `seo-audit` | Crawl multipage et plan de correction priorisé |
| `rank-tracking` | Configurer et lire le suivi de positions, national ou local |
| `link-prospecting` | Domaines référents des concurrents, opportunités de liens |
| `local-seo` | Pack local, fiches Google Business, requêtes par ville |

## Ce que ce plugin ne fait pas

La visibilité dans les moteurs de réponse IA (taux de citation, intervalle de
confiance, preuve datée) relève de Synaptik (synaptik.kayzen-lyon.com), pas de
Nexus. Aucun outil ici ne renvoie de score de citation IA.
