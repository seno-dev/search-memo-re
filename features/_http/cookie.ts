import { cookies } from 'next/headers'

type CookieKey = 'profile' | 'session' | 'state' | 'code_verifier'

class Cookie {
  readonly expiresIn = 60 * 60 * 24 * 14 * 1000

  async get(name: CookieKey, delete_ = false) {
    const store = await cookies()
    const value = store.get(name)?.value
    if (delete_) {
      store.delete(name)
    }
    return value
  }

  async getAs<T = unknown>(name: CookieKey) {
    const json = await this.get(name)
    if (!json) {
      return undefined
    }
    return JSON.parse(json) as T
  }

  async set(name: CookieKey, value: string) {
    const store = await cookies()
    store.set({
      name,
      value,
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date(Date.now() + this.expiresIn),
    })
  }

  async setAs<T = unknown>(name: CookieKey, value: T) {
    await this.set(name, JSON.stringify(value))
  }

  async delete(name: CookieKey) {
    const store = await cookies()
    store.delete(name)
  }
}

export type { Cookie }

export const cookie = new Cookie()
