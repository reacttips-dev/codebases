import { LOCATION_CHANGE } from 'react-router-redux';

import {
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
  REDIRECT,
  REQUEST_PDP_STORY_SYMPHONY_COMPONENTS,
  REQUEST_PDP_SYMPHONY_COMPONENTS,
  REQUEST_PRODUCT_DETAIL,
  REQUEST_PRODUCT_REVIEWS,
  REQUEST_SEARCH_REVIEWS,
  REQUEST_SIMILAR_STYLES,
  REQUEST_UPVOTE_REVIEW,
  SET_CAROUSEL_INDEX,
  SET_DOC_META_PDP,
  SET_DOC_META_PRODUCT_REVIEWS,
  SET_DOC_META_WRITE_REVIEW,
  SET_ERROR,
  SHOW_SELECT_SIZE_TOOLTIP,
  TOGGLE_OOS_BUTTON,
  UNHIGHLIGHT_SELECT_SIZE_TOOLTIP,
  VALIDATE_DIMENSIONS
} from 'constants/reduxActions';
import {
  MOST_HELPFUL,
  PRODUCT_REVIEWS_PER_PAGE
} from 'constants/appConstants';
import {
  constructLayeredMsaImageSizingPositioning,
  constructLayeredMsaImageUrl,
  constructMSAImageUrl,
  filterThenMap
} from 'helpers/index.js';
import ProductUtils from 'helpers/ProductUtils';
import { cleanDescription } from 'helpers/ProductDescriptionUtils';
import { buildDimensionValueLengthTypes } from 'helpers/productDimensionHelper';
import { buildSeoProductUrl } from 'helpers/SeoUrlBuilder';
import { createYouTubeContentUrl } from 'helpers/ClientUtils.js';
import {
  addAndUpdateAirplaneCacheConstraints,
  AirplaneCache,
  getSingleOptionDimensionValues,
  makeAirplaneCache,
  wipeAndReplaceAirplaneCacheConstraints
} from 'reducers/detail/airplaneCache';
import cleanReviews, { CleanedProductReview, cleanReview } from 'reducers/reviews/cleanReviews';
import {
  ArchRating,
  DimensionId,
  MapSomeDimensionIdTo,
  ProductBrand,
  ProductBundle,
  ProductFit,
  ProductRating,
  ProductReview,
  ProductReviewSummary,
  ProductSizing,
  ProductStyle,
  ProductVideo,
  SizeRating,
  WidthRating
} from 'types/cloudCatalog';
import {
  BrandPromo,
  GenericSizeBiases,
  PDPSymphonyComponent,
  PDPSymphonyStory,
  ProductDimensionValidation,
  ProductLookupKey,
  ProductSimilarStyle,
  SelectedSizing,
  SimilarStyles
} from 'types/product';
import { AppAction } from 'types/app';

export interface ProductDetailState {
  selectedSizing: SelectedSizing;
  validation: ProductDimensionValidation;
  reviewData: {
    submittedReviews: string[];
    loadingReviews: string[];
    isLoading?: boolean;
    offset?: number | string;
    orderBy?: string;
    page?: number | string;
    productId?: string;
    reviews?: CleanedProductReview[];
  };
  searchReviewData: {
    searchTerm: string;
    page?: string;
    offset?: string;
    reviews?: CleanedProductReview[];
    totalPages?: string;
    totalReviews?: string;
  };
  isDescriptionExpanded: boolean;
  carouselIndex: number;
  sizingPredictionId: null | string;
  isOnDemandEligible: null | boolean | undefined;
  brandPromo: BrandPromo | {};
  availableDimensionsForColor: null | {
    available: MapSomeDimensionIdTo<Record<string, boolean>>;
  };
  symphony: {
    loadingSymphonyComponents: boolean;
  } | (PDPSymphonyComponent & { loadingSymphonyComponents: boolean });
  symphonyStory: {
    loadingSymphonyStoryComponents: boolean;
    stories: PDPSymphonyStory[];
    pageType?: null | string;
    pageHeading?: null | string;
    pageTitle?: null | string;
    canonicalUrl?: null | string;
    subPageType?: null | string;
    keywords?: string;
    description?: null | string;
    pageLayout?: null | string;
    brandName?: null | string;
    customerAuth?: string;
    productId?: string;
    slotNames?: string[]; // We can probably make this an enum with the exact slot names we have
    slotData?: Record<string, PDPSymphonyStory>; // `string` can get updated to the same solt names, `PDPSymphonyStory` interface can get updated to the landing slot component interfaces when written;
  };
  genericSizeBiases: {} | null | GenericSizeBiases;
  sizingPredictionValue: string;
  detail?: FormattedProductBundle;
  isLoading?: boolean;
  isSearchingReviews?: boolean;
  colorId?: string;
  isSelectSizeTooltipVisible?: boolean;
  isSelectSizeTooltipHighlighted?: boolean;
  isSimilarStylesLoading: boolean;
  similarStyles?: SimilarStyles;
  styleThumbnails?: StyleThumbnail[];
  reviewsTotalPages?: number;
  oosButtonClicked: boolean;
}

