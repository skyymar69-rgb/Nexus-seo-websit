---
name: rank-tracking
description: Configurer, lancer et lire le suivi de positions Nexus, national ou local par ville, avec estimation du coût avant chaque run.
---

# Suivi de positions Nexus

## Objectif

Mesurer où un site se positionne sur ses mots-clés, depuis le pays ou depuis une ville précise, et suivre l'évolution run après run.

## Entrées requises

- `websiteId`
- Mots-clés à suivre (ou reprendre ceux du skill `keyword-research`)
- Marché et, pour un suivi local, la ville

## Outils MCP

- `search_local_locations` : chaîne de localisation canonique d'une ville (gratuit).
- `configure_rank_tracker` : pays, langue, `locationName`, appareil, profondeur, actif ou non pour le cron (gratuit).
- `add_rank_tracking_keywords` / `remove_rank_tracking_keywords` (gratuit).
- `estimate_rank_tracker_cost` : borne haute avant de lancer (gratuit).
- `run_rank_tracker` : mesure en direct, enregistre un instantané (facturé).
- `get_rank_tracker` : configuration, dernier run, dernière position par mot-clé (gratuit).

## Déroulé

1. `get_rank_tracker` pour voir l'état. S'il n'y a pas de configuration, la poser avec `configure_rank_tracker` ; pour un commerce local, chercher la ville avec `search_local_locations` et passer `locationName`.
2. Ajouter les mots-clés (10 à 50 pour commencer). Éviter les termes de marque de tiers.
3. `estimate_rank_tracker_cost`, annoncer le montant, attendre l'accord de l'utilisateur au-delà de 0,50 $.
4. `run_rank_tracker`. Lire `results` : position, position précédente, URL classée.
5. Interpréter : mots-clés qui montent, qui descendent, absents (null) ; URL classée différente de la page prévue = cannibalisation à traiter.
6. Laisser `active` à vrai pour que le cron quotidien continue la mesure.

## Format de sortie

| Mot-clé | Position | Précédente | URL classée | Commentaire |
| ------- | -------- | ---------- | ----------- | ----------- |

Puis : coût réel du run (`meta.costUsd`), et les trois mouvements les plus significatifs.

## Garde-fous

- Une position est celle d'une SERP à un instant, depuis une localisation et un appareil donnés : toujours les rappeler.
- Une position nulle signifie « absent des N premiers résultats explorés », pas « non indexé ».
- Ne pas lancer deux runs dans la même heure.
