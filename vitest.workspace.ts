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
      include: ['**/*.server.test.ts'],
    },
  },
  {
    plugins: [react(), tsconfigPaths()],
    test: {
      name: 'browser',
      globals: true,
      include: ['**/*.test.{ts,tsx}'],
      exclude: [...configDefaults.exclude, '**/*.server.test.ts'],
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
