# Mobile Responsiveness Guide

Complete guide to mobile-first responsive design implementation in the portfolio site.

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Breakpoints](#breakpoints)
- [Fluid Typography](#fluid-typography)
- [Touch Interactions](#touch-interactions)
- [Mobile Navigation](#mobile-navigation)
- [Mobile Animations](#mobile-animations)
- [Image Optimization](#image-optimization)
- [Testing Tools](#testing-tools)
- [Common Patterns](#common-patterns)
- [Troubleshooting](#troubleshooting)

---

## Design Philosophy

### Mobile-First Approach

This project follows a **mobile-first** design methodology:

1. **Start with mobile** (320px - 640px)
2. **Progressively enhance** for larger screens
3. **Test on real devices** (iOS Safari, Chrome Android)
4. **Optimize for touch** (44x44px minimum tap targets)
5. **Reduce complexity on mobile** (simpler animations, smaller images)

### Core Principles

- **Touch-friendly**: All interactive elements ≥ 44x44px
- **Performance**: Faster animations and smaller images on mobile
- **Readability**: Minimum 16px font size to prevent iOS zoom
- **Accessibility**: Respects `prefers-reduced-motion`
- **Progressive Enhancement**: Basic functionality works everywhere

---

## Breakpoints

### Tailwind Breakpoints

```javascript
{
  sm: '640px',   // Small tablets (portrait)
  md: '768px',   // Tablets (portrait) / Large phones (landscape)
  lg: '1024px',  // Tablets (landscape) / Small desktops
  xl: '1280px',  // Desktops
  '2xl': '1536px' // Large desktops
}
```

### Common Device Sizes

**Mobile Phones:**
- iPhone SE: 375 × 667
- iPhone 12/13/14: 390 × 844
- iPhone 14 Pro Max: 430 × 932
- Pixel 5: 393 × 851
- Galaxy S21: 360 × 800

**Tablets:**
- iPad Mini: 768 × 1024
- iPad Pro 11": 834 × 1194
- iPad Pro 12.9": 1024 × 1366

**Desktops:**
- MacBook Air: 1280 × 800
- Standard HD: 1920 × 1080
- 4K: 3840 × 2160

### Usage in Code

```tsx
// Tailwind classes
<div className="w-full md:w-1/2 lg:w-1/3">
  Content
</div>

// Hidden on mobile, visible on desktop
<div className="hidden md:block">
  Desktop only
</div>

// Visible on mobile, hidden on desktop
<div className="block md:hidden">
  Mobile only
</div>
```

---

## Fluid Typography

### CSS Clamp() Implementation

All headings and body text use fluid typography that scales between mobile and desktop:

```css
/* Configured in src/styles/globals.css */

h1 {
  font-size: clamp(2rem, 5vw + 1rem, 3.5rem);    /* 32px → 56px */
  line-height: 1.2;
}

h2 {
  font-size: clamp(1.75rem, 4vw + 0.75rem, 3rem); /* 28px → 48px */
  line-height: 1.25;
}

h3 {
  font-size: clamp(1.5rem, 3vw + 0.5rem, 2.25rem); /* 24px → 36px */
  line-height: 1.3;
}

p {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem); /* 16px → 18px */
  line-height: 1.7;
}
```

### Benefits

- ✅ Smooth scaling across all viewport sizes
- ✅ No sudden jumps at breakpoints
- ✅ Better readability on all devices
- ✅ Maintains visual hierarchy

### Testing Typography

```tsx
// Force minimum 16px on mobile (prevents iOS zoom on input focus)
@media (max-width: 640px) {
  html {
    font-size: 16px;
  }
}
```

---

## Touch Interactions

### Minimum Touch Target Size

All interactive elements meet **WCAG 2.5.5 Level AAA** standards:

```css
/* Utility classes in src/styles/globals.css */

.touch-target {
  min-width: 44px;
  min-height: 44px;
}

.touch-manipulation {
  touch-action: manipulation; /* Disable double-tap zoom */
}

.tap-highlight-none {
  -webkit-tap-highlight-color: transparent;
}
```

### Touch-Friendly Components

**Buttons:**
```tsx
<button className="w-11 h-11 touch-manipulation active:scale-95">
  Click me
</button>
```

**Links:**
```tsx
<Link
  href="/projects"
  className="inline-block py-3 px-6 touch-manipulation"
>
  View Projects
</Link>
```

**Navigation Items:**
```tsx
<nav className="flex flex-col gap-4">
  {links.map(link => (
    <a
      key={link.href}
      href={link.href}
      className="py-3 px-4 touch-manipulation active:bg-primary/10"
    >
      {link.label}
    </a>
  ))}
</nav>
```

### Active States

Provide visual feedback on touch:

```css
.touch-active {
  @apply transition-transform active:scale-95;
}
```

### Safe Area Insets

Support for notched devices (iPhone X+):

```css
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.pt-safe {
  padding-top: env(safe-area-inset-top);
}

.px-safe {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

---

## Mobile Navigation

### Hamburger Menu

**Location**: `src/components/layout/Header.tsx`

Features:
- ✅ 44x44px touch target
- ✅ Animated hamburger → X transition
- ✅ GSAP slide-in animation (0.4s)
- ✅ Backdrop overlay with click-to-close
- ✅ Prevents body scroll when open
- ✅ Auto-closes on route change
- ✅ Close button inside menu

**Usage:**
```tsx
const [isMenuOpen, setIsMenuOpen] = useState(false)

// Auto-close on route change
useEffect(() => {
  setIsMenuOpen(false)
}, [pathname])

// Prevent body scroll
useEffect(() => {
  if (isMenuOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}, [isMenuOpen])
```

### Mobile Menu Structure

```tsx
{/* Backdrop */}
<div
  className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40"
  onClick={toggleMenu}
/>

{/* Menu Slide-in */}
<div className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-light z-50">
  <nav className="pt-24 px-6">
    {/* Navigation items with 44px minimum height */}
  </nav>
</div>
```

---

## Mobile Animations

### Automatic Optimization

Animations are automatically optimized for mobile devices using detection utilities in `src/lib/utils/animations.ts`:

```typescript
// Detect mobile device
export const isMobileDevice = (): boolean => {
  const hasTouch = 'ontouchstart' in window
  const isSmallScreen = window.innerWidth < 768
  return (hasTouch && isSmallScreen) || isMobileUserAgent
}

// Get optimized duration (30% faster on mobile)
export const getOptimizedDuration = (baseDuration: number): number => {
  if (isMobileDevice()) return baseDuration * 0.7
  return baseDuration
}

// Get optimized distance (40% less on mobile)
export const getOptimizedDistance = (baseDistance: number): number => {
  if (isMobileDevice()) return baseDistance * 0.6
  return baseDistance
}
```

### Mobile-Specific Animations

**Simplified Fade In (Mobile):**
```typescript
export const mobileFadeIn = (element: gsap.TweenTarget, delay = 0) => {
  const duration = getOptimizedDuration(0.5)

  return gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: 'power2.out' }
  )
}
```

**Disable Parallax on Mobile:**
```typescript
export const shouldEnableParallax = (): boolean => {
  return !isMobileDevice() && !prefersReducedMotion()
}

// Usage
if (shouldEnableParallax()) {
  parallaxScroll(element, 0.5)
}
```

### Performance Best Practices

**Mobile-Optimized GSAP Config:**
```typescript
// Automatically called in initGSAP()
export const setupMobileAnimations = () => {
  if (isMobileDevice()) {
    ScrollTrigger.config({
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    })

    if (isIOS()) {
      document.documentElement.style.webkitOverflowScrolling = 'touch'
    }
  }
}
```

**Reduced Motion:**
```typescript
// Automatically respects prefers-reduced-motion
export const setupAccessibleAnimations = () => {
  if (prefersReducedMotion()) {
    gsap.globalTimeline.timeScale(100) // Nearly instant animations
  }
}
```

---

## Image Optimization

### Responsive Image Utilities

**Location**: `src/lib/utils/imageOptimization.ts`

### Pre-configured Image Sizes

```typescript
import { IMAGE_SIZES, IMAGE_DIMENSIONS, getImageConfig } from '@/lib/utils/imageOptimization'

// Hero image (full width)
const heroProps = getImageConfig('hero', '/hero.jpg', 'Hero image', true)
<Image {...heroProps} />

// Project card image (responsive grid)
const cardProps = getImageConfig('projectCard', '/project.jpg', 'Project')
<Image {...cardProps} />
```

### Manual Configuration

```typescript
import { getResponsiveImageProps } from '@/lib/utils/imageOptimization'

const imageProps = getResponsiveImageProps({
  src: '/image.jpg',
  alt: 'Description',
  width: 1600,
  height: 900,
  sizes: {
    mobile: '100vw',
    tablet: '80vw',
    desktop: '60vw',
  },
  priority: true, // Above the fold
  quality: 90,
})

<Image {...imageProps} />
```

### Mobile-Optimized Dimensions

```typescript
import { getMobileOptimizedDimensions } from '@/lib/utils/imageOptimization'

const { width, height } = getMobileOptimizedDimensions(1920, 1080)
// On mobile (< 768px): Scales to device width
// On tablet (< 1024px): Caps at 1024px
// On desktop: Uses original 1920x1080
```

### Image Loading Strategies

**Priority Loading (Above the Fold):**
```tsx
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1920}
  height={1080}
  priority
  quality={90}
  sizes="100vw"
/>
```

**Lazy Loading (Below the Fold):**
```tsx
<Image
  src="/gallery-image.jpg"
  alt="Gallery"
  width={800}
  height={600}
  loading="lazy"
  quality={85}
  sizes="(max-width: 768px) 100vw, 33vw"
/>
```

### Blur Placeholders

```typescript
import { generateBlurDataURL } from '@/lib/utils/imageOptimization'

const blurDataURL = generateBlurDataURL(10, 10, '#e5e5e0')

<Image
  src="/image.jpg"
  alt="Image"
  width={800}
  height={600}
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

---

## Testing Tools

### Development Mode Tools

All testing tools are **automatically enabled in development mode** and hidden in production.

### 1. Responsive Indicator

**Location**: Bottom-left corner

Shows:
- Current breakpoint (xs, sm, md, lg, xl, 2xl)
- Viewport dimensions (width × height)
- Touch device detection
- Visual breakpoint indicators

**Always visible** in development mode.

### 2. Breakpoint Tester

**Toggle**: Press `Ctrl + Shift + G`

Shows:
- Vertical lines at each Tailwind breakpoint
- Labeled breakpoint markers
- Grid overlay

**Usage:**
1. Press `Ctrl + Shift + G` to show
2. Resize browser to see breakpoints
3. Press again to hide

### 3. Mobile Simulator Info

**Toggle**: Press `Ctrl + Shift + M`

Shows:
- Common mobile device screen sizes
- iPhone, Pixel, Galaxy, iPad dimensions
- Quick reference for testing

**Usage:**
1. Press `Ctrl + Shift + M` to show
2. Resize browser to match device dimensions
3. Use Chrome DevTools device toolbar for simulation

### 4. Web Vitals Overlay

**Location**: Bottom-right corner

Shows:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)
- Color-coded: 🟢 Good, 🟡 Needs Improvement, 🔴 Poor

**Always visible** in development mode.

### Chrome DevTools

**Device Toolbar (Ctrl + Shift + M):**
1. Open DevTools
2. Click device toolbar icon or press `Ctrl + Shift + M`
3. Select device preset or enter custom dimensions
4. Test touch interactions and viewport

**Lighthouse:**
1. Open DevTools → Lighthouse tab
2. Select "Mobile" device
3. Generate report
4. Review Performance and Accessibility scores

---

## Common Patterns

### Responsive Grid

```tsx
{/* 1 column mobile, 2 columns tablet, 3 columns desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

### Responsive Padding

```tsx
{/* Smaller padding on mobile, larger on desktop */}
<section className="py-12 md:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
  Content
</section>

{/* Use utility classes */}
<section className="section-padding container-mobile">
  Content
</section>
```

### Responsive Typography

```tsx
{/* Fluid typography automatically scales */}
<h1>Main Heading</h1>  {/* 32px → 56px */}
<h2>Section Heading</h2>  {/* 28px → 48px */}
<p>Body text</p>  {/* 16px → 18px */}

{/* Custom responsive text */}
<p className="text-sm md:text-base lg:text-lg">
  Custom sizing
</p>
```

### Responsive Flexbox

```tsx
{/* Stack on mobile, horizontal on desktop */}
<div className="flex flex-col md:flex-row gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Responsive Images

```tsx
import { getImageConfig } from '@/lib/utils/imageOptimization'

const imageProps = getImageConfig('projectCard', image.url, image.alt)

<Image {...imageProps} />
```

### Show/Hide on Mobile

```tsx
{/* Hide on mobile */}
<div className="hidden md:block">
  Desktop navigation
</div>

{/* Show only on mobile */}
<div className="block md:hidden">
  Mobile menu button
</div>
```

---

## Troubleshooting

### Common Issues

**1. Horizontal Scroll on Mobile**

**Problem**: Content overflows causing horizontal scroll

**Solution**:
```css
body {
  overflow-x: hidden; /* Already configured in globals.css */
}

/* Find overflowing elements */
* {
  outline: 1px solid red; /* Temporarily add to find culprit */
}
```

**2. iOS Input Zoom**

**Problem**: iOS zooms in when focusing on inputs < 16px

**Solution**:
```css
/* Already configured in globals.css */
@media (max-width: 640px) {
  html {
    font-size: 16px;
  }
}

/* Ensure inputs are at least 16px */
input, textarea, select {
  font-size: 16px;
}
```

**3. Touch Target Too Small**

**Problem**: Buttons/links are hard to tap on mobile

**Solution**:
```tsx
// Use touch-target utility or ensure min 44x44px
<button className="touch-target">Click me</button>

// Or manually
<button className="min-w-[44px] min-h-[44px]">Click me</button>
```

**4. Animations Too Complex on Mobile**

**Problem**: Janky animations on mobile devices

**Solution**:
```typescript
// Animations are auto-optimized, but you can manually check
import { isMobileDevice, shouldEnableComplexAnimations } from '@/lib/utils/animations'

if (shouldEnableComplexAnimations()) {
  // Complex animation
} else {
  // Simple fade or no animation
}
```

**5. Images Too Large on Mobile**

**Problem**: Large images slow down mobile

**Solution**:
```tsx
// Use image optimization utilities
import { getImageConfig } from '@/lib/utils/imageOptimization'

const imageProps = getImageConfig('projectCard', src, alt)
<Image {...imageProps} />

// Or specify custom sizes
<Image
  src={src}
  alt={alt}
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

**6. Menu Not Closing on iOS**

**Problem**: Mobile menu doesn't close when tapping overlay

**Solution**:
```tsx
// Use onClick instead of onTouchEnd
<div
  className="fixed inset-0 bg-dark/50"
  onClick={closeMenu}  // ✅ Works on all devices
  aria-hidden="true"
/>
```

---

## Performance Checklist

### Mobile-Specific Optimizations

**Images:**
- [ ] Use Next.js Image component
- [ ] Specify responsive sizes
- [ ] Lazy load below-the-fold images
- [ ] Use AVIF/WebP formats
- [ ] Add blur placeholders

**Animations:**
- [ ] Animations are 30% faster on mobile
- [ ] Parallax disabled on mobile
- [ ] Complex animations simplified
- [ ] Respects prefers-reduced-motion

**Touch Interactions:**
- [ ] All tap targets ≥ 44x44px
- [ ] Active states provide feedback
- [ ] Double-tap zoom disabled on buttons
- [ ] Scrolling is smooth

**Typography:**
- [ ] Fluid typography scales smoothly
- [ ] Minimum 16px font size
- [ ] Readable line heights (1.5+)
- [ ] Proper text wrapping

**Layout:**
- [ ] Mobile-first approach
- [ ] No horizontal scroll
- [ ] Safe area insets respected
- [ ] Proper viewport meta tag

**Testing:**
- [ ] Tested on iPhone (Safari)
- [ ] Tested on Android (Chrome)
- [ ] Tested with device toolbar
- [ ] Lighthouse mobile score ≥ 90

---

## Resources

### Testing Tools

- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Device simulation
- [BrowserStack](https://www.browserstack.com/) - Real device testing
- [Responsive Design Checker](https://responsivedesignchecker.com/) - Quick viewport testing

### Guides

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Mobile Performance](https://web.dev/mobile/)
- [WCAG Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

### Utilities

- **Responsive Indicator**: Always visible in dev mode (bottom-left)
- **Breakpoint Tester**: `Ctrl + Shift + G`
- **Mobile Simulator**: `Ctrl + Shift + M`
- **Web Vitals**: Always visible in dev mode (bottom-right)

---

Last Updated: 2026-01-21
