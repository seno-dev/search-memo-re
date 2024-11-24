import { auth } from '@/features/_http/auth'
import { cookie } from '@/features/_http/cookie'
import { router } from '@/features/_http/router'
import { $savedSearch } from '@/features/db'
import { Profile } from '@/features/models'

export async function getCurrentUser() {
  return await auth.getCurrentUser()
}

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
