# Performance Optimization Guide

This document outlines the performance optimizations implemented in the portfolio site and provides guidelines for maintaining optimal performance.

## Table of Contents

- [Core Web Vitals](#core-web-vitals)
- [Image Optimization](#image-optimization)
- [Code Splitting & Bundle Optimization](#code-splitting--bundle-optimization)
- [Caching Strategy](#caching-strategy)
- [SEO Optimization](#seo-optimization)
- [Security Headers](#security-headers)
- [Performance Monitoring](#performance-monitoring)
- [Accessibility](#accessibility)
- [Lighthouse Audit](#lighthouse-audit)

---

## Core Web Vitals

### What are Core Web Vitals?

Core Web Vitals are a set of metrics that measure real-world user experience:

- **LCP (Largest Contentful Paint)**: Measures loading performance. Should occur within **2.5 seconds** of page load.
- **FID (First Input Delay)**: Measures interactivity. Pages should have an FID of **100 milliseconds** or less.
- **CLS (Cumulative Layout Shift)**: Measures visual stability. Pages should maintain a CLS of **0.1** or less.
- **INP (Interaction to Next Paint)**: Measures responsiveness. Should be **200 milliseconds** or less.

### Monitoring Web Vitals

Web Vitals are automatically tracked via the `WebVitals` component in `src/app/_components/WebVitals.tsx`.

**In Development:**
```bash
npm run dev
```
- Open browser console to see real-time Web Vitals logs
- A visual overlay appears in the bottom-right corner showing metrics
- Metrics are color-coded: 🟢 Good, 🟡 Needs Improvement, 🔴 Poor

**In Production:**
- Metrics are automatically sent to Google Analytics (if configured)
- Facebook Pixel tracking (if configured)
- Custom analytics endpoint (optional via `NEXT_PUBLIC_ANALYTICS_ENDPOINT`)

### Improving Web Vitals

**LCP Optimization:**
- Use Next.js Image component for all images
- Implement proper image sizing and formats (AVIF/WebP)
- Avoid large CSS/JS bundles blocking render
- Use `priority` prop on above-the-fold images

**FID/INP Optimization:**
- Minimize JavaScript execution time
- Use code splitting and dynamic imports
- Defer non-critical JavaScript
- Optimize GSAP animations (reduce complexity on low-end devices)

**CLS Optimization:**
- Always specify width/height for images
- Reserve space for dynamic content
- Avoid inserting content above existing content
- Use transform animations instead of layout-affecting properties

---

## Image Optimization

### Configuration

Images are optimized via `next.config.js`:

```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

### Best Practices

**Use Next.js Image Component:**
```tsx
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Description"
  width={1200}
  height={630}
  priority // For above-the-fold images
  quality={85} // Default: 75
  placeholder="blur" // Optional blur placeholder
  blurDataURL="data:image/..." // Base64 blur
/>
```

**Image Size Guidelines:**
- **Hero images**: 1920x1080 (or wider for 4K displays)
- **Project cards**: 800x600
- **Thumbnails**: 300x200
- **OG images**: 1200x630

**Format Priority:**
1. AVIF (best compression, modern browsers)
2. WebP (good compression, wide support)
3. JPEG/PNG (fallback)

**Image Optimization Checklist:**
- [ ] Use Next.js Image component
- [ ] Specify width and height
- [ ] Add descriptive alt text
- [ ] Use `priority` for above-the-fold images
- [ ] Compress images before upload (TinyPNG, Squoosh)
- [ ] Use appropriate format (AVIF > WebP > JPEG)
- [ ] Consider lazy loading for below-the-fold content

---

## Code Splitting & Bundle Optimization

### Dynamic Imports

Use dynamic imports for heavy libraries:

```tsx
// Bad: Increases initial bundle size
import gsap from 'gsap'

// Good: Loads only when needed
const gsap = await import('gsap')
```

**Example from ProjectCard:**
```tsx
useEffect(() => {
  let gsapContext: any

  const setupAnimations = async () => {
    const gsap = await import('gsap')
    gsapContext = gsap.gsap.context(() => {
      // Animation setup
    }, cardRef)
  }

  setupAnimations()

  return () => {
    if (gsapContext) gsapContext.revert()
  }
}, [])
```

### Bundle Analysis

Analyze your bundle to identify large dependencies:

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

This opens an interactive treemap showing:
- Bundle sizes by route
- Largest dependencies
- Duplicate packages
- Code split chunks

### Optimization Strategies

**Package Optimization:**
- Use `experimental.optimizePackageImports` in next.config.js
- Currently optimized: `gsap`, `framer-motion`
- Consider alternatives for large libraries

**Code Splitting:**
- Next.js automatically splits code by route
- Use dynamic imports for heavy components
- Lazy load components below the fold

**Tree Shaking:**
- Import only what you need: `import { specific } from 'library'`
- Avoid barrel imports that import entire modules
- Use ES modules (not CommonJS)

---

## Caching Strategy

### Static Assets

**Cache Headers (configured in next.config.js):**
- **Images**: 1 year (immutable)
- **JS/CSS**: 1 year (immutable, versioned)
- **API responses**: Varies by endpoint

### Next.js Caching

**Static Generation (SSG):**
```tsx
// Generates static pages at build time
export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug)
  return <ProjectDetail project={project} />
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map(p => ({ slug: p.slug }))
}
```

**Incremental Static Regeneration (ISR):**
```tsx
// Revalidate page every 60 seconds
export const revalidate = 60

export default async function ProjectsPage() {
  const projects = await getProjects()
  return <ProjectGrid projects={projects} />
}
```

**API Route Caching:**
```tsx
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  })
}
```

### CDN Caching

**Vercel (Recommended):**
- Automatic edge caching
- Global CDN with 70+ locations
- Automatic purging on redeployment

**Cloudflare:**
- Configure page rules for caching
- Automatic minification
- Image optimization via Cloudflare Images

---

## SEO Optimization

### Meta Tags

Metadata is generated dynamically using utilities from `src/lib/utils/seo.ts`:

```tsx
import { generateMetadata } from '@/lib/utils/seo'

export async function generateMetadata({ params }): Promise<Metadata> {
  const project = await getProject(params.slug)

  return generateMetadata({
    title: project.title,
    description: project.description,
    image: project.featuredImage.url,
    url: `/projects/${project.slug}`,
    type: 'article',
    keywords: project.tags,
  })
}
```

### Structured Data (JSON-LD)

Add structured data for rich search results:

```tsx
import { generateProjectStructuredData } from '@/lib/utils/structured-data'

export default async function ProjectPage({ params }) {
  const project = await getProject(params.slug)
  const structuredData = generateProjectStructuredData(project, siteSettings)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Page content */}
    </>
  )
}
```

### Sitemap & Robots

**Sitemap**: Automatically generated at `/sitemap.xml`
- Static routes (homepage, projects)
- Dynamic project pages
- Dynamic CMS pages
- Proper priority and change frequency

**Robots.txt**: Available at `/robots.txt`
- Allows all crawlers
- Disallows admin and API routes
- References sitemap location

### SEO Checklist

- [ ] Unique title and description for each page
- [ ] Title length: 50-60 characters
- [ ] Description length: 150-160 characters
- [ ] Include target keywords naturally
- [ ] Add Open Graph tags (og:title, og:description, og:image)
- [ ] Add Twitter Card tags
- [ ] Generate JSON-LD structured data
- [ ] Create descriptive URLs (kebab-case)
- [ ] Add canonical URLs
- [ ] Include alt text for all images
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics

---

## Security Headers

Security headers are configured in `next.config.js`:

```javascript
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ],
  }]
}
```

### Header Explanations

- **HSTS**: Enforces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing
- **X-XSS-Protection**: Enables browser XSS filter
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

---

## Performance Monitoring

### Development Mode

**Browser DevTools:**
1. Open Chrome DevTools (F12)
2. Navigate to Lighthouse tab
3. Generate report for Performance, Accessibility, Best Practices, SEO
4. Review recommendations

**Web Vitals Console:**
- Automatic logging in development mode
- Color-coded metrics in console
- Visual overlay in bottom-right corner

### Production Monitoring

**Google Analytics 4:**
```javascript
// Automatically tracked via WebVitals component
gtag('event', 'LCP', {
  value: Math.round(metric.value),
  event_category: 'Web Vitals',
  event_label: metric.id,
  non_interaction: true,
})
```

**Custom Analytics Endpoint:**
```env
# .env.local
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://analytics.yoursite.com/vitals
```

### Performance Budget

Set performance budgets to prevent regressions:

- **Initial Page Load**: < 3 seconds (4G connection)
- **JavaScript Bundle**: < 170 KB (gzipped)
- **CSS Bundle**: < 50 KB (gzipped)
- **Images**: < 100 KB per image
- **LCP**: < 2.5 seconds
- **FID**: < 100 milliseconds
- **CLS**: < 0.1

---

## Accessibility

### WCAG 2.1 Level AA Compliance

**Keyboard Navigation:**
- [ ] All interactive elements accessible via keyboard
- [ ] Visible focus indicators
- [ ] Logical tab order
- [ ] Skip to main content link

**Screen Readers:**
- [ ] Semantic HTML (header, nav, main, footer, article)
- [ ] ARIA labels for icons and buttons
- [ ] Alt text for images
- [ ] Form labels properly associated

**Color & Contrast:**
- [ ] Text contrast ratio ≥ 4.5:1 (normal text)
- [ ] Text contrast ratio ≥ 3:1 (large text)
- [ ] Don't rely solely on color to convey information

**Motion & Animations:**
- [ ] Respect `prefers-reduced-motion`
- [ ] Provide pause/stop controls for auto-playing content
- [ ] Avoid flashing content (seizure risk)

### Accessibility Implementation

**Reduced Motion Support:**
```tsx
import { prefersReducedMotion } from '@/lib/utils/animations'

