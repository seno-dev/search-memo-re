import { HTTPError } from 'got'

import {
  buildAuthorizationUrl,
  xOAuth2Token,
  xUsersMe,
} from '@/features/_external/x-api'
import { cookie } from '@/features/_http/cookie'
import { router } from '@/features/_http/router'
import { Profile } from '@/features/models'
import { authAdmin } from '@/lib/firebase/server/app'
import { getIdToken } from '@/lib/firebase/server/id-token'
import { generateRandomString } from '@/utils/string'

class Auth {
  async #createUserSessionCookie(uid: string) {
    const customToken = await authAdmin.createCustomToken(uid)
    const idToken = await getIdToken(customToken)

    return await authAdmin.createSessionCookie(idToken, {
      expiresIn: cookie.expiresIn,
    })
  }

  async getCurrentUser() {
    const session = await cookie.get('session')
    if (!session) {
      return router.redirectToSignIn()
    }

    try {
      return await authAdmin.verifySessionCookie(session)
    } catch (error) {
      console.error(error)
      return router.redirectToSignIn()
    }
  }

  async startSignIn() {
    const state = generateRandomString(32)
    const codeVerifier = generateRandomString(32)
    await cookie.set('state', state)
    await cookie.set('code_verifier', codeVerifier)

    const authorizationUrl = buildAuthorizationUrl({
      redirectUrl: await router.getCallbackUrl(),
      state,
      codeVerifier,
    })
    router.redirectToExternalUrl(authorizationUrl)
  }

  async signOut() {
    await cookie.delete('profile')
    await cookie.delete('session')
    router.redirectToSignIn()
  }

  async handleXRedirect(params: {
    state?: string | null
    code?: string | null
  }) {
    try {
      if (!params.state || !params.code) {
        throw new Error('Params missing')
      }
      const state = await cookie.get('state', true)
      const codeVerifier = await cookie.get('code_verifier', true)
      if (!state || !codeVerifier) {
        throw new Error('Cookie missing')
      }
      if (params.state !== state) {
        throw new Error('State mismatch')
      }

      const { access_token: accessToken } = await xOAuth2Token({
        code: params.code,
        codeVerifier,
        redirectUrl: await router.getCallbackUrl(),
      })
      const { data: xUser } = await xUsersMe({ accessToken })
      await cookie.setAs<Profile>('profile', {
        ...xUser,
        imageUrl: xUser.profile_image_url,
      })

      const session = await this.#createUserSessionCookie(xUser.id)
      await cookie.set('session', session)

      return { success: true as const, xUser }
    } catch (error) {
      console.error(error instanceof HTTPError ? error.response.body : error)
      return { success: false as const }
    }
  }
}

export type { Auth }

export const auth = new Auth()
