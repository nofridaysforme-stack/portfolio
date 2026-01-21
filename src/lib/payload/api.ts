import { getPayload } from './getPayload'

// Types for API responses
export interface SiteSettings {
  siteName: string
  tagline?: string
  logo?: {
    url: string
    alt: string
  }
  favicon?: {
    url: string
  }
  colorPalette: {
    primary: string
    secondary: string
    dark: string
    light: string
    accent?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    location?: string
  }
  socialLinks?: Array<{
    platform: string
    url: string
    displayText?: string
  }>
  seoDefaults?: {
    metaTitle?: string
    metaDescription?: string
    ogImage?: {
      url: string
    }
    twitterHandle?: string
  }
  analytics?: {
    enableAnalytics: boolean
    googleAnalyticsId?: string
    facebookPixelId?: string
    googleTagManagerId?: string
  }
}

export interface Project {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  featured: boolean
  status: 'draft' | 'published'
  featuredImage?: {
    url: string
    alt: string
  }
  gallery?: Array<{
    image: {
      url: string
      alt: string
    }
    caption?: string
  }>
  content: any
  techStack: Array<{ technology: string }>
  links?: {
    liveUrl?: string
    githubUrl?: string
    caseStudyUrl?: string
  }
  metrics?: Array<{
    label: string
    value: string
  }>
  displayOrder: number
  createdAt: string
  updatedAt: string
}

export interface Page {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  layout: any[]
  seo?: {
    metaTitle?: string
    metaDescription?: string
    metaKeywords?: string
    ogImage?: {
      url: string
    }
    noindex: boolean
  }
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

/**
 * Fetch global site settings
 * @returns Site settings object
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const payload = await getPayload()

    const settings = await payload.findGlobal({
      slug: 'site-settings',
    })

    return settings as SiteSettings
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

/**
 * Fetch all projects with optional filters
 * @param filters - Optional query filters
 * @returns Array of projects
 */
export async function getProjects(filters?: {
  featured?: boolean
  category?: string
  limit?: number
}): Promise<Project[]> {
  try {
    const payload = await getPayload()

    const where: any = {
      status: {
        equals: 'published',
      },
    }

    if (filters?.featured !== undefined) {
      where.featured = {
        equals: filters.featured,
      }
    }

    if (filters?.category) {
      where.category = {
        equals: filters.category,
      }
    }

    const projects = await payload.find({
      collection: 'projects',
      where,
      limit: filters?.limit || 100,
      sort: 'displayOrder',
    })

    return projects.docs as Project[]
  } catch (error) {
    console.error('Error fetching projects:', error)
    return []
  }
}

/**
 * Fetch a single project by slug
 * @param slug - Project slug
 * @returns Project object or null
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const payload = await getPayload()

    const projects = await payload.find({
      collection: 'projects',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
    })

    if (projects.docs.length === 0) {
      return null
    }

    return projects.docs[0] as Project
  } catch (error) {
    console.error('Error fetching project by slug:', error)
    return null
  }
}

/**
 * Fetch a page by slug
 * @param slug - Page slug
 * @returns Page object or null
 */
export async function getPage(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
        status: {
          equals: 'published',
        },
      },
      limit: 1,
    })

    if (pages.docs.length === 0) {
      return null
    }

    return pages.docs[0] as Page
  } catch (error) {
    console.error('Error fetching page by slug:', error)
    return null
  }
}

/**
 * Fetch all published pages
 * @returns Array of pages
 */
export async function getPages(): Promise<Page[]> {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
      collection: 'pages',
      where: {
        status: {
          equals: 'published',
        },
      },
      limit: 100,
      sort: '-updatedAt',
    })

    return pages.docs as Page[]
  } catch (error) {
    console.error('Error fetching pages:', error)
    return []
  }
}

/**
 * Fetch media item by ID
 * @param id - Media ID
 * @returns Media object or null
 */
export async function getMediaById(id: string) {
  try {
    const payload = await getPayload()

    const media = await payload.findByID({
      collection: 'media',
      id,
    })

    return media
  } catch (error) {
    console.error('Error fetching media by ID:', error)
    return null
  }
}
