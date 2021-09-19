import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ExecutionEnvironment from 'exenv';
import { parse } from 'query-string';
import { deepEqual } from 'fast-equals';

// constants & regex
import {
  NON_SEARCH_PREFIXES,
  NULL_SEARCH_RE,
  PRODUCT_ASIN,
  SLASH_SEARCH_RE,
  ZSO_URL_RE,
  ZSO_URL_WITH_FILTERS_RE
} from 'common/regex';
// actions
import { setError } from 'actions/errors';
import { redirectWithAppRoot } from 'actions/redirect';
import usePrevious from 'hooks/usePrevious';
import { fetchFromSearch, fetchFromZso, processReceivedSearchResponse } from 'actions/fancyUrls';
import NoSearchResults from 'components/search/NoSearchResults';
import useMartyContext from 'hooks/useMartyContext';
// resources
import { productBundle } from 'apis/cloudcatalog';
import { logDebug } from 'middleware/logger';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { FetchError, fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import ProductUtils from 'helpers/ProductUtils';
import { isDesktop } from 'helpers/ClientUtils';
import {
  isPrettySearchOrSlashSearchPath,
  makeSearchUrl,
  normalizeSearchLocation,
  shouldSearchServiceBeCalled
} from 'helpers/SearchUtils';

const SearchLogic = props => {
  // marketplace
  const {
    router,
    marketplace: {
      search: { showHorizontalInlineSearchRecos, oosMessaging, hasCrossSiteSearches, useAutoCorrect },
      checkout: { allowMoveToFavorites },
      hasBannerAds
    }
  } = useMartyContext();

  const {
    children,
    location,
    setHFSearchTerm,
    filters,
    fetchSearchInlineRecos,
    clearInlineRecos,
    setOosMessaging,
    getHearts,
    pageTypeChange,
    fetchSymphonySearchComponents,
    fetchLandingPageInfo,
    getHeartCounts,
    hydraMicrosoftSponsoredProducts,
    setUrlUpdated,
    filters: { autocorrect, executedSearchUrl: filtersExecutedSearchUrl, term, originalTerm, page, staleProducts, shouldUrlUpdate },
    products: { allProductsCount, executedSearchUrl, list, isLoading, inlineRecos, recommendations, isBlacklisted, msftResults, requestedUrl, oosMessaging: productOosMessaging },
    fetchFromSearch,
    fetchFromZso,
    makeScrollhandler,
    params: { seoName },
    isVip,
    landingPage
  } = props;

  // Search loaded
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollHandlerLoaded, setScrollHandlerLoaded] = useState(false);
  const prevLocation = usePrevious(location);
  const prevStale = usePrevious(staleProducts);

  const requestSearchResultsForLocation = useCallback(({ location, isFresh, bypassCache, shouldAppendResults }) => {
    if (ZSO_URL_RE.test(location.pathname)) {
      return fetchFromZso({ location, isFresh, bypassCache, shouldAppendResults });
    } else {
      return fetchFromSearch({ location: normalizeSearchLocation(location), isFresh, bypassCache, shouldAppendResults });
    }
  }, [fetchFromSearch, fetchFromZso]);

  const hasProductResults = () => {
    if (hasCrossSiteSearches) {
      return allProductsCount > 0;
    }
    return !!list?.length;
  };

  const shouldShowNoResults = () => !!requestedUrl && !isLoading && !hasProductResults();
  const hasProducts = hasProductResults();

  const getPageFromUrlSearch = search => {
    const nextUrlSearchParsed = parse(search);
    return nextUrlSearchParsed?.p && parseInt(nextUrlSearchParsed.p, 10);
  };

  const nextUrlSearchPageParam = getPageFromUrlSearch(location.search);

  const mobileScrollToTop = useCallback(() => !isDesktop() && window.scrollTo(0, 0), []);

  const shouldHaveRecos = useCallback((pathname = location.pathname) => {
    const doesNotHaveZsoFilters = !ZSO_URL_WITH_FILTERS_RE.test(pathname);
    const doesNotHaveSlashFilters = !SLASH_SEARCH_RE.test(pathname);
    return showHorizontalInlineSearchRecos && doesNotHaveZsoFilters && doesNotHaveSlashFilters && ExecutionEnvironment.canUseDOM && page === 0;
  }, [location.pathname, page, showHorizontalInlineSearchRecos]);

  useEffect(() => {
    if (originalTerm || autocorrect?.termBeforeAutocorrect) {
      // keep the header term in sync with the searched for term.
      const autoCorrectTerm = autocorrect?.termBeforeAutocorrect;
      setHFSearchTerm((useAutoCorrect && autoCorrectTerm) || originalTerm);// For Marty HF
    }

    if (originalTerm || (!isLoaded && filtersExecutedSearchUrl)) {
      setIsLoaded(true);
    }
  }, [originalTerm, filtersExecutedSearchUrl, isLoaded, setHFSearchTerm, useAutoCorrect, autocorrect.termBeforeAutocorrect]);

  useEffect(() => {
    if (allowMoveToFavorites) {
      getHearts();
      if (list.length) {
        getHeartCounts(list);
      }

      if (msftResults?.results?.length) {
        getHeartCounts(msftResults.results);
      }

      if (inlineRecos?.recos) {
        getHeartCounts(inlineRecos.recos);
      }
    }
  }, [list, getHeartCounts, recommendations, msftResults, allowMoveToFavorites, getHearts, inlineRecos]);

  useEffect(() => {
    if (hasBannerAds && term) {
      fetchSymphonySearchComponents();
    }
  }, [hasBannerAds, term, fetchSymphonySearchComponents]);

  // componentDidMount
  useEffect(() => {
    pageTypeChange('search');
  }, [pageTypeChange]);

  useEffect(() => {
    const hasMsftAds = hydraMicrosoftSponsoredProducts && msftResults?.results?.length;
    const locationsDiffer = prevLocation?.pathname !== location.pathname;
    if (locationsDiffer && shouldHaveRecos(location.pathname) && !hasMsftAds && !nextUrlSearchPageParam) {
      fetchSearchInlineRecos(originalTerm);
    } else if (locationsDiffer && inlineRecos) {
      clearInlineRecos();
    }
  }, [
    location.pathname,
    clearInlineRecos,
    inlineRecos,
    fetchSearchInlineRecos,
    mobileScrollToTop,
    nextUrlSearchPageParam,
    msftResults,
    originalTerm,
    shouldHaveRecos,
    prevLocation,
    hydraMicrosoftSponsoredProducts
  ]);

  useEffect(() => {
    if (NULL_SEARCH_RE.test(`${location.pathname}${location.search}`) && (term || originalTerm)) {
      logDebug(`replacing browser url to ${executedSearchUrl}`);
      router.replacePreserveAppRoot(executedSearchUrl);
    } else if (shouldUrlUpdate) {
      logDebug(`pushing browser url to ${executedSearchUrl}`);
      router.forceBrowserPush(executedSearchUrl);
      setUrlUpdated();
    }
  }, [executedSearchUrl, router, shouldUrlUpdate, location, setUrlUpdated, term, originalTerm]);

  useEffect(() => {
    if (!isBlacklisted && shouldSearchServiceBeCalled(location, seoName, executedSearchUrl) && !deepEqual(location, prevLocation)) {
      // breadcrumb/page update
      logDebug('calling products due to breadcrumb or page udpate');
      requestSearchResultsForLocation({ location });
      mobileScrollToTop();
    }
  }, [
    location,
    requestSearchResultsForLocation,
    prevLocation,
    isBlacklisted,
    mobileScrollToTop,
    executedSearchUrl,
    seoName
  ]);

  useEffect(() => {
    if (!isBlacklisted && staleProducts && staleProducts !== prevStale) {
      // facet/sort update
      // not yet requested
      logDebug('stale products due to facet or sort update');
      const [pathname, search] = makeSearchUrl(filters).split(/\?/, 2);
      const mockLocation = { pathname, search: search ? `?${search}` : '' };
      requestSearchResultsForLocation({ location: mockLocation });
      mobileScrollToTop();
    }
  }, [
    requestedUrl,
    router,
    location,
    staleProducts,
    requestSearchResultsForLocation,
    setOosMessaging,
    filters,
    isBlacklisted,
    mobileScrollToTop,
    prevLocation,
    prevStale
  ]);

  useEffect(() => {
    // Watch scrolling for scrollToTop
    if (!scrollHandlerLoaded && makeScrollhandler && hasProducts) {
      setScrollHandlerLoaded(true);
      makeScrollhandler();
    }
  }, [hasProducts, scrollHandlerLoaded, makeScrollhandler]);

  useEffect(() => {
    // if they we redirected to search due to an oos item
    if (!productOosMessaging && location?.query?.oosRedirected) {
      setOosMessaging(oosMessaging);
    } else if (productOosMessaging && !location?.query?.oosRedirected) {
      setOosMessaging(null);
    }
    // Empty array ensures that oosMessaging is updated only once regardless of fancy url update
  }, [productOosMessaging]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {shouldShowNoResults() && <NoSearchResults
        filters={filters}
        landingPage={landingPage}
        isVip={isVip}
        fetchLandingPageInfo={fetchLandingPageInfo} />}
      {children({
        hasProductResults,
        shouldShowNoResults
      })}
    </>
  );
};

