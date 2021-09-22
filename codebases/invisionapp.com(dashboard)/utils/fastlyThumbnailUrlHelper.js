import { RHOMBUS } from '../constants/DocumentTypes'

export function generateFastlyThumbnailUrl (
  assetUrl,
  type,
  width,
  height,
  fit
) {
  let thumbnailUrl = ''

  if (type && type === RHOMBUS) {
    thumbnailUrl = `${assetUrl}?width=${width}&format=auto`
  } else {
    thumbnailUrl = `${assetUrl}?width=${width}&height=${height}&fit=${fit}&format=auto`
  }

  return thumbnailUrl
}

export function generateFastlyThumbnailSrcset (
  assetUrl,
  type,
  width,
  height,
  fit
) {
  const url = generateFastlyThumbnailUrl(assetUrl, type, width, height, fit)
  return `${url}&dpr=1.5 1.5x, ${url}&dpr=2 2x`
}
