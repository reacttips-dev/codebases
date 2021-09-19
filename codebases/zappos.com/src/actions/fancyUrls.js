import { parse } from 'query-string';
import appendQuery from 'append-query';

import {
  HYDRA_BRAND_NAME_SEARCH,
  HYDRA_COLOR_SWATCHES
} from 'constants/hydraTests';
import { SINGLE_SHOE_COOKIE } from 'constants/cookies';
import { err, setError } from 'actions/errors';
import { generateSeoOptimizedData } from 'actions/seoOptimizedData';
import { setAndStoreCookie } from 'actions/session';
import { stripAppRoot } from 'history/AppRootUtils';
import { clearSavedFilters, updateSavedFilters } from 'actions/search';
import { fireSearchPixels, receiveAndDeferSearchResponse, receiveSearchResponse, requestSearch } from 'actions/products';
import { makeQueryStringSearchTerm } from 'helpers';
import { breakdownNonZso, combineQueryParams, formatSavedFilters } from 'helpers/SearchUtils';
import { convertPageParamToUrlPath } from 'helpers/ClientUtils';
import { buildSeoBrandString } from 'helpers/SeoUrlBuilder';
import {
  slashSearchProducts,
  zsoSearchProducts
} from 'apis/calypso';
import { deleteFiltersFromOpal, saveFiltersToOpal } from 'apis/opal';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import marketplace from 'cfg/marketplace.json';
import { redirectTo } from 'actions/redirect';
import { blacklistedSearch } from 'actions/blacklistedSearch';
import { getAssignmentGroup, triggerAssignment } from 'actions/ab';
import { OOS_REDIRECTED_RE, ZSO_URL_RE } from 'common/regex';
import { receiveAutoCompleteProducts, requestAutoCompleteProducts } from 'zen/ducks/search/actions';

const {
  search: { codesTo404, hasBrandRedirects, hasSingleShoes }
} = marketplace;

