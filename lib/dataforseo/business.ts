/**
 * Business Data DataForSEO : fiches Google Business (annuaire, profil, questions
 * et réponses). Portage d'OpenSEO (MIT), limité aux endpoints live ; les
 * files d'avis (task_post / task_get) restent à porter si le besoin apparaît.
 */
import { z } from 'zod'
import { dataforseoGet, dataforseoPost } from './core'
import {
  assertOk,
  buildTaskBilling,
  isRecord,
  type DataforseoApiResponse,
  type DataforseoItemsTask,
} from './envelope'

export type BusinessListingItem = Record<string, unknown>

/** Coordonnée "lat,lng,rayon_m" ou code de localisation, jamais les deux. */
type BusinessLocationInput = {
  locationCoordinate?: string
  locationCode?: number
  languageCode: string
}

function locationParams(input: BusinessLocationInput) {
  return input.locationCoordinate
    ? { location_coordinate: input.locationCoordinate }
    : { location_code: input.locationCode }
}

export async function fetchBusinessListingsSearch(input: {
  categories?: string[]
  title?: string
  locationCoordinate: string
  isClaimed?: boolean
  filters?: unknown[]
  orderBy?: string[]
  limit: number
  offset?: number
}): Promise<DataforseoApiResponse<BusinessListingItem[]>> {
  const response = await dataforseoPost<DataforseoItemsTask<BusinessListingItem>>(
    '/v3/business_data/business_listings/search/live',
    [
      {
        categories: input.categories,
        title: input.title,
        location_coordinate: input.locationCoordinate,
        is_claimed: input.isClaimed,
        filters: input.filters,
        order_by: input.orderBy,
        limit: input.limit,
        offset: input.offset,
      },
    ],
  )
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return { data: task.result?.[0]?.items ?? [], billing: buildTaskBilling(task) }
}

const questionsResultSchema = z
  .object({
    items: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    items_without_answers: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
  })
  .passthrough()

function combinedQuestionItems(results: unknown): Record<string, unknown>[] {
  const list = Array.isArray(results) ? results : []
  return list.flatMap((result) => {
    const parsed = questionsResultSchema.safeParse(result ?? {})
    if (!parsed.success) return []
    return [...(parsed.data.items ?? []), ...(parsed.data.items_without_answers ?? [])]
  })
}

export async function fetchQuestionsAnswers(input: {
  keyword: string
  locationCoordinate: string
  languageCode: string
  depth: number
}): Promise<DataforseoApiResponse<Record<string, unknown>[]>> {
  const response = await dataforseoPost('/v3/business_data/google/questions_and_answers/live', [
    {
      keyword: input.keyword,
      location_coordinate: input.locationCoordinate,
      language_code: input.languageCode,
      depth: input.depth,
    },
  ])
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  return { data: combinedQuestionItems(task.result), billing: buildTaskBilling(task) }
}

export async function fetchMyBusinessInfo(
  input: { keyword: string } & BusinessLocationInput,
): Promise<DataforseoApiResponse<Record<string, unknown> | null>> {
  const response = await dataforseoPost<DataforseoItemsTask<unknown>>(
    '/v3/business_data/google/my_business_info/live',
    [{ keyword: input.keyword, ...locationParams(input), language_code: input.languageCode }],
  )
  // 40501 = résultat vide facturé : une entreprise sans fiche Google.
  const task = assertOk(response, { treatNoResultsAsEmpty: true })
  const entry = task.result?.[0]
  const item = entry?.items?.[0]
  if (!isRecord(item)) return { data: null, billing: buildTaskBilling(task) }
  if (item.check_url == null) item.check_url = entry?.check_url
  return { data: item, billing: buildTaskBilling(task) }
}

const businessCategorySchema = z
  .object({ category_name: z.string(), business_count: z.number().nullable().optional() })
  .passthrough()

/** Catégories d'annuaire les plus fournies. Gratuit chez DataForSEO. */
export async function fetchBusinessListingsCategories(): Promise<
  DataforseoApiResponse<Array<{ category: string; businessCount: number | null }>>
> {
  const response = await dataforseoGet('/v3/business_data/business_listings/categories')
  const task = assertOk(response)
  const rows = (task.result ?? []).flatMap((entry) => {
    const parsed = businessCategorySchema.safeParse(entry)
    if (!parsed.success) return []
    return [{ category: parsed.data.category_name, businessCount: parsed.data.business_count ?? null }]
  })
  return { data: rows, billing: buildTaskBilling(task) }
}
