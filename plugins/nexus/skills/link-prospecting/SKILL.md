---
name: link-prospecting
description: Trouver des opportunités de liens avec Nexus à partir des domaines référents des concurrents et du profil du site.
---

# Prospection de liens Nexus

## Objectif

Lister des domaines qui lient déjà des concurrents comparables et qui pourraient lier le site, avec l'angle éditorial pour chacun.

## Entrées requises

- Domaine du site et 2 à 5 concurrents
- Facultatif : `websiteId` pour attribuer la dépense

## Outils MCP

- `get_backlinks_overview` : résumé et 50 meilleurs domaines référents (facturé, environ 0,02 à 0,05 $ par domaine).
- `get_backlinks_profile` : liste paginée des liens, un par domaine référent, avec ancre et rang (facturé, environ 0,02 $ par page).

## Déroulé

1. `get_backlinks_overview` sur le site pour connaître sa base et ses domaines référents actuels.
2. Même appel sur chaque concurrent. Construire l'ensemble des domaines référents des concurrents moins ceux du site : ce sont les candidats.
3. Classer les candidats par nombre de concurrents liés (un domaine qui lie trois concurrents est très probable) puis par rang.
4. `get_backlinks_profile` sur un ou deux concurrents pour voir les ancres et les pages liées : c'est l'angle (annuaire, article invité, mention presse, ressource).
5. Écarter les annuaires de faible qualité et les domaines au score de spam élevé.

## Format de sortie

| Domaine candidat | Concurrents liés | Rang | Type de lien observé | Angle proposé |
| ---------------- | ---------------- | ---- | -------------------- | ------------- |

Puis dix cibles prioritaires avec le contenu à proposer.

## Garde-fous

- Ne jamais recommander l'achat de liens ni les réseaux de sites.
- Un domaine référent d'un concurrent n'est pas forcément accessible : le qualifier de « candidat ».
- Le rang DataForSEO est une échelle propriétaire 0-100, pas une métrique Google.
