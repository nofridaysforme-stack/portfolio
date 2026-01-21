import type { Project, SiteSettings } from '@/lib/payload/api'

/**
 * Generate JSON-LD structured data for a project
 * Helps with SEO and rich snippets in search results
 */
export function generateProjectStructuredData(
  project: Project,
  siteSettings?: SiteSettings | null
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.summary,
    url: `${baseUrl}/projects/${project.slug}`,
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    ...(project.featuredImage && {
      image: {
        '@type': 'ImageObject',
        url: project.featuredImage.url,
        ...(project.featuredImage.alt && {
          caption: project.featuredImage.alt,
        }),
      },
    }),
    ...(siteSettings && {
      author: {
        '@type': 'Person',
        name: siteSettings.siteName,
        ...(siteSettings.contactInfo?.email && {
          email: siteSettings.contactInfo.email,
        }),
      },
    }),
    keywords: project.techStack.map((tech) => tech.technology).join(', '),
    ...(project.links?.liveUrl && {
      workExample: {
        '@type': 'WebApplication',
        url: project.links.liveUrl,
      },
    }),
    ...(project.links?.githubUrl && {
      codeRepository: project.links.githubUrl,
    }),
    inLanguage: 'en',
    isFamilyFriendly: true,
  }

  return structuredData
}

/**
 * Generate JSON-LD structured data for a portfolio/projects list page
 */
export function generateProjectsPageStructuredData(
  projects: Project[],
  siteSettings?: SiteSettings | null
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Projects Portfolio',
    description: 'A collection of creative projects and case studies',
    url: `${baseUrl}/projects`,
    numberOfItems: projects.length,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.title,
        description: project.summary,
        url: `${baseUrl}/projects/${project.slug}`,
        ...(project.featuredImage && {
          image: project.featuredImage.url,
        }),
      },
    })),
    ...(siteSettings && {
      author: {
        '@type': 'Person',
        name: siteSettings.siteName,
      },
    }),
  }

  return structuredData
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  items: Array<{ name: string; url?: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': item.url ? `${baseUrl}${item.url}` : undefined,
        name: item.name,
      },
    })),
  }
}
