---
name: seo-audit
description: Auditer un site avec le crawl multipage Nexus et produire un plan de correction priorisé par gravité.
---

# Audit de site Nexus

## Objectif

Répondre à : « Qu'est-ce qui, techniquement, empêche ce site d'être bien exploré, indexé et compris ? » et livrer une liste d'actions ordonnée, avec pour chaque constat le correctif fourni par l'outil.

## Entrées requises

- `websiteId` (obtenir avec `list_websites`, créer avec `create_website`)
- URL de départ facultative (par défaut la racine du domaine)
- Budget de pages (20 par défaut, 50 max)

## Outils MCP

- `run_site_audit` : lance le crawl (gratuit, moins d'une minute). Respecte robots.txt ; les pages bloquées par un pare-feu sont marquées « bloquées », pas cassées.
- `get_audit_issues` : constats triés par gravité, chacun avec `explanation` et `howToFix`. Filtrer par `severity` ou `issueType`.
- `get_audit_pages` : pages avec statut, indexabilité, profondeur, nombre de mots. Filtrer par `statusCode`, `fetchClass`, `urlContains`.

## Déroulé

1. `list_websites` ; si le site n'existe pas, `create_website`.
2. `run_site_audit` avec `maxPages` 20. Si `truncated` est vrai et que l'utilisateur veut la couverture, relancer à 50.
3. Si des pages sont `blocked`, le dire en premier : l'audit est partiel et les moteurs peuvent subir la même friction. Proposer d'autoriser le user-agent `NexusSEO-Audit`.
4. `get_audit_issues` sans filtre pour le résumé, puis `severity: critical` pour le détail des urgences.
5. Regrouper par cause probable (gabarit, CMS, redirections de migration) plutôt que par page : dix titles manquants sur un même gabarit sont une seule action.
6. `get_audit_pages` avec `statusCode` 404 ou `fetchClass` error pour lister ce qu'il faut rediriger ou restaurer.

## Format de sortie

Commencer par trois lignes : pages explorées et couverture, nombre de constats critiques, action la plus rentable.

Puis un tableau :

| Priorité | Constat | Pages concernées | Correctif | Effort |
| -------- | ------- | ---------------- | --------- | ------ |

Terminer par les constats `info` en une ligne chacun, et par ce que l'audit ne voit pas (rendu JavaScript, Core Web Vitals : utiliser l'outil de performance de Nexus).

## Garde-fous

- Ne pas inventer de cause : le constat dit ce qui est observé, l'hypothèse doit être annoncée comme telle.
- Ne pas promettre un gain de position : un audit corrige des freins, il ne garantit pas un classement.
- Un audit tronqué se présente comme un échantillon.
- Pour la visibilité dans les moteurs IA, renvoyer vers Synaptik, pas vers cet audit.
