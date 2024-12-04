import { cookies } from 'next/headers.js'

type CookieKey = 'profile' | 'session' | 'state' | 'code_verifier'

export const cookieExpiresIn = 60 * 60 * 24 * 14 * 1000

export async function getCookie(name: CookieKey, delete_ = false) {
  const store = await cookies()
  const value = store.get(name)?.value
  if (delete_) {
    store.delete(name)
  }
  return value
}

export async function getCookieAs<T = unknown>(name: CookieKey) {
  const json = await getCookie(name)
  if (!json) {
    return undefined
  }
  return JSON.parse(json) as T
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

export async function setCookieAs<T = unknown>(name: CookieKey, value: T) {
  await setCookie(name, JSON.stringify(value))
}

export async function deleteCookie(name: CookieKey) {
  const store = await cookies()
  store.delete(name)
}
