// NOTE: GLOBAL SHARED REGEXES ARE BAD
// https://github01.zappos.net/mweb/marty/issues/6464
export const DASH_UNDERSCORE_WITH_FOLLOWING_LETTER_RE_GEN = () => /[_.-]+(\w|$)/g;
export const QUERY_PARAMS_RE_GEN = () => /(\?.*)/g;
export const NUMBER_SANS_COMMAS_RE_GEN = () => /\B(?=(\d{3})+(?!\d))/g;
export const NON_ALPHA_NUMERIC_RE_GEN = () => /[^a-z0-9]/gi;

export const ABSOLUTE_URL_RE = /\/\/([^/,\s]+\.[^/,\s]+?)(?=\/|,|\s|$|\?|#)/;
export const BODY_PAGE_CLASS = /(page-\S*)/;
export const BRAND_URL_RE = /^(?:\/marty)?\/search\/brand\/(\d+)(.*)?$/i;
export const CHECKOUT_URL_RE = /^(?:\/marty)?\/(checkout)($|\/)(?!(thankyou))/;
export const CONFIRMATION_URL_RE = /^(?:\/marty)?\/confirmation\//i;
export const CONTENT_LINK_ACTION_PARSE_RE = /^([^:]*):?(.*)?/; // data-application-action="actionName:parameters" --> [ (not needed), actionName, parameters ]
export const EXPIRATION_MM_YYYY = /^(0?[1-9]|1[0-2])[ ](2[0-9]{3})$/;
export const FILE_NAME_NO_EXT = /([^/]+)(?=\.\w+$)/;
export const FILTER_URL_RE = /\/filter\/(null)?/i;
export const FILTERS_RE = /^(?:\/marty)?\/filters/i;
// INTERNET_EMAIL is a regex taken from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#Validation
// Browsers that implement the specification should be using an algorithm equivalent to the following:
export const INTERNET_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
export const IS_EGC_NAME = /E-Gift Card$/;
export const IS_GIFT_CARD = /Gift Cards$/;
export const IS_LETTER_RE = /^[a-z]{1}$/i;
export const IS_NUMBER_RE = /^\d+$/;
export const IS_LIST_ID = /^h\./;
export const IS_LOGIN_PAGE = /^\/(ap|zap)\/?/;
export const MARTY_URL_PREFIX_RE = /^\/marty\//;
export const MSA_IMAGE_ID_FROM_URL = /([^/]+)(?=\.\w+$)/;
export const NOFOLLOW_FACET_RE = /size|priceFacet/i;
export const NON_MARTY_URL = /^(?:\/marty)?(\S*[^/])\/??$/i;
export const NON_SEARCH_PREFIXES = /^\/(p|product|b|brand|c)\//;
export const PAGE_NUMBER_IN_URL_RE = /\/page\/\d+/;
export const PO_BOX_RE = /box.*\d+|[po.][po.]+\s?b?(ox)?.*\d+/i;
export const POPUP_CLASS_RE = /^popup-(\d+)-(\d+)$/;

/** match[1]=dollars, match[2]=cents, match[2] may be undefined */
export const PRICE = /^\s*\$?(\d+)(?:\.(\d+))?\s*$/;

export const PRODUCT_ASIN = /^B0[A-Z0-9]{8}$/;
export const PRODUCT_COLOR_URL_FRAGMENT_RE = /\/color\/\d+/;
export const PRODUCT_DETAIL_IMAGE_PAGE_RE = /\/i\/\d+/;
export const PRODUCT_PRETTY_FRAGMENT_RE = /\/p\/.*?\/product\//; // matches /p/some-brand-some-name-some-color/product/
export const RELATIVE_URL_RE = /^\/[^/]/;
export const MATCH_TEMPLATE_VARIABLE = /\$\{(.*?)\}/;
export const SEO_URL_RE = /^(?:\/marty)?\/([a-z0-9-]+)$/i;
export const SIZE_CHART_RE = /([^]?)(size chart|guide)([^]?)/i;
export const SIZE_VALUE = /[-.0-9]+/; // Matches size on PDP's Calculate Your Size Modal, such as "7.5" or "11"
export const SLASH_SEARCH_RE = /^(?:\/marty)?(?:\/filters)?\/search/;
export const SLASH_SEARCH_FILTERS_RE = /\/search\/(.*)\/filter/;
export const NULL_SEARCH_RE = /\/search\?term=/;
export const TRIM_BR_TAGS = /^\s*(<br\/?>\s*)*|(<br\/?>\s*)*\s*$/ig;
export const VALID_CC = /^[2-6]\d{12,15}$/;
export const VALID_EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const VALID_IMAGE_MIMETYPE = /image\/(?:png|jpg|jpeg)/i;
export const VALID_ORDER = /^\d{3}-\d{7}-\d{7}$|^\d+$/;
export const VALID_PHONE = /.*[0-9].*/;
export const VALID_VIDEO_MIMETYPE = /video\/mp4/i;
export const ZCS_VALID_PAGE_NAME_RE = /^[\w\d-_+]+$/;
export const ZSO_URL_RE = /\.zso/;
export const ZSO_URL_WITH_FILTERS_RE = /\/[\w-]+\.zso\b/;
export const PAGE_NUMBER_IN_TITLE_RE = /(,? page \d)|(Pg.\d)+/;
export const OOS_REDIRECTED_RE = /[?&]oosRedirected=true/;
export const MOBILE_PAGINATION = /^(\d+)\s(of)\s(\d+)/;
export const DIGITS = /(\d+)/ig;
export const MONTHS = /(January|February|March|April|May|June|July|August|September|October|November|December)/ig;

// A description of what the following regexp extracts can be found at src/helpers/SearchUtils.js
export const NONZSO_SEARCH_RE = /^(?:\/marty)?(?:\/filters)?\/search\/([^/?]*)(?:\/filter\/?(.*?))?(?:\/orig\/(.*?))?(?:\/termLander\/(.*?))?(?:\/page\/(\d+))?(?:\/sort\/(.*?))?(?:\/si\/(.*?))?(?:\/sy\/(\d+))?(?:\/debug\/(.*?))?(?:\/noEncode\/(true|false?))?(?:\/nq\/(.*?))?(?:\/pf_rd_r\/(.*?))?(?:\/pf_rd_p\/(.*?))?\/?(?:\?(.*))?$/;
export const EXTRACT_URL_SEGMENTS_RE = /([^?]*)(\?)?(.*)/; // When used with a url: matches $1 = everything before '?', $2 = '?' (if exists), $3 = everything after '?'
export const DELIVERY_PROMISE_TYPE = /(Estimated Delivery )|(Guaranteed delivery date of )|(Estimated Shipping )/i;
