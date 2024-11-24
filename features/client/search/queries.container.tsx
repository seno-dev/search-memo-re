import { Queries } from '@/features/client/search/queries'
import { updateSavedSearchQueries } from '@/features/server/search/actions'
import { getSavedSearch } from '@/features/server/search/api'

export async function QueriesContainer() {
  const data = await getSavedSearch()

  return <Queries {...data} updateAction={updateSavedSearchQueries} />
}
