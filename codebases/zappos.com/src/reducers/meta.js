import template from 'lodash.template';

import {
  LOCATION_UPDATED,
  RECEIVE_ROUTE_DETAILS,
  RECEIVE_SEARCH_RESPONSE,
  RECEIVE_TAXONOMY_BRAND_PAGE_INFO,
  RESET_ERROR,
  SET_DOC_META_COLLECTION,
  SET_DOC_META_INFLUENCER_LP,
  SET_DOC_META_LP,
  SET_DOC_META_PDP,
  SET_DOC_META_PRODUCT_REVIEWS,
  SET_DOC_META_WRITE_REVIEW,
  SET_ERROR,
  SET_REQUEST_INFORMATION,
  SET_RESPONSE_STATUS
} from 'constants/reduxActions';
import marketplace from 'cfg/marketplace.json';
import {
  buildCollectionPageDocMeta,
  buildLandingPageDocMeta,
  buildProductPageDocMeta,
  buildProductReviewsPageDocMeta,
  buildSearchPageDocMeta,
  buildSimplePageMeta,
  buildTaxonomyBrandPageDocMeta,
  buildTitleWithMarketplaceSuffix,
  buildWriteReviewPageDocMeta,
  isSimpleMeta
} from 'helpers/DocumentMetaBuilder';
import { toRelativeUrlString } from 'helpers/LocationUtils';
import { buildBase64EncodedSearchResultsMetaData, getProductPageZfcMetadata } from 'helpers/ZfcMetadata';
import { getType } from 'history/historyFactory';

const { features } = marketplace;
// only compile the template once
const compiledPdpMetaDescriptionTemplate = template(marketplace.defaultMeta.pdpDescription);
const compiledErrorTitleTemplate = template(marketplace.defaultMeta.errorTitleTemplate);
const stateWithOnlyTitleMeta = (state, title) => ({ ...state, zfcMetadata: null, documentMeta: { title } });

export function configureCanonicalAndAlternatesForRequest({ desktopBaseUrl } = {}) {
  return function(host) {
    const defaultDesktopBaseUrl = `https://${host}`;

    return {
      canonicalBaseUrl: desktopBaseUrl || defaultDesktopBaseUrl
    };
  };
}

const alternateDeterminator = configureCanonicalAndAlternatesForRequest(features.canonicalUrls.alternateUrls);
// this should never be used, but you can never be too sure
const fallbackAlternateData = { canonicalBaseUrl: features.canonicalUrls.alternateUrls.desktopBaseUrl };

