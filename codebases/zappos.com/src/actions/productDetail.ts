import ExecutionEnvironment from 'exenv';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

import imageServerConfig from 'helpers/imageServerConfig';
import {
  ADD_ITEM_TO_CART,
  EVENT_SIZING_IMPRESSION,
  EXIT_SEARCH_REVIEWS,
  HIDE_SELECT_SIZE_TOOLTIP,
  HIGHLIGHT_SELECT_SIZE_TOOLTIP,
  PRODUCT_AGE_GROUP_CHANGED,
  PRODUCT_COLOR_CHANGED,
  PRODUCT_DESCRIPTION_COLLAPSED,
  PRODUCT_DESCRIPTION_TOGGLE,
  PRODUCT_GENDER_CHANGED,
  PRODUCT_SIZE_CHANGED,
  PRODUCT_SIZE_UNIT_CHANGED,
  PRODUCT_SWATCH_CHANGE,
  RECEIVE_BRAND_PROMO,
  RECEIVE_GENERIC_SIZING_BIAS,
  RECEIVE_PDP_STORY_SYMPHONY_COMPONENTS,
  RECEIVE_PDP_SYMPHONY_COMPONENTS,
  RECEIVE_PRODUCT_DETAIL,
  RECEIVE_PRODUCT_REVIEWS,
  RECEIVE_SEARCH_REVIEWS,
  RECEIVE_SIMILAR_STYLES,
  RECEIVE_SIZING_PREDICTION_FAILURE,
  RECEIVE_SIZING_PREDICTION_SUCCESS,
  RECEIVE_UPVOTE_REVIEW_FAILURE,
  RECEIVE_UPVOTE_REVIEW_SUCCESS,
  REQUEST_PDP_STORY_SYMPHONY_COMPONENTS,
  REQUEST_PDP_SYMPHONY_COMPONENTS,
  REQUEST_PRODUCT_DETAIL,
  REQUEST_PRODUCT_REVIEWS,
  REQUEST_SEARCH_REVIEWS,
  REQUEST_SIMILAR_STYLES,
  REQUEST_UPVOTE_REVIEW,
  SET_CAROUSEL_INDEX,
  SET_DOC_META_PDP,
  SHOW_SELECT_SIZE_TOOLTIP,
  TOGGLE_OOS_BUTTON,
  UNHIGHLIGHT_SELECT_SIZE_TOOLTIP,
  VALIDATE_DIMENSIONS
} from 'constants/reduxActions';
import { MOST_HELPFUL, NEWEST } from 'constants/appConstants';
import { isAssigned } from 'actions/ab';
import { fetchSearchSimilarity } from 'apis/calypso';
import { upvoteReview as upvoteReviewApi } from 'apis/cloudreviews';
import { err, redirectToAuthWithHistory, setError } from 'actions/errors';
import { setFederatedLoginModalVisibility } from 'actions/headerfooter';
import { fetchErrorMiddleware, fetchErrorMiddlewareMaybeJson } from 'middleware/fetchErrorMiddleware';
import { trackEvent } from 'helpers/analytics';
import { createViewProductPageMicrosoftUetEvent, pushMicrosoftUetEvent } from 'actions/microsoftUetTag';
import { firePixelServer } from 'actions/pixelServer';
import { redirectTo, redirectToSearch } from 'actions/redirect';
import { absoluteImageUrl } from 'helpers/productImageHelpers';
import ProductUtils from 'helpers/ProductUtils';
import { isAllowedPreferredSubsite } from 'helpers/MarketplaceUtils';
import { buildSeoProductString, buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import { trackError } from 'helpers/ErrorUtils';
import { productBundle, productReviews } from 'apis/cloudcatalog';
import { sizingPrediction } from 'apis/opal';
import { genericSizeBias, getBrandPromo, getSymphonyPdpComponents, getSymphonySlots } from 'apis/mafia';
import { IS_EGC_NAME, IS_NUMBER_RE, PRODUCT_ASIN } from 'common/regex';
import marketplace from 'cfg/marketplace.json';
import { getMafiaAndCredentials } from 'store/ducks/readFromStore';
import { sessionLoggerMiddleware } from 'middleware/sessionLoggerMiddleware';
import { MapSomeDimensionIdTo, ProductBundle, ProductReviews, ProductStyle } from 'types/cloudCatalog';
import { AppState } from 'types/app';
import { BrandPromo, PDPSymphonyComponent, PDPSymphonyStory, ProductLookupKey, ProductSimilarStyleResponse } from 'types/product';
import { AirplaneCacheStock } from 'reducers/detail/airplaneCache';
import { FormattedProductBundle } from 'reducers/detail/productDetail';
import { sendIntentEvent } from 'apis/intent';
import { HYDRA_BLUE_SKY_PDP } from 'constants/hydraTests';

const { hasFederatedLogin, subsiteId: { desktop: subsiteId }, pdp: { egcUrl, includeTsdImagesParam = false } } = marketplace;

const REVIEW_SORTS: Record<any, string> = {
  [MOST_HELPFUL]: 'upVotes:desc,overallRating:desc,reviewDate:desc',
  [NEWEST]: 'reviewDate:desc'
};

const reviewSort = (label: string) => REVIEW_SORTS[label] || REVIEW_SORTS[MOST_HELPFUL];

export function setCarouselIndex(index: number) {
  return {
    type: SET_CAROUSEL_INDEX,
    index
  } as const;
}

function requestProductDetail() {
  return {
    type: REQUEST_PRODUCT_DETAIL
  } as const;
}

export function productSwatchChange(colorId: string) {
  return {
    type: PRODUCT_SWATCH_CHANGE,
    colorId
  } as const;
}

export function receiveProductDetail(productDetail: ProductBundle, imageServerUrl: string, lookupKeyObject: ProductLookupKey, colorId: string | undefined, hydraBlueSkyPdp: boolean) {
  return {
    type: RECEIVE_PRODUCT_DETAIL,
    product: { detail: productDetail },
    imageServerUrl,
    colorId,
    lookupKeyObject,
    receivedAt: Date.now(),
    calledClientSide: typeof window !== 'undefined',
    hydraBlueSkyPdp
  } as const;
}

export function productNotFound() {
  return setError(err.PRODUCT_DETAILS, null, 404);
}

export function firePdpPixelServer(product: ProductBundle, colorId?: string) {
  const style = ProductUtils.getStyleByColor(product.styles, colorId);
  return firePixelServer('pdp', {
    product: {
      sku: product.productId,
      styleId: style.styleId,
      price: style.price.replace('$', ''),
      name: product.productName,
      brand: product.brandName,
      category: product.defaultProductType,
      subCategory: product.defaultCategory,
      gender: ProductUtils.getGender(product)
    }
  });
}

export function toggleOosButton(oosModalActive: boolean) {
  return {
    type: TOGGLE_OOS_BUTTON,
    oosModalActive
  } as const;
}

function handleOos(dispatch: ThunkDispatch<AppState, void, AnyAction>, product: ProductBundle) {
  const seoTerm = buildSeoProductString(product);
  if (seoTerm) {
    dispatch(redirectToSearch(seoTerm));
  } else {
    dispatch(productNotFound());
  }
}

export function requestUpvoteReview(reviewId: string) {
  return {
    type: REQUEST_UPVOTE_REVIEW,
    reviewId
  } as const;
}

export function receiveUpvoteReviewSucess(reviewId: string) {
  return {
    type: RECEIVE_UPVOTE_REVIEW_SUCCESS,
    reviewId
  } as const;
}

export function receiveUpvoteReviewFailure(reviewId: string) {
  return {
    type: RECEIVE_UPVOTE_REVIEW_FAILURE,
    reviewId
  } as const;
}

export function upvoteReview(reviewId: string, returnTo: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestUpvoteReview(reviewId));

    const state = getState();
    const { environmentConfig: { api: { mafia: { url } } } } = state;
    const credentials = getMafiaAndCredentials(state);

    const upvoteFailure = (info?: string) => {
      dispatch(receiveUpvoteReviewFailure(reviewId));
      trackError('NON-FATAL', 'Could not upvote a product review.', info);
    };
    const upvoteApiCall = upvoteReviewApi(url, credentials, reviewId);
    return (
      upvoteApiCall
        .then(response => {
          if (!response) {
            upvoteFailure();
          } else if (response.status === 200) {
            dispatch(receiveUpvoteReviewSucess(reviewId));
          } else if (response.status === 403) {
            if (hasFederatedLogin) {
              dispatch(setFederatedLoginModalVisibility(true, { returnTo }));
            } else {
              redirectToAuthWithHistory(dispatch, returnTo);
            }
          } else {
            upvoteFailure(`server responded with a status of ${response.status}`);
          }
        })
        .catch(upvoteFailure)
    );
  };
}

