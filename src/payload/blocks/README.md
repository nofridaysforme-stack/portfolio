# Payload Blocks

Reusable content blocks for flexible page layouts. These blocks are used in the Pages collection to build dynamic page structures.

## Available Blocks

### 1. Hero Block

**Purpose**: Large header section with background image/video and call-to-action

**Fields**:
- **headline** (text, required) - Main headline
- **subheadline** (textarea) - Supporting text
- **ctaText** (text) - Button text
- **ctaLink** (text) - Button URL/path
- **backgroundImage** (upload) - Background image
- **backgroundVideo** (text) - Optional video URL
- **height** (select) - Section height (small, medium, large, fullscreen)
- **overlay** (checkbox) - Dark overlay for text readability
- **alignment** (select) - Content alignment (left, center, right)

**Use Cases**:
- Homepage hero section
- Landing page headers
- Feature announcements
- Campaign pages

**Example**:
```typescript
{
  blockType: 'hero',
  headline: 'Welcome to My Portfolio',
  subheadline: 'Creative developer & designer',
  ctaText: 'View My Work',
  ctaLink: '/projects',
  height: 'large',
  overlay: true,
  alignment: 'center'
}
```

---

### 2. Rich Text Block

**Purpose**: Formatted text content with flexible column layouts

**Fields**:
- **content** (rich text, required) - Main content with formatting
- **columnLayout** (select) - single, two-column, three-column
- **maxWidth** (select) - Container width (narrow, medium, wide, full)
- **backgroundColor** (select) - Section background (none, light, dark, primary, secondary)
- **paddingTop** (select) - Top spacing (none, small, medium, large)
- **paddingBottom** (select) - Bottom spacing (none, small, medium, large)

**Use Cases**:
- Article content
- About sections
- Long-form content
- FAQ sections

**Example**:
```typescript
{
  blockType: 'richText',
  content: '<p>Your rich text content here...</p>',
  columnLayout: 'two-column',
  maxWidth: 'medium',
  backgroundColor: 'light',
  paddingTop: 'large',
  paddingBottom: 'large'
}
```

---

### 3. Gallery Block

**Purpose**: Display multiple images in various layouts

**Fields**:
- **title** (text) - Optional gallery heading
- **images** (array, required) - Array of images with captions
  - image (upload) - Media reference
  - caption (text) - Optional caption
  - alt (text) - Alt text override
- **layout** (select) - grid, masonry, carousel, slider
- **columns** (select) - Two, three, or four columns (grid/masonry only)
- **gap** (select) - Spacing between images (small, medium, large, none)
- **aspectRatio** (select) - Image cropping (original, square, landscape, portrait)
- **enableLightbox** (checkbox) - Click to view fullscreen
- **autoplay** (checkbox) - Auto-advance slides (carousel/slider)
- **autoplaySpeed** (number) - Seconds between slides

**Use Cases**:
- Project showcases
- Photo galleries
- Image carousels
- Portfolio displays

**Layout Options**:
- **Grid**: Equal height rows, perfect for uniform images
- **Masonry**: Pinterest-style, preserves aspect ratios
- **Carousel**: Slideshow with navigation
- **Slider**: Slideshow with thumbnails

**Example**:
```typescript
{
  blockType: 'gallery',
  title: 'Project Screenshots',
  images: [
    { image: 'media-id-1', caption: 'Homepage design' },
    { image: 'media-id-2', caption: 'Mobile view' }
  ],
  layout: 'grid',
  columns: 'three',
  gap: 'medium',
  aspectRatio: 'landscape',
  enableLightbox: true
}
```

---

### 4. Call to Action (CTA) Block

**Purpose**: Prominent section encouraging user action

**Fields**:
- **title** (text, required) - Main heading
- **description** (textarea, required) - Supporting text (max 300 chars)
- **buttons** (array, 1-2 items) - Action buttons
  - text (text) - Button label
  - link (text) - Button URL/path
  - style (select) - primary, secondary, ghost
  - openInNewTab (checkbox) - Open link in new tab
- **backgroundColor** (select) - primary, secondary, dark, light
- **backgroundImage** (upload) - Optional background image
- **alignment** (select) - left, center, right
- **size** (select) - small, medium, large

**Use Cases**:
- Newsletter signups
- Contact prompts
- Service offerings
- Download sections

