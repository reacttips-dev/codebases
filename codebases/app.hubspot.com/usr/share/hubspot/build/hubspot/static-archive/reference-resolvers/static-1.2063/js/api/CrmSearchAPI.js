'use es6';

import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import { Map as ImmutableMap } from 'immutable';
import curry from 'transmute/curry';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import { defaultCustomObjectGetters } from 'reference-resolvers/formatters/formatCustomObjects';
var BASE_URI = 'crm-search';
var SEARCH_API = BASE_URI + "/search";
var emptyQuery = ImmutableMap();
var defaultSearchOptions = {
  count: 100,
  offset: 0,
  query: '',
  requestOptions: {
    allPropertiesFetchMode: 'latest_version'
  },
  sorts: [{
    property: 'createdate',
    order: 'ASC'
  }]
};
var formatResults = curry(function (getters, response) {
  var hasMore = response.hasMore,
      offset = response.offset,
      count = response.total,
      results = response.results;
  return ImmutableMap({
    hasMore: hasMore,
    offset: offset,
    count: count,
    results: formatToReferencesList(getters, results)
  });
});

var defaultIdsFilterInserter = function defaultIdsFilterInserter(searchOptions, idsFilter) {
  var filters = searchOptions && searchOptions.filterGroups && searchOptions.filterGroups[0] && searchOptions.filterGroups[0].filters || [];
  var filterGroups = [{
    filters: filters.concat(idsFilter)
  }];
  return Object.assign({
    count: idsFilter.values.length
  }, searchOptions, {
    filterGroups: filterGroups
  });
};

var createIdsFilter = function createIdsFilter(idPropName, ids) {
  return {
    property: idPropName,
    values: ids,
    operator: 'IN'
  };
};

var createFetchByIdsSearchOptions = function createFetchByIdsSearchOptions(searchOptions, idsFilterInserter, idPropName, ids) {
  return idsFilterInserter(searchOptions, createIdsFilter(idPropName, ids));
};

var fetch = function fetch(httpClient, objectTypeId, _ref) {
  var searchOptions = _ref.searchOptions,
      searchQueryParams = _ref.searchQueryParams,
      getters = _ref.formatterOptions.getters;
  var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : emptyQuery;
  var fullSearchQuery = Object.assign({
    portalId: PortalIdParser.get()
  }, defaultSearchOptions, {}, searchOptions, {}, query.toJS(), {
    objectTypeId: objectTypeId
  });
  var referenceGetters = Object.assign({}, defaultCustomObjectGetters, {}, getters);
  return httpClient.post(SEARCH_API, {
    query: searchQueryParams,
    data: fullSearchQuery
  }).then(formatResults(referenceGetters));
};

export var createFetchByIds = function createFetchByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return curry(function (objectTypeId, _ref3, _ref4, ids) {
    var searchOptions = _ref3.searchOptions,
        searchQueryParams = _ref3.searchQueryParams,
        formatterOptions = _ref3.formatterOptions,
        responseFormatter = _ref3.responseFormatter;
    var idPropName = _ref4.idPropName,
        _ref4$idsFilterInsert = _ref4.idsFilterInserter,
        idsFilterInserter = _ref4$idsFilterInsert === void 0 ? defaultIdsFilterInserter : _ref4$idsFilterInsert;
    var fetchByIdSearchOptions = createFetchByIdsSearchOptions(searchOptions, idsFilterInserter, idPropName, ids);
    return fetch(httpClient, objectTypeId, {
      searchOptions: fetchByIdSearchOptions,
      searchQueryParams: searchQueryParams,
      formatterOptions: formatterOptions
    }).then(function (response) {
      return responseFormatter ? responseFormatter(response) : response;
    });
  });
};
export var fetchByIds = createFetchByIds({
  httpClient: http
});
export var createFetchSearchPage = function createFetchSearchPage(_ref5) {
  var httpClient = _ref5.httpClient;
  return curry(function (objectTypeId, _ref6, query) {
    var searchOptions = _ref6.searchOptions,
        searchQueryParams = _ref6.searchQueryParams,
        formatterOptions = _ref6.formatterOptions;
    return fetch(httpClient, objectTypeId, {
      searchOptions: searchOptions,
      searchQueryParams: searchQueryParams,
      formatterOptions: formatterOptions
    }, query);
  });
};
export var fetchSearchPage = createFetchSearchPage({
  httpClient: http
});