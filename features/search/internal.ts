import { getCurrentUser } from '@/features/auth/internal'
import { $savedSearch } from '@/features/db'
import { getDataOrThrow } from '@/lib/firebase.server/features/firestore'

export async function getSavedSearch() {
  const { uid } = await getCurrentUser()

  return await getDataOrThrow($savedSearch(uid))
}
