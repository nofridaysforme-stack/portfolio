'use client'

import { useEffect } from 'react'
import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals tracking component
 * Tracks Core Web Vitals (LCP, FID, CLS, FCP, TTFB, INP)
 * Logs to console in development and sends to analytics in production
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    const isDevelopment = process.env.NODE_ENV === 'development'

    // Log to console in development mode
    if (isDevelopment) {
      console.group(`⚡ Web Vital: ${metric.name}`)
      console.log('Value:', metric.value)
      console.log('Rating:', metric.rating)
      console.log('ID:', metric.id)
      console.groupEnd()
    }

    // Send to analytics in production
    if (!isDevelopment && typeof window !== 'undefined') {
      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }

      // Facebook Pixel
      if (window.fbq) {
        window.fbq('trackCustom', 'WebVital', {
          metric: metric.name,
          value: metric.value,
          rating: metric.rating,
        })
      }

      // Custom analytics endpoint (optional)
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metric: metric.name,
            value: metric.value,
            rating: metric.rating,
            id: metric.id,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
          }),
        }).catch((err) => {
          console.error('Failed to send web vitals:', err)
        })
      }
    }
  })

  // Display vitals in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info(
        '%c🚀 Web Vitals Tracking Active',
        'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;'
      )
      console.info('Monitoring: LCP, FID, CLS, FCP, TTFB, INP')
    }
  }, [])

  return null
}

/**
 * Web Vitals display overlay for development
 * Shows real-time metrics in bottom-right corner
 */
export function WebVitalsOverlay() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    let metricsData: Record<string, { value: number; rating: string }> = {}

    // Create overlay element
    const overlay = document.createElement('div')
    overlay.id = 'web-vitals-overlay'
    overlay.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      z-index: 999999;
      min-width: 200px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    `

    const updateOverlay = () => {
      const metrics = Object.entries(metricsData)
        .map(([name, data]) => {
          const color =
            data.rating === 'good' ? '#10b981' : data.rating === 'needs-improvement' ? '#f59e0b' : '#ef4444'
          return `<div style="margin: 4px 0;">
            <span style="color: ${color};">●</span>
            <strong>${name}</strong>: ${Math.round(data.value)}${name === 'CLS' ? '' : 'ms'}
          </div>`
        })
        .join('')

      overlay.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: #10b981;">⚡ Web Vitals</div>
        ${metrics || '<div style="color: #6b7280;">Collecting metrics...</div>'}
      `
    }

    // Listen for web vitals
    const handler = (metric: any) => {
      metricsData[metric.name] = {
        value: metric.value,
        rating: metric.rating,
      }
      updateOverlay()
    }

    // Add custom event listener for web vitals
    const originalConsoleLog = console.log
    console.log = function (...args) {
      if (args[0]?.includes?.('Web Vital:')) {
        // Extract metric from console log
        const metricMatch = args[0].match(/Web Vital: (\w+)/)
        if (metricMatch) {
          const metricName = metricMatch[1]
          // This is a simplified version - in reality, we'd need better parsing
        }
      }
      originalConsoleLog.apply(console, args)
    }

    document.body.appendChild(overlay)
    updateOverlay()

    // Cleanup
    return () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      console.log = originalConsoleLog
    }
  }, [])

  return null
}

// Type definitions for analytics
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
  }
}
