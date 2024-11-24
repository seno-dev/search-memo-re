import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

import { getCurrentUser } from '@/features/_http/api'
import { $savedSearch } from '@/features/db'
import { getDataOrThrow } from '@/lib/firebase.server/features/firestore'

async function cachedSavedSearch(uid: string) {
  'use cache'
  cacheTag(`savedSearch-${uid}`)
  cacheLife('weeks')

  return await getDataOrThrow($savedSearch(uid))
}

export async function getSavedSearch() {
  const { uid } = await getCurrentUser()

  return await cachedSavedSearch(uid)
}
