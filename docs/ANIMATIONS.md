# GSAP Animations Documentation

Comprehensive guide to scroll-based animations using GSAP ScrollTrigger.

## Table of Contents

- [Setup](#setup)
- [Basic Animations](#basic-animations)
- [Scroll-Based Animations](#scroll-based-animations)
- [Parallax Effects](#parallax-effects)
- [Text Animations](#text-animations)
- [Special Effects](#special-effects)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [Examples](#examples)

## Setup

### Installation

GSAP is already installed in the project. The ScrollTrigger plugin is registered automatically.

### Initialization

GSAP is initialized globally via the `GSAPProvider` in the root layout:

```tsx
import { GSAPProvider } from '@/components/providers/GSAPProvider'

// Wraps your app in layout.tsx
<GSAPProvider>
  {children}
</GSAPProvider>
```

### Configuration

Global GSAP configuration is managed in `src/lib/utils/gsapConfig.ts`:

```typescript
import { initGSAP } from '@/lib/utils/gsapConfig'

// Initialize GSAP with optimal settings
initGSAP()
```

## Basic Animations

### fadeInUp
Fade in with upward slide animation.

```typescript
import { fadeInUp } from '@/lib/utils/animations'

// Simple usage
fadeInUp(element, delay, duration, distance)

// Example
fadeInUp('.card', 0.3, 0.8, 60)
```

**Parameters:**
- `element`: Element or selector
- `delay`: Delay before animation (seconds)
- `duration`: Animation duration (seconds)
- `distance`: Slide distance (pixels)

### fadeIn
Simple fade in animation.

```typescript
import { fadeIn } from '@/lib/utils/animations'

fadeIn(element, delay, duration)
```

### scaleIn
Scale and fade in animation.

```typescript
import { scaleIn } from '@/lib/utils/animations'

scaleIn(element, delay, duration)
```

## Scroll-Based Animations

All scroll-based animations use ScrollTrigger for automatic play/reverse based on scroll position.

### fadeInDown
Slide down + fade on scroll into view.

```typescript
import { fadeInDown } from '@/lib/utils/animations'

fadeInDown(element, {
  delay: 0,
  duration: 0.8,
  distance: 60,
  start: 'top 80%', // When element top hits 80% of viewport
})
```

### fadeInLeft
Slide from left + fade on scroll.

```typescript
import { fadeInLeft } from '@/lib/utils/animations'

fadeInLeft('.image', {
  duration: 1,
  distance: 100,
  start: 'top 75%',
})
```

### fadeInRight
Slide from right + fade on scroll.

```typescript
import { fadeInRight } from '@/lib/utils/animations'

fadeInRight('.sidebar', {
  duration: 0.8,
  distance: 80,
})
```

### staggerFadeIn
Sequential reveal with stagger effect.

```typescript
import { staggerFadeIn } from '@/lib/utils/animations'

staggerFadeIn('.card', {
  stagger: 0.1,  // Delay between each element
  duration: 0.8,
  direction: 'up', // 'up' | 'down' | 'left' | 'right'
  distance: 40,
  start: 'top 85%',
})
```

**Use Cases:**
- Grid items
- List items
- Navigation links
- Gallery images

## Parallax Effects

### parallaxImage
Background image parallax effect.

```typescript
import { parallaxImage } from '@/lib/utils/animations'

// speed: 0.2 = slow, 0.8 = fast
parallaxImage('.hero-bg', 0.3)
```

Creates smooth parallax scrolling tied to scroll position.

### parallaxElement
Element movement parallax.

```typescript
import { parallaxElement } from '@/lib/utils/animations'

// distance: pixels to move
parallaxElement('.floating-element', 100)
```

## Scale Animations

### scaleOnScroll
Grow/shrink animation on scroll.

```typescript
import { scaleOnScroll } from '@/lib/utils/animations'

scaleOnScroll('.feature', {
  from: 0.8,  // Start scale
  to: 1,      // End scale
  duration: 0.8,
  start: 'top 80%',
})
```

### revealOnScrollWithScale
Scale from 0 with elastic ease.

```typescript
import { revealOnScrollWithScale } from '@/lib/utils/animations'

revealOnScrollWithScale('.badge', {
  duration: 1,
  start: 'top 80%',
})
```

**Best for:**
- Badges
- Icons
- Feature highlights

## Text Animations

### splitTextAnimation
Word-by-word or character-by-character reveal.

```typescript
import { splitTextAnimation } from '@/lib/utils/animations'

const element = document.querySelector('h1')
splitTextAnimation(element, {
  splitBy: 'words', // 'words' | 'chars' | 'lines'
  stagger: 0.05,
  duration: 0.6,
  start: 'top 80%',
})
```

**Note:** Modifies DOM structure - splits text into spans.

### typewriterEffect
Character-by-character typing animation.

```typescript
import { typewriterEffect } from '@/lib/utils/animations'

typewriterEffect(element, 50) // 50 characters per second
```

**Best for:**
- Headlines
- Taglines
- Feature descriptions

## Special Effects

### magneticButton
Cursor-following button effect.

```typescript
import { magneticButton } from '@/lib/utils/animations'

const cleanup = magneticButton(button, 0.3) // strength: 0-1

// Clean up on unmount
useEffect(() => {
  return cleanup
}, [])
```

### pinOnScroll
Pin element during scroll.

```typescript
import { pinOnScroll } from '@/lib/utils/gsapConfig'

pinOnScroll(element, {
  start: 'top top',
  end: 'bottom bottom',
  pinSpacing: true,
})
```

**Use Cases:**
- Sticky navigation
- Fixed headers
- Sidebar menus

## Accessibility

### Reduced Motion Support

The library automatically respects user preferences for reduced motion:

```typescript
import { prefersReducedMotion, setupAccessibleAnimations } from '@/lib/utils/animations'

// Check if user prefers reduced motion
if (prefersReducedMotion()) {
  // Disable complex animations
}

// Auto-setup accessible animations
setupAccessibleAnimations()
```

**What it does:**
- Speeds up animations dramatically (100x timeScale)
- Reduces ScrollTrigger update frequency
- Preserves functionality while reducing motion

### Manual Control

```typescript
// Disable specific animations
if (prefersReducedMotion()) {
  return // Skip animation
}

fadeInUp(element)
```

## Performance

### Best Practices

1. **Use will-change sparingly:**
```css
.animating-element {
  will-change: transform, opacity;
}
```

2. **Batch animations:**
```typescript
import { batchScrollTrigger } from '@/lib/utils/gsapConfig'

batchScrollTrigger('.card', {
  onEnter: (batch) => {
    gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15 })
  },
})
```

3. **Clean up animations:**
```typescript
import { cleanupGSAP } from '@/lib/utils/gsapConfig'

useEffect(() => {
  // Setup animations
  fadeInUp('.element')

  return () => {
    cleanupGSAP() // Cleanup on unmount
  }
}, [])
```

4. **Refresh after layout changes:**
```typescript
import { refreshScrollTriggers } from '@/lib/utils/gsapConfig'

// After content loads
refreshScrollTriggers()
```

### Mobile Optimization

The library automatically reduces animation complexity on mobile devices:
- Faster durations (0.5s vs 0.8s)
- Simplified effects
- Reduced motion for low-end devices

## Examples

### Animated Card Grid

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { staggerFadeIn } from '@/lib/utils/animations'

export function CardGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return

    const cards = gridRef.current.querySelectorAll('.card')
    staggerFadeIn(cards, {
      stagger: 0.15,
      duration: 0.8,
      direction: 'up',
    })
  }, [])

  return (
    <div ref={gridRef} className="grid grid-cols-3 gap-4">
      <div className="card opacity-0">Card 1</div>
      <div className="card opacity-0">Card 2</div>
      <div className="card opacity-0">Card 3</div>
    </div>
  )
}
```

### Parallax Hero

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { parallaxImage, fadeInUp } from '@/lib/utils/animations'

export function ParallaxHero() {
  const bgRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (bgRef.current) {
      parallaxImage(bgRef.current, 0.3)
    }

    if (titleRef.current) {
      fadeInUp(titleRef.current, 0.3, 1, 80)
    }
  }, [])

  return (
    <section className="relative h-screen overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 bg-cover bg-center" />
      <h1 ref={titleRef} className="relative z-10 opacity-0">
        Hero Title
      </h1>
    </section>
  )
}
```

### Split Text Animation

```tsx
'use client'

import { useEffect, useRef } from 'react'
import { splitTextAnimation } from '@/lib/utils/animations'

export function AnimatedHeadline() {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (headlineRef.current) {
      splitTextAnimation(headlineRef.current, {
        splitBy: 'words',
        stagger: 0.1,
        duration: 0.6,
      })
    }
  }, [])

  return (
    <h1 ref={headlineRef}>
      Animated Headline
    </h1>
  )
}
```

## Troubleshooting

### Animations Not Working

1. **Check if element is visible:**
```typescript
import { isInViewport } from '@/lib/utils/gsapConfig'

if (!isInViewport(element)) {
  console.log('Element not in viewport')
}
```

2. **Verify ScrollTrigger is registered:**
```typescript
import { ScrollTrigger } from 'gsap/ScrollTrigger'
console.log('Active triggers:', ScrollTrigger.getAll().length)
```

3. **Check for conflicts:**
```typescript
// Kill all animations
cleanupGSAP()

// Re-initialize
initGSAP()
```

### Performance Issues

1. **Limit active animations:**
```typescript
// Max 50 ScrollTriggers recommended
if (ScrollTrigger.getAll().length > 50) {
  console.warn('Too many ScrollTriggers!')
}
```

2. **Disable on mobile:**
```typescript
const isMobile = /Mobile|Android/i.test(navigator.userAgent)
if (isMobile) {
  return // Skip complex animations
}
```

3. **Use batch processing:**
```typescript
batchScrollTrigger('.card', {
  interval: 0.1, // Batch size
})
```

## Resources

- [GSAP Documentation](https://greensock.com/docs/)
- [ScrollTrigger Docs](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Animation Library](/src/lib/utils/animations.ts)
- [GSAP Config](/src/lib/utils/gsapConfig.ts)

## Support

For animation issues or questions:
1. Check console for GSAP errors
2. Use `markers: true` in ScrollTrigger for debugging
3. Verify element opacity is set to 0 initially
4. Ensure useEffect dependencies are correct
