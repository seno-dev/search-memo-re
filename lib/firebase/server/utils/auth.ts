import got from 'got'

import { firebaseConfig } from '@/lib/firebase/config'
import { emulatorHost } from '@/lib/firebase/constants'
import { authAdmin } from '@/lib/firebase/server/app'

const api = got.extend({
  prefixUrl:
    process.env.NODE_ENV !== 'production'
      ? `http://${emulatorHost.auth}/www.googleapis.com/identitytoolkit`
      : 'https://www.googleapis.com/identitytoolkit',
})

async function getIdToken(customToken: string) {
  const { idToken } = await api
    .post(`v3/relyingparty/verifyCustomToken?key=${firebaseConfig?.apiKey}`, {
      json: {
        token: customToken,
        returnSecureToken: true,
      },
    })
    .json<{ idToken: string }>()

  return idToken
}

export async function createUserSessionCookie(uid: string, expiresIn: number) {
  const customToken = await authAdmin.createCustomToken(uid)
  const idToken = await getIdToken(customToken)

  return await authAdmin.createSessionCookie(idToken, { expiresIn })
}
