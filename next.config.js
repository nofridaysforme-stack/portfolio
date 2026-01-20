/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'firebasestorage.googleapis.com'],
  },
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'payload-config': require.resolve('./src/payload/payload.config.ts'),
    }
    return config
  },
}

module.exports = nextConfig
