import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware to protect admin routes
 * Redirects to login if not authenticated
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for login and forgot password pages
  if (
    pathname === '/admin/login' ||
    pathname === '/admin/forgot-password' ||
    pathname.startsWith('/api/auth/firebase-exchange') ||
    pathname.startsWith('/api/auth/logout')
  ) {
    return NextResponse.next()
  }

  // Check for auth cookie
  const payloadToken = request.cookies.get('payload-token')

  // If no token, redirect to login
  if (!payloadToken) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify session with Payload
  try {
    const verifyResponse = await fetch(new URL('/api/auth/verify', request.url), {
      headers: {
        Cookie: `payload-token=${payloadToken.value}`,
      },
    })

    if (!verifyResponse.ok) {
      // Invalid session, redirect to login
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)

      // Clear invalid cookie
      response.cookies.delete('payload-token')

      return response
    }

    return NextResponse.next()
  } catch (error) {
    // Error verifying session, redirect to login
    const loginUrl = new URL('/admin/login', request.url)
    return NextResponse.redirect(loginUrl)
  }
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    // Exclude static files and API routes (except auth)
    '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico).*)',
  ],
}
