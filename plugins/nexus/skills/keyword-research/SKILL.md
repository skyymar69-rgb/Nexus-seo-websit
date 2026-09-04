---
name: keyword-research
description: Trouver et qualifier des mots-clés (volume, difficulté, intention) avec Nexus, puis les regrouper en thèmes actionnables.
---

# Recherche de mots-clés Nexus

## Objectif

Produire une liste de mots-clés qualifiés et regroupés par intention, prête à nourrir un plan de contenu ou un suivi de positions.

## Entrées requises

- 1 à 5 mots-clés de départ, ou un sujet
- Marché : `locationCode` (2250 France par défaut) et `languageCode` (fr)
- Facultatif : `locationName` pour un volume local (obtenir avec `search_local_locations`)

## Outils MCP

- `research_keywords` : idées pour chaque mot-clé de départ (facturé, environ 0,01 à 0,05 $ par départ).
- `get_keyword_metrics` : métriques pour une liste connue, jusqu'à 200 (facturé, environ 0,01 $ par lot de 100). Avec `locationName`, volume local et difficulté nationale.
- `get_serp_results` : composition de la SERP d'une requête pour valider l'intention (facturé, environ 0,005 $ par requête).
- `find_serp_competitors` : domaines récurrents sur le jeu de mots-clés.
- `get_data_budget` : vérifier le budget avant un lot important.

## Déroulé

1. `get_data_budget` si le lot dépasse 5 mots-clés de départ ou 100 mots-clés.
2. `research_keywords` avec 3 à 5 départs variés (générique, longue traîne, commercial).
3. Dédoublonner, retirer les hors-sujet et les marques tierces, puis `get_keyword_metrics` sur la liste retenue si elle vient de plusieurs sources.
4. Regrouper par intention (informationnelle, commerciale, transactionnelle, locale) et par thème : un groupe = une page cible.
5. `get_serp_results` sur 3 à 5 requêtes représentatives pour vérifier le format qui se positionne (guide, comparatif, page service, fiche locale).
6. Proposer les mots-clés à suivre avec `add_rank_tracking_keywords` (skill `rank-tracking`).

## Format de sortie

| Groupe | Intention | Mot-clé principal | Volume | KD | Mots-clés secondaires | Page cible |
| ------ | --------- | ----------------- | ------ | -- | --------------------- | ---------- |

Puis : les opportunités faciles (volume correct, KD faible), les mots-clés à écarter et pourquoi, et le coût réel du lot (`meta.costUsd` des réponses).

## Garde-fous

- Les volumes sont des estimations mensuelles Google Ads ; les qualifier de « directionnels ».
- Un marché servi par Google Ads seulement (Monaco) n'a ni difficulté ni intention : le dire.
- Ne pas relancer une recherche identique dans la même session.
