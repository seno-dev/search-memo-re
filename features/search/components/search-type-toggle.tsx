import { Group } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { useOptimistic, useTransition } from 'react'

import { Button } from '@/components/ui/snippets/button'
import { SearchType } from '@/features/models'
import { updateSavedSearchType } from '@/features/search/actions'

interface Props {
  type: SearchType
}

export function SearchTypeToggle({ type }: Props) {
  const router = useRouter()

  const [displayType, addOptimistic] = useOptimistic(
    type,
    (_, newType: SearchType) => newType,
  )

  const [isPending, startTransition] = useTransition()

  function updateType(newType: SearchType) {
    startTransition(async () => {
      addOptimistic(newType)
      await updateSavedSearchType({ type: newType })
      router.refresh()
    })
  }

  return (
    <Group attached>
      <Button
        variant={displayType === 'default' ? 'surface' : 'outline'}
        onClick={() => updateType('default')}
      >
        {'話題のツイート'}
      </Button>

      <Button
        variant={displayType === 'live' ? 'surface' : 'outline'}
        onClick={() => updateType('live')}
      >
        {'最新'}
      </Button>
    </Group>
  )
}
