import { Block } from 'payload/types'

export const RichText: Block = {
  slug: 'richText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Content',
      admin: {
        description: 'Rich text content with full formatting options',
      },
    },
    {
      name: 'columnLayout',
      type: 'select',
      label: 'Column Layout',
      defaultValue: 'single',
      options: [
        {
          label: 'Single Column',
          value: 'single',
        },
        {
          label: 'Two Columns',
          value: 'two-column',
        },
        {
          label: 'Three Columns',
          value: 'three-column',
        },
      ],
      admin: {
        description: 'Choose how to display the content',
      },
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Maximum Width',
      defaultValue: 'medium',
      options: [
        {
          label: 'Narrow (640px)',
          value: 'narrow',
        },
        {
          label: 'Medium (768px)',
          value: 'medium',
        },
        {
          label: 'Wide (1024px)',
          value: 'wide',
        },
        {
          label: 'Full Width',
          value: 'full',
        },
      ],
      admin: {
        description: 'Maximum width of the content container',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Background Color',
      defaultValue: 'none',
      options: [
        {
          label: 'None (Transparent)',
          value: 'none',
        },
        {
          label: 'Light',
          value: 'light',
        },
        {
          label: 'Dark',
          value: 'dark',
        },
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
      ],
    },
    {
      name: 'paddingTop',
      type: 'select',
      label: 'Top Padding',
      defaultValue: 'medium',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
    {
      name: 'paddingBottom',
      type: 'select',
      label: 'Bottom Padding',
      defaultValue: 'medium',
      options: [
        {
          label: 'None',
          value: 'none',
        },
        {
          label: 'Small',
          value: 'small',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'Large',
          value: 'large',
        },
      ],
    },
  ],
}
