import { Editable, IconButton, useEditableContext } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { MouseEvent, useEffect, useState } from 'react'
import { LuCheck, LuPencil, LuTrash2, LuX } from 'react-icons/lu'

import { Query, SearchType } from '@/features/models'
import { withSearchParams } from '@/utils/url'

interface Props extends Query {
  type: SearchType
  defaultEdit: boolean
  update: (id: string, text: string) => void
  delete: (id: string) => void
}

export function QueryItem(props: Props) {
  const { type, defaultEdit, id, text, update, delete: delete_ } = props
  const [inputText, setInputText] = useState(text)

  useEffect(() => {
    setInputText(text)
  }, [text])

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const sortableProps = {
    ref: setNodeRef,
    style: {
      transform: CSS.Transform.toString(
        transform && { ...transform, scaleY: 1 },
      ),
      transition,
    },
    ...attributes,
    ...listeners,
    touchAction: 'none',
  }

  function onClick(e: MouseEvent<HTMLDivElement>) {
    if (
      e.target instanceof HTMLElement &&
      !e.target.closest('button, label, a, input, textarea')
    ) {
      location.href = withSearchParams('https://x.com/search', {
        q: text,
        src: 'spelling_expansion_revert_click',
        ...(type === 'default' ? {} : { f: type }),
      })
    }
  }

  return (
    <Editable.Root
      py={2}
      cursor='pointer'
      _hover={{ bg: 'bg.subtle' }}
      value={inputText}
      activationMode='dblclick'
      selectOnFocus={false}
      defaultEdit={defaultEdit}
      onValueChange={({ value }) => setInputText(value)}
      onValueCommit={({ value }) => update(id, value)}
      onClick={onClick}
      {...sortableProps}
    >
      <Inner {...props} />
    </Editable.Root>
  )
}

function Inner({ id, delete: delete_ }: Props) {
  const context = useEditableContext()

  function triggerDelete() {
    if (confirm('削除しますか？')) {
      delete_(id)
    }
  }

  return (
    <>
      <Editable.Preview
        flex={1}
        ml={-1}
        wordBreak='break-word'
        pointerEvents='none'
        tabIndex={-1}
      />
      <Editable.Input flex={1} ml={-1} as='textarea' {...{ rows: 3 }} />

      <Editable.Control>
        <Editable.EditTrigger asChild>
          <IconButton size='xs' variant='outline'>
            <LuPencil />
          </IconButton>
        </Editable.EditTrigger>

        <Editable.CancelTrigger asChild>
          <IconButton size='xs' variant='solid' colorPalette='red'>
            <LuX />
          </IconButton>
        </Editable.CancelTrigger>

        <Editable.SubmitTrigger asChild>
          <IconButton size='xs' variant='solid' colorPalette='green'>
            <LuCheck />
          </IconButton>
        </Editable.SubmitTrigger>
      </Editable.Control>

      {!context.editing && (
        <IconButton variant='outline' size='xs' onClick={triggerDelete}>
          <LuTrash2 />
        </IconButton>
      )}
    </>
  )
}
