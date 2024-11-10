import { cookies } from 'next/headers'

import { UsersMeResponse } from '@/features/auth/x-api'
import { Profile } from '@/features/models'

export const cookieExpiresIn = 60 * 60 * 24 * 14 * 1000

export type CookieKey = 'profile' | 'session' | 'state' | 'code_verifier'

export async function getCookie(name: CookieKey, delete_ = false) {
  const store = await cookies()
  const value = store.get(name)?.value
  if (delete_) {
    store.delete(name)
  }
  return value
}

export async function setCookie(name: CookieKey, value: string) {
  const store = await cookies()
  store.set({
    name,
    value,
    secure: true,
    httpOnly: true,
    path: '/',
    expires: new Date(Date.now() + cookieExpiresIn),
  })
}

export async function deleteCookie(name: CookieKey) {
  const store = await cookies()
  store.delete(name)
}

export async function getProfileCookie() {
  const json = await getCookie('profile')
  if (!json) {
    return undefined
  }
  return JSON.parse(json) as Profile
}

export async function setProfileCookie({
  profile_image_url: imageUrl,
  ...rest
}: UsersMeResponse['data']) {
  const profile: Profile = { ...rest, imageUrl }
  await setCookie('profile', JSON.stringify(profile))
}
