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
  env: {
    NEXT_PUBLIC_BASE_PATH: '/v0-lib-ty',
  },
}

export default nextConfig
