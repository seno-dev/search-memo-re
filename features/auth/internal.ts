import { HTTPError } from 'got'
import { redirect } from 'next/navigation'

import {
  cookieExpiresIn,
  getCookie,
  setCookie,
  setProfileCookie,
} from '@/features/auth/cookie'
import { xOAuth2Token, xUsersMe } from '@/features/auth/x-api'
import { $savedSearch } from '@/features/db'
import { authAdmin } from '@/lib/firebase.server/features/auth'
import { getIdToken } from '@/lib/firebase.server/utils'
import { getCurrentOrigin } from '@/utils/url.server'

export async function getCallbackUrl() {
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

export async function redirectToHomeIfSignedIn() {
  const session = await getCookie('session')
  if (session) {
    redirect('/home')
  }
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
      redirectUrl: await getCallbackUrl(),
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
