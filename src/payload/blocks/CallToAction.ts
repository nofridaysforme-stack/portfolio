import { Block } from 'payload/types'

export const CallToAction: Block = {
  slug: 'cta',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Action Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Main heading for the CTA section',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      label: 'Description',
      maxLength: 300,
      admin: {
        description: 'Supporting text explaining the action (max 300 characters)',
      },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      minRows: 1,
      maxRows: 2,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          label: 'Button Text',
          admin: {
            placeholder: 'e.g., Get Started, Learn More',
          },
        },
        {
          name: 'link',
          type: 'text',
          required: true,
          label: 'Button Link',
          admin: {
            placeholder: '/contact or https://example.com',
          },
          validate: (value) => {
            if (!value) return 'Button link is required'
            if (value.startsWith('/') || value.startsWith('#')) return true
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL or path'
            }
          },
        },
        {
          name: 'style',
          type: 'select',
          label: 'Button Style',
          defaultValue: 'primary',
          options: [
            {
              label: 'Primary (Filled)',
              value: 'primary',
            },
            {
              label: 'Secondary (Outlined)',
              value: 'secondary',
            },
            {
              label: 'Ghost (Text only)',
              value: 'ghost',
            },
          ],
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in New Tab',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'primary',
      required: true,
      options: [
        {
          label: 'Primary (Burnt Orange)',
          value: 'primary',
        },
        {
          label: 'Secondary (Champagne Gold)',
          value: 'secondary',
        },
        {
          label: 'Dark (Charcoal)',
          value: 'dark',
        },
        {
          label: 'Light (Warm Neutral)',
          value: 'light',
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        description: 'Optional background image (will overlay with background color)',
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
    {
      name: 'size',
      type: 'select',
      label: 'Section Size',
      defaultValue: 'medium',
      options: [
        {
          label: 'Small (Compact)',
          value: 'small',
        },
        {
          label: 'Medium (Standard)',
          value: 'medium',
        },
        {
          label: 'Large (Prominent)',
          value: 'large',
        },
      ],
    },
  ],
}
