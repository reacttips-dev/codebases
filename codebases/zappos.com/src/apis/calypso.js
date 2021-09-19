import { parse, stringify } from 'query-string';
import appendQuery from 'append-query';

import timedFetch from 'middleware/timedFetch';
import marketplace from 'cfg/marketplace.json';
import { HYDRA_AUTO_FACET_SUGGESTION, HYDRA_COLOR_SWATCHES } from 'constants/hydraTests';
import { BRAND_URL_RE, FILTER_URL_RE } from 'common/regex';
import { makeQueryStringSearchTerm } from 'helpers';
import { cookieObjectToString } from 'helpers/Cookie';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { absolutifyItemImages } from 'helpers/productImageHelpers';
import { getAssignmentGroup, isAssigned } from 'actions/ab';

/**
 * Includes to be sent with all search requests
 */
export const COMMON_SEARCH_INCLUDES = [
  'productSeoUrl',
  'pageCount',
  'reviewCount',
  'productRating',
  'onSale',
  'isNew',
  'zsoUrls',
  'isCouture',
  'msaImageId',
  'brandRedirect',
  'facetPrediction',
  'phraseContext',
  'currentPage',
  'facets',
  'melodySearch',
  'styleColor',
  'seoBlacklist',
  'seoOptimizedData',
  'enableCrossSiteSearches'
];

const { search: { hasBestForYou, hasTermBasedOverride, usesImageMap, hasCollapsedSizes, hasMicrosoftAds, hasSingleShoes, hasCrossSiteSearches } } = marketplace;

/* Generates include params */
export const generateIncludes = appState => {
  const { filters: currentFilters } = appState;
  const hydraIncludes = [];
  const hydraAutoFacetSuggestion = getAssignmentGroup(HYDRA_AUTO_FACET_SUGGESTION, appState);
  const hydraColorSwatches = isAssigned(HYDRA_COLOR_SWATCHES, 1, appState);

  if (hydraColorSwatches) {
    hydraIncludes.push('groupProducts');
  }

  if (hasTermBasedOverride) {
    hydraIncludes.push('termLanderAutoFacetOverride');
    hydraIncludes.push('boostQueryOverride');
  }

  // Required for the HYDRA_BRAND_NAME_SEARCH test
  // Leave alone if making the test permanent; remove otherwise.
  hydraIncludes.push('brandRedirectWithResults');

  // onHand is a default includes in order to send isLowStock data to Amethyst
  hydraIncludes.push('onHand');

  if (hasBestForYou && currentFilters?.bestForYou) {
    hydraIncludes.push('enableBestForYouSort');
  }

  if (currentFilters?.autoFacetApplied && hydraAutoFacetSuggestion === 3) {
    hydraIncludes.push('autoFacetApplied');
  }

  if (hasBestForYou) {
    hydraIncludes.push('applySyntheticTwins');
  }

  if (hasBestForYou && currentFilters?.personalizedSize?.facets?.[0]?.selected) {
    hydraIncludes.push('enableSizeFilterPreference');
  }

  if (usesImageMap) {
    hydraIncludes.push('imageMap');
  }

  if (hasCollapsedSizes) {
    hydraIncludes.push('enableUniversalShoeSizeFacets');
  }

  if (currentFilters?.applySavedFilters) {
    hydraIncludes.push('enableExplicitSizeFilterPreference');
  }

  if (hasSingleShoes) {
    hydraIncludes.push('enableSingleShoes');
  }

  if (hasMicrosoftAds) {
    hydraIncludes.push('enableMsftAds');
  }

  if (hasCrossSiteSearches) {
    hydraIncludes.push('enableCrossSiteSearches');
  }

  return includesToString([ ...COMMON_SEARCH_INCLUDES, ...hydraIncludes ]);
};

export const makeQueryString = obj => appendQuery('', obj, { removeNull: true });

export const makeCalypsoOptions = function(cookies, { client }) {
  const config = {
    method: 'get',
    credentials: 'include', // only good for clientside
    headers: {
      'Cookie': cookieObjectToString(cookies) // only good for serverside
    }
  };

  /**
   * Proxying server-side headers for microsft ads (msft)
   */
  if (client?.request) {
    const { clientIp, clientUserAgent } = client.request;
    config.headers['User-Agent'] = clientUserAgent;
    config.headers['X-Forwarded-For'] = clientIp;
  }

  return config;
};

/**
 * Convert a list of includes to a includes query param value
 * @param  {string[]} includes          list of fields to include
 * @param  {string[]} moreIncludes=[]]  additional includes to join before converting to param value
 * @return {string}                     includes querystring param value
 */
export const includesToString = (includes, moreIncludes = []) => {
  const includesStr = includes
    .concat(moreIncludes)
    .map(item => `"${item}"`)
    .join(',');
  return `[${includesStr}]`;
};

/**
 * Preprocess the criteria and build request components for a slash search request
 * @param {object}  criteria  search criteria
 * @return {object}           preprocessed criteria
 */
