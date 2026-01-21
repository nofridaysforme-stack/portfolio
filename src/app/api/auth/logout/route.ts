import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'

/**
 * Logout from Payload session
 * POST /api/auth/logout
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Logout from Payload
    await payload.logout({
      headers: await getHeaders(),
    } as any)

    return NextResponse.json(
      { message: 'Logged out successfully' },
      {
        status: 200,
        headers: {
          'Set-Cookie': 'payload-token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
        },
      }
    )
  } catch (error) {
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 })
  }
}
