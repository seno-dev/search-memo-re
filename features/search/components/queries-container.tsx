import { getSavedSearch } from '@/features/search/actions'
import { Queries } from '@/features/search/components/queries'

export async function QueriesContainer() {
  const data = await getSavedSearch()

  return <Queries {...data} />
}
