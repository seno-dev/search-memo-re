import { querySchema, searchTypeSchema } from '@/features/models'
import { z } from '@/lib/zod'

export const updateSavedSearchQueriesSchema = z.object({
  queries: querySchema.array(),
})

export const updateSavedSearchTypeSchema = z.object({
  type: searchTypeSchema,
})
