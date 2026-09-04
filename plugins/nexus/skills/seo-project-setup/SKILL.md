---
name: seo-project-setup
description: Mettre en place un site dans Nexus — création, marché, premiers mots-clés suivis, premier audit — en une session courte.
---

# Mise en place d'un projet Nexus

## Objectif

Partir de zéro et arriver à un site enregistré, un marché posé, une dizaine de mots-clés suivis et un premier audit lu, sans dépense inutile.

## Entrées requises

- Domaine du site
- Activité et zone (nationale ou une ville)
- Facultatif : concurrents connus

## Outils MCP

`whoami`, `list_websites`, `create_website`, `configure_rank_tracker`, `search_local_locations`, `research_keywords`, `add_rank_tracking_keywords`, `estimate_rank_tracker_cost`, `run_site_audit`, `get_audit_issues`, `get_data_budget`.

## Déroulé

1. `whoami` : vérifier que DataForSEO est configuré et le budget restant.
2. `list_websites` ; `create_website` si le domaine n'y est pas.
3. Poser le marché avec `configure_rank_tracker` : France / fr par défaut ; pour une activité locale, `search_local_locations` puis `locationName`.
4. `research_keywords` avec 2 ou 3 départs tirés de l'activité ; retenir 10 à 20 mots-clés à intention claire.
5. `add_rank_tracking_keywords` avec cette sélection ; `estimate_rank_tracker_cost` et annoncer le coût d'un run. Ne pas lancer le run sans accord.
6. `run_site_audit` (gratuit) puis `get_audit_issues` avec `severity: critical` : les urgences techniques.
7. Résumer en une page : marché, mots-clés suivis, trois actions techniques, coût d'un run quotidien.

## Format de sortie

- Site et marché configurés
- Mots-clés suivis (liste)
- Trois constats critiques et leurs correctifs
- Coût estimé par run et par mois (30 runs)
- Skills à enchaîner : `keyword-research`, `seo-audit`, `rank-tracking`, `local-seo`

## Garde-fous

- Une seule recherche de mots-clés à la mise en place ; approfondir avec le skill dédié.
- Annoncer chaque coût avant l'appel facturé.
