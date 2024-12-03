import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { QueryListContainer } from '@/features/search/components/query-list.container'

export default async function Page() {
  return (
    <Stack gap={6}>
      <Suspense>
        <QueryListContainer />
      </Suspense>
    </Stack>
  )
}