export type CCFetchOpts = Partial<{
  background: boolean;
  colorId: string;
  filterNonHardLaunchDateOosStyles: boolean;
  firePixel: boolean;
  errorOnOos: boolean;
  includeOos: boolean;
  includeOosSizing: boolean;
  includeRecos: boolean;
  includeTsdImages: boolean;
  isAllowedSubsite: typeof isAllowedPreferredSubsite;
  localSendIntentEvent: typeof sendIntentEvent;
  seoName: string;
  callbackOnSuccess: (...args: any[]) => any;
}>;
export function loadProductDetailPage(lookupKey: ProductLookupKey | string | number, options: CCFetchOpts): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    return dispatch(fetchProductDetail(lookupKey, options))
      .then(() => {
        const { product: { detail }, error } = getState();
        // only do this if we have actually properly loaded a product, otherwise we'll get error noise in the logs
        if (detail && !error) {
          dispatch(setProductDocMeta(detail, options?.colorId));
        }
      });
  };
}

export function getSymphonyContentAfterPdpLoad(
  { styles, productId }: { styles: ProductStyle[]; productId: string},
  colorId: string,
  getCall = getSymphonyComponents
): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return dispatch => {
    const style = ProductUtils.getStyleByColor(styles, colorId);
    const { styleId } = style;
    return dispatch(getCall(productId, styleId));
  };
}

