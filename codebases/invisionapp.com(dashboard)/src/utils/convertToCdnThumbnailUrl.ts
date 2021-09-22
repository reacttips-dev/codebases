export const MAX_THUMBNAIL_WIDTH = 100;

const convertoToCdnThumbnailUrl = (assetUrl?: string) => {
  if (!assetUrl) {
    return assetUrl;
  }

  // Convert the assetUrl to a smaller image, serviced by the invision CDN
  return `${assetUrl}?width=${MAX_THUMBNAIL_WIDTH}&format=auto`;
};

export default convertoToCdnThumbnailUrl;
