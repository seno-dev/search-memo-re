'use client'

import { useSearchParams } from 'next/navigation'

import { Alert } from '@/components/ui/snippets/alert'

export function SignInError() {
  const searchParams = useSearchParams()
  const signInError = searchParams.get('sign-in-error')

  return signInError ? (
    <Alert status='error' title='エラー'>
      {'ログイン中にエラーが発生しました。もう一度やり直してください。'}
    </Alert>
  ) : null
}
