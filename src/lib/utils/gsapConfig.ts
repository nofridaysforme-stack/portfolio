import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Initialize GSAP with optimal settings for the site
 */
export function initGSAP() {
  if (typeof window === 'undefined') return

  // Set global GSAP defaults
  gsap.defaults({
    ease: 'power3.out',
    duration: 0.8,
  })

  // Configure ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    markers: false, // Set to true for debugging
  })

  // Configure ScrollTrigger for better performance
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    limitCallbacks: true, // Throttle callbacks for performance
  })

  // Handle accessibility - reduce motion if preferred
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (prefersReducedMotion) {
    // Speed up animations dramatically for reduced motion
    gsap.globalTimeline.timeScale(100)

    // Reduce ScrollTrigger update frequency
    ScrollTrigger.config({
      syncInterval: 1000,
    })
  }

  // Refresh ScrollTrigger on window resize (debounced)
  let resizeTimeout: NodeJS.Timeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 300)
  })

  // Detect mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Reduce complex animations on mobile for performance
  if (isMobile) {
    gsap.defaults({
      duration: 0.5, // Faster animations on mobile
    })
  }
}

/**
 * Cleanup GSAP animations
 * Call this on component unmount or route changes
 */
export function cleanupGSAP() {
  if (typeof window === 'undefined') return

  // Kill all ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

  // Kill all running tweens
  gsap.killTweensOf('*')
}

/**
 * Refresh all ScrollTriggers
 * Useful after content changes or layout shifts
 */
export function refreshScrollTriggers() {
  if (typeof window === 'undefined') return
  ScrollTrigger.refresh()
}

/**
 * Create a matched media query for responsive animations
 * @param breakpoint - Breakpoint value (e.g., '768px')
 */
export function createMatchMedia(breakpoint: string = '768px') {
  if (typeof window === 'undefined') return null

  return gsap.matchMedia()
}

/**
 * Batch process elements for better performance
 * @param elements - Elements to animate
 * @param config - ScrollTrigger config
 */
export function batchScrollTrigger(
  elements: string | Element[],
  config?: ScrollTrigger.BatchVars
) {
  if (typeof window === 'undefined') return null

  return ScrollTrigger.batch(elements, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
      })
    },
    start: 'top 85%',
    ...config,
  })
}

/**
 * Get current scroll position
 */
export function getScrollPosition(): number {
  if (typeof window === 'undefined') return 0
  return window.pageYOffset || document.documentElement.scrollTop
}

/**
 * Check if element is in viewport
 * @param element - Element to check
 * @param offset - Offset from viewport edges
 */
export function isInViewport(element: Element, offset: number = 0): boolean {
  if (typeof window === 'undefined') return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top >= -offset &&
    rect.left >= -offset &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
  )
}

/**
 * Performance monitoring for animations
 */
export function logScrollTriggerPerformance() {
  if (typeof window === 'undefined') return

  const triggers = ScrollTrigger.getAll()
  console.log(`Active ScrollTriggers: ${triggers.length}`)

  triggers.forEach((trigger, index) => {
    console.log(`Trigger ${index + 1}:`, {
      element: trigger.trigger,
      start: trigger.start,
      end: trigger.end,
      progress: trigger.progress,
    })
  })
}

// Export ScrollTrigger for direct use
export { ScrollTrigger }
export default { initGSAP, cleanupGSAP, refreshScrollTriggers }
