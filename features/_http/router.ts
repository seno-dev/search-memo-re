import { headers } from 'next/headers.js'
import { redirect } from 'next/navigation.js'

async function getCurrentOrigin() {
  const headerList = await headers()
  const host = headerList.get('host')
  if (!host) {
    throw new Error('Host missing')
  }
  return host.startsWith('localhost:') ? `http://${host}` : `https://${host}`
}

export async function getCallbackPageUrl() {
  const origin = await getCurrentOrigin()
  return `${origin}/callback`
}

export function redirectToSignIn(error = false): never {
  redirect(error ? '/?sign-in-error=true' : '/')
}

export function redirectToHome(): never {
  redirect('/home')
}

export function redirectToExternalUrl(url: string): never {
  redirect(url)
}
