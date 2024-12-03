import { Locator } from '@playwright/test'

export function onlyVisible(loc: Locator): Locator {
  return loc.locator('visible=true')
}
