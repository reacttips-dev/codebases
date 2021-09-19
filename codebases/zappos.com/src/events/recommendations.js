import { toFloatInt } from 'helpers/NumberFormats';
import { trackEvent } from 'helpers/analytics';
import { devLogger } from 'middleware/logger';

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/RecommendationImpression.proto
  *
  * @param {string} numberOfRecommendations - number of items/products
  * @param {string} recommendationType - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_TYPE, BRAND_RECOMMENDATION, PRODUCT_RECOMMENDATION, PRODUCT_CATEGORY_RECOMMENDATION
  * @param {string} recommendationSource - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_SOURCE, ZAPPOS_DATA_SCIENCE, EP13N, INDIA_MACHINE_LEARNING, SENTIENT
  * @param {string} widgetType - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_WIDGET, SIMILAR_PRODUCT_WIDGET, BRAND_RECOMMENDATION_WIDGET, IOS_HOMEPAGE_SUGGESTED_CATEGORIES, YOUR_RECENTLY_VIEWED_WIDGET
*/
export const evRecommendationImpression = ({ numberOfRecommendations, recommendationType, recommendationSource, widgetType }) => ({
  recommendationImpression: {
    numberOfRecommendations,
    recommendationType,
    recommendationSource,
    widgetType
  }
});

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/RecommendationImpressionWrapper.proto
  *
  * @param {array} recommendationImpression - Array of recommendationImpressions objects with keys of: numberOfRecommendations, recommendationType, recommendationSource, widgetType
*/
export const evRecommendationImpressionWrapper = ({ recommendationImpression }) => {
  if (!recommendationImpression) {
    devLogger('WARNING: recommendationImpression is empty!');
  }
  return {
    recommendationImpressionWrapper: {
      recommendationImpression
    }
  };
};

/**
  * https://code.amazon.com/packages/AmethystEvents/blobs/mainline/--/configuration/include/com/zappos/amethyst/website/RecommendationClick.proto
  *
  * @param {integer} index - index of item clicked
  * @param {string} recommendationType - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_TYPE, BRAND_RECOMMENDATION, PRODUCT_RECOMMENDATION, PRODUCT_CATEGORY_RECOMMENDATION
  * @param {string} recommendationValue - sku/product_category/brand, ex '123456'(sku)
  * @param {Object} recommendedProduct - alternative to recommendationValue that is ProductIdentifiers.
  * @param {string} recommendationSource - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_SOURCE, ZAPPOS_DATA_SCIENCE, EP13N, INDIA_MACHINE_LEARNING, SENTIENT
  * @param {string} widgetType - See WebsiteEnums.proto file in AmethystEvents codebase.
  * UNKNOWN_RECOMMENDATION_WIDGET, SIMILAR_PRODUCT_WIDGET, BRAND_RECOMMENDATION_WIDGET, IOS_HOMEPAGE_SUGGESTED_CATEGORIES, YOUR_RECENTLY_VIEWED_WIDGET
*/
export const evRecommendationClick = ({ index, recommendationType, recommendationValue, recommendedProduct, recommendationSource, widgetType, sourcePage }) => ({
  recommendationClick: {
    index: toFloatInt(index),
    recommendationType,
    recommendationValue,
    recommendedProduct,
    recommendationSource,
    widgetType,
    sourcePage
  }
});

/**
  * Below are reco events specifically for crossSiteItems on Zappos https://github01.zappos.net/mweb/marty/issues/9859
*/
export const evSearchCrossSiteRecoImpression = trustedRetailers => {
  const styleIds = trustedRetailers.map(({ styleId }) => styleId).join('-');
  trackEvent('TE_SEARCH_CROSS_SITE_PRODUCTS_VIEW', `styles:${styleIds}`);
  const recommendationImpression = [{
    numberOfRecommendations: styleIds?.length,
    recommendationType: 'PRODUCT_RECOMMENDATION',
    widgetType: 'CROSS_SITE_RECOMMENDATION',
    recommendationSource: 'ZAPPOS_DATA_SCIENCE'
  }];
  return {
    recommendationImpressionWrapper: {
      recommendationImpression
    }
  };
};

const CROSS_SITE_DOMAIN_MAP = {
  findzen: 'ZEN',
  vrsnl: 'VRSNL'
};

export const evSearchCrossSiteRecoClick = ({ product = {}, proceedToTrustedRetailer }) => {
  const { styleId, productId, colorId, store, crossSiteSellingUniqueIdentifier, index } = product;
  if (proceedToTrustedRetailer === true) {
    trackEvent('TE_SEARCH_CROSS_SITE_PRODUCT_CLICK', `${styleId}:continue`);
  } else if (proceedToTrustedRetailer === false) {
    trackEvent('TE_SEARCH_CROSS_SITE_PRODUCT_CLICK', `${styleId}:stay`);
  } else if (proceedToTrustedRetailer === undefined) {
    trackEvent('TE_SEARCH_CROSS_SITE_PRODUCT_CLICK', `${styleId}:card`);
  }

  return {
    recommendationClick: {
      index,
      recommendationType: 'PRODUCT_RECOMMENDATION',
      widgetType: 'CROSS_SITE_RECOMMENDATION',
      recommendationSource: 'ZAPPOS_DATA_SCIENCE',
      recommendedProduct: {
        productId,
        styleId,
        colorId,
        supplementalData: {
          websiteDomain: CROSS_SITE_DOMAIN_MAP[store],
          proceedToTrustedRetailer,
          crossSiteSellingUniqueIdentifier
        }
      }
    }
  };
};
