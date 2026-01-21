import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import path from 'path'

// Import Collections
import Users from './collections/Users'
import Media from './collections/Media'
import Projects from './collections/Projects'
import Pages from './collections/Pages'

// Import Globals
import SiteSettings from './globals/SiteSettings'

export default buildConfig({
  // Admin panel configuration
  admin: {
    user: Users.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Jana Portfolio CMS',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },

  // Editor configuration
  editor: slateEditor({}),

  // Collections
  collections: [
    Users,
    Media,
    Projects,
    Pages,
    // Add more collections here as you build them
    // Example: Blog, Categories, etc.
  ],

  // Globals
  globals: [
    SiteSettings,
    // Add more globals here as needed
    // Example: Navigation, Footer, etc.
  ],

  // TypeScript configuration
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },

  // GraphQL configuration
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },

  // Database adapter
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio',
  }),

  // Server URL
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',

  // CORS configuration
  cors: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // CSRF protection
  csrf: [
    process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  ].filter(Boolean),

  // Rate limiting
  rateLimit: {
    max: 2000,
    trustProxy: true,
  },
})