export const slashSearchPreprocessor = ({ location, page: criteriaPage, limit = 100, siteId, subsiteId }, state) => {
  const { page, sort, term } = parse(location.search);
  const limitFragment = `/limit/${limit}`;
  let paramUpdate;

  const includes = generateIncludes(state);

  if (location.pathname.indexOf('.zso') > -1) {
    paramUpdate = `/Search/zso${location.pathname}`;
  } else {
    if (location.pathname === '/search' || term || page || sort) {
      paramUpdate = `/Search/${encodeURIComponent(term || null)}${page ? `/page/${encodeURIComponent(page)}` : ''}${limitFragment}${sort ? `/sort/${sort}` : ''}`;
    } else if (BRAND_URL_RE.test(location.pathname)) {
      const cleanedPath = location.pathname.replace(FILTER_URL_RE, '');
      const filterParams = cleanedPath.match(BRAND_URL_RE);
      const extraParams = filterParams[2] ? `/${filterParams[2]}` : '';
      paramUpdate = `/Search/${term || null}/filter/brandId/${filterParams[1]}${extraParams}`;
    } else {
      const newPage = criteriaPage + 1;
      paramUpdate = location.pathname
        .replace(/\/page\/(?:\d+)/gi, `/page/${newPage}`)
      // patron required the limit to appear before sort.. not sure if still true w/ calypso
        .replace(/(\/sort\/|$)/, (match, sort) =>
          ((sort)
            ? `${limitFragment}/sort/` // there is already a sort so just include the limit
            : limitFragment) // add limit
        )
        .replace(/(^|\/)[sS](earch)(.*)/, (val, m1, m2, m3) =>// 'search' either beginning of string or preceeded with '/'
        // make search uppercase and add ending / if missing
          `${m1}S${m2}${m3[0] !== '/' ? `/${m3}` : m3}`
        )
        .replace('&', '%26');
    }
  }

  return {
    path: `v2${paramUpdate}`,
    query: makeQueryString({
      includes,
      relativeUrls: true,
      siteId,
      subsiteId
    })
  };
};

/**
 * Preprocess the criteria and build request components for a zso search request
 * @param {object}  criteria  search criteria
 * @return {object}           preprocessed criteria
 */
export const zsoSearchPreprocessor = ({ path, query = {}, limit = 100, siteId, subsiteId }, state) => {
  const { si, sy } = query;

  const includes = generateIncludes(state);

  const newQuery = {
    limit,
    includes,
    relativeUrls: 'true',
    siteId,
    subsiteId
  };

  const page = query.page || query.p;
  if (page) {
    newQuery['page'] = parseInt(page, 10) + 1;
  }

  ['s', 't', 'ot'].forEach(param => {
    if (typeof query[param] !== 'undefined' && query[param] !== '') {
      newQuery[param] = param === 't' ? makeQueryStringSearchTerm(query[param]) : query[param];
    }
  });

  if (si) {
    newQuery['si'] = si;
    if (sy === '1') {
      newQuery['sy'] = 1;
    }
  }

  return {
    path: `Search/zso${path}`,
    query: makeQueryString(newQuery)
  };
};

/**
 * Execute a product Search and return a promise.
 * @param  {object}   calypso          calypso configuration
 * @param  {object}   criteria         request path and query
 * @param  {function} [fetcher=fetch]  fetch or fetch like implementation
 * @return {object}                    promise
 */
export const slashSearchProducts = ({ url, siteId, subsiteId }, criteria, cookies, state, fetcher = timedFetch('calypsoSearch')) => {
  const { path, query } = slashSearchPreprocessor({ ...criteria, siteId, subsiteId }, state);

  return fetcher(`${url}/${path}${query}`, makeCalypsoOptions(cookies, state));
};

/**
 * Execute a ZSO Search and return a promise.
 * @param  {object}   calypso          calypso configuration
 * @param  {object}   location         request path and query
 * @param  {function} [fetcher=fetch]  fetch or fetch like implementation
 * @return {object}                    promise
 */
export const zsoSearchProducts = ({ url, siteId, subsiteId }, criteria, cookies, state, fetcher = timedFetch('calypsoZsoSearch')) => {
  const { path, query } = zsoSearchPreprocessor({ ...criteria, siteId, subsiteId }, state);

  return fetcher(`${url}/${path}${query}`, makeCalypsoOptions(cookies, state));
};

export function fetchSearchSimilarity(url, { styleId, type, page, subsiteId, limit, opts }, fetcher = timedFetch('searchSimilarity')) {
  const { imageServerUrl } = opts;
  return fetcher(`${url}/Search/Similarity/type/${type}?relativeUrls=true&styleId=${styleId}&limit=${limit}&subsiteId=${subsiteId}&page=${page}`)
    .then(fetchErrorMiddleware)
    .then(recoResponse => {
      if (recoResponse && recoResponse.results) {
        absolutifyItemImages(recoResponse.results, imageServerUrl);
      }
      return recoResponse;
    });
}

export function searchAutoComplete({ url, siteId, subsiteId }, { term, categories }, fetcher = timedFetch('searchAutoComplete')) {
  return fetcher(`${url}/hesiod/autocomplete/${encodeURIComponent(term)}?${stringify({ categories, siteId, subsiteId })}`);
}
