import got from 'got'

import { firebaseConfig } from '@/lib/firebase/config'
import { emulatorHost } from '@/lib/firebase/constants'

const api = got.extend({
  prefixUrl:
    process.env.NODE_ENV === 'test'
      ? `http://${emulatorHost.auth}/identitytoolkit.googleapis.com`
      : 'https://www.googleapis.com/identitytoolkit',
})

export async function getIdToken(customToken: string) {
  const { idToken } = await api
    .post(`v3/relyingparty/verifyCustomToken?key=${firebaseConfig.apiKey}`, {
      json: {
        token: customToken,
        returnSecureToken: true,
      },
    })
    .json<{ idToken: string }>()

  return idToken
}
