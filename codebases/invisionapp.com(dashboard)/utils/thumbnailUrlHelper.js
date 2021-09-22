import { generateFastlyThumbnailUrl, generateFastlyThumbnailSrcset } from './fastlyThumbnailUrlHelper'
import { generateCloudflareThumbnailUrl, generateCloudflareThumbnailSrcset } from './cloudflareThumbnailUrlHelper'

const DEFAULT_CLOUDFLARE_ENABLED = false
export const DEFAULT_WIDTH = 276
export const DEFAULT_HEIGHT = 188
export const DEFAULT_FIT = 'crop'

export function generateThumbnailUrl (
  assetUrl,
  type,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  isCloudFlareEnabled = DEFAULT_CLOUDFLARE_ENABLED,
  fit = DEFAULT_FIT) {
  if (!assetUrl) return ''

  return isCloudFlareEnabled
    ? generateCloudflareThumbnailUrl(assetUrl, type, width, height)
    : generateFastlyThumbnailUrl(assetUrl, type, width, height, fit)
}

export function generateThumbnailSrcset (
  assetUrl,
  type,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  isCloudFlareEnabled = DEFAULT_CLOUDFLARE_ENABLED,
  fit = DEFAULT_FIT) {
  if (!assetUrl) return ''

  return isCloudFlareEnabled
    ? generateCloudflareThumbnailSrcset(assetUrl, type, width, height)
    : generateFastlyThumbnailSrcset(assetUrl, type, width, height, fit)
}
