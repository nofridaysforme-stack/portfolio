import { CollectionConfig } from 'payload/types'
import { slugify } from '@/lib/utils/formatters'

const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'featured', 'status', 'updatedAt'],
    group: 'Portfolio',
    listSearchableFields: ['title', 'summary', 'category'],
  },
  access: {
    // Public can read published projects only
    read: ({ req: { user } }) => {
      if (user) {
        // Authenticated users can read all projects
        return true
      }
      // Public can only read published projects
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
    // BASIC INFO
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Project Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Auto-generated from title, but can be customized',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            // Auto-generate slug from title if not provided
            if (!value && data?.title) {
              return slugify(data.title)
            }
            // Slugify the value if provided
            return value ? slugify(value) : value
          },
        ],
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      required: true,
      maxLength: 200,
      label: 'Short Summary',
      admin: {
        description: 'Brief description for project cards (max 200 characters)',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Web Application',
          value: 'web-application',
        },
        {
          label: 'Mobile App',
          value: 'mobile-app',
        },
        {
          label: 'Design System',
          value: 'design-system',
        },
        {
          label: 'Music Production',
          value: 'music-production',
        },
        {
          label: 'AI/ML',
          value: 'ai-ml',
        },
        {
          label: 'Client Work',
          value: 'client-work',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Project',
      defaultValue: false,
      admin: {
        description: 'Display this project in the featured section on homepage',
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

    // MEDIA
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Featured Image',
      admin: {
        description: 'Main image shown in project cards and header',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Image Gallery',
      admin: {
        description: 'Additional images showcasing the project',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Image Caption',
        },
      ],
    },

    // CONTENT
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Full Case Study',
      admin: {
        description: 'Detailed project description and case study content',
      },
    },
    {
      name: 'techStack',
      type: 'array',
      label: 'Technology Stack',
      required: true,
      minRows: 1,
      admin: {
        description: 'Technologies and tools used in this project',
      },
      fields: [
        {
          name: 'technology',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'links',
      type: 'group',
      label: 'Project Links',
      fields: [
        {
          name: 'liveUrl',
          type: 'text',
          label: 'Live URL',
          admin: {
            description: 'Link to the live project',
            placeholder: 'https://example.com',
          },
          validate: (value) => {
            if (!value) return true // Optional field
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL (include https://)'
            }
          },
        },
        {
          name: 'githubUrl',
          type: 'text',
          label: 'GitHub URL',
          admin: {
            description: 'Link to the GitHub repository',
            placeholder: 'https://github.com/username/repo',
          },
          validate: (value) => {
            if (!value) return true // Optional field
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL (include https://)'
            }
          },
        },
        {
          name: 'caseStudyUrl',
          type: 'text',
          label: 'External Case Study URL',
          admin: {
            description: 'Link to external case study or blog post',
            placeholder: 'https://example.com/case-study',
          },
          validate: (value) => {
            if (!value) return true // Optional field
            try {
              new URL(value)
              return true
            } catch {
              return 'Please enter a valid URL (include https://)'
            }
          },
        },
      ],
    },
    {
      name: 'metrics',
      type: 'array',
      label: 'Project Metrics',
      admin: {
        description: 'Key metrics and results from the project',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Metric Label',
          admin: {
            placeholder: 'e.g., Performance Improvement',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          label: 'Metric Value',
          admin: {
            placeholder: 'e.g., 50% faster load time',
          },
        },
      ],
    },

    // ADMIN
    {
      name: 'displayOrder',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first. Use for manual sorting.',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Set updatedAt timestamp
        data.updatedAt = new Date().toISOString()
        return data
      },
    ],
  },
  timestamps: true,
}

export default Projects