const initialState = { metaHistoryByPageType : { }, wildcardRoutes: {} };
export default function meta(state = initialState, action, alternateDeterminatorFn = alternateDeterminator, marketplaceConfig = marketplace, pdpTemplate = compiledPdpMetaDescriptionTemplate, errorPageTemplate = compiledErrorTitleTemplate) {
  const { type, host } = action;
  switch (type) {
    case SET_REQUEST_INFORMATION:
      const canonicalAlternates = alternateDeterminatorFn(host) || fallbackAlternateData;
      let documentMeta;
      const pageType = getType(action.upstreamUrl);
      if (isSimpleMeta(pageType)) {
        documentMeta = buildSimplePageMeta(marketplaceConfig, canonicalAlternates, pageType, action.upstreamUrl);
      }
      return { ...state, canonicalAlternates, documentMeta, lastUrl: action.upstreamUrl };

    case RECEIVE_TAXONOMY_BRAND_PAGE_INFO: {
      const documentMeta = buildTaxonomyBrandPageDocMeta(marketplaceConfig, state.canonicalAlternates, action.brandId, action.pageInfo);
      return storeLastMeta('brand', { ...state, documentMeta, zfcMetadata: null });
    }
    case SET_DOC_META_LP: {
      const documentMeta = buildLandingPageDocMeta(marketplaceConfig, state.canonicalAlternates, action.pageName, action.pageInfo);
      const pageType = action.pageName === marketplaceConfig.homepage ? 'homepage' : 'landing';
      return storeLastMeta(pageType, { ...state, documentMeta, zfcMetadata: null });
    }
    case SET_DOC_META_INFLUENCER_LP: {
      const documentMeta = buildLandingPageDocMeta(marketplaceConfig, state.canonicalAlternates, action.pageName, action.pageInfo);
      return storeLastMeta('influencer', { ...state, documentMeta, zfcMetadata: null });
    }
    case RECEIVE_SEARCH_RESPONSE: {
      if (state.hasError) {
        // The error page uses search results as "recommendations", so ignore this action if an error has occurred.
        return state;
      }
      const documentMeta = buildSearchPageDocMeta(marketplaceConfig, state.canonicalAlternates, action.response);
      const zfcMetadata = buildBase64EncodedSearchResultsMetaData(action.response);
      return storeLastMeta('search', { ...state, documentMeta, zfcMetadata });

    }
    case SET_DOC_META_COLLECTION: {
      const { metaPayload: { collectionId, collectionName, collectionSubCopy, imageId, imageExtension } } = action;
      const documentMeta = buildCollectionPageDocMeta(marketplaceConfig, state.canonicalAlternates, collectionSubCopy, collectionId, collectionName, imageId, imageExtension);
      return storeLastMeta('collection', { ...state, documentMeta, zfcMetadata: null });
    }
    case SET_DOC_META_PDP: {
      const { metaPayload: { product, colorId } } = action;
      const documentMeta = buildProductPageDocMeta(marketplaceConfig, state.canonicalAlternates, pdpTemplate, product, colorId);
      const zfcMetadata = getProductPageZfcMetadata(product, colorId);

      return storeLastMeta('pdp', { ...state, documentMeta, zfcMetadata });
    }
    case SET_ERROR: {
      const title = errorPageTemplate({ statusCode: action.statusCode });
      return stateWithOnlyTitleMeta({ ...state, hasError: true }, buildTitleWithMarketplaceSuffix(marketplaceConfig.defaultMeta, title));
    }
    case RESET_ERROR: {
      return { ...state, hasError: false };
    }
    case SET_RESPONSE_STATUS: {
      if (action.statusCode && action.statusCode >= 400) {
        const title = errorPageTemplate({ statusCode: action.statusCode });
        return stateWithOnlyTitleMeta({ ...state, hasError: true }, buildTitleWithMarketplaceSuffix(marketplaceConfig.defaultMeta, title));
      }
      return state;
    }
    case SET_DOC_META_PRODUCT_REVIEWS: {
      const { product } = action;
      const documentMeta = buildProductReviewsPageDocMeta(marketplaceConfig, state.canonicalAlternates, state.lastUrl, product);
      return storeLastMeta('reviews', { ...state, documentMeta, zfcMetadata: null });
    }
    case SET_DOC_META_WRITE_REVIEW: {
      const { product } = action;
      const documentMeta = buildWriteReviewPageDocMeta(marketplaceConfig, state.canonicalAlternates, state.lastUrl, product);
      return { ...state, documentMeta, zfcMetadata: null };
    }
    case LOCATION_UPDATED: {
      // we only use zfcMetadata on PDP and SEARCH pages, so clear it out so for the pages which don't do anything special we don't accidentally send along metadata.
      const url = toRelativeUrlString(action.location);
      const stateWithUpdatedUrl = { ...state, lastUrl: url, hasError: false };
      const pageType = getType(url);
      if (isSimpleMeta(pageType)) {
        return { ...stateWithUpdatedUrl, documentMeta: buildSimplePageMeta(marketplaceConfig, state.canonicalAlternates, pageType, url), zfcMetadata: null };
      }

      if (pageType) {
        // if not a simple page, store the last metadata for each type in a map in case user goes "back" to a page so we immediately have the correct metadata
        // e..g search -> pdp -> back button, or LP -> search -> back button
        const lastMetaForType = getLastPageForTypeMeta(pageType, stateWithUpdatedUrl);
        return { ...stateWithUpdatedUrl, ...lastMetaForType };
      } else {
        // if the incoming page is a wildcard/pretty-url, then use that as the page type.
        const wildCardType = getWildcardRouteFromPath(stateWithUpdatedUrl.wildcardRoutes, action.location.pathname);
        if (wildCardType) {
          const lastMetaForType = getLastPageForTypeMeta(wildCardType, stateWithUpdatedUrl);
          return { ...stateWithUpdatedUrl, ...lastMetaForType };
        }
      }

      return stateWithUpdatedUrl;
    }
    case RECEIVE_ROUTE_DETAILS: {
      // store this for later in case a user client routes back to a page where data is already stored
      return {
        ...state,
        wildcardRoutes: { ...state.wildcardRoutes, [action.routeDetails.type]: action.routeDetails.path }
      };
    }
    // TODO on serialization can/should we get rid of the zfcMetadata from the store to redux document payload size?
    default:
      return state;
  }
}

function getWildcardRouteFromPath(wildcardRoutes, path) {
  return Object.keys(wildcardRoutes).find(type => wildcardRoutes[type] === path);
}

function getLastPageForTypeMeta(pageType, state) {
  const lastHistory = state.metaHistoryByPageType[pageType];
  return lastHistory || { documentMeta: null, zfcMetadata: null };
}

function storeLastMeta(pageType, state) {
  return {
    ...state,
    metaHistoryByPageType: {
      ...state.metaHistoryByPageType,
      [pageType]: {
        zfcMetadata: state.zfcMetadata,
        documentMeta: state.documentMeta
      }
    }
  };
}
