import { EmulatorMockTokenOptions } from '@firebase/util'
import got from 'got'

import { emulatorHost } from '@/lib/firebase/constants'

const emulatorApi = {
  firestore: got.extend({
    prefixUrl: `http://${emulatorHost.firestore}/emulator/v1/projects/${process.env.FIREBASE_EMULATOR_PROJECT_ID}`,
  }),
}

export async function cleanupFirestoreEmulator() {
  await emulatorApi.firestore.delete('databases/(default)/documents')
}

export const testUserUid = 'user1'

export const mockUserToken: EmulatorMockTokenOptions = { sub: testUserUid }
