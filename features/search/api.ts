import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidateTag,
} from 'next/cache'

import { $savedSearch } from '@/features/db'
import { updateSavedSearchQueriesSchema } from '@/features/search/schema'
import { getDataOrThrow } from '@/lib/firebase/server/utils/firestore'
import { z } from '@/lib/zod'

export async function getSavedSearch(uid: string) {
  'use cache'
  cacheTag(`savedSearch-${uid}`)
  cacheLife('weeks')

  return await getDataOrThrow($savedSearch(uid))
}

export async function updateSavedSearchQueries(
  uid: string,
  input: z.input<typeof updateSavedSearchQueriesSchema>,
) {
  const { success, data } = updateSavedSearchQueriesSchema.safeParse(input)
  if (!success) {
    throw new Error('Error')
  }

  await $savedSearch(uid).update({ queries: data })
  revalidateTag(`savedSearch-${uid}`)
}
