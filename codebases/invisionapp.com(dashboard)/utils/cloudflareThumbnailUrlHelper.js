import { RHOMBUS } from '../constants/DocumentTypes'

export function generateCloudflareThumbnailUrl (
  assetUrl,
  type,
  width,
  height
) {
  const thumbnailUrl = `${assetUrl}?width=${width}&height=${height}&fit=cover`

  if (type && type === RHOMBUS) {
    return `${thumbnailUrl}&gravity=top`
  } else {
    return `${thumbnailUrl}&gravity=0.5x0.5`
  }
}

export function generateCloudflareThumbnailSrcset (
  assetUrl,
  type,
  width,
  height
) {
  return `${generateCloudflareThumbnailUrl(assetUrl, type, width * 1.5, height * 1.5)} 1.5x, ${generateCloudflareThumbnailUrl(assetUrl, type, width * 2, height * 2)} 2x`
}
