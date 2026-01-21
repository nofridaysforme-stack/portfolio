import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'

/**
 * Verify Payload session
 * GET /api/auth/verify
 */
export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config: configPromise })

    // Get user from request
    const user = await payload.auth({
      headers: await getHeaders(),
    })

    if (!user || !user.user) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.user.id,
        email: user.user.email,
        role: user.user.role,
      },
    })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
