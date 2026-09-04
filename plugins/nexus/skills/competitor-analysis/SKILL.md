---
name: competitor-analysis
description: Analyser un concurrent avec Nexus — empreinte organique, mots-clés positionnés, pages fortes, profil de liens — et identifier les écarts exploitables.
---

# Analyse concurrentielle Nexus

## Objectif

Répondre à : « Sur quoi ce concurrent se positionne, avec quelles pages, et qu'est-ce que nous pourrions prendre ? »

## Entrées requises

- Domaine du concurrent (nu, sans protocole)
- Facultatif : domaine de l'utilisateur pour la comparaison, marché (`locationCode`, `languageCode`)

## Outils MCP

- `get_domain_overview` : nombre de mots-clés positionnés, trafic estimé, 20 meilleurs mots-clés (facturé, environ 0,02 $).
- `get_ranked_keywords` : liste paginée avec position, URL, volume, KD, intention (facturé, environ 0,01 $ + 0,0001 $ par ligne).
- `find_serp_competitors` : autres domaines sur le même jeu de mots-clés.
- `get_backlinks_overview` : autorité et domaines référents (facturé, environ 0,02 à 0,05 $).
- `get_serp_results` : vérifier une SERP précise.

## Déroulé

1. `get_domain_overview` sur le concurrent, puis sur le domaine de l'utilisateur si fourni : c'est la taille relative.
2. `get_ranked_keywords` limite 200 sur le concurrent. Regrouper les mots-clés par URL : les 10 URL qui portent le plus de trafic estimé sont ses pages fortes.
3. Si le domaine de l'utilisateur est connu, `get_ranked_keywords` sur lui aussi et calculer l'écart : mots-clés où le concurrent est dans le top 10 et l'utilisateur absent ou au-delà de la position 20.
4. `get_backlinks_overview` sur les deux pour situer l'écart d'autorité.
5. Sélectionner 10 à 20 mots-clés d'écart à difficulté raisonnable et proposer une page cible par groupe.

## Format de sortie

Trois lignes d'abord : taille relative, forces principales du concurrent, écart le plus exploitable.

| Page forte du concurrent | Mots-clés portés | Trafic estimé | Notre équivalent | Action |
| ------------------------ | ---------------- | ------------- | ---------------- | ------ |

Puis le tableau d'écart de mots-clés et les observations sur les liens.

## Garde-fous

- Les trafics sont des estimations ; ne jamais les présenter comme des mesures.
- Distinguer concurrent SEO (qui se positionne) et concurrent commercial.
- Un écart de liens ne se comble pas en achetant des liens : proposer des cibles éditoriales (skill `link-prospecting`).
