import { z } from '@/lib/zod'

export interface Profile {
  id: string
  name: string
  username: string
  imageUrl: string
}

export interface User {}

export interface SavedSearch {
  type: SearchType
  queries: Query[]
}

export type SearchType = z.infer<typeof searchTypeSchema>

export const searchTypeSchema = z.enum(['default', 'live'])

export type Query = z.infer<typeof querySchema>

export const querySchema = z.object({
  id: z.string(),
  text: z.string(),
})
