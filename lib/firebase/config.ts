export const firebaseConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG
  ? (JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG) as { apiKey: string })
  : undefined
