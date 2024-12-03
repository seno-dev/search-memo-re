import { NextRequest } from 'next/server'

import { handleXRedirect } from '@/features/_http/api'

export async function GET(request: NextRequest): Promise<Response> {
  const { searchParams } = request.nextUrl
  const state = searchParams.get('state') ?? undefined
  const code = searchParams.get('code') ?? undefined

  return await handleXRedirect({ state, code })
}
