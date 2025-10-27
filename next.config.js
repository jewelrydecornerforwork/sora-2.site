/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable caching in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Disable static optimization to always get fresh content
  generateBuildId: async () => {
    return 'development-' + Date.now()
  },
  images: {
    domains: ['localhost', 'sora-2.site'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sora-2.site',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
