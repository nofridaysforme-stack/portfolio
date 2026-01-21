'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Lightbox } from '@/components/ui/Lightbox'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/lib/payload/api'

interface ProjectGalleryProps {
  gallery: Project['gallery']
  className?: string
}

export function ProjectGallery({ gallery, className }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const galleryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!galleryRef.current || !gallery) return

    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default
      const { ScrollTrigger } = gsapModule

      gsap.registerPlugin(ScrollTrigger)

      const items = galleryRef.current?.querySelectorAll('.gallery-item')
      if (!items) return

      gsap.fromTo(
        items,
        {
          y: 60,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: galleryRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })
  }, [gallery])

  if (!gallery || gallery.length === 0) return null

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // Convert gallery to lightbox images
  const lightboxImages = gallery.map((item) => ({
    url: item.image.url,
    alt: item.image.alt,
    caption: item.caption,
  }))

  return (
    <>
      <div className={cn('space-y-6', className)}>
        <h2 className="text-3xl md:text-4xl font-bold text-dark font-serif">
          Project Gallery
        </h2>

        <div
          ref={galleryRef}
          className={cn(
            'grid gap-4',
            gallery.length === 1 && 'grid-cols-1',
            gallery.length === 2 && 'grid-cols-1 md:grid-cols-2',
            gallery.length >= 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          )}
        >
          {gallery.map((item, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className={cn(
                'gallery-item group relative overflow-hidden rounded-lg',
                'aspect-video bg-light cursor-pointer',
                'hover:shadow-xl transition-all duration-300',
                // Make first item span 2 columns if there are 3+ images
                index === 0 && gallery.length >= 3 && 'md:col-span-2'
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={item.image.url}
                alt={item.image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/30 transition-all duration-300" />

              {/* View Icon */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-light/90 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>

              {/* Caption */}
              {item.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-light text-sm">{item.caption}</p>
                </div>
              )}
            </button>
          ))}
        </div>

        {gallery.length > 0 && (
          <p className="text-dark/60 text-sm">
            Click any image to view in full size • {gallery.length}{' '}
            {gallery.length === 1 ? 'image' : 'images'}
          </p>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  )
}
