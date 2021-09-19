import { PRODUCT_ASIN } from 'common/regex';
import { ADD_TO_COLLECTIONS, CART_ADD } from 'constants/amethyst';
import { COLLECTIONS_LIST_PAGE, COLLECTIONS_PAGE, UNKNOWN_PAGE_TYPE } from 'constants/amethystPageTypes';
import { middlewareTrack } from 'apis/amethyst';

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ProductNotifyMe.proto
export const evProductNotifyMe = ({ asin, productId, styleId, colorId, stockId }) => ({
  productNotifyMe: {
    productIdentifiers: {
      asin,
      productId,
      styleId,
      colorId,
      stockId
    },
    sourcePage: COLLECTIONS_PAGE // pageType as defined https://code.amazon.com/packages/AmethystEvents/blobs/faf0f5e028991bc37ab4f812b597685205aa5bfc/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L86
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/SelectSizeButton.proto
export const evSelectSizeButton = ({ asin, productId, styleId, colorId, stockId }) => ({
  selectSizeButton: {
    productIdentifiers: {
      asin,
      productId,
      styleId,
      colorId,
      stockId
    },
    sourcePage: COLLECTIONS_PAGE // pageType as defined https://code.amazon.com/packages/AmethystEvents/blobs/faf0f5e028991bc37ab4f812b597685205aa5bfc/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L86
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddToCart.proto
export const evAddToCart = ({ asin, price, productId, styleId, colorId, stockId }) => ({
  [CART_ADD]: {
    productIdentifiers: {
      asin,
      productId,
      styleId,
      colorId,
      stockId
    },
    price,
    addedFrom: COLLECTIONS_PAGE // pageType as defined https://code.amazon.com/packages/AmethystEvents/blobs/faf0f5e028991bc37ab4f812b597685205aa5bfc/--/configuration/include/com/zappos/amethyst/website/WebsiteEnums.proto#L86
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AddToCollections.proto
export const evAddToCollections = ({ asin, productId, styleId, colorId, stockId, price, collectionId, incompleteAddToCollections, missingDimension, sourcePage = UNKNOWN_PAGE_TYPE }) => ({
  [ADD_TO_COLLECTIONS]: {
    productIdentifiers: {
      asin,
      productId,
      styleId,
      colorId,
      stockId
    },
    price,
    incompleteAddToCollections,
    missingDimension,
    collectionId,
    sourcePage: sourcePage // setting the default to unknown page type, if we see more events with no page will have to go in and ensure page is being set
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/RemoveFromCollections.proto
export const evRemoveFromCollections = ({ asin, productId, styleId, colorId, stockId, price, collectionId, sourcePage = COLLECTIONS_PAGE }) => ({
  removeFromCollection: { // notice there's an s missing on this property name https://code.amazon.com/packages/AmethystEvents/blobs/a6ee4162eb4e615f995c41f5e4242584ccb2d30d/--/configuration/include/com/zappos/amethyst/website/WebsiteEvent.proto#L211
    productIdentifiers: {
      asin,
      productId,
      styleId,
      colorId,
      stockId
    },
    price,
    collectionId,
    sourcePage
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/AllCollectionsPageView.proto
export const pvCollections = ({ collectionCount, recommendationImpression, isOwner }) => ({
  allCollectionsPageView: {
    collectionCount,
    recommendationImpression,
    isOwner,
    sourcePage: COLLECTIONS_LIST_PAGE
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CollectionsPageView.proto
export const pvCollection = ({ itemCount, recommendationImpression, productsInCollection, isOwner, arrivedFromShareLink, shareToken, collectionId }) => ({
  collectionsPageView: {
    itemCount,
    recommendationImpression,
    productsInCollection,
    isOwner,
    arrivedFromShareLink,
    shareToken,
    collectionId,
    sourcePage: COLLECTIONS_PAGE
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/CreateCollectionClick.proto
const evCreateCollectionClick = ({ collectionId, collectionName }) => ({
  createCollectionClick: {
    collectionId,
    collectionName,
    sourcePage: COLLECTIONS_LIST_PAGE
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/DeleteCollectionClick.proto
const evDeleteCollectionClick = ({ collectionId }) => ({
  deleteCollectionClick: {
    collectionId,
    sourcePage: COLLECTIONS_LIST_PAGE
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/EditCollectionClick.proto
export const evEditCollectionClick = ({ collectionId }) => ({
  editCollectionClick: {
    collectionId,
    sourcePage: COLLECTIONS_LIST_PAGE
  }
});

// https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/ShareCollectionClick.proto
const evShareCollectionClick = ({ collectionId, shareToken, sourcePage }) => ({
  shareCollectionClick: {
    collectionId,
    shareToken,
    sourcePage
  }
});

export const addSubItemId = (payload, subItemId) => {
  // no asin/stockId so just return payload
  if (!subItemId) {
    return payload;
  }

  const IDTYPE = PRODUCT_ASIN.test(subItemId) ? 'asin' : 'stockId';
  payload[IDTYPE] = IDTYPE === 'stockId' ? parseInt(subItemId, 10) : subItemId;

  return payload;
};

export const DELETE_COLLECTION_LIST = 'DELETE_COLLECTION_LIST';
export const SHARE_COLLECTION_LIST = 'SHARE_COLLECTION_LIST';
export const CREATE_COLLECTION_LIST = 'CREATE_COLLECTION_LIST';
export const REMOVE_FROM_COLLECTION = 'REMOVE_FROM_COLLECTION';
export const COLLECTIONS_PAGE_VIEW = 'COLLECTIONS_PAGE_VIEW';

export default {
  pageEvent: COLLECTIONS_PAGE_VIEW,
  events: {
    [COLLECTIONS_PAGE_VIEW]: [], // deliberately left blank because we fire page view on API response
    [DELETE_COLLECTION_LIST]: [(_, params) => middlewareTrack(evDeleteCollectionClick(params))],
    [SHARE_COLLECTION_LIST]: [(_, params) => middlewareTrack(evShareCollectionClick(params))],
    [CREATE_COLLECTION_LIST]: [(_, params) => middlewareTrack(evCreateCollectionClick(params))]
  }
};
