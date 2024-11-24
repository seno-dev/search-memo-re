'use server'

import { revalidateTag } from 'next/cache'

import { $savedSearch } from '@/features/db'
import { auth } from '@/features/server/_http/auth'
import {
  updateSavedSearchQueriesSchema,
  updateSavedSearchTypeSchema,
} from '@/features/server/search/schema'
import { z } from '@/lib/zod'

export async function updateSavedSearchQueries(
  input: z.input<typeof updateSavedSearchQueriesSchema>,
) {
  const { uid } = await auth.getCurrentUser()

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
  const { uid } = await auth.getCurrentUser()

  const { success, data } = updateSavedSearchTypeSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update({ type: data })
  revalidateTag(`savedSearch-${uid}`)
}