export function setProductDocMeta(product: FormattedProductBundle, colorId?: string) {
  return { type: SET_DOC_META_PDP, metaPayload: { product, colorId } } as const;
}

// Filter styles out if there are OOS and without a future hardLaunchDate
export function makefilteredNonHardLaunchDateOosStyles(detail: ProductBundle) {
  const styles = detail.styles.filter(style => {
    const { hardLaunchDate } = style;
    const hasStock = ProductUtils.hasAvailableStock(style);
    const hasFutureHardLaunchDate = hardLaunchDate ? new Date(hardLaunchDate).getTime() > Date.now() : false;
    return hasStock || hasFutureHardLaunchDate;
  });
  return { ...detail, styles };
}

/**
 * Loads product data for the given product and stores it in the product reducer.
 * @param  {String|Object}  productId            Product to load either string productId, or an object with an asin, stockId, or productId field.
 * @param  {Object}  options              Optional flags-
 *                                        background(boolean=false) if true, does not set the isLoading flag while the request is running.  Additionally will not set full page error if request fails if it is "background" request.
 *                                          includeRecos(boolean=false) if calypso searchsimilarity should be sent.
 *                                          colorId(String)-- color of the product being viewed. only used for pixel server
 *                                          seoName(String) -- seo friendly name of product -- used to redirect to search if OOS
 *                                          firePixel(boolean=false) whether to fire the pdp pixel on load
 * @return {Promise}
*/
export function fetchProductDetail(
  lookupKeyObject: ProductLookupKey | string | number,
  {
    background = false,
    includeRecos = false,
    includeTsdImages = includeTsdImagesParam,
    colorId,
    seoName,
    firePixel = false,
    errorOnOos = true,
    includeOos = false,
    includeOosSizing = false,
    callbackOnSuccess,
    filterNonHardLaunchDateOosStyles = false,
    isAllowedSubsite = isAllowedPreferredSubsite,
    localSendIntentEvent = sendIntentEvent
  }: CCFetchOpts = {}
): ThunkAction<Promise<any>, AppState, void, AnyAction> {

  return function(dispatch, getState) {
    if (typeof lookupKeyObject === 'string' || typeof lookupKeyObject === 'number') {
      lookupKeyObject = { productId: '' + lookupKeyObject };
    }
    if (lookupKeyObject.productId && !IS_NUMBER_RE.test(lookupKeyObject.productId)) {
      dispatch(productNotFound());
      return Promise.reject(err.PRODUCT_DETAILS);
    } else if (lookupKeyObject.asin) {
      lookupKeyObject.asin = lookupKeyObject.asin.toUpperCase();
      if (!PRODUCT_ASIN.test(lookupKeyObject.asin)) {
        dispatch(productNotFound());
        return Promise.reject(err.PRODUCT_DETAILS);
      }
    } else if (lookupKeyObject.stockId && !IS_NUMBER_RE.test(lookupKeyObject.stockId)) {
      dispatch(productNotFound());
      return Promise.reject(err.PRODUCT_DETAILS);
    }

    const state = getState();
    const {
      cookies,
      environmentConfig: { api: { cloudcatalog: cloudcatalogInfo } },
      pageView: { pageType },
      url: { userAgent }
    } = state;

    const imageServerOpts = imageServerConfig(state);
    if (!background) {
      dispatch(requestProductDetail());
    }

    const productRequest = productBundle(cloudcatalogInfo, { ...lookupKeyObject, includeTsdImages, includeOos, includeOosSizing })
      .then(fetchErrorMiddleware);

    const dispatchErrorMessageOrNotFound = function(error: any) {
      if (error && error.status === 404 && seoName) {
        dispatch(redirectToSearch(seoName));
      } else {
        if (!background) {
          dispatch(setError(err.PRODUCT_DETAILS, error));
        }
      }
      return Promise.reject(err.PRODUCT_DETAILS);
    };

    return productRequest.then(productResponse => {

      if (!productResponse.product || productResponse.product.length !== 1) {
        dispatch(productNotFound());
        // Also throw an error because this means the response returned without the data we need
        throw err.PRODUCT_DETAILS;
      }

      const product: ProductBundle = filterNonHardLaunchDateOosStyles ? makefilteredNonHardLaunchDateOosStyles(productResponse.product[0]) : productResponse.product[0];

      const { preferredSubsite } = product;

      if (preferredSubsite) {
        const { url, id } = preferredSubsite;
        const domConditionalUserAgent = ExecutionEnvironment.canUseDOM ? navigator.userAgent : userAgent;
        const shouldRedirect = isAllowedSubsite(marketplace, id, domConditionalUserAgent);
        // we dont want to redirect for the reviews page https://github01.zappos.net/mweb/marty/issues/11165
        const isPdpPageType = pageType === 'product';
        if (shouldRedirect && isPdpPageType) {
          return dispatch(redirectTo(`https://${url}${buildSeoProductUrl(product, colorId)}`, 301));
        }
      }

      if (IS_EGC_NAME.test(product.productName)) {
        return dispatch(redirectTo(egcUrl));
      }

      const { defaultImageUrl, styles } = product;
      const { imageServerUrl } = imageServerOpts;

      // If there are no styles, the product is effectively out of stock.
      if ((!styles || styles.length < 1) && errorOnOos) {
        return handleOos(dispatch, product);
      }

      if (typeof lookupKeyObject === 'string' || typeof lookupKeyObject === 'number') {
        lookupKeyObject = { productId: '' + lookupKeyObject };
      }

      const lookup = lookupKeyObject; // Previous typeguards won't be in effect, as the narrowing won't cross function scopes. Re-assigning safely fixes this.

      if (lookup.asin || lookup.stockId) {
        const style = styles.find(style => style.stocks.find(stock => stock.asin === lookup.asin || stock.stockId === lookup.stockId));
        if (style) {
          ({ colorId } = style);
        }
      }

      product.hasHalfSizes = null;
      if (ProductUtils.isShoeType(product.defaultProductType) && product.sizing.allValues) {
        product.hasHalfSizes = product.sizing.allValues.some(({ value }) => value.includes('.5'));
      }

      product.defaultImageUrl = absoluteImageUrl(defaultImageUrl, imageServerUrl);
      const hydraBlueSkyPdp = isAssigned(HYDRA_BLUE_SKY_PDP, 1, state);
      dispatch(receiveProductDetail(product, imageServerUrl, lookupKeyObject, colorId, hydraBlueSkyPdp));
      if (callbackOnSuccess) {
        dispatch(callbackOnSuccess(product, colorId));
      }
      if (firePixel) {
        dispatch(pushMicrosoftUetEvent(createViewProductPageMicrosoftUetEvent(product.productId)));
        if (cookies['session-id']) {
          dispatch(localSendIntentEvent('view', { page_id: 'details', custom_1: product.productId }));
        }
        dispatch(firePdpPixelServer(product, colorId));
      }

      // If we're also fetching recos and/or reviews, then the resulting promise should resolve
      // when the recos are loaded, otherwise the promise is resolved when details are loaded
      if (includeRecos) {
        const { styleId } = styles[0];
        return fetchProductSearchSimilarity(product.productId, styleId)(dispatch, getState);
      }
      return product;
    }).catch(dispatchErrorMessageOrNotFound);
  };
}

