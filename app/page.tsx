import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/snippets/button'
import { startSignInAction } from '@/features/_http/actions'
import { redirectToHomeIfSignedIn } from '@/features/_http/api'
import { SignInErrorContainer } from '@/features/_http/components/sign-in-error.container'

export default async function Page() {
  await redirectToHomeIfSignedIn()

  return (
    <Stack gap={6}>
      <Suspense>
        <SignInErrorContainer />
      </Suspense>

      <Button onClick={startSignInAction}>{'Xでログイン'}</Button>
    </Stack>
  )
}
