import appendQuery from 'append-query';
import { parse, parseUrl, stringify } from 'query-string';

import { sanitizeForEvent } from './index';

import { SINGLE_SELECT_FILTERS } from 'constants/appConstants';
import { OOS_REDIRECT_SUFFIX } from 'actions/redirect';
import {
  EXTRACT_URL_SEGMENTS_RE,
  MARTY_URL_PREFIX_RE,
  NONZSO_SEARCH_RE,
  PAGE_NUMBER_IN_URL_RE,
  QUERY_PARAMS_RE_GEN,
  SEO_URL_RE,
  SLASH_SEARCH_RE,
  ZSO_URL_RE
} from 'common/regex';
import { looksLikeSeoUrl, seoTermToHumanTerm, termToSeoPath } from 'helpers/SeoUtils';
import { parsePath } from 'helpers/LocationUtils';
import layoutConfig from 'common/searchLayoutConfig';
import { stripAppRoot } from 'history/AppRootUtils';
import { priceToFloat } from 'helpers/ProductUtils';
import { guid } from 'helpers/guid';

const SEARCH_URL_WHITELISTED_PARAMS_LIST = [
  'p',
  'page',
  's',
  'si',
  'sort',
  'sy',
  't',
  'term'
];

/*
  Returns a String from the filter list that uniquely identifies the

  1. Applied filters
  2. Search term
  3. Sort order
  4. Page
*/
export function buildSearchFilterChecksum(filters) {
  const allFilters = Object.assign({}, filters.selected.singleSelects, filters.selected.multiSelects);
  return `${JSON.stringify(allFilters)}|${filters.term}|${JSON.stringify(filters.sort)}|${filters.page}`;
}

/**
 * Builds the "payload" field for search-related events.  Handles special characters, converts spaces to dashes, and lowercases the search term.  If there is no search term, it uses 'no-term' instead.
 */
export function buildSearchTermEventPayload(searchText) {
  if (searchText) {
    return sanitizeForEvent(searchText).toLowerCase();
  } else {
    return 'no-term';
  }
}

/**
 *  Returns a string with the page (1-indexed), row position (1-indexed), and column position (1-indexed) of the product.
 * @param  {Integer} filterPage              0 indexed page
 * @param  {Integer} productPosition         position in result (1 indexed)
 * @param  {String} [layoutId='three-item'] the layout Id for the rendered page
 * @return {String}                         String that has the computed row+column of the clicked product.
 */
export function formatProductClickEvent(filterPage, productPosition, layoutId = 'three-item') {
  const fallbackLayoutId = layoutId in layoutConfig ? layoutId : 'three-item';
  const { columnCount } = layoutConfig[fallbackLayoutId];
  const mod = productPosition % columnCount;
  return `Page${filterPage + 1}-Pos${Math.ceil(productPosition / columnCount)}-${mod === 0 ? columnCount : mod}`;
}

