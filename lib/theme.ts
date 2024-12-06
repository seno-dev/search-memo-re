'use client'

import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const appConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: defaultConfig.theme!.tokens!.colors!['blue']!,
      },
    },
    semanticTokens: {
      colors: {
        brand: defaultConfig.theme!.semanticTokens!.colors!['blue']!,
      },
    },
    textStyles: {},
  },
})

export const system = createSystem(defaultConfig, appConfig)
