import { Locator } from '@vitest/browser/context'
import { ComponentProps } from 'react'

import { Query } from '@/features/models'
import { QueryList } from '@/features/search/components/query-list'
import { closest, onlyVisible, render } from '@/testing/vitest-browser/dom'

afterEach(() => {
  vi.restoreAllMocks()
})

const defaultProps = {
  type: 'default',
} satisfies Partial<ComponentProps<typeof QueryList>>

const defaultQueries = [
  { id: '1', text: 'テスト1' },
  { id: '2', text: 'テスト2' },
]

const prepareMocks = (initialQueries: Query[]) => {
  let queries: Query[] = initialQueries
  const updateAction = vi.fn(async (newQueries: Query[]) => {
    queries = newQueries
  })
  return () => ({
    queries,
    updateAction,
  })
}

const getRect = (l: Locator) => l.element().getBoundingClientRect()

it('queryが0件の場合empty stateが表示される', async () => {
  const mocks = prepareMocks([])
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)

  await expect
    .element($.getByText('検索ワードが登録されていません'))
    .toBeVisible()
  await expect.element($.getByText('追加', { exact: true })).toBeVisible()
})

it('追加ボタンを押すとupdateActionが呼ばれitemが編集モードで追加される', async () => {
  const mocks = prepareMocks([])
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $add = $.getByText('追加', { exact: true })

  await $add.click()
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: expect.any(String), text: '' },
  ])

  const $item = $.getByRole('listitem')
  await expect.element($item).toHaveTextContent(/^$/)
  await expect.element($item.getByRole('textbox')).toBeVisible()
})

it('データが更新されるとpreviewが更新される', async () => {
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $preview1 = onlyVisible($.getByText('テスト1'))
  const $preview2 = onlyVisible($.getByText('テスト2'))

  $.rerender(
    <QueryList
      {...defaultProps}
      {...mocks()}
      queries={[
        { id: '1', text: 'テスト1' },
        { id: '2', text: 'テスト2-edited' },
      ]}
    />,
  )

  await expect.element($preview1).toHaveTextContent(/^テスト1$/)
  await expect.element($preview2).toHaveTextContent(/^テスト2-edited$/)
})

it('itemのテキストを編集して保存するとpreviewが更新されupdateActionが呼ばれる', async () => {
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $preview = onlyVisible($.getByText('テスト2'))
  const $item = closest($preview, 'li')

  await $item.getByLabelText('編集').click()
  await $item.getByRole('textbox').fill('テスト2-edited')
  await $item.getByLabelText('保存').click()
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  await expect.element($preview).toHaveTextContent(/^テスト2-edited$/)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: '1', text: 'テスト1' },
    { id: '2', text: 'テスト2-edited' },
  ])
})

it('itemのテキスト編集をキャンセルするとpreviewが元に戻りupdateActionが呼ばれない', async () => {
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $preview = onlyVisible($.getByText('テスト2'))
  const $item = closest($preview, 'li')

  await $item.getByLabelText('編集').click()
  await $item.getByRole('textbox').fill('テスト2-edited')
  await $item.getByLabelText('キャンセル').click()
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  await expect.element($preview).toHaveTextContent(/^テスト2$/)

  expect(mocks().updateAction).not.toBeCalled()
})

it('itemの削除ボタンを押しconfirmするとupdateActionが呼ばれitemが削除される', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $preview = onlyVisible($.getByText('テスト2'))
  const $item = closest($preview, 'li')

  await $item.getByLabelText('削除').click()
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([{ id: '1', text: 'テスト1' }])
  await expect.element($item).not.toBeInTheDocument()
})

it('itemの削除ボタンを押しconfirmしないとupdateActionが呼ばれずitemが削除されない', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $preview = onlyVisible($.getByText('テスト2'))
  const $item = closest($preview, 'li')

  await $item.getByLabelText('削除').click()
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).not.toBeCalled()
  await expect.element($item).toBeInTheDocument()
})

it('queryをドラッグ&ドロップするとupdateActionが呼ばれ並べ替えられる', async () => {
  const mocks = prepareMocks([
    { id: '1', text: 'テスト1' },
    { id: '2', text: 'テスト2' },
  ])
  const $ = render(<QueryList {...defaultProps} {...mocks()} />)
  const $q1 = $.getByText('テスト1').all()[0]!
  const $q2 = $.getByText('テスト2').all()[0]!
  const $handle1 = $.getByLabelText('ドラッグハンドル').all()[0]!
  const $handle2 = $.getByLabelText('ドラッグハンドル').all()[1]!

  expect(getRect($q1).top).toBeLessThan(getRect($q2).top)

  await $handle1.dropTo($handle2)
  await new Promise((resolve) => setTimeout(resolve, 500))
  $.rerender(<QueryList {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: '2', text: 'テスト2' },
    { id: '1', text: 'テスト1' },
  ])
  expect(getRect($q2).top).toBeLessThan(getRect($q1).top)
})
