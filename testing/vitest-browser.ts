/* eslint-disable no-restricted-imports */
import { ReactElement } from 'react'
import { ComponentRenderOptions, render } from 'vitest-browser-react'

import { AppProvider } from '@/components/ui/app-provider'

const customRender = (
  ui: ReactElement,
  options?: Omit<ComponentRenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AppProvider, ...options })

export * from 'vitest-browser-react'
export { customRender as render }
