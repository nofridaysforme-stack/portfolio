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
