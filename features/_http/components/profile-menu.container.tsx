import { getProfileFromCookie, signOut } from '@/features/_http/api'
import { ProfileMenu } from '@/features/_http/components/profile-menu'

async function signOutAction() {
  'use server'
  await signOut()
}

export async function ProfileMenuContainer() {
  const profile = await getProfileFromCookie()
  if (!profile) {
    return null
  }
  return <ProfileMenu {...profile} signOutAction={signOutAction} />
}
