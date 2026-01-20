import { CollectionConfig } from 'payload/types'
import { slugify } from '@/lib/utils/formatters'
import { Hero } from '../blocks/Hero'
import { RichText } from '../blocks/RichText'
import { Gallery } from '../blocks/Gallery'
import { CallToAction } from '../blocks/CallToAction'

const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Content',
    description: 'Create flexible page layouts using drag-and-drop blocks',
  },
  access: {
    // Public can read published pages only
    read: ({ req: { user } }) => {
      if (user) {
        return true
      }
      return {
        status: {
          equals: 'published',
        },
      }
    },
    // Authenticated users can create/update/delete
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Page Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly page identifier (auto-generated from title)',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return slugify(data.title)
            }
            return value ? slugify(value) : value
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        {
          label: 'Draft',
          value: 'draft',
        },
        {
          label: 'Published',
          value: 'published',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Published Date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Page Layout',
      minRows: 1,
      blocks: [Hero, RichText, Gallery, CallToAction],
      admin: {
        description: 'Build your page by adding and arranging content blocks',
        initCollapsed: false,
      },
    },
    // SEO Group
    {
      name: 'seo',
      type: 'group',
      label: 'SEO Settings',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          maxLength: 60,
          admin: {
            description: 'Overrides the page title in search results (max 60 characters)',
            placeholder: 'Leave empty to use page title',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          maxLength: 160,
          admin: {
            description: 'Description shown in search results (max 160 characters)',
          },
        },
        {
          name: 'metaKeywords',
          type: 'text',
          label: 'Meta Keywords',
          admin: {
            description: 'Comma-separated keywords for this page',
            placeholder: 'portfolio, web design, projects',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Social Share Image',
          admin: {
            description: 'Image shown when sharing on social media (recommended: 1200x630px)',
          },
        },
        {
          name: 'noindex',
          type: 'checkbox',
          label: 'Hide from Search Engines',
          defaultValue: false,
          admin: {
            description: 'Prevent search engines from indexing this page',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set publishedAt date when publishing for the first time
        if (data.status === 'published' && !data.publishedAt && operation === 'create') {
          data.publishedAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
  timestamps: true,
}

export default Pages
