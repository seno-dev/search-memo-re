import { NextRequest } from 'next/server'

import { handleXAuthorizationRedirect } from '@/features/auth/actions'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const state = searchParams.get('state')
  const code = searchParams.get('code')
  await handleXAuthorizationRedirect({ state, code })

  return new Response()
}
