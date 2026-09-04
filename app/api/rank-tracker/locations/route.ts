import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { describeDataforseoError, DataforseoError, getIsoCountryCode, isDataforseoConfigured } from '@/lib/dataforseo/index'
import { searchSerpLocations } from '@/lib/dataforseo/serp-locations'

/**
 * Recherche de localisations locales (villes, départements, régions) pour le
 * suivi de positions local. Gratuit chez DataForSEO, mis en cache 30 jours.
 *
 * GET /api/rank-tracker/locations?q=lyon&locationCode=2250
 */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  if (!isDataforseoConfigured()) return NextResponse.json({ locations: [], configured: false })

  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') ?? '').trim()
  const locationCode = Number(searchParams.get('locationCode') ?? '2250')
  if (query.length < 2) return NextResponse.json({ locations: [] })

  try {
    const locations = await searchSerpLocations(getIsoCountryCode(locationCode), query, 20)
    return NextResponse.json({ locations, configured: true })
  } catch (error) {
    if (error instanceof DataforseoError) {
      return NextResponse.json({ error: describeDataforseoError(error), code: error.code }, { status: 502 })
    }
    console.error('Locations search error:', error)
    return NextResponse.json({ error: 'Erreur lors de la recherche' }, { status: 500 })
  }
}
