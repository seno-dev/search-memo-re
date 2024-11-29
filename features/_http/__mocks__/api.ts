import { testUserUid } from '@/lib/firebase/server/emulator'

export async function getCurrentUser() {
  return { uid: testUserUid }
}
