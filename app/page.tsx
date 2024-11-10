'use client'

import { Stack } from '@chakra-ui/react'
import { useSearchParams } from 'next/navigation'

import { Alert } from '@/components/ui/snippets/alert'
import { Button } from '@/components/ui/snippets/button'
import { startSignIn } from '@/features/auth/actions'

export default function Page() {
  const searchParams = useSearchParams()
  const signInError = searchParams.get('sign-in-error')

  return (
    <Stack gap={6}>
      {signInError && (
        <Alert status='error' title='エラー'>
          {'ログイン中にエラーが発生しました。もう一度やり直してください。'}
        </Alert>
      )}
      <Button onClick={startSignIn}>{'Xでログイン'}</Button>
    </Stack>
  )
}
