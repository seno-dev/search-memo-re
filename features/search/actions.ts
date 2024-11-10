'use server'

import { getCurrentUser } from '@/features/auth/actions'
import { $savedSearch } from '@/features/db'
import {
  updateSavedSearchQueriesSchema,
  updateSavedSearchTypeSchema,
} from '@/features/search/schema'
import { getDataOrThrow } from '@/lib/firebase.server/features/firestore'
import { z } from '@/lib/zod'

export async function getSavedSearch() {
  const { uid } = await getCurrentUser()

  return await getDataOrThrow($savedSearch(uid))
}

export async function updateSavedSearchQueries(
  input: z.input<typeof updateSavedSearchQueriesSchema>,
) {
  const { uid } = await getCurrentUser()

  const { success, data } = updateSavedSearchQueriesSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update(data)
}

export async function updateSavedSearchType(
  input: z.input<typeof updateSavedSearchTypeSchema>,
) {
  const { uid } = await getCurrentUser()

  const { success, data } = updateSavedSearchTypeSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update(data)
}
