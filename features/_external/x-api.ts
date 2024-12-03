import got from 'got'

import { withSearchParams } from '@/utils/url'

const scope = 'tweet.read users.read'

const xApi = got.extend({
  prefixUrl: 'https://api.x.com/2',
})

export interface CallbackParams {
  state: string | undefined
  code: string | undefined
}

export interface GenerateXAccessTokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  scope: string
}

export interface GetXUserSelfResponse {
  data: {
    id: string
    name: string
    username: string
    profile_image_url: string
  }
}

export function buildXAuthorizationUrl({
  redirectUrl,
  state,
  codeVerifier,
}: {
  redirectUrl: string
  state: string
  codeVerifier: string
}) {
  return withSearchParams('https://x.com/i/oauth2/authorize', {
    response_type: 'code',
    client_id: process.env.X_CLIENT_ID,
    redirect_uri: redirectUrl,
    scope,
    state,
    code_challenge: codeVerifier,
    code_challenge_method: 'plain',
  })
}

export interface GenerateXAccessTokenParams {
  code: string
  codeVerifier: string
  redirectUrl: string
}

export async function generateXAccessToken({
  code,
  codeVerifier,
  redirectUrl,
}: GenerateXAccessTokenParams) {
  const credential = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`,
  ).toString('base64')

  const { access_token } = await xApi
    .post('oauth2/token', {
      headers: {
        authorization: `Basic ${credential}`,
      },
      form: {
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUrl,
        code_verifier: codeVerifier,
      },
    })
    .json<GenerateXAccessTokenResponse>()

  return access_token
}

export async function getXUserSelf(accessToken: string) {
  const { data } = await xApi
    .get('users/me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      searchParams: {
        'user.fields': 'profile_image_url',
      },
    })
    .json<GetXUserSelfResponse>()

  return data
}
