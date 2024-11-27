import got from 'got'

import { withSearchParams } from '@/utils/url'

const scope = 'tweet.read users.read'

const xApi = got.extend({
  prefixUrl: 'https://api.x.com/2',
})

export interface OAuth2TokenResponse {
  token_type: string
  expires_in: number
  access_token: string
  scope: string
}

export interface UsersMeResponse {
  data: {
    id: string
    name: string
    username: string
    profile_image_url: string
  }
}

export function buildAuthorizationUrl({
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

export async function xOAuth2Token({
  code,
  codeVerifier,
  redirectUrl,
}: {
  code: string
  codeVerifier: string
  redirectUrl: string
}) {
  const credential = Buffer.from(
    `${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`,
  ).toString('base64')

  return await xApi
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
    .json<OAuth2TokenResponse>()
}

export async function xUsersMe({ accessToken }: { accessToken: string }) {
  return await xApi
    .get('users/me', {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      searchParams: {
        'user.fields': 'profile_image_url',
      },
    })
    .json<UsersMeResponse>()
}
