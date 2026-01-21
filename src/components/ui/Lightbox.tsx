'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface LightboxImage {
  url: string
  alt?: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex, isOpen, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const lightboxRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!isOpen) return

    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrevious()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, currentIndex, images.length])

  useEffect(() => {
    if (!isOpen || !lightboxRef.current) return

    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default

      // Animate lightbox entrance
      gsap.fromTo(
        lightboxRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
    })
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleClose = () => {
    if (!lightboxRef.current) return

    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default

      gsap.to(lightboxRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: onClose,
      })
    })
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    } else if (isRightSwipe) {
      goToPrevious()
    }
  }

  if (!isOpen) return null

  const currentImage = images[currentIndex]

  return (
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-[100] bg-dark/95 backdrop-blur-sm"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-light/10 hover:bg-light/20 text-light transition-colors"
        aria-label="Close lightbox"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Image Counter */}
      <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-light/10 text-light font-medium">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={goToPrevious}
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 z-10',
            'p-3 rounded-full bg-light/10 hover:bg-light/20 text-light',
            'transition-all hover:scale-110'
          )}
          aria-label="Previous image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={goToNext}
          className={cn(
            'absolute right-4 top-1/2 -translate-y-1/2 z-10',
            'p-3 rounded-full bg-light/10 hover:bg-light/20 text-light',
            'transition-all hover:scale-110'
          )}
          aria-label="Next image"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div
        className="flex items-center justify-center h-full px-4 md:px-20 py-20"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative max-w-7xl max-h-full w-full">
          {/* Image */}
          <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
            <Image
              src={currentImage.url}
              alt={currentImage.alt || `Image ${currentIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Caption */}
          {currentImage.caption && (
            <div className="mt-6 text-center">
              <p className="text-light/90 text-lg">{currentImage.caption}</p>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip (optional, for desktop) */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 pb-6 hidden md:block">
          <div className="flex justify-center gap-2 px-4 overflow-x-auto scrollbar-hide">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  'relative w-20 h-20 flex-shrink-0 rounded overflow-hidden',
                  'transition-all duration-300',
                  index === currentIndex
                    ? 'ring-2 ring-primary scale-110'
                    : 'opacity-50 hover:opacity-100'
                )}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex items-center gap-6 px-4 py-2 rounded-full bg-light/10 text-light/70 text-sm">
          <span>← → Navigate</span>
          <span>ESC Close</span>
        </div>
      </div>
    </div>
  )
}