export const initialState: ProductDetailState = {
  selectedSizing: {},
  validation: {
    dimensions: {}
  },
  reviewData: {
    submittedReviews: [],
    loadingReviews: []
  },
  searchReviewData: {
    searchTerm: ''
  },
  isDescriptionExpanded: false,
  carouselIndex: 0,
  sizingPredictionId: null,
  isOnDemandEligible: null,
  brandPromo: {},
  availableDimensionsForColor: null,
  symphony: { loadingSymphonyComponents: false },
  symphonyStory: { loadingSymphonyStoryComponents: false, stories: [] },
  genericSizeBiases: {},
  sizingPredictionValue: '',
  isSimilarStylesLoading: false,
  oosButtonClicked: false
};

// 1200px x 1200px
const layeredMsaDimensions = constructLayeredMsaImageSizingPositioning(1200);

// comparator for sorting styles by price
interface Price { price: number | string }
const priceSorter = ({ price: price1 }: Price, { price: price2 }: Price) => ProductUtils.priceToFloat(price1) - ProductUtils.priceToFloat(price2);
// comparator for sorting styles by color name alphabetically
interface Color { color: string }
const colorSorter = ({ color: color1 }: Color, { color: color2 }: Color) => (color1 < color2 ? -1 : (color1 > color2) ? 1 : 0);

function orderStyles(productType: string, styles: ProductStyle[]) {
  if (Array.isArray(styles)) {
    const sortedStyles = styles.slice();
    const sorter = ProductUtils.isGiftCard(productType) ? priceSorter : colorSorter;
    sortedStyles.sort(sorter);
    return sortedStyles;
  }
  return styles;
}

export function getSizingFromPrediction(sizingPredictionValue: string, currentSelectedSizing: SelectedSizing, colorId: string | undefined, { styles, sizing }: { styles: ProductStyle[]; sizing: ProductSizing }, hydraBlueSkyPdp: boolean): ProductSizing {
  const newSelectedSizing = { ...currentSelectedSizing };
  let sizingPredictionId = null;
  if (sizingPredictionValue) {
    for (const dim of sizing.dimensions) {
      const dimValues = dim.units[0].values;
      if (dim.name === 'size' && dimValues && dimValues.length > 1) { // check if value in size array
        for (let i = 0; i < dimValues.length; i++) {
          // sizing prediction found in list of dimensions units
          if (dimValues[i].value === sizingPredictionValue) {
            sizingPredictionId = dimValues[i].id;
            // sizing will NOT be preselected in the oidia test
            if (!hydraBlueSkyPdp) {
              newSelectedSizing[`d${dim.id}`] = sizingPredictionId;
            }
            break;
          }
        }
        const style = ProductUtils.getStyleByColor(styles, colorId);
        if (!sizingPredictionId || !ProductUtils.getStockBySize(sizing.stockData, style.colorId, newSelectedSizing)) {
          // if product not found or out of stock, clear selectedSizing keys so prediction experience isn't shown
          sizingPredictionId = 'oos';
          delete newSelectedSizing[`d${dim.id}`];
        }
        break;
      }
    }
  }
  return Object.assign({
    sizingPredictionId,
    sizingPredictionValue,
    selectedSizing: newSelectedSizing
  });
}

