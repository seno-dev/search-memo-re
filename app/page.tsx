import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/snippets/button'
import { startSignIn } from '@/features/auth/actions'
import { SignInError } from '@/features/auth/components/sign-in-error'
import { redirectToHomeIfSignedIn } from '@/features/auth/internal'

export default async function Page() {
  await redirectToHomeIfSignedIn()

  return (
    <Stack gap={6}>
      <Suspense>
        <SignInError />
      </Suspense>

      <Button onClick={startSignIn}>{'Xでログイン'}</Button>
    </Stack>
  )
}
