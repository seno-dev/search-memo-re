import { cert, getApps, initializeApp } from 'firebase-admin/app'

const options = {
  credential: cert(JSON.parse(process.env._FIREBASE_SERVICE_ACCOUNT!)),
}

// if (process.env.NODE_ENV === 'test') {
//   process.env.FIREBASE_AUTH_EMULATOR_HOST = `${localhost}:${emulators.auth.port}`
//   process.env.FIRESTORE_EMULATOR_HOST = `${localhost}:${emulators.firestore.port}`
//   process.env.FIREBASE_STORAGE_EMULATOR_HOST = `${localhost}:${emulators.storage.port}`
// }

export const appAdmin = getApps()[0] ?? initializeApp(options)
// const { projectId } = appAdmin.options

// export const firestoreEmulatorUrl = (path: string) =>
//   `http://${localhost}:${emulators.firestore.port}/emulator/v1/projects/${projectId}${path}`

// export const functionsEmulatorUrl = (region: string, name: string) =>
//   `http://${localhost}:${emulators.functions.port}/${projectId}/${region}/${name}`
