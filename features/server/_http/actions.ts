'use server'

import { auth } from '@/features/server/_http/auth'

export async function startSignInAction() {
  await auth.startSignIn()
}

export async function signOutAction() {
  await auth.signOut()
}
