import { unstable_rethrow as rethrow } from 'next/navigation'

import {
  buildXAuthorizationUrl,
  generateXAccessToken,
  getXUserSelf,
} from '@/features/_external/x-api'
import {
  cookieExpiresIn,
  deleteCookie,
  getCookie,
  getCookieAs,
  setCookie,
  setCookieAs,
} from '@/features/_http/cookie'
import {
  getCallbackPageUrl,
  redirectToExternalUrl,
  redirectToHome,
  redirectToSignIn,
} from '@/features/_http/router'
import { $savedSearch } from '@/features/db'
import { Profile } from '@/features/models'
import { authAdmin } from '@/lib/firebase/server/app'
import { createUserSessionCookie } from '@/lib/firebase/server/utils/auth'
import { generateRandomString } from '@/utils/string'

export async function getCurrentUser() {
  const session = await getCookie('session')
  if (!session) {
    return redirectToSignIn()
  }

  try {
    return await authAdmin.verifySessionCookie(session)
  } catch (error) {
    console.error(error)
    return redirectToSignIn()
  }
}

export async function redirectToHomeIfSignedIn() {
  const session = await getCookie('session')
  if (session) {
    const token = await authAdmin.verifySessionCookie(session).catch(() => null)
    if (token) {
      return redirectToHome()
    }
  }
}

export async function getProfileFromCookie() {
  return await getCookieAs<Profile>('profile')
}

export async function startSignIn() {
  const state = generateRandomString(32)
  const codeVerifier = generateRandomString(32)
  await setCookie('state', state)
  await setCookie('code_verifier', codeVerifier)

  const authorizationUrl = buildXAuthorizationUrl({
    redirectUrl: await getCallbackPageUrl(),
    state,
    codeVerifier,
  })
  redirectToExternalUrl(authorizationUrl)
}

export async function handleXRedirect(params: {
  state: string | undefined
  code: string | undefined
}) {
  try {
    const fromCookie = {
      state: await getCookie('state', true),
      codeVerifier: await getCookie('code_verifier', true),
    }
    const redirectUrl = await getCallbackPageUrl()

    if (!params.state || !params.code) {
      throw new Error('Params missing')
    }
    if (!fromCookie.state || !fromCookie.codeVerifier) {
      throw new Error('Cookie missing')
    }
    if (params.state !== fromCookie.state) {
      throw new Error('State mismatch')
    }

    const accessToken = await generateXAccessToken({
      code: params.code,
      codeVerifier: fromCookie.codeVerifier,
      redirectUrl,
    })
    const xUser = await getXUserSelf(accessToken)
    const session = await createUserSessionCookie(xUser.id, cookieExpiresIn)

    await setCookie('session', session)
    await setCookieAs<Profile>('profile', {
      ...xUser,
      imageUrl: xUser.profile_image_url,
    })

    await $savedSearch(xUser.id)
      .create({ type: 'default', queries: [] })
      .catch(() => {})

    return redirectToHome()
  } catch (error) {
    rethrow(error)
    console.error(error)
    return redirectToSignIn(true)
  }
}

export async function signOut() {
  await deleteCookie('profile')
  await deleteCookie('session')
  redirectToSignIn()
}