// Converts style list from Product Bundle into array of thumbnails in the format of the legacy images
// returning an object in the form of { styleId, src, swatchSrc }
const makeMsaImageThumbnail = (({ images = [], styleId, swatchImageId, color, colorId, tsdImages }: ProductStyle) => {
  // Use the first image provided by cloud cat as the thumbnail, per docs (https://confluence.zappos.net/display/~jsenecal/Cloud+Catalog+API)
  const thumbnailImageId = images.length ? images[0].imageId : '';
  const tsdThumbnailImageId = tsdImages?.imageIds?.[0] || '';
  return {
    color,
    colorId,
    src: constructMSAImageUrl(thumbnailImageId, { height: 82, width: 110, autoCrop: true }),
    tsdSrc: constructMSAImageUrl(tsdThumbnailImageId, { height: 152, width: 204, autoCrop: true, extension: 'png', customSettings: '_FMjpg' }),
    styleId,
    swatchSrc: constructMSAImageUrl(swatchImageId, { height: 19, width: 19 })
  };
});

const makeMsaImageThumbnails = (styles: ProductStyle[]) => styles.map(style => makeMsaImageThumbnail(style));

// For the given color/style build a data structure that shows what size values for each dimension are in stock
const buildAvailableDimensionsForColor = (colorId: string, { dimensionsSet, stockData }: ProductSizing) => {
  const available: MapSomeDimensionIdTo<Record<string, boolean>> = { };

  dimensionsSet.forEach(dim => {
    available[dim] = {};
  });

  stockData.forEach(stock => {
    if (stock.color === colorId && +stock.onHand > 0) {
      dimensionsSet.forEach(dim => {
        const stockData = stock[dim];
        if (!!stockData && !available[dim]?.[stockData]) {
          available[dim]![stockData] = true;
        }
      });
    }
  });

  return { available };

};

const reviewTypes = ['customerRewardReview', 'powerReview', 'premierReview', 'verifiedPurchase'] as const;

export function cleanReviewBadgeField(review: ProductReview, fieldName: typeof reviewTypes[number]) {
  const fieldValue = review?.[fieldName];
  if (typeof fieldValue === 'string') {
    const lowerCaseFieldValue = fieldValue.toLowerCase();
    if (lowerCaseFieldValue === 'true') {
      review[fieldName] = true;
    } else if (lowerCaseFieldValue === 'false') {
      review[fieldName] = false;
    }
  }
}

export function cleanMostHelpfulReview(review: ProductReview) {
  reviewTypes.forEach(fieldName => cleanReviewBadgeField(review, fieldName));
  return cleanReview(review);
}

/** Invoke the `callback` if the airplane cache is defined in the state */
export function withAirplaneCache(
  state: ProductDetailState,
  callback: (airplaneCache: AirplaneCache) => void
) {
  const airplaneCache = state.detail?.sizing?.airplaneCache;
  if (airplaneCache) {
    callback(airplaneCache);
  }
}

export function changeSelectionAndResetSizing(
  state: ProductDetailState,
  additionalConstraints: Partial<AirplaneCache['constraints']>
): ProductDetailState {
  const newState = Object.assign({}, state);
  withAirplaneCache(newState, airplaneCache => {
    let newConstraints = { ...airplaneCache.constraints };
    // we want to clear a width and size selection after selecting certain
    // "dimensions" like age group or gender, so first we delete d3 and d4 from
    // the airplane cache constraints...
    delete newConstraints.d3;
    delete newConstraints.d4;
    newConstraints = { ...newConstraints, ...additionalConstraints };
    // then we let the airplane cache figure out its effective constraints
    // by refreshing it
    wipeAndReplaceAirplaneCacheConstraints(airplaneCache, newConstraints);
    // then we check if the airplane cache reassigned d3 or d4 (e.g.,
    // because it's the only option)
    const { d3, d4 } = getSingleOptionDimensionValues(airplaneCache);
    updateSelectedSizingInPlace(newState, { d3, d4 });
  });
  return newState;
}

