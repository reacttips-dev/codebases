'use es6';

import { DefaultBatchedCacheProvider, NoCacheProvider } from '../cache/DefaultCacheProvider';
import { createPendingResolutionCache, resolveBatchFetchedReferences, resolveSearchedReferences } from './ResolverEngine';
import { createFetchByIds as defaultCreateFetchByIds, createSearch as defaultCreateSearch, standardBaseUrl, toStandardFetchOptions, toStandardFetchUrl, toStandardSearchUrl } from '../api/ResolverAPI';
import { makeDataFetchingClientFetchQuery, makeDataFetchingClientSearchQuery } from '../adapters/dataFetchingClient/DataFetchingClientQuery';
import { useFetchApiResolver, useSearchApiResolver } from '../adapters/ApiHooks';
import { verifyFetchedObjectAccessors, verifyReferenceType } from './Invariants';
import { FormatterProvider as DefaultFormatterProvider } from '../formatters/FormatterProvider';
import always from '../lib/always';
import compose from '../lib/compose';
import { defaultFetchedObjectAccessors } from '../formatters/FetchedObjectAccessors';
import { defaultSearchResponseAccessors } from '../formatters/SearchResponseAccessors';
import { formatToReference } from '../formatters/Formatter';
import { formatToSearchQuery } from '../formatters/Formatter';
import { formatToSearchResults } from '../formatters/Formatter';
import http from 'hub-http/clients/apiClient';
import identity from '../lib/identity';
import { makeReferenceResolver } from '../ReferenceResolver';
import { toQueryKey } from './CustomKey';

var selectDefaultFetchQuery = function selectDefaultFetchQuery(_ref) {
  var disableApiFetch = _ref.disableApiFetch,
      dfc = _ref.dfc,
      gql = _ref.gql;

  if (disableApiFetch) {
    return undefined;
  }

  if (dfc) {
    return dfc.useDataFetchingClientFetchResolver;
  }

  if (gql) {
    return gql.useGraphQLFetchResolver;
  }

  return useFetchApiResolver;
};

var selectDefaultSearchQuery = function selectDefaultSearchQuery(_ref2) {
  var disableApiSearch = _ref2.disableApiSearch,
      dfc = _ref2.dfc,
      gql = _ref2.gql;

  if (disableApiSearch) {
    return undefined;
  }

  if (dfc) {
    return dfc.useDataFetchingClientSearchResolver;
  }

  if (gql) {
    return gql.useGraphQLSearchResolver;
  }

  return useSearchApiResolver;
};

var selectDefaultCacheProvider = function selectDefaultCacheProvider(_ref3) {
  var dfc = _ref3.dfc,
      gql = _ref3.gql;

  if (dfc || gql) {
    return NoCacheProvider;
  }

  return DefaultBatchedCacheProvider;
};