function requestProductReviews(reviewsPage: number | string, reviewsOffset?: number | string, orderBy?: string) {
  return {
    type: REQUEST_PRODUCT_REVIEWS,
    requestedAt: Date.now(),
    reviewsPage,
    reviewsOffset,
    orderBy
  } as const;
}

function receiveProductReviews(productId: string, reviewData: ProductReviews) {
  return {
    type: RECEIVE_PRODUCT_REVIEWS,
    receivedAt: Date.now(),
    productId,
    reviewData
  } as const;
}

export function requestSearchReviews(reviewsPage: string, searchTerm: string) {
  return {
    type: REQUEST_SEARCH_REVIEWS,
    reviewsPage,
    searchTerm
  } as const;
}

export function receiveSearchReviews(searchResults: ProductReviews) {
  return {
    type: RECEIVE_SEARCH_REVIEWS,
    searchResults
  } as const;
}

export function exitSearchReviews() {
  return {
    type: EXIT_SEARCH_REVIEWS
  } as const;
}

/**
* Sets the current search result review page and offset in the store, as well as loads
*/
export function fetchReviewSearchResults(productId: string, query: string, page = '1', offset = '0', isCrucial = true): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    dispatch(requestSearchReviews(page, query));
    const state = getState();
    const { environmentConfig: { api: { cloudreviews } } } = state;
    return productReviews(cloudreviews, { productId, query, page, offset })
      .then(fetchErrorMiddleware)
      .then(reviewResponse => {
        dispatch(receiveSearchReviews(reviewResponse));
      })
      .catch(e => {
        if (isCrucial) {
          dispatch(setError(err.PRODUCT_DETAILS, e));
        } else {
          trackError('NON-FATAL', 'Could not load Product Review search results', e);
        }
      });
  };
}

