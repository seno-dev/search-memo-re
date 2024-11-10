import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Query,
  QueryDocumentSnapshot,
  Transaction,
  getFirestore,
} from 'firebase-admin/firestore'

import { appAdmin } from '@/lib/firebase.server/app'
import { R } from '@/lib/remeda'

export const firestoreAdmin = getFirestore(appAdmin)
try {
  firestoreAdmin.settings({ ignoreUndefinedProperties: true })
} catch (error) {}

export type WithMeta<T> = T & {
  id?: string
  createTime?: Date
  updateTime?: Date
}

export function _getSnapDataWithMeta<T>(snap: QueryDocumentSnapshot) {
  const data = snap.data() as T
  return {
    id: snap.id,
    createTime: snap.createTime.toDate(),
    updateTime: snap.updateTime.toDate(),
    ...data,
  }
}

export function _omitMeta<T>({
  id,
  createTime,
  updateTime,
  ...data
}: T & { id?: any; createTime?: any; updateTime?: any }) {
  return data
}

export function _withConverter<T extends DocumentData>(
  ref: CollectionReference<DocumentData, DocumentData>,
) {
  return ref.withConverter<WithMeta<T>, T>({
    toFirestore(data) {
      return _omitMeta(data)
    },
    fromFirestore(snap) {
      return _getSnapDataWithMeta<T>(snap)
    },
  })
}

export function _withConverterQuery<T extends DocumentData>(
  ref: Query<DocumentData, DocumentData>,
) {
  return ref.withConverter<WithMeta<T>, T>({
    toFirestore(data) {
      return _omitMeta(data) as T
    },
    fromFirestore(snap) {
      return _getSnapDataWithMeta<T>(snap)
    },
  })
}

export async function txGetAllData<T, U extends DocumentData>(
  tx: Transaction,
  ref: Query<T, U>,
) {
  const { docs } = await tx.get(ref)
  return docs.map((snap) => snap.data())
}

export async function getAllData<T, U extends DocumentData>(ref: Query<T, U>) {
  const { docs } = await ref.get()
  return docs.map((snap) => snap.data())
}

export async function getData<T, U extends DocumentData>(
  ref: DocumentReference<T, U>,
) {
  const snap = await ref.get()
  return snap.data()
}

export async function getDataOrThrow<T, U extends DocumentData>(
  ref: DocumentReference<T, U>,
) {
  const data = await getData(ref)
  if (!data) {
    throw new Error('not found')
  }
  return data
}

export function sortByCreateTime<T>(data: (T & { createTime?: Date })[]) {
  return R.sortBy(data, ({ createTime }) => createTime!.valueOf())
}

export function docRef<T, U extends DocumentData>(
  cRef: CollectionReference<T, U>,
  id: string | undefined,
) {
  return id ? cRef.doc(id) : cRef.doc()
}
