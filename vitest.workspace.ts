import { configDefaults, defineWorkspace } from 'vitest/config'

const glob = {
  all: '**/*.test.{ts,tsx}',
  components: '**/components/**/*.test.{ts,tsx}',
}

export default defineWorkspace([
  {
    extends: './vitest.config.ts',
    test: {
      name: 'node',
      environment: 'node',
      include: [glob.all],
      exclude: [...configDefaults.exclude, glob.components],
    },
  },
  {
    extends: './vitest.config.ts',
    test: {
      name: 'components',
      include: [glob.components],
      browser: {
        enabled: true,
        headless: true,
        name: 'chromium',
        provider: 'playwright',
      },
    },
  },
])
