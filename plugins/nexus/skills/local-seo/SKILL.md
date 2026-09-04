---
name: local-seo
description: Analyser la visibilité locale d'un établissement avec Nexus — pack local, fiche Google Business, concurrents de proximité, requêtes par ville.
---

# SEO local Nexus

## Objectif

Répondre à : « Quand quelqu'un cherche ce service dans cette ville, qui apparaît dans le pack local et sur Maps, et comment cet établissement peut y entrer ? »

## Entrées requises

- Nom de l'établissement et ville (ou coordonnée "lat,lng,rayon_m")
- Service principal (ex. plombier, restaurant, avocat)
- `websiteId` facultatif

## Outils MCP

- `search_local_locations` : chaîne canonique de la ville (gratuit).
- `get_local_serp_results` : Google Maps ou Local Finder pour une requête depuis la ville (facturé, environ 0,005 $).
- `search_local_businesses` : annuaire d'établissements autour d'une coordonnée, par catégorie (facturé).
- `get_business_profile` : fiche Google Business de l'établissement (facturé).
- `get_google_business_questions` : questions posées sur la fiche (facturé).
- `get_keyword_metrics` avec `locationName` : volume local des requêtes.
- `configure_rank_tracker` + `run_rank_tracker` avec `locationName` : suivi organique depuis la ville.

## Déroulé

1. `search_local_locations` pour la ville ; garder `locationName`.
2. `get_business_profile` sur l'établissement : catégorie, note, nombre d'avis, revendication, site.
3. `get_local_serp_results` sur 3 à 5 requêtes « service + ville » et « service près de moi » : relever les trois établissements du pack et leurs notes, avis, catégories.
4. `search_local_businesses` avec la catégorie et la coordonnée pour mesurer la densité concurrentielle.
5. `get_keyword_metrics` avec `locationName` sur les requêtes retenues pour le volume local réel.
6. Comparer la fiche de l'établissement aux fiches du pack : catégorie principale, nombre d'avis, note, complétude, cohérence nom-adresse-téléphone avec le site.

## Format de sortie

Trois lignes : position actuelle dans le pack local, écart principal avec les trois du pack, action prioritaire.

| Requête | Volume local | Pack local (1-3) | Notes / avis | Établissement présent ? |
| ------- | ------------ | ---------------- | ------------ | ----------------------- |

Puis la liste d'actions sur la fiche (catégorie, avis, photos, questions) et sur le site (page ville, NAP cohérent).

## Garde-fous

- Le pack local dépend de la position exacte de l'internaute : les résultats depuis une ville sont une vue, pas la vue.
- Ne pas promettre une entrée dans le pack.
- La visibilité dans les assistants IA pour ces requêtes relève de Synaptik.
