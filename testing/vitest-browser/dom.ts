import { Locator, page } from '@vitest/browser/context'
import { ReactElement } from 'react'
import {
  ComponentRenderOptions,
  // eslint-disable-next-line no-restricted-imports
  render as renderOriginal,
} from 'vitest-browser-react'

import { AppProvider } from '@/components/ui/app-provider'

export function render(
  ui: ReactElement,
  options?: Omit<ComponentRenderOptions, 'wrapper'>,
) {
  return renderOriginal(ui, { wrapper: AppProvider, ...options })
}

export function onlyVisible(loc: Locator) {
  const visibleElements = loc.elements().filter((el) => {
    return el.checkVisibility({
      opacityProperty: true,
      visibilityProperty: true,
    })
  })
  if (!visibleElements[0]) {
    throw new Error('No visible elements found')
  } else if (visibleElements.length > 1) {
    throw new Error('Multiple visible elements found')
  }
  return page.elementLocator(visibleElements[0])
}

export function closest(loc: Locator, selector: string) {
  const el = loc.element().closest(selector)
  if (!el) {
    throw new Error(`No closest element found for ${selector}`)
  }
  return page.elementLocator(el)
}