/**
 * Sets the current review page and offset in the store, as well as loads
 * @param  {String}  productId        Product to load reviews for
 * @param  {Number}  [page=1]         what page of reviews to load
 * @param  {Number}  [offset=0]       how many reviews to load
 * @param  {Boolean} [isCrucial=true] whether a failed request should set the error state or simply log the error.  Defaults to showing the error page if an error is encountered.
 * @param {String} orderBy            sort reviews by (best aka most helpful or newest)
 * @return {Promise}                  fetch promise for loading reviews
 */
export function fetchProductReviews(productId: string, page: number | string = 1, offset: number | string = 0, isCrucial = true, orderBy = MOST_HELPFUL): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    // only sort options are most helpful and newest, so if it is not one of them, sanitize it.
    if (orderBy !== MOST_HELPFUL && orderBy !== NEWEST) {
      orderBy = MOST_HELPFUL;
    }
    dispatch(requestProductReviews(page, offset, orderBy));
    const state = getState();
    const { environmentConfig: { api: { cloudreviews } } } = state;
    return productReviews(cloudreviews, { productId, page, offset, sort: reviewSort(orderBy) })
      .then(fetchErrorMiddleware)
      .then(reviewResponse => {
        dispatch(receiveProductReviews(productId, reviewResponse));
      })
      .catch(e => {
        if (isCrucial) {
          dispatch(setError(err.PRODUCT_DETAILS, e));
        } else {
          trackError('NON-FATAL', 'Could not load Product Reviews.', e);
        }
      });
  };
}

