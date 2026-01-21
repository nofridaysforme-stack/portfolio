# Frontend Block Components

Frontend React components that render Payload CMS blocks with stunning animations and interactions.

## Available Blocks

### HeroBlock

A full-viewport hero section with GSAP animations, inspired by modern design aesthetics.

**Features:**
- Full viewport height options (small, medium, large, fullscreen)
- GSAP-powered animations (fade in, slide up, zoom)
- Background image or video support
- Configurable overlay for text readability
- Animated CTA button with hover effects
- Scroll indicator with bounce animation
- Smooth scroll to next section
- Responsive design
- Accessibility optimized

**Props:**
```typescript
interface HeroBlockProps {
  headline: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  backgroundImage?: {
    url: string
    alt?: string
  }
  backgroundVideo?: string
  height?: 'small' | 'medium' | 'large' | 'fullscreen'
  overlay?: boolean
  alignment?: 'left' | 'center' | 'right'
}
```

**Usage:**
```tsx
import { HeroBlock } from '@/components/blocks'

<HeroBlock
  headline="Crafting Digital Experiences"
  subheadline="Modern web development with stunning design"
  ctaText="Get Started"
  ctaLink="/contact"
  height="fullscreen"
  overlay={true}
  alignment="center"
/>
```

**Animations:**
1. **Headline** - Fades in and slides up (0.3s delay, 1s duration)
2. **Subheadline** - Fades in and slides up (0.6s delay, 1s duration)
3. **CTA Button** - Fades in and slides up (0.9s delay, 0.8s duration)
4. **Background** - Scales from 110% to 100% (0s delay, 1.5s duration)
5. **Scroll Indicator** - Continuous bounce animation

**Payload Integration:**
This component integrates with the Payload Hero block (`src/payload/blocks/Hero.ts`). To use with Payload data:

```tsx
import { getPage } from '@/lib/payload/api'

const page = await getPage('home')
const heroBlock = page?.layout.find(block => block.blockType === 'hero')

if (heroBlock) {
  return <HeroBlock {...heroBlock} />
}
```

## GSAP Animation Utilities

Located in `src/lib/utils/animations.ts`, these utilities provide reusable animation functions:

### fadeInUp(element, delay, duration, distance)
Fade in with upward slide animation.

```tsx
import { fadeInUp } from '@/lib/utils/animations'

useEffect(() => {
  fadeInUp(elementRef.current, 0.3, 1, 60)
}, [])
```

### scaleIn(element, delay, duration)
Scale and fade in animation for backgrounds.

```tsx
scaleIn(backgroundRef.current, 0, 1.5)
```

### bounceAnimation(element)
Infinite bounce animation for indicators.

```tsx
bounceAnimation(scrollIndicatorRef.current)
```

### smoothScrollTo(target, duration, offset)
Smooth scroll to an element or selector.

```tsx
smoothScrollTo('#next-section', 1.2, -80)
```

### parallaxScroll(element, speed)
Parallax scroll effect (requires ScrollTrigger).

```tsx
parallaxScroll(backgroundRef.current, 0.5)
```

### revealOnScroll(element, options)
Reveal element when it enters viewport.

```tsx
revealOnScroll('.card', {
  direction: 'up',
  distance: 60,
  duration: 0.8,
})
```

### staggerReveal(elements, options)
Stagger animation for multiple elements.

```tsx
staggerReveal('.card-item', {
  stagger: 0.1,
  duration: 0.6,
  direction: 'up',
})
```

## Performance Tips

1. **Use ref for animations** - Store element refs and animate directly
2. **Cleanup on unmount** - GSAP automatically cleans up, but explicit cleanup is available via `cleanupAnimations()`
3. **Lazy load backgrounds** - Use Next.js Image component with `priority` for above-the-fold images
4. **Optimize ScrollTrigger** - Call `initScrollTrigger()` once in your app

## Best Practices

1. **Initial state** - Set `opacity: 0` in className for elements that will animate in
2. **Animation delays** - Stagger delays by 0.3-0.4s for natural flow
3. **Duration** - Keep animations between 0.6-1.2s for best UX
4. **Easing** - Use `power3.out` for most animations, `power2.out` for subtle effects
5. **Accessibility** - Always include proper ARIA labels and keyboard navigation

## Creating New Blocks

To create a new block component:

1. Create the component file in `src/components/blocks/`
2. Import and use animation utilities from `@/lib/utils/animations`
3. Add TypeScript interface matching Payload block structure
4. Export from `index.ts`
5. Add documentation here

Example:
```tsx
'use client'

import { useEffect, useRef } from 'react'
import { fadeInUp } from '@/lib/utils/animations'

interface MyBlockProps {
  title: string
  content: string
}

export function MyBlock({ title, content }: MyBlockProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (titleRef.current) {
      fadeInUp(titleRef.current, 0.3)
    }
  }, [])

  return (
    <section>
      <h2 ref={titleRef} className="opacity-0">
        {title}
      </h2>
      <p>{content}</p>
    </section>
  )
}
```

## Troubleshooting

**Animations not working:**
- Ensure GSAP is installed: `npm install gsap`
- Check that element ref is not null before animating
- Verify `'use client'` directive is at top of component file

**ScrollTrigger not working:**
- Import and register: `import { ScrollTrigger } from 'gsap/ScrollTrigger'`
- Call `initScrollTrigger()` in root component
- Check browser console for errors

**Performance issues:**
- Limit number of simultaneous animations
- Use `will-change` CSS property sparingly
- Avoid animating layout properties (width, height) - use transforms instead
