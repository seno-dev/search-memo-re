import { $savedSearch } from '@/features/db'
import { Profile } from '@/features/models'
import { auth } from '@/features/server/_http/auth'
import { cookie } from '@/features/server/_http/cookie'
import { router } from '@/features/server/_http/router'

export async function redirectToHomeIfSignedIn() {
  const session = await cookie.get('session')
  if (session) {
    return router.redirectToHome()
  }
}

export async function getProfileFromCookie() {
  return await cookie.getAs<Profile>('profile')
}

export async function handleXRedirect({
  state,
  code,
}: {
  state: string | null
  code: string | null
}) {
  const { success, xUser } = await auth.handleXRedirect({
    state,
    code,
  })
  if (!success) {
    return router.redirectToSignIn(true)
  }

  await $savedSearch(xUser.id)
    .create({ type: 'default', queries: [] })
    .catch(() => {})

  return router.redirectToHome()
}
