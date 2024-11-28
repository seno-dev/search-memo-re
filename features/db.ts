import { SavedSearch, User } from '@/features/models'
import { defaultDocId } from '@/lib/firebase/constants'
import { firestoreAdmin } from '@/lib/firebase/server/app'
import { _withConverter } from '@/lib/firebase/server/utils/firestore'

export const $users = () =>
  _withConverter<User>(firestoreAdmin.collection('users'))

export const $savedSearch = (uid: string) =>
  _withConverter<SavedSearch>(
    $users().doc(uid).collection('savedSearches'),
  ).doc(defaultDocId)
