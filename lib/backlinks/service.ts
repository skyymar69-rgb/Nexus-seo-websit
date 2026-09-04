/**
 * Profil de liens (portage OpenSEO) : rafraîchissement depuis DataForSEO,
 * import dans `Backlink`, instantané daté dans `BacklinkSnapshot`.
 */
import { prisma } from '@/lib/prisma'
import { createDataforseoClient } from '@/lib/dataforseo/client'
import { normalizeBacklinksTarget, type BacklinksSummaryItem, type ReferringDomainItem } from '@/lib/dataforseo/backlinks'
import type { UsageContext } from '@/lib/dataforseo/budget'

const IMPORT_LIMIT = 100

function parseDate(value: string | null | undefined): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export interface BacklinksRefreshResult {
  target: string
  summary: {
    backlinks: number
    referringDomains: number
    referringPages: number | null
    rank: number | null
    newBacklinks: number | null
    lostBacklinks: number | null
    newReferringDomains: number | null
    lostReferringDomains: number | null
    spamScore: number | null
  }
  imported: number
  referringDomains: Array<{ domain: string; backlinks: number | null; referringPages: number | null; rank: number | null; spamScore: number | null }>
  costUsd: number
}

export function shapeSummary(summary: BacklinksSummaryItem): BacklinksRefreshResult['summary'] {
  return {
    backlinks: summary.backlinks ?? 0,
    referringDomains: summary.referring_domains ?? 0,
    referringPages: summary.referring_pages ?? null,
    rank: summary.rank ?? null,
    newBacklinks: summary.new_backlinks ?? null,
    lostBacklinks: summary.lost_backlinks ?? null,
    newReferringDomains: summary.new_referring_domains ?? summary.new_reffering_domains ?? null,
    lostReferringDomains: summary.lost_referring_domains ?? summary.lost_reffering_domains ?? null,
    spamScore: summary.info?.target_spam_score ?? summary.backlinks_spam_score ?? null,
  }
}

export function shapeReferringDomains(items: ReferringDomainItem[]): BacklinksRefreshResult['referringDomains'] {
  return items
    .filter((item) => item.domain)
    .map((item) => ({
      domain: item.domain!,
      backlinks: item.backlinks ?? null,
      referringPages: item.referring_pages ?? null,
      rank: item.rank ?? null,
      spamScore: item.backlinks_spam_score ?? null,
    }))
}

export async function refreshBacklinks(input: {
  websiteId: string
  userId?: string | null
  hideSpam?: boolean
}): Promise<BacklinksRefreshResult> {
  const website = await prisma.website.findUnique({ where: { id: input.websiteId }, select: { id: true, domain: true } })
  if (!website) throw new Error('Site introuvable')
  const target = normalizeBacklinksTarget(website.domain)

  let costMicros = 0
  const context: UsageContext = {
    userId: input.userId ?? null,
    websiteId: website.id,
    onCost: (micros) => {
      costMicros += micros
    },
  }
  const client = createDataforseoClient(context)
  const hideSpam = input.hideSpam ?? true

  const [summary, rows, referring] = await Promise.all([
    client.backlinks.summary({ target }),
    client.backlinks.rows({ target, limit: IMPORT_LIMIT, hideSpam }),
    client.backlinks.referringDomains({ target, limit: IMPORT_LIMIT, hideSpam }),
  ])

  let imported = 0
  for (const row of rows.items) {
    if (!row.url_from || !row.url_to) continue
    const sourceDomain = row.domain_from ?? new URL(row.url_from).hostname
    const status = row.is_lost ? 'lost' : row.is_broken ? 'broken' : 'active'
    await prisma.backlink.upsert({
      where: { websiteId_sourceUrl_targetUrl: { websiteId: website.id, sourceUrl: row.url_from, targetUrl: row.url_to } },
      create: {
        websiteId: website.id,
        sourceUrl: row.url_from,
        sourceDomain,
        targetUrl: row.url_to,
        anchorText: row.anchor ?? null,
        da: row.domain_from_rank ?? null,
        dr: row.page_from_rank ?? null,
        linkType: row.dofollow === false ? 'nofollow' : 'dofollow',
        status,
        spamScore: row.backlink_spam_score ?? null,
        firstSeen: parseDate(row.first_seen),
        lastChecked: new Date(),
      },
      update: {
        anchorText: row.anchor ?? null,
        da: row.domain_from_rank ?? null,
        dr: row.page_from_rank ?? null,
        linkType: row.dofollow === false ? 'nofollow' : 'dofollow',
        status,
        spamScore: row.backlink_spam_score ?? null,
        lastChecked: new Date(),
      },
    })
    imported += 1
  }

  const shaped = shapeSummary(summary)
  await prisma.backlinkSnapshot.create({ data: { websiteId: website.id, ...shaped } })

  return {
    target,
    summary: shaped,
    imported,
    referringDomains: shapeReferringDomains(referring.items),
    costUsd: costMicros / 1_000_000,
  }
}

export async function getLatestSnapshot(websiteId: string) {
  return prisma.backlinkSnapshot.findFirst({ where: { websiteId }, orderBy: { createdAt: 'desc' } })
}

export async function getSnapshotHistory(websiteId: string, limit = 30) {
  return prisma.backlinkSnapshot.findMany({ where: { websiteId }, orderBy: { createdAt: 'desc' }, take: limit })
}