function requestSimilarStyles() {
  return {
    type: REQUEST_SIMILAR_STYLES,
    requestedAt: Date.now()
  } as const;
}

export function receiveSimilarStyles(productId: string, similarStylesData: ProductSimilarStyleResponse) {
  return {
    type: RECEIVE_SIMILAR_STYLES,
    similarStylesData,
    productId,
    receivedAt: Date.now()
  } as const;
}

// These are Calypso "searchSimilarity" recos not true janus recos.  Instead see actions/recos.
export function fetchProductSearchSimilarity(productId: string, styleId: string, type = 'moreLikeThis', limit = 10, page = 1, fetcher = fetchSearchSimilarity): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const { environmentConfig: { api: { calypso: { url: calypsoUrl } } } } = state;

    dispatch(requestSimilarStyles);
    return fetcher(calypsoUrl, { styleId, type, limit, page, subsiteId, opts: imageServerConfig(state) })
      .then((similarStyleResponse: ProductSimilarStyleResponse) => {
        dispatch(receiveSimilarStyles(productId, similarStyleResponse));
      })
      .catch((e: Error) => {
        dispatch(receiveSimilarStyles(productId, { results:[] }));
        trackError('NON-FATAL', 'Could not load Similar Product Styles.', e);
      });
  };
}

export function productAgeGroupChanged(ageGroup: AirplaneCacheStock['ageGroup']) {
  return { type: PRODUCT_AGE_GROUP_CHANGED, ageGroup } as const;
}

export function productGenderChanged(id: AirplaneCacheStock['gender']) {
  return { type: PRODUCT_GENDER_CHANGED, id } as const;
}

export function productSizeUnitChanged(id: AirplaneCacheStock['countryOrUnit']) {
  return { type: PRODUCT_SIZE_UNIT_CHANGED, id } as const;
}

export function productSizeChanged(dimensions: MapSomeDimensionIdTo<string>) {
  return {
    type: PRODUCT_SIZE_CHANGED,
    dimensions
  } as const;
}

export function toggleProductDescription(payload: string) {
  return { type: PRODUCT_DESCRIPTION_TOGGLE, payload } as const;
}

export function onProductDescriptionCollapsed(ref: React.RefObject<HTMLElement>) {
  return { type: PRODUCT_DESCRIPTION_COLLAPSED, ref } as const;
}

export function validateDimensions(showValidation?: boolean) {
  return { type: VALIDATE_DIMENSIONS, showValidation: !!showValidation } as const;
}

export function showSelectSizeTooltip() {
  return {
    type: SHOW_SELECT_SIZE_TOOLTIP
  } as const;
}

export function hideSelectSizeTooltip() {
  return {
    type: HIDE_SELECT_SIZE_TOOLTIP
  } as const;
}

export function highlightSelectSizeTooltip() {
  return {
    type: HIGHLIGHT_SELECT_SIZE_TOOLTIP
  } as const;
}

export function unhighlightSelectSizeTooltip() {
  return {
    type: UNHIGHLIGHT_SELECT_SIZE_TOOLTIP
  } as const;
}

export function receiveSizingPredictionSuccess(sizingPredictionValue: string, colorId: string, hydraBlueSkyPdp: boolean) {
  return {
    type: RECEIVE_SIZING_PREDICTION_SUCCESS,
    sizingPredictionValue,
    colorId,
    hydraBlueSkyPdp
  } as const;
}

export function receiveSizingPredictionFailure(isOnDemandEligible: boolean | undefined) {
  return {
    type: RECEIVE_SIZING_PREDICTION_FAILURE,
    isOnDemandEligible
  } as const;
}

export function receiveGenericSizingBias(genericSizeBiases: null | { productId: string; sizeBiases: SizeBias[]; text: string }) {
  return {
    type: RECEIVE_GENERIC_SIZING_BIAS,
    genericSizeBiases
  } as const;
}

