import { ProfileMenu } from '@/features/client/auth/profile-menu'
import { getProfileFromCookie } from '@/features/server/_http/api'

export async function ProfileMenuContainer() {
  const profile = await getProfileFromCookie()
  if (!profile) {
    return null
  }
  return <ProfileMenu {...profile} />
}
