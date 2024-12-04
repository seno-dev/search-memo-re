import * as nextEnv from '@next/env'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults, defineConfig } from 'vitest/config'

const { parsedEnv } = (
  (nextEnv as any).default as typeof nextEnv
).loadEnvConfig(process.cwd())

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude!,
        'components/ui/snippets',
        '**/*.js',
      ],
    },
    env: parsedEnv,
    globals: true,
    setupFiles: ['./testing/vitest-browser/setup.ts'],
  },
})
