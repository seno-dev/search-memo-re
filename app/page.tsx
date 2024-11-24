import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/snippets/button'
import { SignInError } from '@/features/client/auth/sign-in-error'
import { startSignInAction } from '@/features/server/_http/actions'
import { redirectToHomeIfSignedIn } from '@/features/server/_http/api'

export default async function Page() {
  await redirectToHomeIfSignedIn()

  return (
    <Stack gap={6}>
      <Suspense>
        <SignInError />
      </Suspense>

      <Button onClick={startSignInAction}>{'Xでログイン'}</Button>
    </Stack>
  )
}
