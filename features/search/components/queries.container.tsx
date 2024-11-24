import { updateSavedSearchQueries } from '@/features/search/actions'
import { getSavedSearch } from '@/features/search/api'
import { Queries } from '@/features/search/components/queries'

export async function QueriesContainer() {
  const data = await getSavedSearch()

  return <Queries {...data} updateAction={updateSavedSearchQueries} />
}
