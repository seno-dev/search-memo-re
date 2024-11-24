import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

class Router {
  async getCurrentOrigin() {
    const headerList = await headers()
    const host = headerList.get('host')
    if (!host) {
      throw new Error('Host missing')
    }
    return host.startsWith('localhost:') ? `http://${host}` : `https://${host}`
  }

  async getCallbackUrl() {
    const origin = await this.getCurrentOrigin()
    return `${origin}/callback`
  }

  redirectToSignIn(error = false): never {
    redirect(error ? '/?sign-in-error=true' : '/')
  }

  redirectToHome(): never {
    redirect('/home')
  }

  redirectToExternalUrl(url: string): never {
    redirect(url)
  }
}

export type { Router }

export const router = new Router()