export function updateSelectedSizingInPlace(state: ProductDetailState, dimensions: SelectedSizing) {
  const cleanedSizing: MapSomeDimensionIdTo<string> = {};
  for (const dimensionId of Object.keys(dimensions)) {
    if (dimensions[dimensionId]) {
      cleanedSizing[dimensionId] = dimensions[dimensionId];
    }
  }
  state.selectedSizing = cleanedSizing;
}

export default function productDetailReducer(state: Readonly<ProductDetailState> = initialState, action: AppAction): ProductDetailState {
  switch (action.type) {
    case REQUEST_PRODUCT_DETAIL: {
      return Object.assign({}, state, { isLoading: true, selectedSizing: {}, sizingPredictionId: null, sizingPredictionValue: null });
    }
    case SET_DOC_META_PDP:
    case SET_DOC_META_WRITE_REVIEW as any: // TODO: These don't have corresponding action types yet
    case SET_DOC_META_PRODUCT_REVIEWS as any: {
      return { ...state, isLoading: false };
    }
    case RECEIVE_PRODUCT_DETAIL: {
      const { calledClientSide, colorId, lookupKeyObject, product, hydraBlueSkyPdp } = action;
      const newProduct = formatProductData(product, colorId, lookupKeyObject, calledClientSide);
      if (state.sizingPredictionId && state.sizingPredictionId !== 'oos' && state.sizingPredictionValue) {
        const sizingPredictions = getSizingFromPrediction(state.sizingPredictionValue, newProduct.selectedSizing, colorId, newProduct.detail, hydraBlueSkyPdp);
        return { ...state, ...newProduct, ...sizingPredictions };
      } else {
        return { ...state, ...newProduct };
      }
    }
    case PRODUCT_SWATCH_CHANGE: {
      const { colorId } = action;
      const newState = { ...state, colorId };
      withAirplaneCache(newState, airplaneCache => {
        addAndUpdateAirplaneCacheConstraints(airplaneCache, { colorId });
      });
      return newState;
    }
    case PRODUCT_AGE_GROUP_CHANGED: {
      return changeSelectionAndResetSizing(state, {});
    }
    case PRODUCT_GENDER_CHANGED: {
      const { id } = action;
      return changeSelectionAndResetSizing(state, { gender: id });
    }
    case PRODUCT_SIZE_UNIT_CHANGED: {
      const { id: countryOrUnit } = action;
      const newState = Object.assign({}, state);
      withAirplaneCache(newState, airplaneCache => {
        addAndUpdateAirplaneCacheConstraints(airplaneCache, { countryOrUnit });
      });
      return newState;
    }
    case PRODUCT_SIZE_CHANGED: {
      const { dimensions } = action;
      const newState = Object.assign({}, state);
      withAirplaneCache(newState, airplaneCache => {
        const newConstraints = airplaneCache.constraints;
        const { d3, d4 } = dimensions;
        newConstraints.d3 = d3;
        newConstraints.d4 = d4;
        wipeAndReplaceAirplaneCacheConstraints(airplaneCache, newConstraints);
      });
      updateSelectedSizingInPlace(newState, dimensions);
      return newState;
    }
    case REQUEST_PRODUCT_REVIEWS: {
      const { orderBy, reviewsPage, reviewsOffset } = action;
      return { ...state, reviewData: { ...state.reviewData, isLoading: true, page: reviewsPage, offset: reviewsOffset, orderBy } };
    }
    case RECEIVE_PRODUCT_REVIEWS: {
      const { productId, reviewData } = action;
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          isLoading: false,
          reviews: cleanReviews(reviewData.reviews),
          productId
        }
      };
    }
    case REQUEST_SEARCH_REVIEWS: {
      const { reviewsPage, searchTerm } = action;
      return Object.assign({},
        state,
        {
          isLoading: true,
          isSearchingReviews: true,
          searchReviewData: {
            ...state.searchReviewData,
            searchTerm,
            page: reviewsPage
          }
        });
    }
    case RECEIVE_SEARCH_REVIEWS: {
      const { searchResults } = action;
      return Object.assign({}, state, {
        isLoading: false,
        reviewData: {
          ...state.reviewData,
          orderBy: MOST_HELPFUL // search is always most helpful first
        },
        searchReviewData: {
          ...state.searchReviewData,
          reviews: cleanReviews(searchResults.reviews),
          totalPages: Math.floor(searchResults.totalHits / 25),
          totalReviews: searchResults.totalHits
        }
      });
    }
    case EXIT_SEARCH_REVIEWS: {
      return Object.assign({}, state, { isSearchingReviews: false, searchReviewData: { reviews: [], searchTerm: '' } });
    }
    case REQUEST_SIMILAR_STYLES: {
      return Object.assign({}, state, {
        isSimilarStylesLoading: true
      });
    }
    case RECEIVE_SIMILAR_STYLES: {
      const { productId, similarStylesData } = action;
      const filteredStyles: (ProductSimilarStyle & { productSeoUrl: string })[] = filterThenMap(similarStylesData.results,
        ((style: ProductSimilarStyle) => `${style.productId}` !== productId),
        ((style: ProductSimilarStyle) => ({ ...style, productSeoUrl: style.productUrl }))); // search similarity response doesn't populate this, but MelodyCardProduct needs it
      const data = { ...similarStylesData, results: filteredStyles };
      return Object.assign({}, state, {
        isSimilarStylesLoading: false,
        similarStyles: data
      });
    }
    case PRODUCT_DESCRIPTION_TOGGLE: {
      return Object.assign({}, state, {
        isDescriptionExpanded: !state.isDescriptionExpanded
      });
    }
    case PRODUCT_DESCRIPTION_COLLAPSED: {
      const { ref } = action;
      if (!state.isDescriptionExpanded) {
        if (ref && ref.current) {
          ref.current.focus();
        }
      }
      return { ...state };
    }
    case TOGGLE_OOS_BUTTON: {
      const { oosModalActive } = action;
      return { ...state, oosButtonClicked: oosModalActive };
    }
    case VALIDATE_DIMENSIONS: {
      const { showValidation } = action;
      const addToCartBeenClicked = showValidation ? true : state.validation.showValidation;
      const validatedState = Object.assign({}, state, {
        validation: {
          showValidation: addToCartBeenClicked,
          dimensions: {}
        }
      });
      state.detail?.sizing.dimensionsSet.forEach((dimId: DimensionId) => {
        // a dimension is invalid if it is true
        validatedState.validation.dimensions[dimId] = addToCartBeenClicked && !state.selectedSizing[dimId];
      });
      return validatedState;
    }
    case SHOW_SELECT_SIZE_TOOLTIP: {
      return { ...state, isSelectSizeTooltipVisible: true };
    }
    case HIDE_SELECT_SIZE_TOOLTIP:
    case LOCATION_CHANGE as any: {
      return { ...state, isSelectSizeTooltipVisible: false, isSelectSizeTooltipHighlighted: false };
    }
    case HIGHLIGHT_SELECT_SIZE_TOOLTIP: {
      return { ...state, isSelectSizeTooltipHighlighted: true };
    }
    case UNHIGHLIGHT_SELECT_SIZE_TOOLTIP: {
      return { ...state, isSelectSizeTooltipHighlighted: false };
    }
    case SET_CAROUSEL_INDEX: {
      const { index } = action;
      return Object.assign({}, state, {
        carouselIndex: index
      });
    }
    case REQUEST_UPVOTE_REVIEW: {
      const { reviewId } = action;
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          loadingReviews: state.reviewData.loadingReviews.concat(reviewId)
        }
      };
    }
    case RECEIVE_UPVOTE_REVIEW_SUCCESS: {
      const { reviewId } = action;
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          loadingReviews: state.reviewData.loadingReviews.filter((id: string) => id !== reviewId),
          submittedReviews: state.reviewData.submittedReviews.concat(reviewId)
        }
      };
    }
    case RECEIVE_UPVOTE_REVIEW_FAILURE: {
      const { reviewId } = action;
      return {
        ...state,
        reviewData: {
          ...state.reviewData,
          loadingReviews: state.reviewData.loadingReviews.filter((id: string) => id !== reviewId)
        }
      };
    }
    case REDIRECT as any:
    case SET_ERROR as any: {
      return Object.assign({}, state, { isLoading: false });
    }
    case RECEIVE_SIZING_PREDICTION_SUCCESS: {
      const { colorId, sizingPredictionValue, hydraBlueSkyPdp } = action;
      // This _should_ always be loaded, but if it isn't we shouldn't blow up
      if (state.selectedSizing && state.detail) {
        const predictedSizing = getSizingFromPrediction(sizingPredictionValue, state.selectedSizing, colorId, state.detail, hydraBlueSkyPdp);
        return { ...state, ...predictedSizing };
      }
      return state;
    }
    case RECEIVE_SIZING_PREDICTION_FAILURE: {
      const { isOnDemandEligible } = action;
      return { ...state, isOnDemandEligible };
    }
    case RECEIVE_GENERIC_SIZING_BIAS: {
      const { genericSizeBiases } = action;
      return { ...state, genericSizeBiases };
    }
    case RECEIVE_BRAND_PROMO: {
      const { brandPromo } = action;
      return Object.assign({}, state, {
        brandPromo
      });
    }
    case PRODUCT_COLOR_CHANGED: {
      const { colorId } = action;
      const newState = Object.assign({}, state);
      withAirplaneCache(newState, airplaneCache => {
        addAndUpdateAirplaneCacheConstraints(airplaneCache, { colorId });
      });
      if (newState.detail?.sizing) {
        return { ...newState, availableDimensionsForColor: buildAvailableDimensionsForColor(colorId, newState.detail?.sizing) };
      }
      return newState;
    }
    case REQUEST_PDP_SYMPHONY_COMPONENTS: {
      return { ...state, symphony: { ...state.symphony, loadingSymphonyComponents: true } };
    }
    case RECEIVE_PDP_SYMPHONY_COMPONENTS: {
      const { symphony } = action;
      const contentStyleId = Object.keys(symphony?.style || {}).length ? symphony.style : null;
      const contentProductId = Object.keys(symphony?.product || {}).length ? symphony.product : null;
      const pageId = contentStyleId ? `s${symphony.styleId}` : contentProductId ? `p${symphony.productId}` : null;
      return {
        ...state, symphony: {
          ...state.symphony,
          ...symphony,
          [`s${symphony.styleId}`]: contentStyleId,
          [`p${symphony.productId}`]: contentProductId,
          loadingSymphonyComponents: false,
          pageId
        }
      };
    }
    case REQUEST_PDP_STORY_SYMPHONY_COMPONENTS: {
      return {
        ...state,
        symphonyStory: { ...state.symphonyStory, loadingSymphonyStoryComponents: true }
      };
    }
    case RECEIVE_PDP_STORY_SYMPHONY_COMPONENTS: {
      const { symphonyStory } = action;
      const stories = symphonyStory.slotNames.reduce((acc: any[], slotName: string) => {
        if (slotName.includes('story')) {
          acc.push({ ...symphonyStory.slotData[slotName], slotName });
        }
        return acc;
      }, []);
      return {
        ...state,
        symphonyStory: { ...symphonyStory, stories, loadingSymphonyStoryComponents: false }
      };
    }
    default:
      return state;
  }
}

