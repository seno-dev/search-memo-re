import { NextRequest } from 'next/server'

import { handleXRedirect } from '@/features/_http/api'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const state = searchParams.get('state')
  const code = searchParams.get('code')

  return await handleXRedirect({ state, code })
}
