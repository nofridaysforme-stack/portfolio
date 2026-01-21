'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import {
  fadeInUp,
  scaleIn,
  bounceAnimation,
  smoothScrollTo,
  initScrollTrigger,
} from '@/lib/utils/animations'

export interface HeroBlockProps {
  headline: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: {
    url: string
    alt?: string
  }
  backgroundVideo?: string
  height?: 'small' | 'medium' | 'large' | 'fullscreen'
  overlay?: boolean
  alignment?: 'left' | 'center' | 'right'
}

const heightClasses = {
  small: 'min-h-[50vh]',
  medium: 'min-h-[70vh]',
  large: 'min-h-[90vh]',
  fullscreen: 'min-h-screen',
}

const alignmentClasses = {
  left: 'text-left items-start',
  center: 'text-center items-center',
  right: 'text-right items-end',
}

export function HeroBlock({
  headline,
  subheadline,
  ctaText,
  ctaLink,
  backgroundImage,
  backgroundVideo,
  height = 'large',
  overlay = true,
  alignment = 'center',
}: HeroBlockProps) {
  const heroRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Initialize ScrollTrigger
    initScrollTrigger()

    // Animate headline
    if (headlineRef.current) {
      fadeInUp(headlineRef.current, 0.3, 1, 80)
    }

    // Animate subheadline
    if (subheadlineRef.current) {
      fadeInUp(subheadlineRef.current, 0.6, 1, 60)
    }

    // Animate CTA button
    if (ctaRef.current) {
      fadeInUp(ctaRef.current, 0.9, 0.8, 40)
    }

    // Animate background (zoom effect)
    if (backgroundRef.current) {
      scaleIn(backgroundRef.current, 0, 1.5)
    }

    // Animate scroll indicator (bounce)
    if (scrollIndicatorRef.current) {
      bounceAnimation(scrollIndicatorRef.current)
    }

    // Cleanup animations on unmount
    return () => {
      // GSAP automatically cleans up, but we can add explicit cleanup if needed
    }
  }, [])

  const handleScrollClick = () => {
    // Scroll to next section (assumes there's content after hero)
    if (heroRef.current) {
      const nextSection = heroRef.current.nextElementSibling
      if (nextSection) {
        smoothScrollTo(nextSection as Element, 1.2, -80)
      }
    }
  }

  const isExternalLink = ctaLink?.startsWith('http')
  const CTAComponent = ctaLink?.startsWith('#') ? 'a' : Link

  return (
    <section
      ref={heroRef}
      className={cn(
        'relative w-full overflow-hidden',
        heightClasses[height],
        'flex items-center justify-center'
      )}
      aria-label="Hero section"
    >
      {/* Background Image/Video */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        {backgroundVideo ? (
          <div className="absolute inset-0">
            {/* Video background - supports MP4 for now */}
            {backgroundVideo.endsWith('.mp4') ? (
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src={backgroundVideo} type="video/mp4" />
              </video>
            ) : (
              // Fallback to image if video URL is not MP4
              backgroundImage && (
                <Image
                  src={backgroundImage.url}
                  alt={backgroundImage.alt || ''}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              )
            )}
          </div>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage.url}
            alt={backgroundImage.alt || ''}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          // Gradient fallback
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/30" />
        )}

        {/* Overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/50 to-dark/70" />
        )}
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            'flex flex-col gap-6 max-w-5xl',
            alignment === 'left' && 'mr-auto',
            alignment === 'center' && 'mx-auto',
            alignment === 'right' && 'ml-auto',
            alignmentClasses[alignment]
          )}
        >
          {/* Headline */}
          <h1
            ref={headlineRef}
            className={cn(
              'text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold',
              'text-light font-serif leading-tight',
              'opacity-0' // Initial state for GSAP
            )}
          >
            {headline}
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p
              ref={subheadlineRef}
              className={cn(
                'text-lg sm:text-xl md:text-2xl',
                'text-light/90 font-light leading-relaxed',
                'max-w-3xl',
                'opacity-0' // Initial state for GSAP
              )}
            >
              {subheadline}
            </p>
          )}

          {/* CTA Button */}
          {ctaText && ctaLink && (
            <CTAComponent
              ref={ctaRef}
              href={ctaLink}
              {...(isExternalLink && {
                target: '_blank',
                rel: 'noopener noreferrer',
              })}
              className={cn(
                'inline-flex items-center justify-center',
                'px-8 py-4 rounded-lg',
                'bg-primary text-light font-semibold text-lg',
                'hover:bg-primary-600 hover:scale-105',
                'transition-all duration-300',
                'shadow-lg hover:shadow-xl',
                'opacity-0', // Initial state for GSAP
                alignment === 'center' && 'self-center',
                alignment === 'right' && 'self-end'
              )}
            >
              {ctaText}
              <svg
                className="ml-2 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </CTAComponent>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {height === 'fullscreen' && (
        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
          onClick={handleScrollClick}
          role="button"
          tabIndex={0}
          aria-label="Scroll to next section"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleScrollClick()
            }
          }}
        >
          <div className="flex flex-col items-center gap-2 text-light/70 hover:text-light transition-colors">
            <span className="text-sm font-medium uppercase tracking-wider">
              Scroll
            </span>
            <svg
              className="w-6 h-6 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  )
}
