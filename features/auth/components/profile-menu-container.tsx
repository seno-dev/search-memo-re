import { ProfileMenu } from '@/features/auth/components/profile-menu'
import { getProfileCookie } from '@/features/auth/cookie'

export async function ProfileMenuContainer() {
  const profile = await getProfileCookie()
  if (!profile) {
    return null
  }
  return <ProfileMenu {...profile} />
}
