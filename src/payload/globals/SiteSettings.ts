import { GlobalConfig } from 'payload/types'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    description: 'Manage global site configuration, branding, and settings',
  },
  access: {
    read: () => true, // Public can read site settings
    update: ({ req: { user } }) => {
      // Only admins can update site settings
      if (!user) return false
      return user.role === 'admin'
    },
  },
  fields: [
    // SITE IDENTITY
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Site Identity',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              defaultValue: 'Jana Portfolio',
              label: 'Site Name',
              admin: {
                description: 'The name of your website/portfolio',
              },
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Tagline',
              admin: {
                description: 'Brief description or motto for your site',
                placeholder: 'e.g., Creative Developer & Designer',
              },
            },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: 'Main site logo (recommended: SVG or PNG with transparent background)',
              },
            },
            {
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon',
              admin: {
                description: 'Site favicon (recommended: 32x32px PNG or ICO file)',
              },
            },
          ],
        },
        {
          label: 'Color Palette',
          fields: [
            {
              name: 'colorPalette',
              type: 'group',
              label: 'Brand Colors',
              admin: {
                description: 'Customize your site\'s color scheme',
              },
              fields: [
                {
                  name: 'primary',
                  type: 'text',
                  required: true,
                  defaultValue: '#D97E3C',
                  label: 'Primary Color (Burnt Orange)',
                  admin: {
                    description: 'Main brand color for buttons, links, accents',
                    placeholder: '#D97E3C',
                  },
                  validate: (value) => {
                    if (!value) return true
                    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    return hexRegex.test(value) || 'Please enter a valid hex color (e.g., #D97E3C)'
                  },
                },
                {
                  name: 'secondary',
                  type: 'text',
                  required: true,
                  defaultValue: '#D4AF6A',
                  label: 'Secondary Color (Champagne Gold)',
                  admin: {
                    description: 'Secondary brand color for highlights and accents',
                    placeholder: '#D4AF6A',
                  },
                  validate: (value) => {
                    if (!value) return true
                    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    return hexRegex.test(value) || 'Please enter a valid hex color (e.g., #D4AF6A)'
                  },
                },
                {
                  name: 'dark',
                  type: 'text',
                  required: true,
                  defaultValue: '#2D2D2D',
                  label: 'Dark Color (Charcoal)',
                  admin: {
                    description: 'Dark color for text and backgrounds',
                    placeholder: '#2D2D2D',
                  },
                  validate: (value) => {
                    if (!value) return true
                    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    return hexRegex.test(value) || 'Please enter a valid hex color (e.g., #2D2D2D)'
                  },
                },
                {
                  name: 'light',
                  type: 'text',
                  required: true,
                  defaultValue: '#F5F5F0',
                  label: 'Light Color (Warm Neutral)',
                  admin: {
                    description: 'Light color for backgrounds and text on dark',
                    placeholder: '#F5F5F0',
                  },
                  validate: (value) => {
                    if (!value) return true
                    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    return hexRegex.test(value) || 'Please enter a valid hex color (e.g., #F5F5F0)'
                  },
                },
                {
                  name: 'accent',
                  type: 'text',
                  label: 'Accent Color',
                  admin: {
                    description: 'Optional accent color for special elements',
                    placeholder: '#FF6B6B',
                  },
                  validate: (value) => {
                    if (!value) return true
                    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    return hexRegex.test(value) || 'Please enter a valid hex color (e.g., #FF6B6B)'
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact Information',
          fields: [
            {
              name: 'contactInfo',
              type: 'group',
              label: 'Contact Details',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email Address',
                  admin: {
                    description: 'Primary contact email',
                    placeholder: 'hello@example.com',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone Number',
                  admin: {
                    description: 'Contact phone number',
                    placeholder: '+1 (555) 123-4567',
                  },
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location',
                  admin: {
                    description: 'City, State/Country',
                    placeholder: 'San Francisco, CA',
                  },
                },
              ],
            },
            {
              name: 'socialLinks',
              type: 'array',
              label: 'Social Media Links',
              admin: {
                description: 'Add your social media profiles',
              },
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  label: 'Platform',
                  options: [
                    {
                      label: 'GitHub',
                      value: 'github',
                    },
                    {
                      label: 'LinkedIn',
                      value: 'linkedin',
                    },
                    {
                      label: 'Twitter',
                      value: 'twitter',
                    },
                    {
                      label: 'Instagram',
                      value: 'instagram',
                    },
                    {
                      label: 'TikTok',
                      value: 'tiktok',
                    },
                    {
                      label: 'Pinterest',
                      value: 'pinterest',
                    },
                    {
                      label: 'YouTube',
                      value: 'youtube',
                    },
                    {
                      label: 'Dribbble',
                      value: 'dribbble',
                    },
                    {
                      label: 'Behance',
                      value: 'behance',
                    },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'Profile URL',
                  admin: {
                    placeholder: 'https://github.com/username',
                  },
                  validate: (value) => {
                    if (!value) return 'URL is required'
                    try {
                      new URL(value)
                      return true
                    } catch {
                      return 'Please enter a valid URL (include https://)'
                    }
                  },
                },
                {
                  name: 'displayText',
                  type: 'text',
                  label: 'Display Text',
                  admin: {
                    description: 'Optional custom text to display (defaults to platform name)',
                    placeholder: '@username',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO Defaults',
          fields: [
            {
              name: 'seoDefaults',
              type: 'group',
              label: 'Default SEO Settings',
              admin: {
                description: 'Default metadata for pages without custom SEO',
              },
              fields: [
                {
                  name: 'metaTitle',
                  type: 'text',
                  label: 'Default Meta Title',
                  maxLength: 60,
                  admin: {
                    description: 'Default title for search results (max 60 characters)',
                    placeholder: 'Jana Portfolio - Creative Developer',
                  },
                },
                {
                  name: 'metaDescription',
                  type: 'textarea',
                  label: 'Default Meta Description',
                  maxLength: 160,
                  admin: {
                    description: 'Default description for search results (max 160 characters)',
                  },
                },
                {
                  name: 'ogImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Default Social Share Image',
                  admin: {
                    description: 'Default image for social media sharing (recommended: 1200x630px)',
                  },
                },
                {
                  name: 'twitterHandle',
                  type: 'text',
                  label: 'Twitter Handle',
                  admin: {
                    description: 'Your Twitter username (without @)',
                    placeholder: 'username',
                  },
                  validate: (value) => {
                    if (!value) return true
                    // Check if it starts with @ and remove it
                    const handle = value.startsWith('@') ? value.substring(1) : value
                    // Check if it's a valid username (alphanumeric and underscore)
                    const usernameRegex = /^[A-Za-z0-9_]{1,15}$/
                    return usernameRegex.test(handle) || 'Please enter a valid Twitter username (no @)'
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Analytics & Tracking',
          fields: [
            {
              name: 'analytics',
              type: 'group',
              label: 'Analytics Configuration',
              admin: {
                description: 'Configure analytics and tracking services',
              },
              fields: [
                {
                  name: 'enableAnalytics',
                  type: 'checkbox',
                  label: 'Enable Analytics',
                  defaultValue: false,
                  admin: {
                    description: 'Enable or disable all analytics tracking',
                  },
                },
                {
                  name: 'googleAnalyticsId',
                  type: 'text',
                  label: 'Google Analytics ID',
                  admin: {
                    description: 'Google Analytics tracking ID (e.g., G-XXXXXXXXXX or UA-XXXXXXXXX)',
                    placeholder: 'G-XXXXXXXXXX',
                    condition: (data) => data.analytics?.enableAnalytics === true,
                  },
                },
                {
                  name: 'facebookPixelId',
                  type: 'text',
                  label: 'Facebook Pixel ID',
                  admin: {
                    description: 'Facebook Pixel ID for conversion tracking',
                    placeholder: '1234567890',
                    condition: (data) => data.analytics?.enableAnalytics === true,
                  },
                },
                {
                  name: 'googleTagManagerId',
                  type: 'text',
                  label: 'Google Tag Manager ID',
                  admin: {
                    description: 'Google Tag Manager container ID (e.g., GTM-XXXXXXX)',
                    placeholder: 'GTM-XXXXXXX',
                    condition: (data) => data.analytics?.enableAnalytics === true,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export default SiteSettings
