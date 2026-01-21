'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/lib/payload/api'

interface ProjectCardProps {
  project: Project
  className?: string
}

// Category label mapping
const categoryLabels: Record<string, string> = {
  'web-application': 'Web Application',
  'mobile-app': 'Mobile App',
  'design-system': 'Design System',
  'music-production': 'Music Production',
  'ai-ml': 'AI/ML',
  'client-work': 'Client Work',
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const overlay = overlayRef.current

    if (!card || !image || !overlay) return

    // Import GSAP dynamically for proper client-side execution
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default

      const handleMouseEnter = () => {
        gsap.to(image, {
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out',
        })
        gsap.to(overlay, {
          opacity: 0.9,
          duration: 0.4,
          ease: 'power2.out',
        })
      }

      const handleMouseLeave = () => {
        gsap.to(image, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
        })
        gsap.to(overlay, {
          opacity: 0.6,
          duration: 0.4,
          ease: 'power2.out',
        })
      }

      card.addEventListener('mouseenter', handleMouseEnter)
      card.addEventListener('mouseleave', handleMouseLeave)

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter)
        card.removeEventListener('mouseleave', handleMouseLeave)
      }
    })
  }, [])

  const categoryLabel = categoryLabels[project.category] || project.category

  // Get first 3 tech stack items
  const techStack = project.techStack.slice(0, 3)

  return (
    <div
      ref={cardRef}
      className={cn(
        'project-card group relative',
        'bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl',
        'transition-shadow duration-300',
        className
      )}
    >
      <Link href={`/projects/${project.slug}`} className="block">
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10">
          {project.featuredImage ? (
            <>
              <div ref={imageRef} className="w-full h-full">
                <Image
                  src={project.featuredImage.url}
                  alt={project.featuredImage.alt || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {/* Overlay */}
              <div
                ref={overlayRef}
                className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-60 transition-opacity duration-300"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">🎨</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="inline-block px-3 py-1 bg-primary text-light text-xs font-semibold rounded-full shadow-lg">
              {categoryLabel}
            </span>
          </div>

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 bg-secondary text-dark text-xs font-semibold rounded-full shadow-lg">
                ⭐ Featured
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold text-dark mb-2 group-hover:text-primary transition-colors font-serif">
            {project.title}
          </h3>

          {/* Summary */}
          <p className="text-dark/70 mb-4 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>

          {/* Tech Stack Tags */}
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {techStack.map((tech, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-light text-dark/80 text-xs rounded border border-dark/10"
                >
                  {tech.technology}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium">
                  +{project.techStack.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* View Project Link */}
          <div className="flex items-center text-primary group-hover:text-primary-600 font-medium">
            View Project
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </div>
        </div>
      </Link>
    </div>
  )
}
