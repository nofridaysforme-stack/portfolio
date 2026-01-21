'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/lib/payload/api'

interface ProjectHeroProps {
  project: Project
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

export function ProjectHero({ project }: ProjectHeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current) return

    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default
      const { ScrollTrigger } = gsapModule

      gsap.registerPlugin(ScrollTrigger)

      // Parallax effect on background
      if (backgroundRef.current) {
        gsap.to(backgroundRef.current, {
          y: 200,
          ease: 'none',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }

      // Animate title
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: 'power3.out' }
        )
      }

      // Animate meta info
      if (metaRef.current) {
        gsap.fromTo(
          metaRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: 'power3.out' }
        )
      }

      // Animate links
      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.9, ease: 'power3.out' }
        )
      }
    })
  }, [])

  const categoryLabel = categoryLabels[project.category] || project.category

  return (
    <section
      ref={heroRef}
      className="relative min-h-[70vh] flex items-end overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 -z-10"
        style={{ willChange: 'transform' }}
      >
        {project.featuredImage ? (
          <>
            <Image
              src={project.featuredImage.url}
              alt={project.featuredImage.alt || project.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-20">
        <div className="max-w-4xl">
          {/* Breadcrumbs */}
          <nav className="mb-6 opacity-0" ref={metaRef} aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-light/70">
              <li>
                <Link href="/" className="hover:text-light transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-light transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </li>
              <li className="text-light font-medium" aria-current="page">
                {project.title}
              </li>
            </ol>
          </nav>

          {/* Category Badge */}
          <div className="mb-6 opacity-0" ref={metaRef}>
            <span className="inline-block px-4 py-2 bg-primary text-light text-sm font-semibold rounded-full">
              {categoryLabel}
            </span>
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-light mb-6 font-serif opacity-0"
          >
            {project.title}
          </h1>

          {/* Summary */}
          <p
            className="text-xl md:text-2xl text-light/90 mb-8 leading-relaxed opacity-0"
            ref={metaRef}
          >
            {project.summary}
          </p>

          {/* Tech Stack Tags */}
          {project.techStack.length > 0 && (
            <div
              className="flex flex-wrap gap-2 mb-8 opacity-0"
              ref={metaRef}
            >
              {project.techStack.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-light/10 backdrop-blur-sm text-light text-sm rounded-full border border-light/20"
                >
                  {tech.technology}
                </span>
              ))}
            </div>
          )}

          {/* Project Metrics */}
          {project.metrics && project.metrics.length > 0 && (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 opacity-0"
              ref={metaRef}
            >
              {project.metrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 bg-light/10 backdrop-blur-sm rounded-lg border border-light/20"
                >
                  <div className="text-3xl font-bold text-primary mb-1 font-serif">
                    {metric.value}
                  </div>
                  <div className="text-sm text-light/70">{metric.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Links */}
          {(project.links?.liveUrl || project.links?.githubUrl) && (
            <div
              className="flex flex-wrap gap-4 opacity-0"
              ref={linksRef}
            >
              {project.links.liveUrl && (
                <a
                  href={project.links.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3',
                    'bg-primary text-light rounded-lg',
                    'hover:bg-primary-600 hover:scale-105',
                    'transition-all duration-300 font-semibold shadow-lg'
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  View Live Demo
                </a>
              )}

              {project.links.githubUrl && (
                <a
                  href={project.links.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3',
                    'bg-light/10 backdrop-blur-sm text-light rounded-lg',
                    'hover:bg-light/20 hover:scale-105',
                    'transition-all duration-300 font-semibold',
                    'border border-light/20'
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </a>
              )}

              {project.links.caseStudyUrl && (
                <a
                  href={project.links.caseStudyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-2 px-6 py-3',
                    'bg-secondary text-dark rounded-lg',
                    'hover:bg-secondary-600 hover:scale-105',
                    'transition-all duration-300 font-semibold shadow-lg'
                  )}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Read Case Study
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