interface CleanedStyle extends ProductStyle {
  tsdImages: {
    backgroundColor: string;
    backgroundId: string;
    imageIds: string[];
    imageUrls?: string[];
  };
}

export interface StyleThumbnail {
  color: string;
  colorId: string;
  src: string;
  styleId: string;
  swatchSrc: string;
  tsdSrc: string;
}

export interface FormattedProductData {
  availableDimensionsForColor: {
    available: MapSomeDimensionIdTo<{
      [key in number]: boolean
    }>;
  };
  colorId?: string;
  productId?: string;
  detail: FormattedProductBundle;
  dimensionValueLengthTypes: MapSomeDimensionIdTo<string>;
  isDescriptionExpanded: boolean;
  requestedAsin?: string;
  requestedStockId?: string;
  reviewsTotalPages: number;
  seoProductUrl: string;
  selectedSizing: SelectedSizing;
  styleThumbnails: StyleThumbnail[];
  validation: {
    addToCartBeenClicked?: boolean;
    dimensions: MapSomeDimensionIdTo<boolean>;
  };
}

export interface FormattedProductBundle {
  archFit: ProductFit<ArchRating>;
  brand: ProductBrand;
  brandId: string;
  brandName: string;
  brandProductName: string;
  defaultCategory: string;
  defaultImageUrl: string;
  defaultProductType: string;
  defaultProductUrl: string;
  defaultSubCategory: string | null;
  description?: {
    bulletPoints: string[];
    sizeCharts: string[];
  };
  gender?: string;
  genders: string[];
  hasHalfSizes: boolean | null;
  isReviewableWithMedia: boolean;
  oos: boolean;
  overallRating: string[];
  preferredSubsite: null | { url: string; id: number };
  productId: string;
  productName: string;
  productRating: string;
  receivedDescription: string;
  reviewCount: string;
  reviewSummary: ProductReviewSummary;
  sizeFit: ProductFit<SizeRating>;
  sizing: FormattedProductSizing;
  styles: ProductStyle[];
  videos: ProductVideo[];
  videoUrl?: string;
  widthFit: ProductFit<WidthRating>;
  youtubeData: {
    videoId?: string;
    contentUrl?: string;
    embedUrl?: string;
    thumbnailUrl?: string;
    videoName?: string;
    uploadDate: boolean | string;
  };
  youtubeVideoId?: string;
  zombie: boolean;
}

