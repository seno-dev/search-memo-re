import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache'

import { $savedSearch } from '@/features/db'
import { auth } from '@/features/server/_http/auth'
import { getDataOrThrow } from '@/lib/firebase.server/features/firestore'

async function cachedSavedSearch(uid: string) {
  'use cache'
  cacheTag(`savedSearch-${uid}`)
  cacheLife('weeks')

  return await getDataOrThrow($savedSearch(uid))
}

export async function getSavedSearch() {
  const { uid } = await auth.getCurrentUser()

  return await cachedSavedSearch(uid)
}
