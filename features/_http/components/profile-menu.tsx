'use client'

import { IconButton } from '@chakra-ui/react'

import { Avatar } from '@/components/ui/snippets/avatar'
import {
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
} from '@/components/ui/snippets/menu'
import { signOutAction } from '@/features/_http/actions'
import { Profile } from '@/features/models'

interface Props extends Profile {}

export function ProfileMenu({ imageUrl }: Props) {
  return (
    <MenuRoot
      onSelect={({ value }) => {
        if (value === 'sign-out') {
          if (confirm('ログアウトしますか？')) {
            void signOutAction()
          }
        }
      }}
    >
      <MenuTrigger asChild>
        <IconButton rounded='full' variant='outline'>
          <Avatar size='full' src={imageUrl} />
        </IconButton>
      </MenuTrigger>

      <MenuContent>
        <MenuItem value='sign-out'>{'ログアウト'}</MenuItem>
      </MenuContent>
    </MenuRoot>
  )
}
