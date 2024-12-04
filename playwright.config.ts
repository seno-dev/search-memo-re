import * as nextEnv from '@next/env'
import { defineConfig, devices } from '@playwright/test'

void ((nextEnv as any).default as typeof nextEnv).loadEnvConfig(process.cwd())

export default defineConfig({
  testDir: 'e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run next:dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
