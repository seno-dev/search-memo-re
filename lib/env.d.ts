/// <reference types="node" />

declare namespace NodeJS {
  type AppEnv = 'production' | 'development'
  type VercelEnv = 'production' | 'preview' | 'development'

  interface ProcessEnv {
    readonly FIREBASE_CONFIG?: string
    readonly FIREBASE_EMULATOR_PROJECT_ID?: string
    FIREBASE_AUTH_EMULATOR_HOST?: string
    FIRESTORE_EMULATOR_HOST?: string
    FIREBASE_STORAGE_EMULATOR_HOST?: string

    readonly NEXT_PUBLIC_APP_ORIGIN?: string
    readonly NEXT_PUBLIC_APP_ENV?: AppEnv
    readonly VERCEL_ENV?: VercelEnv
    readonly NEXT_PUBLIC_FIREBASE_CONFIG?: string
    readonly _FIREBASE_SERVICE_ACCOUNT?: string

    readonly X_CLIENT_ID: string
    readonly X_CLIENT_SECRET: string
  }
}
