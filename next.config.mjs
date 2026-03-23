/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/v0-lib-ty',
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
