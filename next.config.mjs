import withPWA from "next-pwa"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

// configure-pages@v5 (GitHub Pages CI) injects `output: "export"` by rewriting
// this file. next-pwa breaks when that happens. We detect static-export mode
// and skip the PWA wrapper so the Pages build succeeds.
// PWA still works on Vercel (no static export injected there).
const isStaticExport = nextConfig.output === "export"

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development" || isStaticExport,
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: { maxEntries: 200 },
      },
    },
  ],
})

export default pwaConfig(nextConfig)