export var createBatchedReferenceResolver = function createBatchedReferenceResolver(_ref4) {
  var baseUrl = _ref4.baseUrl,
      createFetchByIds = _ref4.createFetchByIds,
      createSearch = _ref4.createSearch,
      _ref4$debouncePeriod = _ref4.debouncePeriod,
      debouncePeriod = _ref4$debouncePeriod === void 0 ? 500 : _ref4$debouncePeriod,
      _ref4$disableApiFetch = _ref4.disableApiFetch,
      disableApiFetch = _ref4$disableApiFetch === void 0 ? false : _ref4$disableApiFetch,
      _ref4$disableApiSearc = _ref4.disableApiSearch,
      disableApiSearch = _ref4$disableApiSearc === void 0 ? false : _ref4$disableApiSearc,
      dfc = _ref4.dfc,
      fetchedObjectAccessors = _ref4.fetchedObjectAccessors,
      fetchMethod = _ref4.fetchMethod,
      fetchOptions = _ref4.fetchOptions,
      fetchQueryParams = _ref4.fetchQueryParams,
      fetchUrl = _ref4.fetchUrl,
      _ref4$formatReference = _ref4.formatReference,
      formatReference = _ref4$formatReference === void 0 ? formatToReference : _ref4$formatReference,
      _ref4$formatSearchQue = _ref4.formatSearchQuery,
      formatSearchQuery = _ref4$formatSearchQue === void 0 ? formatToSearchQuery : _ref4$formatSearchQue,
      _ref4$formatSearchRes = _ref4.formatSearchResponse,
      formatSearchResponse = _ref4$formatSearchRes === void 0 ? formatToSearchResults : _ref4$formatSearchRes,
      gql = _ref4.gql,
      _ref4$httpClient = _ref4.httpClient,
      httpClient = _ref4$httpClient === void 0 ? http : _ref4$httpClient,
      _ref4$isIdValid = _ref4.isIdValid,
      isIdValid = _ref4$isIdValid === void 0 ? always(true) : _ref4$isIdValid,
      _ref4$maxBatchSize = _ref4.maxBatchSize,
      maxBatchSize = _ref4$maxBatchSize === void 0 ? 500 : _ref4$maxBatchSize,
      referenceType = _ref4.referenceType,
      objectTypeId = _ref4.objectTypeId,
      searchMethod = _ref4.searchMethod,
      searchOptions = _ref4.searchOptions,
      searchResponseAccessors = _ref4.searchResponseAccessors,
      searchQueryParams = _ref4.searchQueryParams,
      searchUrl = _ref4.searchUrl;
  verifyReferenceType(referenceType);
  var queryKey = toQueryKey(referenceType, objectTypeId);

  if (dfc) {
    dfc = Object.assign({}, dfc, {
      fieldName: dfc.fieldName || queryKey
    });
  }

  var objectAccessors = Object.assign({}, defaultFetchedObjectAccessors, {}, fetchedObjectAccessors);
  verifyFetchedObjectAccessors(objectAccessors);
  var searchAccessors = Object.assign({}, defaultSearchResponseAccessors, {}, searchResponseAccessors);

  if (!disableApiFetch && !createFetchByIds) {
    createFetchByIds = defaultCreateFetchByIds;
  }

  if (!disableApiSearch && !createSearch) {
    createSearch = defaultCreateSearch;
  }

  if (!baseUrl && !(disableApiFetch && disableApiSearch)) {
    baseUrl = standardBaseUrl;
  }

  var api;

  if (baseUrl || fetchUrl || searchUrl) {
    if (!fetchUrl && createFetchByIds) {
      fetchUrl = toStandardFetchUrl(baseUrl, referenceType, objectTypeId);
      fetchOptions = toStandardFetchOptions(fetchOptions, referenceType, objectTypeId);
    }

    if (!searchUrl && createSearch) {
      searchUrl = toStandardSearchUrl(baseUrl, referenceType, objectTypeId);
    }

    var byId;

    if (createFetchByIds) {
      var fetchByIds = createFetchByIds({
        fetchOptions: fetchOptions,
        queryParams: fetchQueryParams,
        http: httpClient,
        method: fetchMethod,
        url: fetchUrl
      });
      var resolutionCache = createPendingResolutionCache();
      var resolveById = resolveBatchFetchedReferences({
        debouncePeriod: debouncePeriod,
        fetchByIds: fetchByIds,
        isIdValid: isIdValid,
        maxBatchSize: maxBatchSize,
        resolutionCache: resolutionCache
      });

      byId = function byId(id) {
        return resolveById(id);
      };
    }

    var bySearch;

    if (createSearch) {
      var search = createSearch({
        searchOptions: searchOptions,
        queryParams: searchQueryParams,
        http: httpClient,
        method: searchMethod,
        url: searchUrl
      });
      var resolveBySearch = resolveSearchedReferences(search);

      bySearch = function bySearch(query) {
        return resolveBySearch(query);
      };
    }

    api = {
      byId: byId,
      search: bySearch
    };
  }

  var referenceFormatter = formatReference(objectAccessors);
  var searchResponseFormatter = formatSearchResponse(searchAccessors);
  return function () {
    var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref5$useFetchQuery = _ref5.useFetchQuery,
        useFetchQuery = _ref5$useFetchQuery === void 0 ? selectDefaultFetchQuery({
      disableApiFetch: disableApiFetch,
      dfc: dfc,
      gql: gql
    }) : _ref5$useFetchQuery,
        _ref5$useSearchQuery = _ref5.useSearchQuery,
        useSearchQuery = _ref5$useSearchQuery === void 0 ? selectDefaultSearchQuery({
      disableApiSearch: disableApiSearch,
      dfc: dfc,
      gql: gql
    }) : _ref5$useSearchQuery,
        _ref5$CacheProvider = _ref5.CacheProvider,
        CacheProvider = _ref5$CacheProvider === void 0 ? selectDefaultCacheProvider({
      dfc: dfc,
      gql: gql
    }) : _ref5$CacheProvider,
        _ref5$FormatterProvid = _ref5.FormatterProvider,
        FormatterProvider = _ref5$FormatterProvid === void 0 ? DefaultFormatterProvider : _ref5$FormatterProvid,
        _ref5$enableCaching = _ref5.enableCaching,
        enableCaching = _ref5$enableCaching === void 0 ? true : _ref5$enableCaching,
        _ref5$applyFormatter = _ref5.applyFormatter,
        applyFormatter = _ref5$applyFormatter === void 0 ? true : _ref5$applyFormatter;

    if (api) {
      api = compose(applyFormatter ? FormatterProvider({
        formatReference: referenceFormatter,
        formatSearchQuery: formatSearchQuery,
        formatSearchResponse: searchResponseFormatter
      }) : identity, enableCaching ? CacheProvider() : identity)(api);
    }

    if (dfc) {
      dfc = Object.assign({
        fetchQuery: makeDataFetchingClientFetchQuery({
          api: api,
          dfc: dfc
        }),
        searchQuery: makeDataFetchingClientSearchQuery({
          api: api,
          dfc: dfc
        })
      }, dfc);
    }

    return makeReferenceResolver({
      api: api,
      dfc: dfc,
      gql: gql,
      queryKey: queryKey,
      useFetchQuery: useFetchQuery,
      useSearchQuery: useSearchQuery
    }, 'BatchedReferenceResolver');
  };
};