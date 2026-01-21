import type { ImageProps } from 'next/image'

/**
 * Image optimization utilities for mobile-first responsive images
 */

/**
 * Get optimized image sizes for different breakpoints
 * @param maxWidth - Maximum width of the image
 * @param aspectRatio - Aspect ratio (width / height)
 */
export function getResponsiveSizes(
  maxWidth: number,
  aspectRatio: number = 16 / 9
): {
  mobile: { width: number; height: number }
  tablet: { width: number; height: number }
  desktop: { width: number; height: number }
} {
  return {
    mobile: {
      width: Math.min(640, maxWidth),
      height: Math.round(Math.min(640, maxWidth) / aspectRatio),
    },
    tablet: {
      width: Math.min(1024, maxWidth),
      height: Math.round(Math.min(1024, maxWidth) / aspectRatio),
    },
    desktop: {
      width: maxWidth,
      height: Math.round(maxWidth / aspectRatio),
    },
  }
}

/**
 * Generate sizes attribute for responsive images
 * @param config - Configuration for different breakpoints
 */
export function generateSizesAttribute(config: {
  mobile?: string
  tablet?: string
  desktop?: string
  default?: string
}): string {
  const { mobile = '100vw', tablet = '50vw', desktop = '33vw', default: defaultSize = '100vw' } = config

  const sizes = []

  if (mobile) sizes.push(`(max-width: 640px) ${mobile}`)
  if (tablet) sizes.push(`(max-width: 1024px) ${tablet}`)
  if (desktop) sizes.push(`(min-width: 1025px) ${desktop}`)

  sizes.push(defaultSize)

  return sizes.join(', ')
}

/**
 * Get loading strategy based on image position
 * @param isAboveFold - Whether image is above the fold
 * @param isPriority - Whether image should be prioritized
 */
export function getLoadingStrategy(
  isAboveFold: boolean = false,
  isPriority: boolean = false
): {
  loading: 'lazy' | 'eager' | undefined
  priority: boolean
  placeholder: 'blur' | 'empty'
} {
  if (isPriority || isAboveFold) {
    return {
      loading: 'eager',
      priority: true,
      placeholder: 'blur',
    }
  }

  return {
    loading: 'lazy',
    priority: false,
    placeholder: 'empty',
  }
}

/**
 * Generate responsive image props for Next.js Image component
 * Optimized for mobile-first approach
 */
export function getResponsiveImageProps(config: {
  src: string
  alt: string
  width: number
  height: number
  sizes?: {
    mobile?: string
    tablet?: string
    desktop?: string
    default?: string
  }
  priority?: boolean
  quality?: number
}): Partial<ImageProps> {
  const { src, alt, width, height, sizes, priority = false, quality = 85 } = config

  const loading = getLoadingStrategy(priority, priority)

  return {
    src,
    alt,
    width,
    height,
    sizes: sizes ? generateSizesAttribute(sizes) : '100vw',
    priority: loading.priority,
    quality,
    loading: loading.loading,
    placeholder: loading.placeholder,
  }
}

/**
 * Calculate optimal image dimensions for mobile
 * Reduces dimensions for mobile devices to save bandwidth
 * @param originalWidth - Original width
 * @param originalHeight - Original height
 * @param deviceWidth - Device width (default: window.innerWidth)
 */
export function getMobileOptimizedDimensions(
  originalWidth: number,
  originalHeight: number,
  deviceWidth?: number
): { width: number; height: number } {
  const viewport = deviceWidth || (typeof window !== 'undefined' ? window.innerWidth : 1920)

  // For mobile devices (< 768px), cap at device width
  if (viewport < 768) {
    const scaleFactor = Math.min(1, viewport / originalWidth)
    return {
      width: Math.round(originalWidth * scaleFactor),
      height: Math.round(originalHeight * scaleFactor),
    }
  }

  // For tablets (< 1024px), cap at 1024px
  if (viewport < 1024) {
    const scaleFactor = Math.min(1, 1024 / originalWidth)
    return {
      width: Math.round(originalWidth * scaleFactor),
      height: Math.round(originalHeight * scaleFactor),
    }
  }

  // Desktop - use original dimensions
  return { width: originalWidth, height: originalHeight }
}

/**
 * Check if WebP is supported
 * Modern browsers support WebP, but fallback detection is useful
 */
export function isWebPSupported(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
  }
  return false
}

/**
 * Check if AVIF is supported
 * AVIF offers better compression than WebP
 */
export function isAVIFSupported(): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0
  }
  return false
}

