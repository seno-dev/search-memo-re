'use server'

import { auth } from '@/features/_http/auth'

export async function startSignInAction() {
  await auth.startSignIn()
}

export async function signOutAction() {
  await auth.signOut()
}
