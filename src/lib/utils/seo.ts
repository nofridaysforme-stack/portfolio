import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

/**
 * Generate metadata for Next.js pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.jpg',
    url = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    type = 'website',
    author,
    publishedTime,
    modifiedTime,
  } = config

  const fullTitle = `${title} | Portfolio`

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Portfolio',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

/**
 * Generate JSON-LD structured data for a person/profile
 */
export function generatePersonSchema(data: {
  name: string
  jobTitle: string
  url: string
  image?: string
  sameAs?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: data.name,
    jobTitle: data.jobTitle,
    url: data.url,
    image: data.image,
    sameAs: data.sameAs,
  }
}

/**
 * Generate JSON-LD structured data for a portfolio work
 */
export function generateCreativeWorkSchema(data: {
  name: string
  description: string
  image: string
  author: string
  datePublished: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.name,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    datePublished: data.datePublished,
    url: data.url,
  }
}

/**
 * Generate JSON-LD structured data for an organization
 */
export function generateOrganizationSchema(data: {
  name: string
  url: string
  logo?: string
  description?: string
  sameAs?: string[]
  contactPoint?: {
    email?: string
    telephone?: string
    contactType?: string
  }
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: data.name,
    url: data.url,
    logo: data.logo,
    description: data.description,
    sameAs: data.sameAs,
    ...(data.contactPoint && {
      contactPoint: {
        '@type': 'ContactPoint',
        email: data.contactPoint.email,
        telephone: data.contactPoint.telephone,
        contactType: data.contactPoint.contactType || 'customer service',
      },
    }),
  }
}

/**
 * Generate JSON-LD structured data for a website
 */
export function generateWebsiteSchema(data: {
  name: string
  url: string
  description?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: data.name,
    url: data.url,
    description: data.description,
    ...(data.author && {
      author: {
        '@type': 'Person',
        name: data.author,
      },
    }),
  }
}

/**
 * Generate canonical URL
 */
export function generateCanonicalURL(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Generate alternate URLs for multilingual sites
 */
export function generateAlternateURLs(
  path: string,
  languages: string[]
): Array<{ hrefLang: string; href: string }> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return languages.map((lang) => ({
    hrefLang: lang,
    href: `${baseUrl}/${lang}${path}`,
  }))
}

/**
 * Generate meta robots configuration
 */
export function generateRobotsConfig(options?: {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
  maxImagePreview?: 'none' | 'standard' | 'large'
  maxVideoPreview?: number
  maxSnippet?: number
}) {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false,
    maxImagePreview = 'large',
    maxVideoPreview = -1,
    maxSnippet = -1,
  } = options || {}

  return {
    index,
    follow,
    noarchive,
    nosnippet,
    googleBot: {
      index,
      follow,
      'max-image-preview': maxImagePreview,
      'max-video-preview': maxVideoPreview,
      'max-snippet': maxSnippet,
    },
  }
}

/**
 * Strip HTML tags from string (for meta descriptions)
 */
export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/**
 * Truncate text for meta descriptions
 */
export function truncateText(text: string, maxLength: number = 160): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Get estimated reading time
 */
export function getReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
