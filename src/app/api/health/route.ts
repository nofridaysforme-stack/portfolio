import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'

/**
 * Health Check Endpoint
 *
 * Used for:
 * - Uptime monitoring
 * - Load balancer health checks
 * - Deployment verification
 * - Service status monitoring
 *
 * Returns:
 * - 200: All services healthy
 * - 503: One or more services unhealthy
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now()

  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    services: {
      database: { status: 'unknown', responseTime: 0 },
      payload: { status: 'unknown', responseTime: 0 },
      firebase: { status: 'unknown', responseTime: 0 },
    },
  }

  // Check database connection
  try {
    const dbStart = Date.now()
    const payload = await getPayload({ config: configPromise })

    // Simple query to verify database connectivity
    await payload.find({
      collection: 'users',
      limit: 1,
    })

    health.services.database.status = 'healthy'
    health.services.database.responseTime = Date.now() - dbStart
    health.services.payload.status = 'healthy'
    health.services.payload.responseTime = Date.now() - dbStart
  } catch (error) {
    console.error('Health check - Database error:', error)
    health.status = 'unhealthy'
    health.services.database.status = 'unhealthy'
    health.services.payload.status = 'unhealthy'
  }

  // Check Firebase (basic check - just verify env vars are present)
  try {
    const firebaseConfigured = !!(
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    )

    health.services.firebase.status = firebaseConfigured ? 'healthy' : 'not_configured'
  } catch (error) {
    console.error('Health check - Firebase error:', error)
    health.services.firebase.status = 'unhealthy'
  }

  // Calculate total response time
  const totalResponseTime = Date.now() - startTime

  // Determine overall health status
  const isHealthy =
    health.services.database.status === 'healthy' &&
    health.services.payload.status === 'healthy' &&
    (health.services.firebase.status === 'healthy' || health.services.firebase.status === 'not_configured')

  const statusCode = isHealthy ? 200 : 503

  return NextResponse.json(
    {
      ...health,
      status: isHealthy ? 'healthy' : 'unhealthy',
      responseTime: totalResponseTime,
    },
    {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    }
  )
}

/**
 * Simple ping endpoint for quick health checks
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, must-revalidate',
    },
  })
}
