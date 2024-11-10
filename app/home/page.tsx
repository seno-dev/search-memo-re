import { Stack } from '@chakra-ui/react'

import { QueriesContainer } from '@/features/search/components/queries-container'

export default async function Page() {
  return (
    <Stack gap={6}>
      <QueriesContainer />
    </Stack>
  )
}
