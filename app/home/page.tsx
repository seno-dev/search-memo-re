import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { QueriesContainer } from '@/features/client/search/queries.container'

export default async function Page() {
  return (
    <Stack gap={6}>
      <Suspense>
        <QueriesContainer />
      </Suspense>
    </Stack>
  )
}