SearchLogic.build404ErrorMessage = () => setError('404 not found', new Error('Not a Search URL.'), 404);

SearchLogic.fetchDataOnServer = (store, location, params, { zsoFetch = fetchFromZso, searchFetch = fetchFromSearch, redirect = redirectWithAppRoot, asinFetch = productBundle } = {}) => {
  const qs = location.pathname === '/search' ? parse(location.search) : {};
  const potentialAsin = (params.seoName || qs.term || '').toUpperCase();
  if (ZSO_URL_RE.test(location.pathname)) {
    if (NON_SEARCH_PREFIXES.test(location.pathname)) {
      return store.dispatch(SearchLogic.build404ErrorMessage());
    } else {
      return store.dispatch(zsoFetch({ location, keepParams: true }));
    }
  } else if (PRODUCT_ASIN.test(potentialAsin)) {
    const state = store.getState();
    const { environmentConfig: { api: { cloudcatalog: cloudcatalogInfo } } } = state;
    return asinFetch(cloudcatalogInfo, { asin: potentialAsin })
      .then(fetchErrorMiddleware)
      .then(response => {
        const productReceived = response.statusCode === '200' && response.product.length;
        if (productReceived) {
          const productUrl = ProductUtils.getProductUrlFromAsin(response.product[0], potentialAsin);
          if (productUrl) {
            return store.dispatch(redirect(productUrl));
          }
        }
        throw new FetchError(location.pathname, response.statusCode, `Unexpected CloudCatalogAPI response for ASIN: ${potentialAsin}`);
      })
      .catch(() => {
        if (isPrettySearchOrSlashSearchPath(location.pathname)) {
          return store.dispatch(searchFetch({ location: normalizeSearchLocation(location), keepParams: true }));
        } else {
          return store.dispatch(SearchLogic.build404ErrorMessage());
        }
      });
  } else if (isPrettySearchOrSlashSearchPath(location.pathname)) {
    return store.dispatch(searchFetch({ location: normalizeSearchLocation(location), keepParams: true, isSearchHappeningServerSide: true }));
  } else {
    return store.dispatch(SearchLogic.build404ErrorMessage());
  }
};

SearchLogic.afterFetchDataOnServer = ({ dispatch, getState, doProcessReceivedSearchResponse = processReceivedSearchResponse }) => {
  const { products: { deferredSearchResponse } } = getState();
  if (!deferredSearchResponse) {
    return;
  }
  const { response, parsedParams, completeUrl } = deferredSearchResponse;

  doProcessReceivedSearchResponse(response, dispatch, getState, parsedParams, completeUrl);
};

SearchLogic.defaultProps = {
  trackEvent,
  trackLegacyEvent
};

SearchLogic.propTypes = {
  products: PropTypes.object.isRequired,
  filters: PropTypes.object,
  facets: PropTypes.object
};

export default SearchLogic;
