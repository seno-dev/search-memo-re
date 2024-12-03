import { getCurrentUser } from '@/features/_http/api'
import { Query } from '@/features/models'
import { getSavedSearch, updateSavedSearchQueries } from '@/features/search/api'
import { QueryList } from '@/features/search/components/query-list'

async function updateAction(input: Query[]) {
  'use server'
  const { uid } = await getCurrentUser()
  await updateSavedSearchQueries(uid, input)
}

export async function QueryListContainer() {
  const { uid } = await getCurrentUser()
  const data = await getSavedSearch(uid)

  return <QueryList {...data} updateAction={updateAction} />
}