useEffect(() => {
  if (!prefersReducedMotion()) {
    // Apply animations
  } else {
    // Skip or simplify animations
  }
}, [])
```

**ARIA Labels:**
```tsx
<button
  aria-label="Close lightbox"
  aria-keyshortcuts="Escape"
>
  <XIcon />
</button>
```

**Semantic HTML:**
```tsx
<article>
  <header>
    <h1>{project.title}</h1>
  </header>
  <section aria-labelledby="overview-heading">
    <h2 id="overview-heading">Overview</h2>
    {/* Content */}
  </section>
</article>
```

---

## Lighthouse Audit

### Running Lighthouse

**Chrome DevTools:**
1. Open DevTools (F12)
2. Navigate to Lighthouse tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Choose device: Mobile or Desktop
5. Click "Generate report"

**Command Line:**
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yoursite.com --view

# Run audit with specific categories
lighthouse https://yoursite.com --only-categories=performance,accessibility --view

# Run multiple audits and average
lighthouse https://yoursite.com --runs=5 --view
```

### Target Scores

- **Performance**: ≥ 90
- **Accessibility**: 100
- **Best Practices**: 100
- **SEO**: 100

### Common Issues & Fixes

**Performance Issues:**
- ❌ Large JavaScript bundles → Use code splitting
- ❌ Unoptimized images → Use Next.js Image component
- ❌ Render-blocking resources → Use `next/script` with strategy
- ❌ No caching headers → Configure in next.config.js

