import { headers } from 'next/headers'

export async function getCurrentOrigin() {
  const $headers = await headers()
  const host = $headers.get('host')
  if (!host) {
    throw new Error('Host missing')
  }
  return host.startsWith('localhost:') ? `http://${host}` : `https://${host}`
}
