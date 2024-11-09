'use client'

import { ChakraProvider } from '@chakra-ui/react'

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from '@/components/ui/snippets/color-mode'
import { system } from '@/config/theme'

export function AppProvider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  )
}
