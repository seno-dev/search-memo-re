import { $savedSearch } from '@/features/db'
import { SavedSearch } from '@/features/models'
import { updateSavedSearchQueries } from '@/features/search/actions'
import { Queries } from '@/features/search/components/queries'
import { QueriesContainer } from '@/features/search/components/queries.container'
import {
  cleanupFirestoreEmulator,
  testUserUid,
} from '@/lib/firebase/server/emulator'
import { getDataOrThrow } from '@/lib/firebase/server/utils/firestore'
import { extractProps } from '@/testing/props'

const defaultSavedSearch: SavedSearch = {
  type: 'default',
  queries: [{ id: '1', text: 'テスト1' }],
}

beforeEach(async () => {
  await $savedSearch(testUserUid).create(defaultSavedSearch)
})

afterEach(async () => {
  await cleanupFirestoreEmulator()
})

it('Queriesにpropsが正しく渡される', async () => {
  const el = await QueriesContainer()

  expect(extractProps(el, Queries)).toEqual({
    id: 'default',
    createTime: expect.any(Date),
    updateTime: expect.any(Date),
    ...defaultSavedSearch,
    updateAction: updateSavedSearchQueries,
  })
})

it('updateSavedSearchQueriesを呼ぶとデータが更新される', async () => {
  await updateSavedSearchQueries([
    { id: '1', text: 'テスト1' },
    { id: '2', text: 'テスト2' },
  ])

  expect(await getDataOrThrow($savedSearch(testUserUid))).toEqual({
    id: 'default',
    createTime: expect.any(Date),
    updateTime: expect.any(Date),
    ...defaultSavedSearch,
    queries: [
      { id: '1', text: 'テスト1' },
      { id: '2', text: 'テスト2' },
    ],
  })
})
