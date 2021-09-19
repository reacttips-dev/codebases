/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/MediaStreamClick.proto
 *
 * @param {string} pageType
 * @param {string} widgetType
 * @param {number} index
 * @param {object} media (should contain mediaUrl and mediaType)
 * @param {string} mediaUrl
 * @param {string} mediaType
 * @param {string} productId
 * @param {string} colorId
 */
export const evMediaStreamClick = ({ pageType, widgetType, index, media, productId, colorId }) => ({
  mediaStreamClick: {
    pageType,
    widgetType,
    index,
    media,
    sourceProduct: {
      productId,
      colorId
    }
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/MediaStreamImpression.proto
 *
 * @param {string} pageType
 * @param {string} widgetType
 * @param {array} media (each should have mediaUrl and mediaType)
 * @param {string} productId
 * @param {string} colorId
 * @param {boolean} viewableImpression
 */
export const evMediaStreamImpression = ({ pageType, media, productId, colorId, viewableImpression, widgetType }) => ({
  mediaStreamImpression: {
    pageType,
    widgetType,
    media,
    productIdentifiers: {
      productId,
      colorId
    },
    viewableImpression
  }
});

/**
 * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ModalMediaImpression.proto
 *
 * @param {string} modal
 * @param {string} productId
 * @param {string} colorId
 * @param {array} media (each should have mediaUrl and mediaType)
 * @param {boolean} viewableImpression
 */
export const evModalMediaImpression = ({ modal, productId, colorId, media, viewableImpression }) => ({
  modalMediaImpression: {
    modal,
    media,
    sourceProduct: {
      productId,
      colorId
    },
    viewableImpression
  }
});

