import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/**
 * Fade in with upward slide animation
 * @param element - Element or selector to animate
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - Duration of animation (in seconds)
 * @param distance - Distance to slide up (in pixels)
 */
export const fadeInUp = (
  element: gsap.TweenTarget,
  delay: number = 0,
  duration: number = 0.8,
  distance: number = 60
) => {
  return gsap.fromTo(
    element,
    {
      y: distance,
      opacity: 0,
    },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      ease: 'power3.out',
    }
  )
}

/**
 * Fade in animation without slide
 * @param element - Element or selector to animate
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - Duration of animation (in seconds)
 */
export const fadeIn = (
  element: gsap.TweenTarget,
  delay: number = 0,
  duration: number = 0.8
) => {
  return gsap.fromTo(
    element,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      duration,
      delay,
      ease: 'power2.out',
    }
  )
}

/**
 * Scale and fade in animation
 * @param element - Element or selector to animate
 * @param delay - Delay before animation starts (in seconds)
 * @param duration - Duration of animation (in seconds)
 */
export const scaleIn = (
  element: gsap.TweenTarget,
  delay: number = 0,
  duration: number = 1.2
) => {
  return gsap.fromTo(
    element,
    {
      scale: 1.1,
      opacity: 0,
    },
    {
      scale: 1,
      opacity: 1,
      duration,
      delay,
      ease: 'power2.out',
    }
  )
}

/**
 * Parallax scroll effect for background elements
 * @param element - Element or selector to animate
 * @param speed - Speed of parallax (higher = slower)
 */
export const parallaxScroll = (element: gsap.TweenTarget, speed: number = 0.5) => {
  if (typeof window === 'undefined') return null

  return gsap.to(element, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  })
}

/**
 * Scale on hover effect
 * @param element - Element or selector to animate
 * @param scale - Scale value on hover
 * @param duration - Duration of animation
 */