/**
 * Get optimal image format based on browser support
 * @returns Preferred format: 'avif' | 'webp' | 'jpeg'
 */
export function getOptimalImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (isAVIFSupported()) return 'avif'
  if (isWebPSupported()) return 'webp'
  return 'jpeg'
}

/**
 * Generate blur data URL for image placeholder
 * @param width - Width of blur placeholder
 * @param height - Height of blur placeholder
 * @param color - Base color (hex or rgb)
 */
export function generateBlurDataURL(
  width: number = 10,
  height: number = 10,
  color: string = '#e5e5e0'
): string {
  // Convert hex to RGB
  let r = 229,
    g = 229,
    b = 224 // default light color

  if (color.startsWith('#')) {
    const hex = color.slice(1)
    r = parseInt(hex.substr(0, 2), 16)
    g = parseInt(hex.substr(2, 2), 16)
    b = parseInt(hex.substr(4, 2), 16)
  }

  // Create SVG blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="rgb(${r}, ${g}, ${b})" filter="url(#blur)"/>
    </svg>
  `

  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Common image size configurations for portfolio components
 */
export const IMAGE_SIZES = {
  // Hero images (full width)
  hero: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '100vw',
    default: '100vw',
  },

  // Project card images (grid layout)
  projectCard: {
    mobile: '100vw',
    tablet: '50vw',
    desktop: '33vw',
    default: '33vw',
  },

  // Project detail featured image
  projectFeatured: {
    mobile: '100vw',
    tablet: '100vw',
    desktop: '80vw',
    default: '80vw',
  },

  // Gallery thumbnails
  galleryThumbnail: {
    mobile: '50vw',
    tablet: '33vw',
    desktop: '25vw',
    default: '25vw',
  },

  // Avatar/profile images
  avatar: {
    mobile: '80px',
    tablet: '100px',
    desktop: '120px',
    default: '100px',
  },

  // Logo
  logo: {
    mobile: '120px',
    tablet: '150px',
    desktop: '180px',
    default: '150px',
  },
} as const

/**
 * Common image dimensions for portfolio components
 */
export const IMAGE_DIMENSIONS = {
  hero: { width: 1920, height: 1080, aspectRatio: 16 / 9 },
  projectCard: { width: 800, height: 600, aspectRatio: 4 / 3 },
  projectFeatured: { width: 1600, height: 900, aspectRatio: 16 / 9 },
  galleryThumbnail: { width: 400, height: 300, aspectRatio: 4 / 3 },
  avatar: { width: 200, height: 200, aspectRatio: 1 },
  logo: { width: 200, height: 60, aspectRatio: 10 / 3 },
  ogImage: { width: 1200, height: 630, aspectRatio: 1200 / 630 },
} as const

/**
 * Get responsive image configuration for a specific component type
 * @param type - Component type (hero, projectCard, etc.)
 * @param src - Image source URL
 * @param alt - Alt text
 * @param priority - Whether to prioritize loading
 */
export function getImageConfig(
  type: keyof typeof IMAGE_SIZES,
  src: string,
  alt: string,
  priority: boolean = false
): Partial<ImageProps> {
  const sizes = IMAGE_SIZES[type]
  const dimensions = IMAGE_DIMENSIONS[type]

  return getResponsiveImageProps({
    src,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    sizes,
    priority,
    quality: priority ? 90 : 85, // Higher quality for priority images
  })
}

/**
 * Preload critical images for better LCP
 * @param images - Array of image URLs to preload
 */
export function preloadCriticalImages(images: string[]) {
  if (typeof window === 'undefined') return

  images.forEach((src) => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src

    // Add format-specific hints
    const format = getOptimalImageFormat()
    if (format === 'avif') {
      link.type = 'image/avif'
    } else if (format === 'webp') {
      link.type = 'image/webp'
    }

    document.head.appendChild(link)
  })
}

/**
 * Lazy load images with Intersection Observer
 * @param selector - CSS selector for images to lazy load
 */
export function setupLazyLoading(selector: string = 'img[data-src]') {
  if (typeof window === 'undefined') return

  const images = document.querySelectorAll<HTMLImageElement>(selector)

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            const src = img.dataset.src

            if (src) {
              img.src = src
              img.removeAttribute('data-src')
              observer.unobserve(img)
            }
          }
        })
      },
      {
        rootMargin: '50px 0px', // Start loading 50px before entering viewport
      }
    )

    images.forEach((img) => imageObserver.observe(img))
  } else {
    // Fallback for older browsers
    images.forEach((img) => {
      const src = img.dataset.src
      if (src) img.src = src
    })
  }
}
