import '@testing-library/jest-dom/vitest'

vi.mock('react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react')>()

  return {
    ...mod,
    // node_modules/next/dist/compiled/react-dom/cjs/react-dom-server.browser.production.js
    useActionState: (action: any, initialState: any, permalink: any) => {
      const boundAction = action.bind(null, initialState)
      return [
        initialState,
        (payload: any) => {
          boundAction(payload)
        },
        false,
      ]
    },
  }
})
