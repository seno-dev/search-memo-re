import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    plugins: [tsconfigPaths()],
    test: {
      name: 'unit',
      globals: true,
      environment: 'node',
      includeSource: ['**/*.{ts,tsx}'],
      exclude: [...configDefaults.exclude, '**/components/**/*.{ts,tsx}'],
    },
  },
  {
    plugins: [react(), tsconfigPaths()],
    test: {
      name: 'browser',
      globals: true,
      includeSource: ['**/components/**/*.{ts,tsx}'],
      setupFiles: ['./testing/setup.ts'],
      browser: {
        enabled: true,
        headless: true,
        name: 'chromium',
        provider: 'playwright',
      },
    },
  },
])
