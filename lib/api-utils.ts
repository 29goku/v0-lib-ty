// Utility for building API URLs with basePath support
export function getDataUrl(path: string): string {
  // In browser, detect basePath from window location
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname
    // If URL contains /v0-lib-ty/, use that as basePath
    if (pathname.includes('/v0-lib-ty/')) {
      return `/v0-lib-ty${path}`
    }
  }

  // Otherwise use process.env or no basePath
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${basePath}${path}`
}
