# Notices de tiers

Nexus SEO contient du code dérivé de projets sous licence libre. Les notices
ci-dessous sont reproduites conformément à leurs licences.

## OpenSEO — every-app/open-seo

Dépôt : https://github.com/every-app/open-seo
Licence : MIT

Fichiers dérivés (portage adapté à Next.js 14, Prisma et NextAuth ; voir
`docs/PORTAGE_OPENSEO.md`) :

- `lib/dataforseo/**` (client, enveloppe de facturation, sections Labs, SERP,
  Google Ads, backlinks, business, localisations)
- `lib/audit/**` sauf `crawler.ts` et `persist.ts` (politique d'URL, fenêtre de
  concurrence, découverte robots/sitemap, analyseur HTML, rapporteurs de
  constats, vérifications multipages, catalogue de constats)
- `lib/mcp/helpers.ts`, `lib/mcp/server.ts` et la structure des outils de
  `lib/mcp/tools/**`
- `plugins/nexus/skills/**` (structure et méthode des skills)

```
MIT License

Copyright (c) 2026 Ben Senescu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