**Accessibility Issues:**
- ❌ Low contrast text → Update color palette
- ❌ Missing alt text → Add descriptive alt attributes
- ❌ No ARIA labels → Add aria-label/aria-labelledby
- ❌ Poor heading hierarchy → Use h1-h6 properly

**SEO Issues:**
- ❌ Missing meta description → Add via generateMetadata
- ❌ No structured data → Add JSON-LD schemas
- ❌ Missing canonical URL → Use generateCanonicalURL utility
- ❌ Non-descriptive link text → Use meaningful text

---

## Performance Optimization Checklist

### Build & Deploy
- [ ] Run `npm run build` locally to check for errors
- [ ] Run bundle analyzer: `ANALYZE=true npm run build`
- [ ] Review bundle sizes and optimize if needed
- [ ] Test production build locally: `npm run start`
- [ ] Run Lighthouse audit on production URL
- [ ] Check all Core Web Vitals are in "Good" range

### Images
- [ ] All images use Next.js Image component
- [ ] Images have width and height specified
- [ ] Above-the-fold images have `priority` prop
- [ ] Images are compressed and optimized
- [ ] AVIF/WebP formats are being served

### Code
- [ ] No console.log statements in production
- [ ] Heavy libraries use dynamic imports
- [ ] No unused dependencies in package.json
- [ ] CSS is minified and purged
- [ ] JavaScript is minified and compressed

### SEO
- [ ] All pages have unique titles and descriptions
- [ ] Structured data is present and valid
- [ ] Sitemap is generated and accessible
- [ ] Robots.txt is configured correctly
- [ ] Canonical URLs are set
- [ ] Open Graph and Twitter Card tags are present

### Security
- [ ] Security headers are configured
- [ ] HTTPS is enforced
- [ ] Environment variables are not exposed
- [ ] Dependencies are up to date (npm audit)
- [ ] Content Security Policy is configured

### Monitoring
- [ ] Google Analytics is set up
- [ ] Web Vitals tracking is active
- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Uptime monitoring is set up
- [ ] Performance budgets are defined

---

## Resources

### Tools
- [PageSpeed Insights](https://pagespeed.web.dev/) - Test real-world performance
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) - Automated testing
- [WebPageTest](https://www.webpagetest.org/) - Advanced performance testing
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Browser debugging
- [Next.js Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer) - Bundle analysis

### Documentation
- [Next.js Performance](https://nextjs.org/docs/pages/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Schema.org](https://schema.org/) - Structured data reference
- [MDN Performance](https://developer.mozilla.org/en-US/docs/Web/Performance)

### Testing
- [Google Search Console](https://search.google.com/search-console) - SEO monitoring
- [Rich Results Test](https://search.google.com/test/rich-results) - Structured data validation
- [Lighthouse Viewer](https://googlechrome.github.io/lighthouse/viewer/) - View Lighthouse reports
- [WAVE](https://wave.webaim.org/) - Accessibility testing
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility auditing

---

## Maintenance

### Regular Tasks

**Weekly:**
- [ ] Monitor Web Vitals in analytics
- [ ] Check for build errors/warnings
- [ ] Review performance metrics

**Monthly:**
- [ ] Run full Lighthouse audit
- [ ] Review and update dependencies
- [ ] Check for security vulnerabilities: `npm audit`
- [ ] Review bundle sizes for growth

**Quarterly:**
- [ ] Comprehensive accessibility audit
- [ ] Review and update SEO strategy
- [ ] Analyze Core Web Vitals trends
- [ ] Update performance documentation

---

Last Updated: 2026-01-21