export function sanitizeHurlResponse(filter) {
  return decodeURIComponent(filter).replace(/"+/g, '').replace(/\+/g, ' ').split(' OR ');
}

export function buildFiltersObject(hurlFiltersUrl) {
  const result = {};
  const values = hurlFiltersUrl.split('/').filter(v => {
    if (v.length > 0 && v !== 'null' && v !== 'filter' && v !== 'search') {
      return v;
    }
  });

  if (values.length > 0) {
    values.forEach((el, i, arr) => {
      if (i % 2) {
        result[arr[i - 1]] = sanitizeHurlResponse(el);
      }
    });
  }
  return result;
}

function sanitizeSort(value) {
  return value === 'asc' || value === 'desc' ? value : 'desc';
}

export function decodeSort(sortQueryParam) {
  const sort = {};
  if (sortQueryParam) {
    const sortValue = sortQueryParam.replace(' ', '').split('/');
    Object.keys(sortValue).forEach(v => {
      const par = sortValue[v];
      const val = sortValue[parseInt(v, 10) + 1];
      if (v % 2 === 0 && par.length > 0) {
        sort[par] = sanitizeSort(val);
      }
    });
  }
  return sort;
}

export function locationLooksLikeNonNullQueryStringSearch({ pathname, query }) {
  return (pathname === '/search' || pathname === '/marty/search') && query?.term && ![null, 'null', ''].includes(query.term);
}

/**
 * Returns true if the pathname and query string look like a simple query
 * string search request.
 * @param  {String} pathname path of the request
 * @param  {String} search   query string of the request
 * @return {boolean}         true or false
 */
export function looksLikeQueryStringSearch(pathname, search) {
  return (pathname === '/search' || pathname === '/marty/search') && 'term' in parse(search);
}

export function isNullSearchUrl(location) {
  if (typeof location === 'string') {
    location = parsePath(location);
  }
  const queryObject = parse(location.search);
  return (location.pathname === '/search' || location.pathname === '/marty/search') && queryObject.term === '' && (queryObject.department === undefined || queryObject.department === '');
}

export function breakdownNonZso(path, search = '') {
  const fullPath = path + search;
  /*
  NONZSO_SEARCH_RE
  Regex from https://github01.zappos.net/SearchTeam/Helios/blob/master/src/main/webapp/WEB-INF/urlrewrite.xml#L224
  0: Full url
  1: Search term
  2: facets
  3: Original term
  4: Term lander
  5: page
  6: sort
  7: si
  8: sy
  9: debug
  10: noEncode
  11: nq
  12: pf_rd_r
  13: pf_rd_p
  14: remaining string
  */
  let response = { queryParams: {} };
  const urlParams = fullPath.match(NONZSO_SEARCH_RE);
  if (looksLikeQueryStringSearch(path, search)) {
    // just a query string term. some testing against desktop search revealed
    // that, with a search url of this format, other params (i.e. p, page, s,
    // sort) are completely ignored.
    const queryObj = parse(search);
    response.term = queryObj.term;
    response.filters = {};
    response.page = 0;
    response.sort = {};
    if (queryObj.pf_rd_p && queryObj.pf_rd_r) {
      response = {
        ...response,
        queryParams: {
          'pf_rd_r': queryObj.pf_rd_r,
          'pf_rd_p': queryObj.pf_rd_p
        }
      };
    }
  } else if (urlParams) {
    const pageNum = parseInt(urlParams[5], 10);
    response.term = urlParams[1] !== 'null' && urlParams[1] !== 'undefined' ? urlParams[1] : '';
    response.filters = urlParams[2] ? buildFiltersObject(urlParams[2]) : '';
    response.page = pageNum ? pageNum : 0;
    if (urlParams[7] && urlParams[8]) {
      response.si = urlParams[7].split('/');
      response.sy = urlParams[8];
    }
    if (urlParams[12] && urlParams[13]) {
      response = {
        ...response,
        queryParams: {
          'pf_rd_r': urlParams[12],
          'pf_rd_p': urlParams[13]
        }
      };
    }
    if (urlParams[14]) {
      const remainingParams = parse(urlParams[14]);
      response = { ...response, queryParams: remainingParams };
    }
    response.sort = urlParams[6] ? decodeSort(urlParams[6]) : {};
  }

  return response;
}

function sealObj(obj) {
  const arr = [];

  for (const k in obj) {
    arr.push(k);
    arr.push(obj[k]);
  }
  return arr.join('/');
}

/**
 * Returns true if the given url and filters object match in terms of criteria.
 * @param  {string} url     search url
 * @param  {object} filters filters object possibly containing term, selected, page and sort
 * @return {boolean}
 */
export function searchUrlMatchesFilters(url, filters) {
  return lookLikeSameSearchUrls(url, makeSearchUrl(filters));
}

/**
 * Return true if two search urls appear to have all the same criteria
 * @param  {string} url1 search url
 * @param  {string} url2 search url
 * @return {boolean}
 */
export function lookLikeSameSearchUrls(url1, url2) {
  return decodeURIComponent(url1) === decodeURIComponent(url2);
}

/**
 * Determines if you should be redirected to a /search/termlander page
 * based on the new page you're passing
 * @param {object} filters
 * @param {integer} page
 * @return {boolean}
 */

export function isJustTerm(filters, newPage) {
  const { selected, sort, si } = filters;
  const hasSort = Object.keys(sort || {}).length > 0;
  return (newPage === 0 || !newPage) && Object.keys(selected.singleSelects).length === 0 && Object.keys(selected.multiSelects).length === 0 && !hasSort && !si;
}

/**
 * Make a search url for a given set of filters. This function is deterministic.
 * Given the same set of filters it will always generate the same url.
 * @param  {object} filters object of filters containing selected, term, page and sort
 * @return {string}         search url
 */
export function makeSearchUrl(filters, v2 = false) {
  const baseUrl = v2 ? '/v2/Search' : '/search';
  const term = filters.term ? filters.term : null;
  const searchFilters = [];
  const combinedFilters = Object.assign({}, filters.selected.singleSelects, filters.selected.multiSelects);

  const filterNames = Object.keys(combinedFilters || {}).sort();
  if (filterNames.length) {
    filterNames.forEach(key => {
      const values = [].concat(combinedFilters[key]).sort(); // copy in case it's immutable, and sort
      if (values.length > 0) {
        const filterParams = `${key}/"${encodeURIComponent(values.join(' OR '))}"`;
        searchFilters.push(filterParams);
      }
    });
  } else {
    searchFilters.push('null');
  }

  const hasSort = Object.keys(filters.sort || {}).length > 0;
  const page = typeof filters.page !== 'undefined' ? filters.page : 0;

  if (isJustTerm(filters, page)) {
    return `${baseUrl}?term=${term !== null ? term : ''}`;
  }

  const sortString = hasSort ? `sort/${sealObj(filters.sort)}` : '';
  const si = filters.si ? `/si/${filters.si.join(',')}/sy/1` : '';
  return appendQuery(`${baseUrl}/${term}/filter/${searchFilters.join('/')}/page/${page}${sortString ? `/${sortString}` : ''}${si}`);
}

/**
  Organizes filters into single-selects vs multi-selects
  @param {object}
  @return {object} Filters: {singleSelects: {}, multiSelects: {}}
**/
export function organizeSelects(filters) {
  const selected = {
    singleSelects: {},
    multiSelects: {}
  };

  if (filters) {
    Object.keys(filters).forEach(v => {
      if (SINGLE_SELECT_FILTERS[v]) {
        selected.singleSelects[v] = filters[v];
      } else {
        selected.multiSelects[v] = filters[v];
      }
    });
  }

  return selected;
}

/**
 * Convert a sort string into an object
 * @param  {string} sortString sort string with "-" delimiting values
 * @return {object}            criteria
 */
export const sortStringToObject = sortString => {
  const keysAndValues = sortString
    .split('-')
    .filter(item => item !== '');
  const sortObj = {};
  const numIter = keysAndValues.length / 2;
  for (let i = 0; i < numIter; i++) {
    const index = i * 2;
    sortObj[keysAndValues[index]] = keysAndValues[index + 1];
  }
  return sortObj;
};

/**
 * Convert an non-zso location to a normalized search location. This normalized
 * search location can then be handled by fetchFromSearch. This is most useful
 * for converting potentially seo-url search locations to locations
 * understandable by fetchFromSearch.
 * @param  {object} location a location object
 * @return {object}          a new location object
 */
export const normalizeSearchLocation = location => {
  location = Object.assign({}, location, { pathname: location.pathname.replace(MARTY_URL_PREFIX_RE, '/') });
  if (location.pathname !== '/search') {
    const matches = location.pathname.match(SEO_URL_RE);
    if (matches && matches.length > 1) {
      return {
        ...location,
        pathname: '/search',
        search: `?term=${seoTermToHumanTerm(matches[1])}`
      };
    }
  }

  return location;
};

/**
* Appends new search param object to existing url
* @param {object} location location object
* @param {object} params new parameters
*/
export const createLocationWithParams = (pathname, params) => {
  const newPath = decodeURIComponent(appendQuery(pathname, params, { removeNull: true }));
  return newPath;
};

/**
 * Returns whether the given path is a pretty search url path or a slash (/search) path.
 * @param  {string}  path relative pathname to check
 * @return {Boolean}      true if the path is a pretty search or a slash search (/search) path.
 */
export function isPrettySearchOrSlashSearchPath(path) {
  return looksLikeSeoUrl(path) || SLASH_SEARCH_RE.test(path);
}

/**
 * Utility function for building a URL friendly search terms.
 * Takes a string, including special characters and converts it into a format that the search stack will handle in the /search/${term} format:
 * @param  {String} path  string of search term
 * @return {String} string of encoded search to be consumed by search API
 * Levi's®  ->  Levi%27s%C2%AE
*/
const encodableCharacters = new RegExp([
  '(?:[\0-\x1F"-&+-}\x7F-\uD7FF\uE000-\uFFFF]|',
  '[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|',
  '(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])'
].join(''), 'g');
export function termEncoder(path) {
  return path
    .replace(encodableCharacters, encodeURIComponent)
    .replace(/ /g, '%20')
    .replace(/[!'()~*]/g, ch => '%' + ch.charCodeAt().toString(16).slice(-2).toUpperCase());
}

export function pruneUrl(urlParam, whiteList) {
  const { url = '', query: parsedParams = {} } = parseUrl(urlParam || '');
  Object.keys(parsedParams).forEach(key => {
    parsedParams[key] = (whiteList || []).includes(key) ? parsedParams[key] : undefined; // stringify() will prune away keys with undefined values.
  });

  return [ url, stringify(parsedParams) ].join('?').replace(/\?$/, '');
}

function areUrlAndParametersEquivalent(url1, url2, whiteList) {
  return pruneUrl(url1, whiteList) === pruneUrl(url2, whiteList);
}

/**
  * Determines if search should be called on the client side inital visit
**/

export function shouldSearchServiceBeCalled(location, seoName, executedSearchUrl) {
  const currentUrl = stripAppRoot(location.pathname + location.search);

  // We should only call for initial products if:
  // (a) They haven't been to search before
  const newToSearch = !executedSearchUrl;
  // (b) They did not click the back button after faceting
  const backFromFaceting = SEO_URL_RE.test(location.pathname) && executedSearchUrl !== location.pathname;
  // (c) They are not returning to the same results
  const differentResults = !areUrlAndParametersEquivalent(executedSearchUrl, currentUrl, SEARCH_URL_WHITELISTED_PARAMS_LIST);
  // (d) Or they are not coming back from the product page to a seo url (ie /red-shoes?oosRedirected=true)
  const prodPageToSeoUrl = !seoName || !SEO_URL_RE.test(currentUrl.replace(OOS_REDIRECT_SUFFIX, ''));

  return newToSearch || backFromFaceting || (differentResults && !isNullSearchUrl(currentUrl) && prodPageToSeoUrl);
}

/**
  * compares query params from url vs query obj
  * @param {String} executedSearchUrl
  * @param {Object} query
*/
export function combineQueryParams(url = '', queryParams) {
  const queryParamArr = Object.keys(queryParams);
  if (queryParamArr.length > 0) {
    const missingParams = {};
    const executedQuery = url.match(QUERY_PARAMS_RE_GEN());
    if (executedQuery?.[0]) {
      const executedParams = parse(executedQuery[0]);
      for (const paramIndex in queryParamArr) {
        const param = queryParamArr[paramIndex];
        if (!executedParams[param]) {
          /*
            Site merch occassionally gives us dupe querystring params for pf_rd_p & pf_rd_r.
            Check if get an array instead of a string. If it's an array take the first one.
          */
          if (Array.isArray(queryParams[param])) {
            missingParams[param] = queryParams[param][0];
          } else {
            missingParams[param] = queryParams[param];
          }
        }
      }
      return appendQuery(url, missingParams);
    }
    return appendQuery(url, queryParams);
  }
  return url;
}

function updatePathPage(url, page) {
  if (page === 0) {
    return url.replace(PAGE_NUMBER_IN_URL_RE, '');
  } else {
    return url.includes('/page') ? url.replace(PAGE_NUMBER_IN_URL_RE, `/page/${page}`) : url.replace(EXTRACT_URL_SEGMENTS_RE, `$1/page/${page}$2$3`);
  }
}

export function makePageLink(filters, currentLocation, targetPage, hasSeoTermPages = false) {
  const { executedSearchUrl } = filters || {};
  if (executedSearchUrl) {
    if (hasSeoTermPages && isJustTerm(filters, targetPage)) {
      if (filters.term) {
        return termToSeoPath(filters.term);
      }
      return '/search?term=';
    }
    if (ZSO_URL_RE.test(executedSearchUrl)) {
      return createLocationWithParams(executedSearchUrl, { p: targetPage > 0 ? targetPage : null });
    } else {
      return updatePathPage(executedSearchUrl, targetPage);
    }
  } else if (currentLocation && typeof currentLocation === 'string') {
    return updatePathPage(currentLocation, targetPage);
  }
  return null;
}

/**
 * Converts current filters into an opal expect request
 * excludeFilter will remove a filter from the returned object
 * @param {object} filters
 * @param {string} excludeFilter
 * @return {Object or null}
 */

export function formatSavedFilters({ selected: { singleSelects, multiSelects }, savedsizes }, excludeFilter = null, wasSavedCookie = null) {
  const hasGender = singleSelects?.['txAttrFacet_Gender']?.length === 1;
  const hasZc1 = singleSelects?.['zc1'] && singleSelects.zc1.includes('Shoes');
  if (hasGender && hasZc1) {
    const { txAttrFacet_Gender: genderArr, ...allCategories } = singleSelects;
    const gender = genderArr[0];

    const sizes = Object.entries(savedsizes.filters).reduce((sizes, [key, values]) => {
      const shouldExcludeFilter = !excludeFilter || excludeFilter !== key;
      if ((shouldExcludeFilter || wasSavedCookie) && multiSelects[key]) {
        multiSelects[key].forEach(filterValue => {
          if (!sizes.some(v => v.value === filterValue)) {
            sizes.push({ name: key, value: filterValue });
          }
        });
      }

      if ((wasSavedCookie || !multiSelects[key]) && values.length) {
        values.forEach(filterValue => {
          if (!sizes.some(v => v.value === filterValue)) {
            sizes.push({ name: key, value: filterValue });
          }
        });
      }

      return sizes;
    }, []);

    const zetaCategories = Object.entries(allCategories).reduce((zetaCategories, [key, value]) => {
      zetaCategories[key] = value[0];
      return zetaCategories;
    }, {});

    return { gender, zetaCategories, sizes };
  }
  return null;
}

/**
 * Compares two arrays if they have the same values
 * @param {array}
 * @param {array}
 * @return {boolean}
 */
export function savedValuesMatch(arr1 = [], arr2 = []) {
  const sorted1 = [...arr1].sort();
  const sorted2 = [...arr2].sort();
  return sorted1.length === sorted2.length && sorted1.every((item, index) => item === sorted2[index]);
}

export function formatMicrosoftPixelData({ filters = {}, results = [] }) {
  const { page = 0, sort = {} } = filters;
  const formatPrice = price => {
    if (typeof price === 'string') {
      return priceToFloat(price);
    }
    return price;
  };

  const resultsItems = results.map(item => {
    const newItem = {
      id: item.styleId || '',
      price: item.price ? formatPrice(item.price) : '',
      brand: escape(item.brandName) || '',
      categories: [],
      available: true
    };

    if (item.originalPrice && item.originalPrice !== item.price) {
      newItem['on_sale'] = true;
      newItem.msrp = item.originalPrice;
    }

    return newItem;
  });

  let formattedFilters = [];
  if (filters.selected) {
    const singleSelects = Object.keys(filters.selected.singleSelects).map(v => ({ name: v, operator: 'in', value: filters.selected.singleSelects[v].join(', ') }));
    const multiSelects = Object.keys(filters.selected.multiSelects).map(v => ({ name: v, operator: 'in', value: filters.selected.multiSelects[v].join(', ') }));
    formattedFilters = [ ...singleSelects, ...multiSelects];
  }

  let sortVal = [ 'relevance/desc' ];
  if (Object.keys(sort)?.length) {
    sortVal = Object.keys(sort).map(v => `${v}/${sort[v]}`);
  }

  return { results: resultsItems, results_set: page + 1, filters: formattedFilters, sort_type: sortVal };
}

// We create, store, and set a unique id on the url so we can link the users from
// their session on one store to another.
export const crossSiteSellingUniqueIdentifier = guid();
