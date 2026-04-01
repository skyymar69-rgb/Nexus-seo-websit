import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = (session.user as any).id

    const websites = await prisma.website.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        domain: true,
        name: true,
        verified: true,
        createdAt: true,
        audits: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { score: true, grade: true, createdAt: true },
        },
      },
    })

    const websitesWithLatestAudit = websites.map((website) => ({
      ...website,
      latestAudit: website.audits[0] || null,
      audits: undefined,
    }))

    return NextResponse.json(websitesWithLatestAudit)
  } catch (error) {
    console.error('Get websites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const userId = (session.user as any).id
    const body = await request.json()
    const { domain, name } = body

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json(
        { error: 'Domain is required and must be a string' },
        { status: 400 }
      )
    }

    // Check if website already exists for this user
    const existing = await prisma.website.findUnique({
      where: {
        domain_userId: {
          domain,
          userId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'This website is already in your account' },
        { status: 409 }
      )
    }

    const website = await prisma.website.create({
      data: {
        domain,
        name: name || domain,
        userId,
      },
    })

    return NextResponse.json(website, { status: 201 })
  } catch (error) {
    console.error('Create website error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
