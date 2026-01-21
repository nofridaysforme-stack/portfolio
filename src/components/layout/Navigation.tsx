'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export interface NavLink {
  href: string
  label: string
}

interface NavigationProps {
  variant?: 'desktop' | 'mobile'
  links?: NavLink[]
  className?: string
  onLinkClick?: () => void
}

const defaultLinks: NavLink[] = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Navigation({
  variant = 'desktop',
  links = defaultLinks,
  className,
  onLinkClick,
}: NavigationProps) {
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle smooth scroll for anchor links
    if (href.startsWith('#')) {
      e.preventDefault()
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }
    }

    // Call onLinkClick callback (useful for closing mobile menu)
    onLinkClick?.()
  }

  const isActiveLink = (href: string) => {
    if (href.startsWith('#')) {
      return false // Anchor links don't have active state
    }
    return pathname === href
  }

  if (variant === 'mobile') {
    return (
      <nav className={cn('flex flex-col', className)} aria-label="Mobile navigation">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={(e) => handleClick(e, link.href)}
            className={cn(
              'menu-item text-2xl font-medium transition-colors py-3',
              isActiveLink(link.href)
                ? 'text-primary'
                : 'text-dark hover:text-primary'
            )}
            aria-current={isActiveLink(link.href) ? 'page' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    )
  }

  // Desktop variant
  return (
    <nav
      className={cn('flex items-center gap-8', className)}
      aria-label="Main navigation"
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={(e) => handleClick(e, link.href)}
          className={cn(
            'text-base font-medium transition-colors relative group',
            isActiveLink(link.href)
              ? 'text-primary'
              : 'text-dark hover:text-primary'
          )}
          aria-current={isActiveLink(link.href) ? 'page' : undefined}
        >
          {link.label}
          <span
            className={cn(
              'absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300',
              isActiveLink(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
            )}
            aria-hidden="true"
          />
        </Link>
      ))}
    </nav>
  )
}

// Export types for use in other components
export type { NavigationProps }
