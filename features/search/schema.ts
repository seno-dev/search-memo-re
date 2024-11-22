import { querySchema, searchTypeSchema } from '@/features/models'

export const updateSavedSearchQueriesSchema = querySchema.array()

export const updateSavedSearchTypeSchema = searchTypeSchema
