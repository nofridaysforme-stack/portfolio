import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { slateEditor } from '@payloadcms/richtext-slate'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import path from 'path'

export default buildConfig({
  // Admin panel configuration
  admin: {
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Portfolio Admin',
      favicon: '/favicon.ico',
      ogImage: '/og-image.jpg',
    },
  },

  // Editor configuration
  editor: slateEditor({}),

  // Collections will be added here
  collections: [
    // Import and add your collections here
    // Example: Projects, Blog, Media, etc.
  ],

  // Globals will be added here
  globals: [
    // Import and add your globals here
    // Example: Navigation, Footer, SEO, etc.
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
