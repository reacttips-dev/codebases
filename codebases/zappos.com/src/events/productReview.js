/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AttachMedia.proto
 *
 * @param {string} mediaType
 * @param {string} fileName
 * @param {string} productId
 * @param {string} colorId
 */
export const evAttachMedia = ({ productId, colorId, mediaType, fileName }) => ({
  attachMedia: {
    mediaType,
    fileName,
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AttachMediaClick.proto
 *
 * @param {string} productId
 * @param {string} colorId
 */
export const evAttachMediaClick = ({ productId, colorId }) => ({
  attachMediaClick: {
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SubmitProductReviewClick.proto
 *
 * @param {string} productId
 * @param {string} colorId
 * @param {string} reviewId
 * @param {boolean} incomplete
 */
export const evSubmitProductReviewClick = ({
  productId,
  colorId,
  incomplete,
  reviewId
}) => ({
  submitProductReviewClick: {
    review: { reviewId },
    incompleteSubmitReview: incomplete,
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/WriteProductReviewClick.proto
 *
 * @param {string} productId
 * @param {string} styleId
 * @param {string} colorId
 * @param {string} stockId
 * @param {string} asin
 * @param {string} addedFrom : Information about where the write-review-button was clicked from; PageType values as defined at https://code.amazon.com/packages/AmethystEvents/blobs/71e8d02717a853a857e2b57dfce7aa9f67e7614e/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L212-L238
 */
export const evWriteProductReviewClick = ({ productId, styleId, colorId, stockId, asin, addedFrom }) => ({
  writeProductReviewClick: {
    productIdentifiers: {
      productId,
      styleId,
      colorId,
      stockId,
      asin
    },
    addedFrom
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ProductReviewImpression.proto
 *
 * @param {string} productId
 * @param {string} colorId
 * @param {object} review
 * @param {boolean} viewableImpression
 */
export const evProductReviewImpression = ({ productId, colorId, review: { id: reviewId }, viewableImpression }) => ({
  productReviewImpression: {
    reviews: [{ reviewId }],
    viewableImpression,
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/WriteProductReviewPageView.proto
 *
 * @param {string} productId
 * @param {string} colorId
 */
export const pvWriteProductReview = ({ productId, colorId }) => ({
  writeProductReviewPageView: {
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/MediaUploadPageView.proto
 *
 * @param {string} productId
 * @param {string} colorId
 */
export const pvMediaUpload = ({ productId, colorId }) => ({
  mediaUploadPageView: {
    productIdentifiers: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SubmitMediaUploadClick.proto
 *
 * @param {string} productId
 * @param {string} colorId
 * @param {string} reviewId
 * @param {boolean} incomplete
 */
export const evSubmitMediaUploadClick = ({
  productId,
  colorId,
  incomplete,
  reviewId
}) => ({
  submitMediaUploadClick: {
    review: { reviewId },
    incompleteMediaUpload: incomplete,
    productIdentifiers: {
      productId,
      colorId
    }
  }
});
