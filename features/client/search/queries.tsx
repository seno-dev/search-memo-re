'use client'

import { Box, HStack, Stack, StackSeparator, Text } from '@chakra-ui/react'
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createId } from '@paralleldrive/cuid2'
import { useOptimistic, useState, useTransition } from 'react'
import { LuPlus } from 'react-icons/lu'

import { Alert } from '@/components/ui/snippets/alert'
import { Button } from '@/components/ui/snippets/button'
import { EmptyState } from '@/components/ui/snippets/empty-state'
import { toaster } from '@/components/ui/snippets/toaster'
import { QueryItem } from '@/features/client/search/query-item'
import { Query, SearchType } from '@/features/models'
import { SmartPointerSensor } from '@/utils/dnd'

interface Props {
  type: SearchType
  queries: Query[]
  updateAction: (queries: Query[]) => Promise<void>
}

const maxItems = 100

export function Queries({ type, queries, updateAction }: Props) {
  const sensors = useSensors(
    useSensor(SmartPointerSensor, {
      // activationConstraint: { distance: 5 },
    }),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: sortableKeyboardCoordinates,
    // }),
  )

  const [displayQueries, setOptimisticQueries] = useOptimistic(
    queries,
    (_, newQueries: Query[]) => newQueries,
  )
  const displayQueryIds = displayQueries.map(({ id }) => id)

  const [isPending, startTransition] = useTransition()

  function updateQueries(newQueries: Query[]) {
    startTransition(async () => {
      setOptimisticQueries(newQueries)
      try {
        await updateAction(newQueries)
      } catch (error) {
        toaster.error({ title: 'エラーが発生しました' })
      }
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

  function dragEnd({ active, over }: DragEndEvent) {
    if (over && active.id !== over.id) {
      const oldIndex = displayQueryIds.indexOf(active.id as string)
      const newIndex = displayQueryIds.indexOf(over.id as string)
      updateQueries(arrayMove(displayQueries, oldIndex, newIndex))
    }
  }

  return (
    <Stack gap={6}>
      <HStack gap={6}>
        <Stack gap={1}>
          <Text
            color='fg.muted'
            fontSize='sm'
          >{`${displayQueries.length} / ${maxItems}件`}</Text>

          <Text color='fg.subtle' fontSize='xs'>
            {'ドラッグ&ドロップで並べ替えできます'}
          </Text>
        </Stack>

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={dragEnd}
        >
          <SortableContext
            items={displayQueries}
            strategy={verticalListSortingStrategy}
          >
            <Stack as='ul' gap={0} separator={<StackSeparator />}>
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
          </SortableContext>
        </DndContext>
      ) : (
        <EmptyState
          title='検索ワードが登録されていません'
          description='[追加] を押して検索ワードを登録しましょう'
        />
      )}

      {1 <= displayQueries.length && displayQueries.length <= 3 ? (
        <Alert
          status='neutral'
          title='検索ワードをタップするとXアプリの検索画面が開きます'
          size='sm'
        />
      ) : null}
    </Stack>
  )
}
