import queryString from 'query-string';

import {
  ADD_TO_HEART_ID_LIST,
  BLACKLISTED_SEARCH,
  CLEAR_SEARCH_INLINE_RECOS,
  RECEIVE_AND_DEFER_SEARCH_RESPONSE,
  RECEIVE_HEART_COUNTS,
  RECEIVE_SEARCH_INLINE_RECOS,
  RECEIVE_SEARCH_RECOS,
  RECEIVE_SEARCH_RESPONSE,
  REMOVE_FROM_HEART_ID_LIST,
  REQUEST_SEARCH,
  RESET_PRODUCTS,
  SERIALIZE_STATE,
  SET_SEARCH_OOS_MESSAGING,
  TYPED_SEARCH,
  UPDATE_SEARCH_LIMIT
} from 'constants/reduxActions';
import marketplace from 'cfg/marketplace.json';
import { ABSOLUTE_URL_RE, ZSO_URL_RE } from 'common/regex';
import { looksLikeSeoUrl, termToSeoPath } from 'helpers/SeoUtils';
import { parsePath } from 'helpers/LocationUtils';
import { buildBase64EncodedSearchResultsMetaData } from 'helpers/ZfcMetadata';
import { normalizeToPatronLikeProduct } from 'helpers/RecoUtils';

const { search: { hasSeoUrls, searchLimit, hasOnlyZsoUrls } } = marketplace;

const initialState = {
  totalProductCount: null,
  isLoading:false,
  requestedUrl: null,
  executedSearchUrl: null,
  noResultsRecos: [],
  inlineRecos: null,
  oosMessaging: null,
  heartsList: {},
  productLimit: searchLimit,
  list: [],
  allProductsCount: 0,
  isBlacklisted: false,
  trustedRetailers: [],
  msftResults: {
    impressionUrl: '',
    results: []
  }
};

export const removeRedirectQueryParam = requestedUrl => {
  const [urlWithoutQuery, urlQuery] = requestedUrl.split('?');
  if (!urlQuery) {
    return requestedUrl;
  }
  const params = queryString.parse(urlQuery);
  delete params.redirect;
  const newQueryPercentTwenties = queryString.stringify(params, {
    sort: (a, b) => urlQuery.indexOf(`${a}=${params[a]}`) - urlQuery.indexOf(`${b}=${params[b]}`)
  });
  if (newQueryPercentTwenties.length) {
    const newQuery = newQueryPercentTwenties.replace(/%20/g, '+');
    return `${urlWithoutQuery}?${newQuery}`;
  }
  return urlWithoutQuery;
};

const getExecutedSearchUrl = (requestedUrl, executedUrl, autocorrect) => {
  let newUrl = executedUrl;

  if (!autocorrect && !hasOnlyZsoUrls && hasSeoUrls) {
    const location = parsePath(requestedUrl);
    const queryParams = queryString.parse(location.search);

    if (location.pathname === '/search' && queryParams.term === '') {
      newUrl = requestedUrl;
    } else if (location.pathname === '/search' && queryParams.term) {
      newUrl = termToSeoPath(queryParams.term);
    } else if (looksLikeSeoUrl(location.pathname)) {
      newUrl = location.pathname;
    }
  }

  return newUrl;
};

export const removeHeartsAndStars = sponsoredResults => sponsoredResults.map(sponsoredProduct => ({ ...sponsoredProduct, hearts: {}, productRating: null, reviewRating: null }));

// Return single array of trustedRetailer items and sanitize
export const formatTrustedRetailers = trustedRetailersObj => Object.keys(trustedRetailersObj).reduce((acc, store) => {
  const storeItems = trustedRetailersObj[store].map(v => {
    const storeBase = `https://www.${store}.com`;
    return {
      ...v,
      storeName: store, // add store key so we know which product is from which store
      storeUrl: storeBase,
      isTrustedRetailer: true,
      productUrl: ABSOLUTE_URL_RE.test(v.productUrl) ? v.productUrl : `${storeBase}${v.productUrl}`, // these urls come back relative
      productSeoUrl: ABSOLUTE_URL_RE.test(v.productSeoUrl) ? v.productSeoUrl : `${storeBase}${v.productSeoUrl}`
    };
  });
  return acc.concat(storeItems);
}, []);

