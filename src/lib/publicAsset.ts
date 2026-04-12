/**
 * URLs for files in `public/` (served as site root). Uses Vite `base` so
 * GitHub Pages project sites (`/repo-name/`) resolve correctly.
 */
export function publicAsset(pathFromPublicRoot: string): string {
  const base = import.meta.env.BASE_URL
  const path = pathFromPublicRoot.replace(/^\//, '')
  return `${base}${path}`
}
