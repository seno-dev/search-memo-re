'use server'

import { HTTPError } from 'got'
import { redirect } from 'next/navigation'

import {
  cookieExpiresIn,
  deleteCookie,
  getCookie,
  setCookie,
  setProfileCookie,
} from '@/features/auth/cookie'
import { xOAuth2Token, xUsersMe } from '@/features/auth/x-api'
import { $savedSearch } from '@/features/db'
import { authAdmin } from '@/lib/firebase.server/features/auth'
import { getIdToken } from '@/lib/firebase.server/utils'
import { generateRandomString } from '@/utils/string'
import { withSearchParams } from '@/utils/url'
import { getCurrentOrigin } from '@/utils/url.server'

const scope = 'tweet.read users.read'

async function getRedirectUrl() {
  const origin = await getCurrentOrigin()
  return `${origin}/callback`
}

export async function getCurrentUser() {
  const session = await getCookie('session')
  if (!session) {
    redirect('/')
  }

  try {
    return await authAdmin.verifySessionCookie(session)
  } catch (error) {
    console.error(error)
    redirect('/')
  }
}

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
      redirect_uri: await getRedirectUrl(),
      scope,
      state,
      code_challenge: codeVerifier,
      code_challenge_method: 'plain',
    },
  )
  redirect(authorizationUrl)
}

export async function handleXAuthorizationRedirect(params: {
  state?: string | null
  code?: string | null
}): Promise<never> {
  try {
    if (!params.state || !params.code) {
      throw new Error('Params missing')
    }
    const state = await getCookie('state', true)
    const codeVerifier = await getCookie('code_verifier', true)
    if (!state || !codeVerifier) {
      throw new Error('Cookie missing')
    }
    if (params.state !== state) {
      throw new Error('State mismatch')
    }

    const { access_token: accessToken } = await xOAuth2Token({
      code: params.code,
      codeVerifier,
      redirectUrl: await getRedirectUrl(),
    })
    const { data } = await xUsersMe({ accessToken })
    await setProfileCookie(data)

    const customToken = await authAdmin.createCustomToken(data.id)
    const idToken = await getIdToken(customToken)
    const session = await authAdmin.createSessionCookie(idToken, {
      expiresIn: cookieExpiresIn,
    })
    await setCookie('session', session)
    await $savedSearch(data.id)
      .create({ type: 'default', queries: [] })
      .catch(() => {})
  } catch (error) {
    console.error(error instanceof HTTPError ? error.response.body : error)
    redirect('/?sign-in-error=true')
  }

  redirect('/home')
}

export async function signOut() {
  await deleteCookie('profile')
  await deleteCookie('session')
  redirect('/')
}
