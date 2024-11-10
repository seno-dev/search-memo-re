import { getAuth } from 'firebase-admin/auth'

import { appAdmin } from '@/lib/firebase.server/app'

export const authAdmin = getAuth(appAdmin)
