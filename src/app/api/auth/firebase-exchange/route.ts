import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { adminAuth } from '@/lib/firebase/admin'

/**
 * Exchange Firebase ID token for Payload session
 * POST /api/auth/firebase-exchange
 */
export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json()

    if (!idToken) {
      return NextResponse.json({ message: 'ID token is required' }, { status: 400 })
    }

    // Verify Firebase ID token
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    const { uid, email, email_verified } = decodedToken

    if (!email) {
      return NextResponse.json({ message: 'Email not found in token' }, { status: 400 })
    }

    // Get Payload instance
    const payload = await getPayload({ config: configPromise })

    // Find or create user in Payload
    const existingUsers = await payload.find({
      collection: 'users',
      where: {
        firebaseUid: {
          equals: uid,
        },
      },
      limit: 1,
    })

    let user

    if (existingUsers.docs.length > 0) {
      // User exists, update last login
      user = existingUsers.docs[0]

      await payload.update({
        collection: 'users',
        id: user.id,
        data: {
          lastLogin: new Date().toISOString(),
        },
      })
    } else {
      // Create new user in Payload
      try {
        user = await payload.create({
          collection: 'users',
          data: {
            email,
            firebaseUid: uid,
            emailVerified: email_verified,
            role: 'admin', // Default role, adjust as needed
            lastLogin: new Date().toISOString(),
          },
        })
      } catch (error: any) {
        // Check if user exists by email but without Firebase UID
        const emailUsers = await payload.find({
          collection: 'users',
          where: {
            email: {
              equals: email,
            },
          },
          limit: 1,
        })

        if (emailUsers.docs.length > 0) {
          // Update existing user with Firebase UID
          user = await payload.update({
            collection: 'users',
            id: emailUsers.docs[0].id,
            data: {
              firebaseUid: uid,
              emailVerified: email_verified,
              lastLogin: new Date().toISOString(),
            },
          })
        } else {
          throw error
        }
      }
    }

    // Generate Payload session token
    const token = await payload.login({
      collection: 'users',
      data: {
        email: user.email,
      },
      req: {
        headers: await getHeaders(),
      } as any,
    })

    return NextResponse.json(
      {
        token: token.token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `payload-token=${token.token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
        },
      }
    )
  } catch (error: any) {
    console.error('Firebase token exchange error:', error)

    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ message: 'Token expired. Please login again.' }, { status: 401 })
    }

    if (error.code === 'auth/invalid-id-token') {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json(
      { message: 'Authentication failed', error: error.message },
      { status: 500 }
    )
  }
}
