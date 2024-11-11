'use client'

import { Box, HStack, Stack, StackSeparator, Text } from '@chakra-ui/react'
import { createId } from '@paralleldrive/cuid2'
import { useRouter } from 'next/navigation'
import { useOptimistic, useState, useTransition } from 'react'
import { LuPlus } from 'react-icons/lu'

import { Button } from '@/components/ui/snippets/button'
import { EmptyState } from '@/components/ui/snippets/empty-state'
import { Query, SearchType } from '@/features/models'
import { updateSavedSearchQueries } from '@/features/search/actions'
import { QueryItem } from '@/features/search/components/query-item'

interface Props {
  type: SearchType
  queries: Query[]
}

const maxItems = 100

export function Queries({ type, queries }: Props) {
  const router = useRouter()

  const [displayQueries, addOptimistic] = useOptimistic(
    queries,
    (_, newQueries: Query[]) => newQueries,
  )

  const [isPending, startTransition] = useTransition()

  function updateQueries(newQueries: Query[]) {
    startTransition(async () => {
      addOptimistic(newQueries)
      await updateSavedSearchQueries({ queries: newQueries })
      router.refresh()
    })
  }

  const [addedId, setAddedId] = useState<string | null>(null)

  function addItem() {
    const id = createId()
    setAddedId(id)
    updateQueries([{ id, text: '' }, ...displayQueries])
  }

  function updateItem(id: string, text: string) {
    updateQueries(
      displayQueries.map((query) =>
        query.id === id ? { ...query, text } : query,
      ),
    )
  }

  function deleteItem(id: string) {
    updateQueries(displayQueries.filter((query) => query.id !== id))
  }

  return (
    <Stack gap={6}>
      <HStack gap={6}>
        <Text
          color='fg.muted'
          fontSize='sm'
        >{`${displayQueries.length} / ${maxItems}件`}</Text>

        <Box flex={1} />

        <Button
          alignSelf='end'
          disabled={displayQueries.length >= maxItems}
          onClick={addItem}
        >
          <LuPlus />
          {'追加'}
        </Button>
      </HStack>

      {displayQueries.length ? (
        <Stack gap={0} separator={<StackSeparator />}>
          {displayQueries.map((query) => (
            <QueryItem
              key={query.id}
              type={type}
              defaultEdit={query.id === addedId}
              {...query}
              update={updateItem}
              delete={deleteItem}
            />
          ))}
        </Stack>
      ) : (
        <EmptyState
          title='検索ワードが登録されていません'
          description='[追加] を押して検索ワードを登録しましょう'
        />
      )}
    </Stack>
  )
}
