import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProjects, getProjectBySlug, getSiteSettings } from '@/lib/payload/api'
import { ProjectHero } from '@/components/portfolio/ProjectHero'
import { ProjectGallery } from '@/components/portfolio/ProjectGallery'
import { ProjectNavigation } from '@/components/portfolio/ProjectNavigation'
import {
  generateProjectStructuredData,
  generateBreadcrumbStructuredData,
} from '@/lib/utils/structured-data'

interface ProjectPageProps {
  params: {
    slug: string
  }
}

// Generate static params for all projects
export async function generateStaticParams() {
  const projects = await getProjects()

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  const settings = await getSiteSettings()

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return {
    title: project.title,
    description: project.summary,
    keywords: project.techStack.map((tech) => tech.technology).join(', '),
    authors: settings?.siteName ? [{ name: settings.siteName }] : undefined,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
      publishedTime: project.createdAt,
      modifiedTime: project.updatedAt,
      url: `${baseUrl}/projects/${project.slug}`,
      ...(project.featuredImage && {
        images: [
          {
            url: project.featuredImage.url,
            width: 1200,
            height: 630,
            alt: project.featuredImage.alt || project.title,
          },
        ],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      ...(project.featuredImage && {
        images: [project.featuredImage.url],
      }),
      ...(settings?.seoDefaults?.twitterHandle && {
        creator: `@${settings.seoDefaults.twitterHandle}`,
      }),
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug(params.slug)
  const settings = await getSiteSettings()

  if (!project) {
    notFound()
  }

  // Get all projects for navigation
  const allProjects = await getProjects()
  const currentIndex = allProjects.findIndex((p) => p.id === project.id)
  const previousProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  // Generate structured data
  const projectStructuredData = generateProjectStructuredData(project, settings)
  const breadcrumbStructuredData = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: 'Projects', url: '/projects' },
    { name: project.title },
  ])

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectStructuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      {/* Hero Section */}
      <ProjectHero project={project} />

      {/* Main Content */}
      <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Project Overview */}
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 font-serif">
              Project Overview
            </h2>

            {/* Rich Text Content */}
            {project.content && (
              <div className="prose prose-lg max-w-none">
                {/* Note: You'll need to render Payload's rich text content */}
                {/* For now, showing the summary */}
                <p className="text-dark/80 leading-relaxed text-lg">
                  {project.summary}
                </p>
              </div>
            )}
          </section>

          {/* Tech Stack Section */}
          {project.techStack.length > 0 && (
            <section className="mb-16 p-8 bg-light rounded-lg border border-dark/10">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-6 font-serif">
                Technologies Used
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {project.techStack.map((tech, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-white rounded-lg border border-dark/10 hover:border-primary/30 hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                      {/* Icon placeholder - you can add actual tech icons */}
                      {tech.technology.toLowerCase().includes('react') && '⚛️'}
                      {tech.technology.toLowerCase().includes('next') && '▲'}
                      {tech.technology.toLowerCase().includes('node') && '🟢'}
                      {tech.technology.toLowerCase().includes('typescript') && '🔷'}
                      {tech.technology.toLowerCase().includes('javascript') && '🟨'}
                      {tech.technology.toLowerCase().includes('python') && '🐍'}
                      {tech.technology.toLowerCase().includes('firebase') && '🔥'}
                      {!tech.technology.toLowerCase().match(/react|next|node|typescript|javascript|python|firebase/) && '⚙️'}
                    </div>
                    <span className="font-medium text-dark text-sm">
                      {tech.technology}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery Section */}
          {project.gallery && project.gallery.length > 0 && (
            <section className="mb-16">
              <ProjectGallery gallery={project.gallery} />
            </section>
          )}

          {/* Metrics Section */}
          {project.metrics && project.metrics.length > 0 && (
            <section className="mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-8 font-serif">
                Project Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {project.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10 text-center"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2 font-serif">
                      {metric.value}
                    </div>
                    <div className="text-sm text-dark/70 font-medium">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Project Links Section */}
          {(project.links?.liveUrl ||
            project.links?.githubUrl ||
            project.links?.caseStudyUrl) && (
            <section className="mb-16">
              <div className="p-8 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 rounded-lg border border-primary/10">
                <h2 className="text-2xl font-bold text-dark mb-6 font-serif">
                  Explore This Project
                </h2>
                <div className="flex flex-wrap gap-4">
                  {project.links.liveUrl && (
                    <a
                      href={project.links.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-light rounded-lg hover:bg-primary-600 hover:scale-105 transition-all font-semibold shadow-lg"
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
                      Visit Live Site
                    </a>
                  )}
                  {project.links.githubUrl && (
                    <a
                      href={project.links.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-dark text-light rounded-lg hover:bg-dark/90 hover:scale-105 transition-all font-semibold shadow-lg"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View Source Code
                    </a>
                  )}
                  {project.links.caseStudyUrl && (
                    <a
                      href={project.links.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-dark rounded-lg hover:bg-secondary-600 hover:scale-105 transition-all font-semibold shadow-lg"
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
                      Read Full Case Study
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Project Navigation */}
          <ProjectNavigation
            previousProject={previousProject}
            nextProject={nextProject}
          />
        </div>
      </div>
    </>
  )
}
