import { Locator, page } from '@vitest/browser/context'

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
