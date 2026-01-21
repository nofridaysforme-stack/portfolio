# Payload Globals

Globals are single-instance configurations that manage site-wide settings. Unlike collections, globals don't have multiple entries—each global has just one set of data.

## Available Globals

### Site Settings

**Purpose**: Manage all site-wide configuration, branding, contact info, and SEO defaults

**Access**: Public read, admin-only update

**Tabs**:

#### 1. Site Identity
Configure your site's basic identity and branding.

**Fields**:
- **siteName** (text, required) - Default: "Jana Portfolio"
  - Your website/portfolio name
  - Used in page titles, headers, and branding

- **tagline** (text) - Optional
  - Brief description or motto
  - Example: "Creative Developer & Designer"

- **logo** (upload) - Optional
  - Main site logo
  - Recommended: SVG or PNG with transparent background
  - Used in header/navigation

- **favicon** (upload) - Optional
  - Site favicon
  - Recommended: 32x32px PNG or ICO file
  - Displays in browser tabs

**Use Cases**:
- Update site name without code changes
- Swap logos for rebranding
- A/B test different taglines

---

#### 2. Color Palette
Customize your site's color scheme.

**Fields**:
- **primary** (text, required) - Default: `#D97E3C`
  - Burnt Orange - Main brand color
  - Used for: Buttons, links, primary accents
  - Validation: Must be valid hex color

- **secondary** (text, required) - Default: `#D4AF6A`
  - Champagne Gold - Secondary brand color
  - Used for: Highlights, secondary buttons
  - Validation: Must be valid hex color

- **dark** (text, required) - Default: `#2D2D2D`
  - Charcoal - Dark color
  - Used for: Text, dark backgrounds
  - Validation: Must be valid hex color

- **light** (text, required) - Default: `#F5F5F0`
  - Warm Neutral - Light color
  - Used for: Light backgrounds, text on dark
  - Validation: Must be valid hex color

- **accent** (text) - Optional
  - Additional accent color
  - Used for: Special elements, highlights
  - Validation: Must be valid hex color

**How It Works**:
1. Update color values in CMS
2. Frontend reads colors from global settings
3. CSS variables or Tailwind config updated dynamically
4. Instant theme changes without code deployment

**Example Integration**:
```typescript
// Fetch site settings
const settings = await payload.findGlobal({ slug: 'site-settings' })

// Use in CSS-in-JS
const theme = {
  colors: {
    primary: settings.colorPalette.primary,
    secondary: settings.colorPalette.secondary,
    // ...
  }
}
```

---

#### 3. Contact Information
Manage contact details and social media links.

**Contact Details**:
- **email** (email) - Optional
  - Primary contact email
  - Example: hello@example.com
  - Used in: Contact forms, footer

- **phone** (text) - Optional
  - Contact phone number
  - Example: +1 (555) 123-4567
  - Used in: Contact page, footer

- **location** (text) - Optional
  - City, State/Country
  - Example: "San Francisco, CA"
  - Used in: About page, footer

**Social Links** (array):
Add unlimited social media profiles.

Fields per link:
- **platform** (select, required)
  - Options: GitHub, LinkedIn, Twitter, Instagram, TikTok, Pinterest, YouTube, Dribbble, Behance
  - Determines icon to display

- **url** (text, required)
  - Full profile URL
  - Example: https://github.com/username
  - Validation: Must be valid URL with https://

- **displayText** (text) - Optional
  - Custom text to show
  - Default: Platform name
  - Example: "@username"

**Use Cases**:
- Update email without touching code
- Add/remove social profiles dynamically
- Reorder social links
- A/B test different contact methods

**Example**:
```typescript
{
  contactInfo: {
    email: "hello@janaportfolio.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA"
  },
  socialLinks: [
    {
      platform: "github",
      url: "https://github.com/jana",
      displayText: "@jana"
    },
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/jana"
    }
  ]
}
```

---

#### 4. SEO Defaults
Set default SEO metadata for pages without custom settings.

**Fields**:
- **metaTitle** (text, 60 char max) - Optional
  - Default title for search results
  - Falls back to siteName if not set
  - Example: "Jana Portfolio - Creative Developer"

- **metaDescription** (textarea, 160 char max) - Optional
  - Default description for search results
  - Shown in search engine snippets
  - Example: "Award-winning creative developer specializing in web apps and design systems"

- **ogImage** (upload) - Optional
  - Default social share image
  - Recommended: 1200x630px
  - Used when sharing site on social media

- **twitterHandle** (text) - Optional
  - Your Twitter username
  - Without @ symbol
  - Validation: Alphanumeric and underscore, 1-15 chars
  - Example: "username" not "@username"

**How It Works**:
1. Pages check for custom SEO fields first
2. If empty, fall back to these defaults
3. Frontend generates meta tags accordingly

**Example Meta Tags Output**:
```html
<title>Jana Portfolio - Creative Developer</title>
<meta name="description" content="Award-winning creative developer..." />
<meta property="og:title" content="Jana Portfolio" />
<meta property="og:image" content="https://cdn.../og-image.jpg" />
<meta name="twitter:creator" content="@username" />
```

---

