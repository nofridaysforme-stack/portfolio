import { Block } from 'payload/types'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      label: 'Headline',
      admin: {
        description: 'Main headline for the hero section',
      },
    },
    {
      name: 'subheadline',
      type: 'textarea',
      label: 'Subheadline',
      admin: {
        description: 'Supporting text below the headline',
      },
    },
    {
      name: 'ctaText',
      type: 'text',
      label: 'CTA Button Text',
      admin: {
        description: 'Text for the call-to-action button',
        placeholder: 'e.g., Get Started, Learn More',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'CTA Button Link',
      admin: {
        description: 'URL or path for the CTA button',
        placeholder: '/contact or https://example.com',
      },
      validate: (value) => {
        if (!value) return true // Optional field
        // Basic URL validation - can be relative or absolute
        if (value.startsWith('/') || value.startsWith('#')) return true
        try {
          new URL(value)
          return true
        } catch {
          return 'Please enter a valid URL or path (e.g., /about or https://example.com)'
        }
      },
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Image to display as hero background',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'text',
      label: 'Background Video URL',
      admin: {
        description: 'Optional: Video URL for background (YouTube, Vimeo, or direct MP4)',
        placeholder: 'https://youtube.com/watch?v=... or /videos/hero.mp4',
      },
    },
    {
      name: 'height',
      type: 'select',
      label: 'Section Height',
      defaultValue: 'large',
      options: [
        {
          label: 'Small (50vh)',
          value: 'small',
        },
        {
          label: 'Medium (70vh)',
          value: 'medium',
        },
        {
          label: 'Large (90vh)',
          value: 'large',
        },
        {
          label: 'Full Screen (100vh)',
          value: 'fullscreen',
        },
      ],
    },
    {
      name: 'overlay',
      type: 'checkbox',
      label: 'Dark Overlay',
      defaultValue: true,
      admin: {
        description: 'Add dark overlay to improve text readability',
      },
    },
    {
      name: 'alignment',
      type: 'select',
      label: 'Content Alignment',
      defaultValue: 'center',
      options: [
        {
          label: 'Left',
          value: 'left',
        },
        {
          label: 'Center',
          value: 'center',
        },
        {
          label: 'Right',
          value: 'right',
        },
      ],
    },
  ],
}
