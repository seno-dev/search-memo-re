import { Stack } from '@chakra-ui/react'
import { Suspense } from 'react'

import { Button } from '@/components/ui/snippets/button'
import { redirectToHomeIfSignedIn, startSignIn } from '@/features/_http/api'
import { SignInErrorContainer } from '@/features/_http/components/sign-in-error.container'

async function startSignInAction() {
  'use server'
  await startSignIn()
}

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
