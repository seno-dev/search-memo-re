import { Locator } from '@vitest/browser/context'
import { ComponentProps } from 'react'

import { Query } from '@/features/models'
import { Queries } from '@/features/search/components/queries'
import { render } from '@/testing/vitest-browser'

afterEach(() => {
  vi.restoreAllMocks()
})

const defaultProps = {
  type: 'default',
} satisfies Partial<ComponentProps<typeof Queries>>

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
  const $ = render(<Queries {...defaultProps} {...mocks()} />)

  await expect
    .element($.getByText('検索ワードが登録されていません'))
    .toBeVisible()
  await expect.element($.getByText('追加', { exact: true })).toBeVisible()
})

it('追加ボタンを押すとupdateActionが呼ばれitemが編集モードで追加される', async () => {
  const mocks = prepareMocks([])
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $add = $.getByText('追加', { exact: true })

  await $add.click()
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: expect.any(String), text: '' },
  ])

  const $item = $.getByTestId(/^query-item-\w+$/)
  await expect.element($item).toHaveTextContent(/^$/)
  await expect.element($item.getByRole('textbox')).toBeVisible()
})

it('データが更新されるとpreviewが更新される', async () => {
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $preview1 = $.getByTestId('query-item-1-preview')
  const $preview2 = $.getByTestId('query-item-2-preview')

  await expect.element($preview1).toHaveTextContent(/^テスト1$/)
  await expect.element($preview2).toHaveTextContent(/^テスト2$/)

  $.rerender(
    <Queries
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
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $item = $.getByTestId('query-item-2')
  const $preview = $.getByTestId('query-item-2-preview')

  await expect.element($preview).toHaveTextContent(/^テスト2$/)

  await $item.getByLabelText('編集').click()
  await $item.getByRole('textbox').fill('テスト2-edited')
  await $item.getByLabelText('保存').click()
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  await expect.element($preview).toHaveTextContent(/^テスト2-edited$/)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: '1', text: 'テスト1' },
    { id: '2', text: 'テスト2-edited' },
  ])
})

it('itemのテキスト編集をキャンセルするとpreviewが元に戻りupdateActionが呼ばれない', async () => {
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $item = $.getByTestId('query-item-2')
  const $preview = $.getByTestId('query-item-2-preview')

  await expect.element($preview).toHaveTextContent(/^テスト2$/)

  await $item.getByLabelText('編集').click()
  await $item.getByRole('textbox').fill('テスト2-edited')
  await $item.getByLabelText('キャンセル').click()
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  await expect.element($preview).toHaveTextContent(/^テスト2$/)

  expect(mocks().updateAction).not.toBeCalled()
})

it('itemの削除ボタンを押しconfirmするとupdateActionが呼ばれitemが削除される', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(true)
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $item = $.getByTestId('query-item-2')

  await $item.getByLabelText('削除').click()
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([{ id: '1', text: 'テスト1' }])
  await expect.element($item).not.toBeInTheDocument()
})

it('itemの削除ボタンを押しconfirmしないとupdateActionが呼ばれずitemが削除されない', async () => {
  vi.spyOn(window, 'confirm').mockReturnValue(false)
  const mocks = prepareMocks(defaultQueries)
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $item = $.getByTestId('query-item-2')

  await $item.getByLabelText('削除').click()
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).not.toBeCalled()
  await expect.element($item).toBeInTheDocument()
})

it('queryをドラッグ&ドロップするとupdateActionが呼ばれ並べ替えられる', async () => {
  const mocks = prepareMocks([
    { id: '1', text: 'テスト1' },
    { id: '2', text: 'テスト2' },
  ])
  const $ = render(<Queries {...defaultProps} {...mocks()} />)
  const $q1 = $.getByText('テスト1').all()[0]!
  const $q2 = $.getByText('テスト2').all()[0]!
  const $handle1 = $.getByLabelText('ドラッグハンドル').all()[0]!
  const $handle2 = $.getByLabelText('ドラッグハンドル').all()[1]!

  expect(getRect($q1).top).toBeLessThan(getRect($q2).top)

  await $handle1.dropTo($handle2)
  await new Promise((resolve) => setTimeout(resolve, 500))
  $.rerender(<Queries {...defaultProps} {...mocks()} />)

  expect(mocks().updateAction).toBeCalledTimes(1)
  expect(mocks().updateAction).toBeCalledWith([
    { id: '2', text: 'テスト2' },
    { id: '1', text: 'テスト1' },
  ])
  expect(getRect($q2).top).toBeLessThan(getRect($q1).top)
})