export function fetchSizingPrediction(productId: string, colorId: string, sizingPredictionFetcher = sizingPrediction): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return function(dispatch, getState) {
    const state = getState();
    const { environmentConfig: { api: { opal: opalInfo } } } = state;
    return sizingPredictionFetcher(opalInfo, { productId })
      .then(fetchErrorMiddleware)
      .then(response => {
        const { prediction, error, onDemandEligible } = response;
        if (prediction) {
          const hydraBlueSkyPdp = isAssigned(HYDRA_BLUE_SKY_PDP, 1, state);
          dispatch(receiveSizingPredictionSuccess(prediction, colorId, hydraBlueSkyPdp));
          trackEvent('TE_PDP_SIZING', `${productId}:SizeSelected:${prediction}`);
          trackEvent('TE_PDP_SIZING', `${productId}:SizeSuggested:${prediction}`);
          if (hydraBlueSkyPdp) {
            // We fetch the generic sizing bias regardless of sizing prediction
            // availability within the oidia test
            dispatch(fetchGenericSizingBias(productId));
          }
        } else {
          dispatch(receiveSizingPredictionFailure(onDemandEligible));
          trackEvent('TE_PDP_SIZING', `${productId}:NoResponse:${error}`);
          // If there isn't an explicit sizing prediction available, get generic size bias data
          dispatch(fetchGenericSizingBias(productId));
        }
      })
      .catch(e => {
        trackError('NON-FATAL', 'Could not load Sizing Prediction.', e);
      });
  };
}

interface ProductSizeBias {
  sizeBias: {
    hasHalfSizes: boolean;
    productId: string;
    sizeBiases: SizeBias[];
    text: string;
  };
}

interface SizeBias {
  score: string;
  value: string;
}

export function fetchGenericSizingBias(productId: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { mafia } }, cookies } = getState();
    return genericSizeBias(mafia, productId, cookies)
      .then(fetchErrorMiddleware as any)
      .then((res: ProductSizeBias) => {
        const { sizeBias } = res;
        if (!sizeBias) {
          dispatch(receiveGenericSizingBias(null));
        }

        const { sizeBiases, text } = sizeBias;

        const genericSizeBiases = {
          productId,
          sizeBiases,
          text
        };

        dispatch(receiveGenericSizingBias(genericSizeBiases));
      })
      .catch((err: Error) => trackError('NON-FATAL', 'Could not load generic size bias.', err));
  };
}

export function receiveBrandPromo(response: string | BrandPromo) {
  return {
    type: RECEIVE_BRAND_PROMO,
    brandPromo: response
  } as const;
}

export function addItemToCart() {
  return {
    type: ADD_ITEM_TO_CART
  } as const;
}

export function fetchBrandPromo(brandId: string, brandPromoFetcher = getBrandPromo): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    const { environmentConfig: { api: { mafia: { url } } } } = getState();
    return brandPromoFetcher({ url }, brandId)
      .then(fetchErrorMiddlewareMaybeJson)
      .then((response: BrandPromo) => {
        dispatch(receiveBrandPromo(response));
      })
      .catch((e: Error) => { // Api doesn't return anything if no brand promo found. Need to reset brandPromo object
        dispatch(receiveBrandPromo('no-promo-data'));
        trackError('NON-FATAL', 'Could not load brand promo.', e);
      });
  };
}

export function selectedColorChanged(colorId: string) {
  return { type:  PRODUCT_COLOR_CHANGED, colorId } as const;
}

export function fireSizingImpression(event: string, sizeObj?: { id: string; value: string }) {
  return {
    type:  EVENT_SIZING_IMPRESSION,
    event,
    sizeObj
  } as const;
}

export function requestPdpSymphonyComponents() {
  return {
    type: REQUEST_PDP_SYMPHONY_COMPONENTS
  } as const;
}

export function receivePdpSymphonyComponents(response: PDPSymphonyComponent, productId: string, styleId: string) {
  return {
    type: RECEIVE_PDP_SYMPHONY_COMPONENTS,
    symphony: { ...response, productId, styleId }
  } as const;
}