export type FormattedProductSizing = ProductSizing & {
  airplaneCache?: AirplaneCache;
  hypercubeSizingData: MapSomeDimensionIdTo<{
    min: number;
    max: number;
  }>;
};

export const formatProductData = (product: { detail: ProductBundle }, givenColorId?: string, lookupKeyObject?: ProductLookupKey, calledClientSide?: boolean): FormattedProductData => {
  const stylesWithCleanedImages = [] as CleanedStyle[];
  const {
    detail : {
      reviewSummary: { reviewWithLeastVotes, reviewWithMostVotes } = { reviewWithLeastVotes: null, reviewWithMostVotes: null },
      productName,
      videos,
      youtubeVideoId
    }
  } = product;
  const colorId = givenColorId ? givenColorId : product.detail.styles[0]?.colorId;
  product.detail.styles.forEach(style => {
    const cleanedUpStyle: CleanedStyle = { ...style, tsdImages: { ...style.tsdImages } };
    // remove MAIN image if PAIR image exists for MSA image bundle from image list but throw it in a separate field for use
    if (style.images) {
      const mainImage = style.images.find(image => image.type === 'MAIN');
      if (mainImage) {
        cleanedUpStyle.imageId = mainImage.imageId;
        if (style.images.some(image => image.type === 'PAIR')) {
          cleanedUpStyle.images = style.images.filter(image => image.type !== 'MAIN');
        }
      }
    }

    const tsdImageIds = style.tsdImages?.imageIds;
    const tsdBackgroundImageId = style.tsdImages?.backgroundId;
    if (tsdImageIds && tsdBackgroundImageId) {
      // Basically we layer the shoe image on top of the circle image. And create a single new jpg image. This is MUCH
      // lighter than a png. ~800kb vs 75kb.
      cleanedUpStyle.tsdImages.imageUrls = tsdImageIds.map(shoeImgId => constructLayeredMsaImageUrl({
        ...layeredMsaDimensions,
        topImageId: shoeImgId,
        botImageId: tsdBackgroundImageId
      } as any));
    }

    // Only add to the state if we have an actual image to show
    if (cleanedUpStyle.images?.length || cleanedUpStyle.tsdImages?.imageIds?.length) {
      stylesWithCleanedImages.push(cleanedUpStyle);
    }
  });

  const formattedLeastVotes = reviewWithLeastVotes && cleanMostHelpfulReview(reviewWithLeastVotes);
  const formattedMostVotes = reviewWithMostVotes && cleanMostHelpfulReview(reviewWithMostVotes);

  const { description: receivedDescription, overallRating: receivedOverallRating = {}, sizing : { allValues : allSizes } } = product.detail;
  const overallRating: string[] = [];
  for (let i = 1; i <= 5; i++) {
    overallRating.push(receivedOverallRating[(6 - i) as keyof ProductRating] || '0');
  }

  const youtubeData = youtubeVideoId
    ? {
      videoId : youtubeVideoId,
      contentUrl : createYouTubeContentUrl(youtubeVideoId),
      embedUrl : `https://www.youtube.com/embed/${youtubeVideoId}`,
      thumbnailUrl : `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`,
      // Unfortunately we are not able to get the actual metadata from the youtube video so these will have to do
      videoName : productName,
      uploadDate : videos.length > 0 && videos[0].uploadedDate
    }
    : {}
  ;

  const hypercubeSizingData = allSizes && allSizes.reduce((result, size, index) => ({
    ...result,
    [size.id] : {
      min : parseInt(size.rank, 10),
      max : allSizes[index + 1] ? parseInt(allSizes[index + 1].rank, 10) - 1 : Number.MAX_SAFE_INTEGER
    }
  }), {});

  const airplaneCacheConstraints: Partial<AirplaneCache['constraints']> = {};
  if (colorId) {
    airplaneCacheConstraints.colorId = colorId;
  }
  const airplaneCache = makeAirplaneCache(product.detail, airplaneCacheConstraints);

  const description
    = receivedDescription
      ? cleanDescription(receivedDescription)
      : receivedDescription;
  const styles = orderStyles(product.detail.defaultProductType, stylesWithCleanedImages);
  const sizing = {
    ...product.detail.sizing,
    airplaneCache,
    hypercubeSizingData
  };
  let detail = Object.assign({}, product.detail, { receivedDescription, description, styles, overallRating, youtubeData, sizing });
  if (detail?.reviewSummary?.overallRating) {
    const { aggregateRating } = ([5, 4, 3, 2, 1] as const).reduce((acc, num) => {
      const count = detail.reviewSummary.overallRating?.[num];
      if (count) {
        const numTotal = parseInt(count, 10);
        if (!Number.isNaN(numTotal)) {
          acc.overallTotal += numTotal;
          acc.reviewWeight += numTotal * num;
        }
      }
      return acc;
    }, {
      overallTotal: 0,
      reviewWeight: 0,
      get aggregateRating() {
        return this.reviewWeight / this.overallTotal;
      }
    });
    detail = { ...detail, reviewSummary: { ...detail.reviewSummary, aggregateRating, reviewWithMostVotes: formattedMostVotes, reviewWithLeastVotes: formattedLeastVotes } };
  }

  const seoProductUrl = buildSeoProductUrl(product.detail); // explicitly omit color since this should be the generic canonical.
  const reviewCount = parseInt(product.detail.reviewCount) || 0;
  const reviewsTotalPages = reviewCount > 0 ? Math.ceil(reviewCount / PRODUCT_REVIEWS_PER_PAGE) : 0;
  const styleThumbnails = makeMsaImageThumbnails(detail.styles);
  const availableDimensionsForColor = buildAvailableDimensionsForColor(colorId || detail.styles[0]?.colorId, detail.sizing);
  const dimensionValueLengthTypes = buildDimensionValueLengthTypes(detail.sizing.dimensions);
  const newProduct = Object.assign({}, product, {
    detail,
    selectedSizing: {} as SelectedSizing,
    styleThumbnails,
    validation: { dimensions: {} },
    isDescriptionExpanded: false,
    reviewsTotalPages,
    colorId,
    requestedAsin: lookupKeyObject?.asin,
    requestedStockId: lookupKeyObject?.stockId,
    seoProductUrl,
    availableDimensionsForColor,
    dimensionValueLengthTypes,
    calledClientSide
  }) as FormattedProductData;
  for (const dim of product.detail.sizing.dimensions) {
    if (dim.units[0].values?.length === 1) {
      newProduct.selectedSizing[`d${dim.id}`] = dim.units[0].values[0].id;
    }
  }
  return newProduct;
};

export type PDPState = ReturnType<typeof productDetailReducer>;

