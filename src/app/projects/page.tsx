import type { Metadata } from 'next'
import { getProjects, getSiteSettings } from '@/lib/payload/api'
import { ProjectGrid } from '@/components/portfolio/ProjectGrid'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  return {
    title: 'Projects',
    description:
      'Explore my portfolio of web applications, mobile apps, design systems, and creative projects showcasing modern development practices.',
    openGraph: {
      title: `Projects | ${settings?.siteName || 'Portfolio'}`,
      description:
        'Explore my portfolio of web applications, mobile apps, design systems, and creative projects.',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Projects | ${settings?.siteName || 'Portfolio'}`,
      description:
        'Explore my portfolio of web applications, mobile apps, design systems, and creative projects.',
    },
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          {/* Breadcrumbs */}
          <nav className="flex justify-center mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm text-dark/60">
              <li>
                <a href="/" className="hover:text-primary transition-colors">
                  Home
                </a>
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
              <li className="text-dark font-medium" aria-current="page">
                Projects
              </li>
            </ol>
          </nav>

          {/* Title & Description */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark mb-6 font-serif">
            Featured Work
          </h1>
          <p className="text-xl text-dark/70 leading-relaxed">
            A curated collection of projects showcasing creativity, technical excellence,
            and user-centered design across web, mobile, and interactive experiences.
          </p>
        </div>

        {/* Project Grid with Filtering */}
        <ProjectGrid projects={projects} showFeatured={true} />

        {/* Statistics Section */}
        {projects.length > 0 && (
          <div className="mt-20 pt-12 border-t border-dark/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2 font-serif">
                  {projects.length}
                </div>
                <div className="text-sm text-dark/60 uppercase tracking-wider">
                  Total Projects
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2 font-serif">
                  {projects.filter((p) => p.featured).length}
                </div>
                <div className="text-sm text-dark/60 uppercase tracking-wider">
                  Featured
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2 font-serif">
                  {new Set(projects.map((p) => p.category)).size}
                </div>
                <div className="text-sm text-dark/60 uppercase tracking-wider">
                  Categories
                </div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2 font-serif">
                  {
                    new Set(
                      projects.flatMap((p) => p.techStack.map((t) => t.technology))
                    ).size
                  }
                </div>
                <div className="text-sm text-dark/60 uppercase tracking-wider">
                  Technologies
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        {projects.length > 0 && (
          <div className="mt-20 text-center">
            <div className="inline-block p-8 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-2xl border border-primary/10">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-serif">
                Have a project in mind?
              </h2>
              <p className="text-dark/70 mb-8 max-w-2xl mx-auto">
                Let's work together to create something amazing. I'm always open to
                discussing new projects and creative ideas.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-4 bg-primary text-light rounded-lg hover:bg-primary-600 transition-all font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-105 duration-300"
              >
                Get In Touch
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