export function getSymphonyComponents(productId: string, styleId: string): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    dispatch(requestPdpSymphonyComponents());
    const { environmentConfig: { api: { mafia } }, cookies } = getState();
    return getSymphonyPdpComponents(mafia, { productId, styleId }, cookies)
      .then(fetchErrorMiddleware)
      .then((response: PDPSymphonyComponent) => dispatch(receivePdpSymphonyComponents(response, productId, styleId)))
      .catch((err: Error) => {
        trackError('ERROR', `Failed to fetch PDP Symphony info for: productId: ${productId || 'NA'}, styleId: ${styleId || 'NA'}`, err);
      });
  };
}

export function requestPdpStorySymphonyComponents() {
  return {
    type: REQUEST_PDP_STORY_SYMPHONY_COMPONENTS
  } as const;
}

export function receivePdpStorySymphonyComponents(response: PDPSymphonyStory, productId: string) {
  return {
    type: RECEIVE_PDP_STORY_SYMPHONY_COMPONENTS,
    symphonyStory: { ...response, productId }
  } as const;
}
export function getPdpStoriesSymphonyComponents(productId: string, symphonySlotFetcher = getSymphonySlots): ThunkAction<Promise<void>, AppState, void, AnyAction> {
  return (dispatch, getState) => {
    dispatch(requestPdpStorySymphonyComponents());
    const { cookies, environmentConfig: { api: { mafia } } } = getState();
    return symphonySlotFetcher(mafia, { pageName: productId, pageLayout: 'detail' }, cookies)
      .then((response: any) => sessionLoggerMiddleware(response, cookies))
      .then(fetchErrorMiddleware)
      .then((response: PDPSymphonyStory) => dispatch(receivePdpStorySymphonyComponents(response, productId)))
      .catch((err: Error) => {
        trackError('NON-FATAL', `Failed to fetch PDP Symphony story info for: productId: ${productId}`, err);
      });
  };
}

export type ProductDetailAction =
  | ReturnType<typeof setCarouselIndex>
  | ReturnType<typeof requestProductDetail>
  | ReturnType<typeof productSwatchChange>
  | ReturnType<typeof receiveProductDetail>
  | ReturnType<typeof toggleOosButton>
  | ReturnType<typeof requestUpvoteReview>
  | ReturnType<typeof receiveUpvoteReviewSucess>
  | ReturnType<typeof receiveUpvoteReviewFailure>
  | ReturnType<typeof setProductDocMeta>
  | ReturnType<typeof requestProductReviews>
  | ReturnType<typeof receiveProductReviews>
  | ReturnType<typeof requestSearchReviews>
  | ReturnType<typeof receiveSearchReviews>
  | ReturnType<typeof exitSearchReviews>
  | ReturnType<typeof requestSimilarStyles>
  | ReturnType<typeof receiveSimilarStyles>
  | ReturnType<typeof productAgeGroupChanged>
  | ReturnType<typeof productGenderChanged>
  | ReturnType<typeof productSizeUnitChanged>
  | ReturnType<typeof productSizeChanged>
  | ReturnType<typeof toggleProductDescription>
  | ReturnType<typeof onProductDescriptionCollapsed>
  | ReturnType<typeof validateDimensions>
  | ReturnType<typeof showSelectSizeTooltip>
  | ReturnType<typeof hideSelectSizeTooltip>
  | ReturnType<typeof highlightSelectSizeTooltip>
  | ReturnType<typeof unhighlightSelectSizeTooltip>
  | ReturnType<typeof receiveSizingPredictionSuccess>
  | ReturnType<typeof receiveSizingPredictionFailure>
  | ReturnType<typeof receiveGenericSizingBias>
  | ReturnType<typeof receiveBrandPromo>
  | ReturnType<typeof addItemToCart>
  | ReturnType<typeof selectedColorChanged>
  | ReturnType<typeof fireSizingImpression>
  | ReturnType<typeof requestPdpSymphonyComponents>
  | ReturnType<typeof receivePdpSymphonyComponents>
  | ReturnType<typeof requestPdpStorySymphonyComponents>
  | ReturnType<typeof receivePdpStorySymphonyComponents>;
