import { getProfileFromCookie } from '@/features/_http/api'
import { ProfileMenu } from '@/features/_http/components/profile-menu'

export async function ProfileMenuContainer() {
  const profile = await getProfileFromCookie()
  if (!profile) {
    return null
  }
  return <ProfileMenu {...profile} />
}
