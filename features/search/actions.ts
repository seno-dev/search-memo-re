'use server'

import { revalidateTag } from 'next/cache'

import { getCurrentUser } from '@/features/_http/api'
import { $savedSearch } from '@/features/db'
import {
  updateSavedSearchQueriesSchema,
  updateSavedSearchTypeSchema,
} from '@/features/search/schema'
import { z } from '@/lib/zod'

export async function updateSavedSearchQueries(
  input: z.input<typeof updateSavedSearchQueriesSchema>,
) {
  const { uid } = await getCurrentUser()

  const { success, data } = updateSavedSearchQueriesSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update({ queries: data })
  revalidateTag(`savedSearch-${uid}`)
}

export async function updateSavedSearchType(
  input: z.input<typeof updateSavedSearchTypeSchema>,
) {
  const { uid } = await getCurrentUser()

  const { success, data } = updateSavedSearchTypeSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update({ type: data })
  revalidateTag(`savedSearch-${uid}`)
}
