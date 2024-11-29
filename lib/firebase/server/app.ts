import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

import { emulatorHost } from '@/lib/firebase/constants'

const serviceAccountJson = process.env._FIREBASE_SERVICE_ACCOUNT?.replaceAll(
  '\n',
  '\\n',
)
const options = serviceAccountJson
  ? { credential: cert(JSON.parse(serviceAccountJson)) }
  : undefined

if (process.env.NODE_ENV === 'test') {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = emulatorHost.auth
  process.env.FIRESTORE_EMULATOR_HOST = emulatorHost.firestore
}

export const appAdmin = getApps()[0] ?? initializeApp(options)

export const authAdmin = getAuth(appAdmin)

export const firestoreAdmin = getFirestore(appAdmin)
try {
  firestoreAdmin.settings({ ignoreUndefinedProperties: true })
} catch (error) {}
