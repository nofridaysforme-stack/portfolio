import { Block } from 'payload/types'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Gallery Title',
      admin: {
        description: 'Optional title to display above the gallery',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Image',
        },
        {
          name: 'caption',
          type: 'text',
          label: 'Caption',
          admin: {
            description: 'Optional caption to display with the image',
          },
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text Override',
          admin: {
            description: 'Override the alt text from the media library (optional)',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Gallery Layout',
      defaultValue: 'grid',
      required: true,
      options: [
        {
          label: 'Grid (Equal height rows)',
          value: 'grid',
        },
        {
          label: 'Masonry (Pinterest-style)',
          value: 'masonry',
        },
        {
          label: 'Carousel (Slideshow)',
          value: 'carousel',
        },
        {
          label: 'Slider (With thumbnails)',
          value: 'slider',
        },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Number of Columns',
      defaultValue: 'three',
      options: [
        {
          label: 'Two Columns',
          value: 'two',
        },
        {
          label: 'Three Columns',
          value: 'three',
        },
        {
          label: 'Four Columns',
          value: 'four',
        },
      ],
      admin: {
        description: 'Only applies to grid and masonry layouts',
        condition: (data) => data.layout === 'grid' || data.layout === 'masonry',
      },
    },
    {
      name: 'gap',
      type: 'select',
      label: 'Gap Between Images',
      defaultValue: 'medium',
      options: [
        {
          label: 'Small (8px)',
          value: 'small',
        },
        {
          label: 'Medium (16px)',
          value: 'medium',
        },
        {
          label: 'Large (24px)',
          value: 'large',
        },
        {
          label: 'None',
          value: 'none',
        },
      ],
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Image Aspect Ratio',
      defaultValue: 'original',
      options: [
        {
          label: 'Original (No cropping)',
          value: 'original',
        },
        {
          label: 'Square (1:1)',
          value: 'square',
        },
        {
          label: 'Landscape (16:9)',
          value: 'landscape',
        },
        {
          label: 'Portrait (3:4)',
          value: 'portrait',
        },
      ],
      admin: {
        description: 'Only applies to grid layout',
        condition: (data) => data.layout === 'grid',
      },
    },
    {
      name: 'enableLightbox',
      type: 'checkbox',
      label: 'Enable Lightbox',
      defaultValue: true,
      admin: {
        description: 'Allow users to click images to view in fullscreen',
      },
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay',
      defaultValue: false,
      admin: {
        description: 'Automatically advance slides',
        condition: (data) => data.layout === 'carousel' || data.layout === 'slider',
      },
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      label: 'Autoplay Speed (seconds)',
      defaultValue: 5,
      min: 2,
      max: 10,
      admin: {
        description: 'Time between slides in seconds',
        condition: (data) =>
          (data.layout === 'carousel' || data.layout === 'slider') && data.autoplay === true,
      },
    },
  ],
}
