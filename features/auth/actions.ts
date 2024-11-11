'use server'

import { redirect } from 'next/navigation'

import { deleteCookie, setCookie } from '@/features/auth/cookie'
import { getCallbackUrl } from '@/features/auth/internal'
import { generateRandomString } from '@/utils/string'
import { withSearchParams } from '@/utils/url'

const scope = 'tweet.read users.read'

export async function startSignIn(): Promise<never> {
  const state = generateRandomString(32)
  const codeVerifier = generateRandomString(32)
  await setCookie('state', state)
  await setCookie('code_verifier', codeVerifier)

  const authorizationUrl = withSearchParams(
    'https://x.com/i/oauth2/authorize',
    {
      response_type: 'code',
      client_id: process.env.X_CLIENT_ID,
      redirect_uri: await getCallbackUrl(),
      scope,
      state,
      code_challenge: codeVerifier,
      code_challenge_method: 'plain',
    },
  )
  redirect(authorizationUrl)
}

export async function signOut() {
  await deleteCookie('profile')
  await deleteCookie('session')
  redirect('/')
}
