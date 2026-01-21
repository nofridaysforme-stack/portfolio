import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import type { SiteSettings } from '@/lib/payload/api'

interface FooterProps {
  siteSettings: SiteSettings | null
}

const socialIcons: Record<string, string> = {
  github: '⚙',
  linkedin: '💼',
  twitter: '🐦',
  instagram: '📷',
  tiktok: '🎵',
  pinterest: '📌',
  youtube: '▶',
  dribbble: '🏀',
  behance: '🎨',
}

const quickLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function Footer({ siteSettings }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const siteName = siteSettings?.siteName || 'Portfolio'
  const contactEmail = siteSettings?.contactInfo?.email
  const socialLinks = siteSettings?.socialLinks || []

  return (
    <footer className="bg-dark text-light py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-serif text-primary">
              {siteName}
            </h3>
            {siteSettings?.tagline && (
              <p className="text-light/70 text-sm leading-relaxed">
                {siteSettings.tagline}
              </p>
            )}
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">
              Quick Links
            </h4>
            <nav className="flex flex-col space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-light/70 hover:text-primary transition-colors text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-secondary">
              Connect
            </h4>

            {/* Contact Email */}
            {contactEmail && (
              <div className="space-y-1">
                <p className="text-xs text-light/50">Email</p>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-light/70 hover:text-primary transition-colors text-sm block"
                >
                  {contactEmail}
                </a>
              </div>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-light/50">Follow</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'w-10 h-10 rounded-full bg-light/10 hover:bg-primary',
                        'flex items-center justify-center transition-all',
                        'text-light hover:text-dark text-lg'
                      )}
                      aria-label={`Visit our ${social.platform} profile`}
                      title={social.displayText || social.platform}
                    >
                      <span aria-hidden="true">
                        {socialIcons[social.platform] || '🔗'}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-light/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-light/50 text-sm">
              © {currentYear} {siteName}. All rights reserved.
            </p>

            {siteSettings?.contactInfo?.location && (
              <p className="text-light/50 text-sm">
                📍 {siteSettings.contactInfo.location}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