**Example**:
```typescript
{
  blockType: 'cta',
  title: 'Ready to Start Your Project?',
  description: 'Let\'s work together to bring your ideas to life',
  buttons: [
    { text: 'Get Started', link: '/contact', style: 'primary' },
    { text: 'View Pricing', link: '/pricing', style: 'secondary' }
  ],
  backgroundColor: 'primary',
  alignment: 'center',
  size: 'medium'
}
```

---

## Using Blocks in Pages

### In Payload Admin

1. Go to **Content** → **Pages**
2. Click **Create New**
3. Enter page title and slug
4. In the **Page Layout** section, click **Add Block**
5. Choose a block type
6. Fill in the block fields
7. Click **Save** or add more blocks
8. Use drag handles to reorder blocks
9. Publish when ready

### Drag-to-Reorder

- Each block has a drag handle (⋮⋮) on the left
- Click and drag to reorder blocks
- Changes are saved when you save the page

### Duplicating Blocks

- Click the duplicate icon (📋) on any block
- Creates an exact copy below the original
- Useful for similar sections

### Collapsing Blocks

- Click the block header to collapse/expand
- Collapsed view shows block type and summary
- Helpful for managing pages with many blocks

## Block Design Patterns

### Homepage Example

```
1. Hero Block
   - Large headline
   - Background image
   - CTA to projects

2. Rich Text Block
   - Introduction paragraph
   - Two-column layout

3. Gallery Block
   - Featured projects
   - Grid layout, 3 columns

4. CTA Block
   - Contact prompt
   - Primary background
```

### About Page Example

```
1. Hero Block
   - Smaller height
   - Photo background
   - No CTA

2. Rich Text Block
   - Bio content
   - Single column
   - Medium width

3. Gallery Block
   - Behind-the-scenes photos
   - Masonry layout

4. Rich Text Block
   - Skills & experience
   - Three-column layout

5. CTA Block
   - Contact prompt
```

### Project Detail Page

```
1. Hero Block
   - Project title as headline
   - Featured image background

2. Rich Text Block
   - Project description
   - Single column

3. Gallery Block
   - Project screenshots
   - Carousel layout

4. Rich Text Block
   - Technical details
   - Two-column layout

5. CTA Block
   - View more projects
   - Link to portfolio
```

## Creating New Blocks

To add a new block type:

1. Create a new file in `src/payload/blocks/`
2. Define the block configuration:
```typescript
import { Block } from 'payload/types'

export const YourBlock: Block = {
  slug: 'yourBlock',
  labels: {
    singular: 'Your Block',
    plural: 'Your Blocks',
  },
  fields: [
    // Your fields here
  ],
}
```

3. Import in `src/payload/collections/Pages.ts`
4. Add to the `blocks` array in the layout field

## Best Practices

### Content Strategy

- **Hero**: Use for strong first impressions
- **Rich Text**: Break up long content with column layouts
- **Gallery**: Showcase visual work, limit to 8-12 images
- **CTA**: Place strategically, not too frequently

### Performance

- Optimize images before uploading (use feature size: 1920x1080)
- Limit galleries to ~10 images per block
- Use video backgrounds sparingly (bandwidth)
- Consider lazy loading for below-the-fold content

### Accessibility

- Always provide alt text for images
- Use descriptive CTA button text
- Ensure text has sufficient contrast with backgrounds
- Maintain logical heading hierarchy in rich text

### SEO

- Use H1 for page title (not in Hero block headline)
- Structure content with proper headings
- Include relevant keywords naturally
- Optimize images with descriptive filenames

## TypeScript Types

When consuming blocks in your frontend:

```typescript
type HeroBlock = {
  blockType: 'hero'
  headline: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: Media
  backgroundVideo?: string
  height: 'small' | 'medium' | 'large' | 'fullscreen'
  overlay: boolean
  alignment: 'left' | 'center' | 'right'
}

type RichTextBlock = {
  blockType: 'richText'
  content: any // Slate rich text
  columnLayout: 'single' | 'two-column' | 'three-column'
  maxWidth: 'narrow' | 'medium' | 'wide' | 'full'
  backgroundColor: 'none' | 'light' | 'dark' | 'primary' | 'secondary'
  paddingTop: 'none' | 'small' | 'medium' | 'large'
  paddingBottom: 'none' | 'small' | 'medium' | 'large'
}

// ... etc
```

## Next Steps

- Create frontend block components in `src/components/blocks/`
- Implement block rendering logic
- Add animations with GSAP/Framer Motion
- Create block preview components for admin panel
