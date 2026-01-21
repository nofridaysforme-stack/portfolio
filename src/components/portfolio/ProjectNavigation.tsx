import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'
import type { Project } from '@/lib/payload/api'

interface ProjectNavigationProps {
  previousProject?: Project | null
  nextProject?: Project | null
}

export function ProjectNavigation({
  previousProject,
  nextProject,
}: ProjectNavigationProps) {
  if (!previousProject && !nextProject) return null

  return (
    <nav className="border-t border-dark/10 pt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Previous Project */}
        {previousProject ? (
          <Link
            href={`/projects/${previousProject.slug}`}
            className="group relative overflow-hidden rounded-lg bg-light border border-dark/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 text-dark/60 text-sm mb-3">
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous Project
              </div>
              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-2 font-serif">
                {previousProject.title}
              </h3>
              <p className="text-dark/70 text-sm line-clamp-2">
                {previousProject.summary}
              </p>
            </div>
            {previousProject.featuredImage && (
              <div className="relative h-48 opacity-20 group-hover:opacity-30 transition-opacity">
                <Image
                  src={previousProject.featuredImage.url}
                  alt={previousProject.featuredImage.alt || previousProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}

        {/* Next Project */}
        {nextProject ? (
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group relative overflow-hidden rounded-lg bg-light border border-dark/10 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-center justify-end gap-2 text-dark/60 text-sm mb-3">
                Next Project
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
              </div>
              <h3 className="text-xl font-bold text-dark group-hover:text-primary transition-colors mb-2 font-serif text-right">
                {nextProject.title}
              </h3>
              <p className="text-dark/70 text-sm line-clamp-2 text-right">
                {nextProject.summary}
              </p>
            </div>
            {nextProject.featuredImage && (
              <div className="relative h-48 opacity-20 group-hover:opacity-30 transition-opacity">
                <Image
                  src={nextProject.featuredImage.url}
                  alt={nextProject.featuredImage.alt || nextProject.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>

      {/* Back to Projects Link */}
      <div className="mt-8 text-center">
        <Link
          href="/projects"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3',
            'text-dark hover:text-primary',
            'border border-dark/20 hover:border-primary/30',
            'rounded-lg transition-all duration-300',
            'hover:scale-105 font-medium'
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
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          Back to All Projects
        </Link>
      </div>
    </nav>
  )
}