export const products = (state = initialState, action) => {
  const { type, isFresh, response, url, heartsList, styleId, limit, deferredSearchResponse, term } = action;
  const newHeartList = { ...state.heartsList };
  switch (type) {
    case TYPED_SEARCH:
      return Object.assign({}, state, { requestedUrl: initialState.requestedUrl, executedSearchUrl: initialState.executedSearchUrl });
    case REQUEST_SEARCH:
      return Object.assign({}, (isFresh ? initialState : state), { isLoading: true, requestedUrl: url, executedSearchUrl: ZSO_URL_RE.test(url) ? url : initialState.executedSearchUrl });
    case RECEIVE_SEARCH_RESPONSE:
      if (state.requestedUrl === response.url) {
        const { sponsoredResults } = response;

        // We must support both new and old msft responses until Calypso cuts over (#14853)
        let newSponsoredResults;
        if (!sponsoredResults?.results) {
          newSponsoredResults = {
            impressionUrl: sponsoredResults?.[0]?.impressionUrl || '',
            results: removeHeartsAndStars(sponsoredResults)
          };
        } else {
          newSponsoredResults = { ...sponsoredResults, results: removeHeartsAndStars(sponsoredResults.results) };
        }

        const requestedUrlWithoutRedirectParam = removeRedirectQueryParam(state.requestedUrl);
        const products = response.shouldAppendResults ? state.list.concat(response.results) : response.results;
        const executedSearchUrl = getExecutedSearchUrl(requestedUrlWithoutRedirectParam, response.executedSearchUrl, response.autocorrect);
        const trustedRetailers = response.trustedretailers ? formatTrustedRetailers(response.trustedretailers) : [];
        return Object.assign({}, state, {
          isLoading: false,
          totalProductCount: parseInt(response.totalResultCount, 10),
          allProductsCount: (products.length + trustedRetailers.length),
          list: products,
          executedSearchUrl,
          title: response.titleTag,
          h1: response.honeTag,
          msftResults: newSponsoredResults,
          zfcMetadata: buildBase64EncodedSearchResultsMetaData(response),
          trustedRetailers
        });
      }
      return state;
    case RESET_PRODUCTS:
      return Object.assign({}, state, { isLoading: true, list: [] });
    case RECEIVE_SEARCH_RECOS:
      const formattedRecos = {
        title: response.title,
        recos: response.recs.map(reco => normalizeToPatronLikeProduct(reco, response.recoName))
      };
      return Object.assign({}, state, { noResultsRecos: formattedRecos });
    case RECEIVE_SEARCH_INLINE_RECOS:
      const formattedInlineRecos = {
        title: response.title,
        algoName: response.algoName,
        recoName: response.recoName,
        recos: response.sims.map(reco => normalizeToPatronLikeProduct(reco, response.recoName))
      };
      return Object.assign({}, state, { inlineRecos: formattedInlineRecos });
    case CLEAR_SEARCH_INLINE_RECOS:
      return Object.assign({}, state, { inlineRecos: null });
    case SET_SEARCH_OOS_MESSAGING:
      return Object.assign({}, state, { oosMessaging: response });
    case RECEIVE_HEART_COUNTS:
      return { ...state, heartsList: { ...state.heartsList, ...heartsList } };
    case REMOVE_FROM_HEART_ID_LIST:
      newHeartList[styleId] = newHeartList[styleId] ? newHeartList[styleId] - 1 : 0;
      return { ...state, heartsList: newHeartList };
    case ADD_TO_HEART_ID_LIST:
      newHeartList[styleId] = newHeartList[styleId] ? newHeartList[styleId] + 1 : 1;
      return { ...state, heartsList: newHeartList };
    case UPDATE_SEARCH_LIMIT:
      return { ...state, productLimit: parseInt(limit, 10) };
    case RECEIVE_AND_DEFER_SEARCH_RESPONSE:
      return { ...state, deferredSearchResponse };
    case SERIALIZE_STATE:
      const newState = { ...state };
      delete newState.deferredSearchResponse;
      return newState;
    case BLACKLISTED_SEARCH:
      return { ...state, executedSearchUrl: termToSeoPath(term), requestedUrl: termToSeoPath(term), isLoading: false, isBlacklisted: true };
    default:
      return state;
  }
};

export default products;
