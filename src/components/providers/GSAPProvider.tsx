'use client'

import { useEffect } from 'react'
import { initGSAP } from '@/lib/utils/gsapConfig'

/**
 * GSAP Provider - Initializes GSAP with optimal settings
 * Should be placed at the root of the application
 */
export function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize GSAP when component mounts
    initGSAP()

    // Setup smooth scroll
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth'
    }
  }, [])

  return <>{children}</>
}
