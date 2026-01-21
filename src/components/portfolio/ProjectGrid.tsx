'use client'

import { useEffect, useState, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { Project } from '@/lib/payload/api'
import { ProjectCard } from './ProjectCard'
import { CategoryFilter, type CategoryOption } from '@/components/ui/CategoryFilter'
import { cn } from '@/lib/utils/cn'

interface ProjectGridProps {
  projects: Project[]
  showFeatured?: boolean
}

// Category definitions matching Payload schema
const categories: CategoryOption[] = [
  { label: 'Web Application', value: 'web-application' },
  { label: 'Mobile App', value: 'mobile-app' },
  { label: 'Design System', value: 'design-system' },
  { label: 'Music Production', value: 'music-production' },
  { label: 'AI/ML', value: 'ai-ml' },
  { label: 'Client Work', value: 'client-work' },
]

export function ProjectGrid({ projects, showFeatured = true }: ProjectGridProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const gridRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects)
  const [isAnimating, setIsAnimating] = useState(false)

  // Initialize active category from URL
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [searchParams])

  // Filter projects based on active category
  useEffect(() => {
    if (activeCategory === 'all') {
      setFilteredProjects(projects)
    } else {
      setFilteredProjects(projects.filter((p) => p.category === activeCategory))
    }
  }, [activeCategory, projects])

  // Animate cards when they change
  useEffect(() => {
    if (!gridRef.current) return

    setIsAnimating(true)

    // Import GSAP dynamically
    import('gsap').then((gsapModule) => {
      const gsap = gsapModule.default

      const cards = gridRef.current?.querySelectorAll('.project-card')
      if (!cards || cards.length === 0) {
        setIsAnimating(false)
        return
      }

      // Animate cards in
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 40,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          onComplete: () => setIsAnimating(false),
        }
      )
    })
  }, [filteredProjects])

  // Calculate category counts
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: projects.filter((p) => p.category === cat.value).length,
  }))

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)

    // Update URL with category parameter
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }

    const query = params.toString()
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false })
  }

  // Separate featured and regular projects
  const featuredProjects = showFeatured
    ? filteredProjects.filter((p) => p.featured)
    : []
  const regularProjects = showFeatured
    ? filteredProjects.filter((p) => !p.featured)
    : filteredProjects

  return (
    <div className="space-y-12">
      {/* Category Filter */}
      <div className="flex justify-center">
        <CategoryFilter
          categories={categoriesWithCounts}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-dark font-serif">
              Featured Projects
            </h2>
            <span className="px-3 py-1 bg-secondary/20 text-secondary text-sm font-semibold rounded-full">
              ⭐ {featuredProjects.length}
            </span>
          </div>
          <div
            ref={showFeatured ? gridRef : undefined}
            className={cn(
              'grid gap-8',
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              isAnimating && 'pointer-events-none'
            )}
            role="region"
            aria-label="Featured projects"
            id="projects-grid"
          >
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Regular Projects Section */}
      {regularProjects.length > 0 && (
        <div className="space-y-6">
          {featuredProjects.length > 0 && (
            <h2 className="text-2xl font-bold text-dark font-serif">
              All Projects
            </h2>
          )}
          <div
            ref={!showFeatured || featuredProjects.length === 0 ? gridRef : undefined}
            className={cn(
              'grid gap-8',
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
              isAnimating && 'pointer-events-none'
            )}
            role="region"
            aria-label="All projects"
            id={featuredProjects.length === 0 ? 'projects-grid' : undefined}
          >
            {regularProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block p-6 bg-light rounded-full mb-6">
            <span className="text-6xl opacity-50">🔍</span>
          </div>
          <h3 className="text-2xl font-bold text-dark mb-3 font-serif">
            No Projects Found
          </h3>
          <p className="text-dark/70 max-w-md mx-auto mb-6">
            No projects match the selected category. Try selecting a different
            category or view all projects.
          </p>
          <button
            onClick={() => handleCategoryChange('all')}
            className="px-6 py-3 bg-primary text-light rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            View All Projects
          </button>
        </div>
      )}

      {/* Loading State (for future pagination) */}
      {isAnimating && filteredProjects.length > 0 && (
        <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}
