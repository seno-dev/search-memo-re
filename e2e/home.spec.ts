import { expect, test } from '@playwright/test'

import { cookieExpiresIn } from '@/features/_http/cookie'
import { $savedSearch } from '@/features/db'
import { SavedSearch } from '@/features/models'
import { testUserUid } from '@/lib/firebase/server/emulator'
import { createUserSessionCookie } from '@/lib/firebase/server/utils/auth'
import { getDataOrThrow } from '@/lib/firebase/server/utils/firestore'
import { onlyVisible } from '@/testing/e2e/dom'

const defaultSavedSearch: SavedSearch = {
  type: 'default',
  queries: [{ id: '1', text: 'テスト1' }],
}

const session = await createUserSessionCookie(testUserUid, cookieExpiresIn)

test.beforeEach(async ({ context }) => {
  await context.addCookies([
    { name: 'session', value: session, url: 'http://localhost:3000' },
  ])

  await $savedSearch(testUserUid).create(defaultSavedSearch)
})

test.afterEach(async () => {
  await $savedSearch(testUserUid).delete()
})

test('保存した検索ワードが表示される', async ({ page }) => {
  await page.goto('/home')
  await expect(onlyVisible(page.getByText('テスト1'))).toBeVisible()
})

test('検索ワードを更新する', async ({ page }) => {
  await page.goto('/home')

  await page.getByLabel('編集').click()
  await page.getByRole('textbox').fill('テスト1-edited')
  await page.getByLabel('保存').click()

  await page.reload()
  await expect(onlyVisible(page.getByText('テスト1-edited'))).toBeVisible()

  const data = await getDataOrThrow($savedSearch(testUserUid))
  expect(data).toEqual({
    id: 'default',
    createTime: expect.any(Date),
    updateTime: expect.any(Date),
    ...defaultSavedSearch,
    queries: [{ id: '1', text: 'テスト1-edited' }],
  })
})
