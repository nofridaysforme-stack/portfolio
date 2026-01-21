'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { cn } from '@/lib/utils/cn'
import type { SiteSettings } from '@/lib/payload/api'
import { Navigation } from './Navigation'

interface HeaderProps {
  siteSettings: SiteSettings | null
}

export function Header({ siteSettings }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Handle scroll for sticky header with opacity change
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // GSAP animation for mobile menu
  useEffect(() => {
    if (!menuRef.current) return

    if (isMenuOpen) {
      // Animate menu open
      gsap.to(menuRef.current, {
        x: 0,
        duration: 0.4,
        ease: 'power3.out',
      })

      // Animate menu items
      const menuItems = menuRef.current.querySelectorAll('.menu-item')
      gsap.fromTo(
        menuItems,
        { x: 50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power2.out',
        }
      )
    } else {
      // Animate menu close
      gsap.to(menuRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      })
    }
  }, [isMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const logoUrl = siteSettings?.logo?.url
  const logoAlt = siteSettings?.logo?.alt || siteSettings?.siteName || 'Logo'
  const siteName = siteSettings?.siteName || 'Portfolio'

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-light/95 backdrop-blur-sm shadow-md py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={logoAlt}
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                  priority
                />
              ) : (
                <span className="text-2xl font-bold text-dark font-serif">
                  {siteName}
                </span>
              )}
            </Link>

            {/* Desktop Navigation */}
            <Navigation variant="desktop" className="hidden md:flex" />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-dark hover:text-primary transition-colors"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-5 relative flex flex-col justify-center">
                <span
                  className={cn(
                    'absolute w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'rotate-45' : '-translate-y-2'
                  )}
                />
                <span
                  className={cn(
                    'absolute w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? 'opacity-0' : 'opacity-100'
                  )}
                />
                <span
                  className={cn(
                    'absolute w-full h-0.5 bg-current transition-all duration-300',
                    isMenuOpen ? '-rotate-45' : 'translate-y-2'
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-dark/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu */}
      <div
        ref={menuRef}
        className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-light shadow-2xl z-50 md:hidden translate-x-full"
      >
        <div className="flex flex-col h-full pt-24 px-8 pb-8">
          <Navigation
            variant="mobile"
            className="gap-6"
            onLinkClick={toggleMenu}
          />

          {/* Mobile Menu Footer */}
          {siteSettings?.contactInfo?.email && (
            <div className="mt-auto pt-8 border-t border-dark/10">
              <p className="text-sm text-dark/60 mb-2">Get in touch</p>
              <a
                href={`mailto:${siteSettings.contactInfo.email}`}
                className="text-base text-primary hover:text-primary-600 transition-colors"
              >
                {siteSettings.contactInfo.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
