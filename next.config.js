/** @type {import('next').NextConfig} */
const nextConfig = {
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
