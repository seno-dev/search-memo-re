import { Box, Container, HStack, Heading } from '@chakra-ui/react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React, { Suspense } from 'react'

import { AppProvider } from '@/components/ui/app-provider'
import { Toaster } from '@/components/ui/snippets/toaster'
import { ProfileMenuContainer } from '@/features/_http/components/profile-menu.container'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | 検索メモ (Re)',
    default: '検索メモ (Re)',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='ja' className={inter.variable} suppressHydrationWarning>
      <head />
      <body>
        <AppProvider>
          <Box
            as='header'
            shadow='xs'
            position='sticky'
            top={0}
            zIndex={10}
            bg='white'
          >
            <Container maxW='lg'>
              <HStack align='center' justify='space-between' w='full' h={16}>
                <Heading as='h1' size='md'>
                  {'検索メモ (Re)'}
                </Heading>

                <Box flexGrow={1} />

                <Suspense>
                  <ProfileMenuContainer />
                </Suspense>
              </HStack>
            </Container>
          </Box>

          <Container maxW='lg' py={6}>
            <Suspense>{children}</Suspense>
          </Container>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  )
}
