import {
  GC_PAYMENT_METHOD_NOT_ALLOWED,
  GIFTCARD_CODE_ALREADY_REDEMEED,
  GIFTCARD_CODE_CANCELLED,
  GIFTCARD_CODE_EXPIRED,
  GIFTCARD_CODE_INVALID,
  PROMOTIONAL_CODE_ALREADY_REDEEMED,
  PROMOTIONAL_CODE_BAD,
  PROMOTIONAL_CODE_EXPIRED,
  PROMOTIONAL_CODE_INVALID_FOR_PURCHASE,
  PROMOTIONAL_CODE_USED_BEFORE_START_DATE
} from 'constants/constraintViolations';

declare const __DEVELOPMENT__: boolean | undefined;
declare const __QUIET__: boolean | undefined;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global __DEVELOPMENT__, __QUIET__ */

export const IS_DEV = typeof(__DEVELOPMENT__) !== 'undefined' && __DEVELOPMENT__;
export const IS_QUIET = typeof(__QUIET__) !== 'undefined' && __QUIET__;
export const SINGLE_SELECT_FILTERS = { 'pricingTag': true, 'txAttrFacet_Gender': true, 'zc1': true, 'zc2': true, 'zc3': true, 'zc4': true };
export const PRODUCT_REVIEWS_PER_PAGE = 25;

export const LAZY_TIMEOUT = 1;
export const CV_WHITE_LIST = [
  GIFTCARD_CODE_ALREADY_REDEMEED,
  GIFTCARD_CODE_CANCELLED,
  GIFTCARD_CODE_EXPIRED,
  GIFTCARD_CODE_INVALID,
  GC_PAYMENT_METHOD_NOT_ALLOWED,
  PROMOTIONAL_CODE_ALREADY_REDEEMED,
  PROMOTIONAL_CODE_EXPIRED,
  PROMOTIONAL_CODE_USED_BEFORE_START_DATE,
  PROMOTIONAL_CODE_INVALID_FOR_PURCHASE,
  PROMOTIONAL_CODE_BAD
];
export const SESSION_STORAGE_REVIEW_KEY = 'martyReview';
export const MOST_HELPFUL = 'best';
export const NEWEST = 'latest';
export const IMAGE = 'IMAGE';
export const VIDEO = 'VIDEO';
export const BRAND_VIEW = 'BRAND_VIEW';
export const RECOMMENDED_SIZE_VIEW = 'RECOMMENDED_SIZE_VIEW';
export const SEARCH_IMGS_NOT_LAZY_LOADED = 12;
export const UPLOADED_BY_REVIEWER_ALT_TEXT = 'uploaded by reviewer';
export const DEFAULT_REVIEWER_NAME = 'Anonymous';
export const SHAMELESS_PLUG_LIST_ID = '1';
export const CLOUDCAT_MAX_ITEM_IDS = 200;
export const GRAY_PLACEHOLDER_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAPAAAMDAwP///yH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';
export const IFRAME_EMPTY_TITLE = 'Intentionally blank';
export const MICROSOFT_UET_IFRAME_ID = 'msft-uet';
export const BEST_FOR_YOU_FACETFIELD = 'preferences';
export const FLUID_URL_PROD = 'https://verify.findzen.com';
export const FLUID_URL_ALPHA = 'https://alpha.fluid.findzen.com';
export const MSA_CC_IMAGES_URL = 'https://m.media-amazon.com/images/G/01/zappos/cloudcatalog/reviewugc/images/';
export const GIFTCARD_UNAVAILABLE_VALUE = 'Unavailable';
export const STANDARD_REVIEW_SUBMIT_ERROR = 'We encountered an error while submitting your review.';
export const ADSENSE_URL = 'https://www.google.com/adsense/search/ads.js';
export const GPT_URL = 'https://www.googletagservices.com/tag/js/gpt.js';
export const APS_URL = '//c.amazon-adsystem.com/aax2/apstag.js';
export const UPS_FIND_STORE_URL = 'https://www.theupsstore.com/tools/find-a-store';
export const UPS_DROPOFF_LOCATION_URL = 'https://www.ups.com/dropoff/?loc=en_US';
export const DISMISSED_GLOBAL_BANNER_SESSION_STORAGE_KEY = 'globalBannerDismissed';
export const STORE_ACCOUNT_LOCAL_STORAGE_KEY = 'accountState';
export const CART_LOCAL_STORAGE_KEY = 'browserStorageCart';
export const LOW_STOCK_LABEL_LIMIT = 5;
export const INFLUENCER_TRACKING_LOCAL_STORAGE_KEY = 'influencer';
export const PRODUCT_CARD_BREAKPOINT_MAX = 1232; // $productCardBreakpointMax in src/styles/variables.scss
export const PRODUCT_CARD_BREAKPOINT_MIN = 1024; // $productCardBreakpointMin in src/styles/variables.scss

/**
* Marty-specific LP component values
*/
export const DESKTOP_PDP_VIDEO = 'DESKTOP_PDP_VIDEO'; // used in MelodyVideoPlayer

export const SHIPMENT_TRACKING_DATE_FORMAT = 'MMM D, YYYY hh:mm:ss A';
export const MY_ACCOUNT_DATE_FORMAT = 'MMM D, YYYY [at] h:mm A';

export const LOCATION_ASSIGN = 'LOCATION_ASSIGN';
export const LOCATION_REPLACE = 'LOCATION_REPLACE';

export const REACT_CONTAINER_ID = 'root';
export const ARIA_LIVE_REGION_ROOT = 'ariaLiveRoot';

export const BLANK_IMAGE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export const STANDARD_INTERSECTION_OBSERVER_MARGIN = '200px 0px'; // start loading things ahead of them becoming visible.

export const LIST_OF_STATES = [
  'AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC',
  'DE', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA',
  'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE',
  'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
];

export const A11Y_IMAGE_TRANSLATIONS = {
  MAIN: 'Main View',
  PAIR: 'Pair View',
  TOPP: 'Top View',
  BOTT: 'Bottom View',
  LEFT: 'Left View',
  BACK: 'Back View',
  RGHT: 'Right View',
  FRNT: 'Front View'
};

export const XSLL_EXCLUDED_PRODUCT_IMAGES = ['PAIR', 'TSD'];