export function formatGenderValueForSearchPixel(v) {
  return (
    v.toLowerCase()
      .replace(/^(wo)?men'?s$/, '$1men')
      .replace(/^kid('s)?$/, 'kids')
  );
}

/** helper function for pulling facet data out of the state for the search pixel */
export function makeSearchPixelFacetDataFromState(state) {
  const ret = {};

  // eslint-disable-next-line camelcase
  const genderFacet = state.filters?.selected?.singleSelects?.txAttrFacet_Gender;
  if (genderFacet && genderFacet.length === 1) {
    ret.gender = formatGenderValueForSearchPixel(genderFacet[0]);
  }

  const singleSelectZc1 = state.filters?.selected?.singleSelects?.zc1;
  if (singleSelectZc1) {
    ret.subcategories = singleSelectZc1;
  }
  if (!ret.subcategories) {
    const facets = state.facets?.toDisplay;
    if (facets?.length > 0) {
      const zc1List = facets.find(f => f.facetField === 'zc1');
      if (zc1List) {
        ret.subcategories = zc1List.values.map(obj => obj.name);
      }
    }
  }

  if (ret.subcategories?.length === 1) {
    const category = ret.subcategories[0];
    if (!/\s/.test(category)) {
      ret.category = category.toLowerCase();
    }
  }

  return ret;
}

/**
* Determines if a failed calypso call should 404
*/
export function translatePatronErrorCode(statusCode) {
  return codesTo404.indexOf(statusCode) >= 0 ? 404 : 500;
}

/**
 * Get number of trusted retailer items from trustedretailer calypso object.
 * @param {Object} trustedRetailers Ex: { vrsnl: [ ...products ], findzen: [ ...products ] }
*/
export function getNumberOfTrustedRetailerProducts(trustedRetailers) {
  if (!trustedRetailers) {
    return 0;
  }
  return Object.values(trustedRetailers)
    .reduce((acc, storeProducts) => acc + storeProducts.length, 0);
}

/**
 * Dispatches a custom event intended for the ZFGA stack to control the text of the header term.
 * @param {String} term to set the header search to.
 * @param {Document} doc The doucment to dispatch the event from.
*/
export function setHeaderSearchTerm(term, doc = document, EventConstructor = CustomEvent) {
  doc.dispatchEvent(new EventConstructor('marty_set_search', { 'detail': { searchTerm: term } }));
}

export const shouldRedirectToPdp = location => parse(location.search)?.term || OOS_REDIRECTED_RE.test(location.search);

// Filter out trustedretailers that aren't in the validCrossSiteSearchStores whitelist. Also filter products from brands white & black lists whitelist.
export const filterTrustedRetailers = (trustedRetailers = {}, validCrossSiteSearchStores = [], crossSiteSearchBrandsWhitelist = [], crossSiteSearchBrandsBlacklist = []) => (
  Object.keys(trustedRetailers).reduce((obj, store) => {
    // First only add products from stores that are on our whitelist (ex: vrsnl, findzen)
    if (validCrossSiteSearchStores.includes(store)) {
      obj[store] = trustedRetailers[store];
    }
    // Then look for a brands whitelist and filter those products
    if (crossSiteSearchBrandsWhitelist.length && obj[store]) {
      obj[store] = obj[store].reduce((acc, product) => {
        if (crossSiteSearchBrandsWhitelist.includes(product.brandName)) {
          acc.push(product);
        }
        return acc;
      }, []);
    }
    // If no whitelist and a blacklist present, filter those products
    if (!crossSiteSearchBrandsWhitelist.length && crossSiteSearchBrandsBlacklist.length && obj[store]) {
      obj[store] = obj[store].reduce((acc, product) => {
        if (!crossSiteSearchBrandsBlacklist.includes(product.brandName)) {
          acc.push(product);
        }
        return acc;
      }, []);
    }
    return obj;
  }, {})
);

/**
 * Fetch search results and facets from a slash route
 * @param  {object}   location                             location object
 * @param  {function} [searchProducts=slashSearchProducts] slashSearch api call function
 * @return {object}                                        promise
 */
export function fetchFromSearch({ location, isFresh, limit = null, bypassCache = false, shouldAppendResults = false, searchProducts = slashSearchProducts, isSearchHappeningServerSide }) {
  return (dispatch, getState) => {
    const appState = getState();
    const {
      environmentConfig: { api: { calypso } },
      filters: currentFilters,
      cookies,
      products: { productLimit }
    } = appState;
    const { term, selected: { singleSelects }, urlFilterMapping: filterCache, wasSaveFiltersToggled } = currentFilters;
    const path = stripAppRoot(location.pathname).replace('/filters', '');
    const completeUrl = path + location.search;
    const filterForPath = filterCache[completeUrl];
    const parsedParams = breakdownNonZso(location.pathname, location.search);

    if (singleSelects?.zc1 && !term) {
      triggerAssignment(HYDRA_COLOR_SWATCHES);
    }

    if (filterForPath && !bypassCache && !wasSaveFiltersToggled) {
      return Promise.resolve();
    } else {
      dispatch(requestSearch({ url: completeUrl, isFresh }));
      const cleanLocation = Object.assign({}, location, { pathname: path });
      const criteria = { location: cleanLocation, page: parsedParams.page, limit: limit || productLimit };

      return searchProducts(calypso, criteria, cookies, appState)
        .then(fetchErrorMiddleware)
        .then(response => {
          const { results, totalResultCount, trustedretailers } = response;
          const hasOneProduct = totalResultCount === 1;
          const trustedRetailerProductCount = getNumberOfTrustedRetailerProducts(trustedretailers);
          /*
            If we have:
              - A search `term` param
              - No OOS param
              - One product, including crossSite/trustedRetailer products
            Then we will want to redirect to the PDP page instead of search results.
          */
          if (shouldRedirectToPdp(location) && hasOneProduct && !trustedRetailerProductCount) {
            return dispatch(redirectTo(results[0].productSeoUrl));
          } else {
            processReceivedSearchResponse(response, dispatch, getState, parsedParams, completeUrl, shouldAppendResults, isSearchHappeningServerSide);
          }
        }).catch(e => dispatch(setError(err.GENERIC, e, translatePatronErrorCode(e.status))));
    }
  };
}

export function processReceivedSearchResponse(response, dispatch, getState, parsedParams, completeUrl, shouldAppendResults, isSearchHappeningServerSide = false, hydraBrandNameSearchValue = 0) {

  if (isSearchHappeningServerSide) {
    dispatch(receiveAndDeferSearchResponse({ response, parsedParams, completeUrl }));
    return;
  }

  const originalTerm = response.originalTerm || parsedParams.originalTerm || '';
  if (response.blacklisted) {
    dispatch(blacklistedSearch(originalTerm));
    return;
  }

  if (response.brandRedirect) {
    dispatch(triggerAssignment(HYDRA_BRAND_NAME_SEARCH));
  }

  const appState = getState();
  const {
    cookies = {},
    filters: { page },
    killswitch: { validCrossSiteSearchStores = [], crossSiteSearchBrandsWhitelist, crossSiteSearchBrandsBlacklist } = {}
  } = appState;
  const isRecognizedCustomer = !!cookies['x-main'];
  const hydraBrandNameSearch = getAssignmentGroup(HYDRA_BRAND_NAME_SEARCH, appState) || hydraBrandNameSearchValue;

  const { sort, filters, page: paramPage } = parsedParams;
  // If I don't clone these objects before using them with Object.keys() below,
  // one or more fetchFromSearch tests will fail.  What gives.
  const paramSortLength = Object.keys({ ...sort }).length;
  const paramFiltersLength = Object.keys({ ...filters }).length;
  const pageAndFiltersSpecified = !!(paramSortLength || paramFiltersLength || paramPage);

  const shouldDoBrandRedirect = hasBrandRedirects && (hydraBrandNameSearch === 0) || (hydraBrandNameSearch === 1 && !isRecognizedCustomer);

  if (response.brandRedirect && shouldDoBrandRedirect && !pageAndFiltersSpecified) {
    dispatch(redirectTo(buildSeoBrandString(response.brandRedirect.name, response.brandRedirect.id), 301));
  } else {
    const term = response.term || '';
    const { executedSearchUrl: originalExecutedSearchUrl } = response;
    let executedSearchUrl = ZSO_URL_RE.test(originalExecutedSearchUrl) ? originalExecutedSearchUrl : convertPageParamToUrlPath(originalExecutedSearchUrl);

    if (parsedParams.queryParams) {
      executedSearchUrl = appendQuery(executedSearchUrl, parsedParams.queryParams, { encodeComponents: false });
    }

    const seoOptimizedData = generateSeoOptimizedData(response);

    if (validCrossSiteSearchStores.length && response.trustedretailers instanceof Object) {
      response.trustedretailers = filterTrustedRetailers(response.trustedretailers, validCrossSiteSearchStores, crossSiteSearchBrandsWhitelist, crossSiteSearchBrandsBlacklist);
    }

    if (response?.singleShoeRedirect && hasSingleShoes) {
      const { cookies } = appState;
      const isRecognizedCustomer = !!cookies['x-main'];
      const curRedirectCount = cookies[SINGLE_SHOE_COOKIE];
      const newCookieVal = isRecognizedCustomer && curRedirectCount ? parseInt(curRedirectCount, 10) + 1 : 1;
      if (newCookieVal < 4) {
        if (isRecognizedCustomer) {
          // expire cookie in a month
          const curDate = new Date();
          curDate.setDate(curDate.getDate() + 30);
          dispatch(setAndStoreCookie(SINGLE_SHOE_COOKIE, newCookieVal, curDate));
        }
        dispatch(redirectTo(response.singleShoeRedirect));
      }
    }

    const resp = {
      ...response,
      executedSearchUrl,
      originalTerm,
      seoOptimizedData,
      term,
      customerPreferences: response.customerPreferences || null,
      sort: getAppliedSort(parsedParams, response),
      url: completeUrl,
      page,
      shouldAppendResults
    };

    dispatch(receiveSearchResponse(resp));
    const state = getState();
    const pixelFacetData = makeSearchPixelFacetDataFromState(state);
    dispatch(fireSearchPixels(term, state.products.list, pixelFacetData, state.filters));
  }
  return response;
}

/**
 * Pulls the sort parameters off of the search response, if it exists, otherwise uses the sort provided by the input query.
 * @param  {Object} parsedParams   THe search parameters pulled from a location URL.
 * @param  {Object} searchResponse The slash search api response
 * @return {Object}                sort object with keys being the field and value being the direction
 */
function getAppliedSort(parsedParams, searchResponse) {
  if (searchResponse.sorts && searchResponse.sorts.length) {
    const sortVal = {};
    searchResponse.sorts.forEach(sortObj => sortVal[sortObj.field] = sortObj.direction);
    return sortVal;
  }
  return parsedParams.sort;
}

/**
 * Fetch search results and facets from a ZSO
 * @param  {object}   location                      location object
 * @param  {function} [zsoSearch=zsoSearchProducts] zsoSearch api call function
 * @return {object}                                 promise
 */
export function fetchFromZso({ location, isFresh, bypassCache = false, shouldAppendResults = false, zsoSearch = zsoSearchProducts, hydraBrandNameSearchValue = 0 }) {
  return (dispatch, getState) => {
    const appState = getState();
    const {
      environmentConfig: { api: { calypso } },
      filters: { term, selected: { singleSelects }, urlFilterMapping: filterCache },
      cookies,
      products: { productLimit },
      pageView: { clientRoutedUrls = [] },
      killswitch: { validCrossSiteSearchStores = [], crossSiteSearchBrandsWhitelist, crossSiteSearchBrandsBlacklist } = {}
    } = appState;

    const path = stripAppRoot(location.pathname);
    const query = parse(location.search);
    const completeUrl = path + location.search;
    const filterForPath = filterCache[completeUrl];
    const hydraBrandNameSearch = getAssignmentGroup(HYDRA_BRAND_NAME_SEARCH, appState) || hydraBrandNameSearchValue;
    const isRecognizedCustomer = !!cookies['x-main'];

    const criteria = { path, query, limit: productLimit };

    if (singleSelects?.zc1 && !term) {
      triggerAssignment(HYDRA_COLOR_SWATCHES);
    }

    if (filterForPath && !bypassCache) {
      return Promise.resolve();
    } else {
      dispatch(requestSearch({ url: completeUrl, isFresh }));
      return zsoSearch(calypso, criteria, cookies, appState)
        .then(fetchErrorMiddleware)
        .then(response => {
          const pageAndSortSpecified = !!(
            (query.s?.length && query.s !== 'bestForYou/desc') // Check if sort param present and not default
            || query.p?.length // Check if current url has a page param
            || /p=\d+/.test(clientRoutedUrls[0]?.url) // Check if last page has a page param
          );

          const shouldDoBrandRedirect = hasBrandRedirects && (hydraBrandNameSearch === 0) || (hydraBrandNameSearch === 1 && !isRecognizedCustomer);
          if (response.brandRedirect && shouldDoBrandRedirect && !pageAndSortSpecified) {
            dispatch(redirectTo(buildSeoBrandString(response.brandRedirect.name, response.brandRedirect.id), 301));
          } else {
            const { t, ot } = query;
            const term = makeQueryStringSearchTerm(t || ot || '');
            const executedSearchUrl = combineQueryParams(response.executedSearchUrl, query);
            const seoOptimizedData = generateSeoOptimizedData(response);

            if (validCrossSiteSearchStores.length && response.trustedretailers instanceof Object) {
              response.trustedretailers = filterTrustedRetailers(response.trustedretailers, validCrossSiteSearchStores, crossSiteSearchBrandsWhitelist, crossSiteSearchBrandsBlacklist);
            }

            const resp = {
              ...response,
              executedSearchUrl,
              term,
              seoOptimizedData,
              customerPreferences: response.customerPreferences || null,
              sort: getAppliedSort({ sort: {} }, response),
              url: completeUrl,
              shouldAppendResults
            };

            dispatch(receiveSearchResponse(resp));
            const state = getState();
            const pixelFacetData = makeSearchPixelFacetDataFromState(state);
            dispatch(fireSearchPixels(term, state.products.list, pixelFacetData, state.filters));
          }
          return response;
        }).catch(e => dispatch(setError(err.GENERIC, e, translatePatronErrorCode(e.status))));
    }
  };
}

export function callSearchFromInput(input, searchProducts = slashSearchProducts) {
  return (dispatch, getState) => {
    const appState = getState();
    const {
      environmentConfig: { api: { calypso } },
      cookies
    } = appState;

    dispatch(requestAutoCompleteProducts());

    const criteria = { location: { pathname: `/search/${encodeURIComponent(input)}`, search: '' }, page: 0, limit: 8 };

    return searchProducts(calypso, criteria, cookies, appState)
      .then(fetchErrorMiddleware)
      .then(response => {
        dispatch(receiveAutoCompleteProducts(response));
      });
  };
}

export function saveFilters(excludeFilter, wasSavedCookie, saveCustomerFilters = saveFiltersToOpal) {
  return (dispatch, getState) => {
    const appState = getState();
    const {
      environmentConfig: { api: { opal } },
      filters
    } = appState;

    const organizedFilters = formatSavedFilters(filters, excludeFilter, wasSavedCookie);
    if (organizedFilters) {
      return saveCustomerFilters(opal, { savedsizes: filters.savedsizes, organizedFilters })
        .then(fetchErrorMiddleware)
        .then(response => {
          if (response?.id) {
            dispatch(updateSavedFilters(response, filters.savedsizes.filters));
          }
        });
    }
  };
}

export function deleteSavedFilters(id, deleteCustomerFilters = deleteFiltersFromOpal) {
  return (dispatch, getState) => {
    const appState = getState();
    const {
      environmentConfig: { api: { opal } }
    } = appState;

    if (id) {
      return deleteCustomerFilters(opal, id).then(() => {
        dispatch(clearSavedFilters());
      });
    }
  };
}