export const scaleOnHover = (
  element: HTMLElement,
  scale: number = 1.05,
  duration: number = 0.3
) => {
  const handleMouseEnter = () => {
    gsap.to(element, {
      scale,
      duration,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(element, {
      scale: 1,
      duration,
      ease: 'power2.out',
    })
  }

  element.addEventListener('mouseenter', handleMouseEnter)
  element.addEventListener('mouseleave', handleMouseLeave)

  // Return cleanup function
  return () => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Bounce animation for scroll indicator
 * @param element - Element or selector to animate
 */
export const bounceAnimation = (element: gsap.TweenTarget) => {
  return gsap.to(element, {
    y: 10,
    duration: 0.8,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  })
}

/**
 * Smooth scroll to element
 * @param target - Target element or selector
 * @param duration - Duration of scroll animation (converted to ms for native scroll)
 * @param offset - Offset from top (for fixed headers)
 */
export const smoothScrollTo = (
  target: string | Element,
  duration: number = 1,
  offset: number = 0
) => {
  if (typeof window === 'undefined') return

  const element = typeof target === 'string' ? document.querySelector(target) : target

  if (!element) return

  const targetPosition = element.getBoundingClientRect().top + window.pageYOffset + offset

  // Use native smooth scroll for better compatibility
  window.scrollTo({
    top: targetPosition,
    behavior: 'smooth',
  })
}

/**
 * Initialize ScrollTrigger with custom defaults
 */
export const initScrollTrigger = () => {
  if (typeof window === 'undefined') return

  ScrollTrigger.defaults({
    toggleActions: 'play none none reverse',
    markers: false, // Set to true for debugging
  })

  // Refresh on window resize
  ScrollTrigger.config({
    autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
  })
}

/**
 * Reveal on scroll animation
 * @param element - Element or selector to animate
 * @param options - Animation options
 */
export const revealOnScroll = (
  element: gsap.TweenTarget,
  options?: {
    direction?: 'up' | 'down' | 'left' | 'right'
    distance?: number
    duration?: number
    delay?: number
  }
) => {
  const { direction = 'up', distance = 60, duration = 0.8, delay = 0 } = options || {}

  const from: gsap.TweenVars = {
    opacity: 0,
  }

  switch (direction) {
    case 'up':
      from.y = distance
      break
    case 'down':
      from.y = -distance
      break
    case 'left':
      from.x = distance
      break
    case 'right':
      from.x = -distance
      break
  }

  return gsap.fromTo(
    element,
    from,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

/**
 * Stagger animation for multiple elements
 * @param elements - Array of elements or selector
 * @param options - Animation options
 */
export const staggerReveal = (
  elements: gsap.TweenTarget,
  options?: {
    stagger?: number
    duration?: number
    delay?: number
    direction?: 'up' | 'down' | 'left' | 'right'
  }
) => {
  const {
    stagger = 0.1,
    duration = 0.6,
    delay = 0,
    direction = 'up',
  } = options || {}

  const from: gsap.TweenVars = {
    opacity: 0,
  }

  switch (direction) {
    case 'up':
      from.y = 40
      break
    case 'down':
      from.y = -40
      break
    case 'left':
      from.x = 40
      break
    case 'right':
      from.x = -40
      break
  }

  return gsap.fromTo(
    elements,
    from,
    {
      opacity: 1,
      x: 0,
      y: 0,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
    }
  )
}

/**
 * Text reveal animation (word by word or character by character)
 * @param element - Text element to animate
 * @param type - Type of animation ('words' or 'chars')
 * @param options - Animation options
 */
export const textReveal = (
  element: HTMLElement,
  type: 'words' | 'chars' = 'words',
  options?: {
    stagger?: number
    duration?: number
    delay?: number
  }
) => {
  const { stagger = 0.05, duration = 0.6, delay = 0 } = options || {}

  const text = element.textContent || ''
  element.textContent = ''

  let parts: string[]

  if (type === 'words') {
    parts = text.split(' ')
  } else {
    parts = text.split('')
  }

  const spans = parts.map((part) => {
    const span = document.createElement('span')
    span.textContent = type === 'words' ? part + ' ' : part
    span.style.display = 'inline-block'
    span.style.opacity = '0'
    element.appendChild(span)
    return span
  })

  return gsap.to(spans, {
    opacity: 1,
    y: 0,
    duration,
    delay,
    stagger,
    ease: 'power3.out',
  })
}

/**
 * Cleanup all GSAP animations
 */
export const cleanupAnimations = () => {
  if (typeof window !== 'undefined') {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    gsap.killTweensOf('*')
  }
}

/**
 * Card stagger animation for project cards
 * @param cards - Array of card elements or selector
 * @param options - Animation options
 */
export const cardStagger = (
  cards: gsap.TweenTarget,
  options?: {
    stagger?: number
    duration?: number
    delay?: number
    distance?: number
  }
) => {
  const { stagger = 0.15, duration = 0.8, delay = 0, distance = 60 } = options || {}

  return gsap.fromTo(
    cards,
    {
      y: distance,
      opacity: 0,
      scale: 0.95,
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cards,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  )
}

/**
 * Filter transition animation for grid items
 * @param grid - Grid container element
 * @param oldItems - Items to fade out
 * @param newItems - Items to fade in
 */
export const filterTransition = (
  oldItems: gsap.TweenTarget,
  newItems: gsap.TweenTarget
) => {
  const timeline = gsap.timeline()

  // Fade out old items
  timeline.to(oldItems, {
    opacity: 0,
    scale: 0.9,
    duration: 0.3,
    stagger: 0.05,
    ease: 'power2.in',
  })

  // Fade in new items
  timeline.fromTo(
    newItems,
    {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power3.out',
    },
    '-=0.1' // Slight overlap
  )

  return timeline
}

/**
 * Image zoom effect on hover (for use with mouse events)
 * @param image - Image element to animate
 * @param scale - Scale factor on hover
 */
export const imageZoom = (image: HTMLElement, scale: number = 1.1) => {
  const handleMouseEnter = () => {
    gsap.to(image, {
      scale,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    gsap.to(image, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    })
  }

  image.addEventListener('mouseenter', handleMouseEnter)
  image.addEventListener('mouseleave', handleMouseLeave)

  // Return cleanup function
  return () => {
    image.removeEventListener('mouseenter', handleMouseEnter)
    image.removeEventListener('mouseleave', handleMouseLeave)
  }
}

/**
 * Fade and slide animation for filtering
 * @param element - Element to animate
 * @param show - Whether to show or hide
 */
export const fadeSlide = (element: gsap.TweenTarget, show: boolean = true) => {
  if (show) {
    return gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 20,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      }
    )
  } else {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.in',
    })
  }
}