#### 5. Analytics & Tracking
Configure analytics and tracking services.

**Fields**:
- **enableAnalytics** (checkbox) - Default: false
  - Master switch for all analytics
  - When false, no tracking scripts load
  - GDPR/privacy-friendly

- **googleAnalyticsId** (text) - Optional
  - Google Analytics tracking ID
  - Format: G-XXXXXXXXXX (GA4) or UA-XXXXXXXXX (Universal)
  - Only shown when analytics enabled

- **facebookPixelId** (text) - Optional
  - Facebook Pixel ID for conversion tracking
  - Format: Numeric ID
  - Only shown when analytics enabled

- **googleTagManagerId** (text) - Optional
  - Google Tag Manager container ID
  - Format: GTM-XXXXXXX
  - Only shown when analytics enabled

**Privacy Considerations**:
- Analytics disabled by default
- Easy opt-out for visitors
- Conditional loading reduces unnecessary scripts
- Can integrate with cookie consent banner

**Example Integration**:
```typescript
// In layout or analytics component
const settings = await payload.findGlobal({ slug: 'site-settings' })

if (settings.analytics.enableAnalytics && settings.analytics.googleAnalyticsId) {
  // Load Google Analytics
  loadGoogleAnalytics(settings.analytics.googleAnalyticsId)
}
```

---

## Using Globals in Your App

### Server-Side (Next.js)

```typescript
import { getPayload } from '@/lib/payload/getPayload'

export default async function Page() {
  const payload = await getPayload()

  const settings = await payload.findGlobal({
    slug: 'site-settings',
  })

  return (
    <div>
      <h1>{settings.siteName}</h1>
      <p>{settings.tagline}</p>
    </div>
  )
}
```

### Client-Side (API)

```typescript
// Fetch site settings
const response = await fetch('/api/globals/site-settings')
const settings = await response.json()

// Use settings
document.title = settings.siteName
```

### GraphQL

```graphql
query {
  SiteSettings {
    siteName
    tagline
    colorPalette {
      primary
      secondary
    }
    contactInfo {
      email
      phone
    }
    socialLinks {
      platform
      url
    }
  }
}
```

---

## Admin Interface

### Accessing Globals

1. Log in to admin panel: http://localhost:3000/admin
2. Look for "Globals" section in sidebar
3. Click "Site Settings"
4. Navigate tabs to edit different sections
5. Save changes

### Features

- **Tabbed Interface**: Organized into logical sections
- **Field Descriptions**: Helpful hints for each field
- **Validation**: Real-time validation for URLs, colors, etc.
- **Conditional Fields**: Analytics fields only show when enabled
- **Read-Only Fields**: Some fields locked for consistency

---

## Adding New Globals

To create additional globals:

1. Create new file in `src/payload/globals/`
   ```typescript
   import { GlobalConfig } from 'payload/types'

   const MyGlobal: GlobalConfig = {
     slug: 'my-global',
     label: 'My Global Settings',
     fields: [
       // Your fields here
     ],
   }

   export default MyGlobal
   ```

2. Import in `payload.config.ts`
   ```typescript
   import MyGlobal from './globals/MyGlobal'
   ```

3. Add to globals array
   ```typescript
   globals: [
     SiteSettings,
     MyGlobal,
   ]
   ```

---

## Common Global Use Cases

### Navigation Menu
Manage header/footer navigation links dynamically.

```typescript
{
  slug: 'navigation',
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' }
      ]
    }
  ]
}
```

### Footer Content
Centralize footer text, copyright, links.

```typescript
{
  slug: 'footer',
  fields: [
    { name: 'copyrightText', type: 'text' },
    { name: 'footerLinks', type: 'array' },
    { name: 'newsletterCta', type: 'text' }
  ]
}
```

### Feature Flags
Toggle features without deployment.

```typescript
{
  slug: 'features',
  fields: [
    { name: 'enableBlog', type: 'checkbox' },
    { name: 'enableShop', type: 'checkbox' },
    { name: 'maintenanceMode', type: 'checkbox' }
  ]
}
```

---

## Best Practices

### Performance
- Cache global settings
- Fetch once per page render
- Use static generation when possible

### Organization
- Use tabs for logical grouping
- Add clear field descriptions
- Set sensible defaults
- Validate user input

### Security
- Restrict update access to admins
- Validate all URLs and colors
- Sanitize user input
- Don't store secrets in globals (use env vars)

### User Experience
- Use conditional fields to reduce clutter
- Provide placeholder examples
- Group related fields
- Add helpful descriptions

---

## Troubleshooting

### Changes Not Appearing
1. Check if you're fetching the latest data
2. Clear any caches
3. Verify save was successful
4. Check browser console for errors

### Validation Errors
- Hex colors must start with # (e.g., #D97E3C)
- URLs must include https://
- Twitter handles: no @ symbol, 1-15 chars

### Access Denied
- Only admins can update site settings
- Editors/viewers have read-only access
- Check user role in admin panel

---

## Next Steps

- Create frontend components that consume global settings
- Implement theme switcher using color palette
- Build contact page using contact info
- Add analytics scripts based on settings
- Create navigation menu from global data
