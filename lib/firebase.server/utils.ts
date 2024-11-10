import got from 'got'

import { firebaseConfig } from '@/lib/firebase/app'

export async function getIdToken(customToken: string) {
  const { idToken } = await got
    .post(
      `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=${firebaseConfig.apiKey}`,
      {
        json: {
          token: customToken,
          returnSecureToken: true,
        },
      },
    )
    .json<{ idToken: string }>()

  return idToken
}
