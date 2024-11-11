import { Queries } from '@/features/search/components/queries'
import { getSavedSearch } from '@/features/search/internal'

export async function QueriesContainer() {
  const data = await getSavedSearch()

  return <Queries {...data} />
}
