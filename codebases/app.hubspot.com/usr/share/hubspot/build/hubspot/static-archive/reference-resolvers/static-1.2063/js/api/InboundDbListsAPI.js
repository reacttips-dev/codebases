'use es6';

import http from 'hub-http/clients/apiClient';
import { Map as ImmutableMap } from 'immutable';
import has from 'transmute/has';
import omit from 'transmute/omit';
import { OBJECT_LIST_TYPE_ID } from 'reference-resolvers/constants/ObjectTypeIds';
import formatInboundDbLists from 'reference-resolvers/formatters/formatInboundDbLists';
import formatInboundDbListSegments from 'reference-resolvers/formatters/formatInboundDbListSegments';
export var createGetAllInboundDbLists = function createGetAllInboundDbLists(_ref) {
  var httpClient = _ref.httpClient;
  return function (objectType) {
    return function () {
      return httpClient.get("/inbounddb-lists/v1/lists/type/" + objectType).then(formatInboundDbLists);
    };
  };
};
export var getAllInboundDbLists = createGetAllInboundDbLists({
  httpClient: http
});
export var createGetInboundDbListsByIds = function createGetInboundDbListsByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.post('/inbounddb-lists/v1/lists/getBatch', {
      data: ids
    }).then(formatInboundDbLists);
  };
};
export var getInboundDbListsByIds = createGetInboundDbListsByIds({
  httpClient: http
});
var emptyQuery = ImmutableMap();
var defaultSearchOptions = {
  count: 20,
  offset: 0,
  sorts: [{
    property: 'hs_list_name',
    order: 'ASC'
  }]
};

var isUnique = function isUnique(value, index, array) {
  return array.indexOf(value) === index;
};

var transformToCrmSearchQuery = function transformToCrmSearchQuery(searchQuery) {
  // The destructured properties and searchQueryPropertiesToProcess should match
  var properties = searchQuery.properties,
      listFilterProperties = searchQuery.listFilterProperties;
  var searchQueryPropertiesToProcess = ['properties', 'listFilterProperties'];
  var requiredProperties = ['hs_list_id', 'hs_list_name'];
  var crmSearchQuery = Object.assign({}, defaultSearchOptions, {}, omit(searchQueryPropertiesToProcess, searchQuery), {
    // Allow some flexibility
    objectTypeId: OBJECT_LIST_TYPE_ID,
    requestOptions: {
      properties: Array.isArray(properties) ? requiredProperties.concat(properties).filter(isUnique) : requiredProperties
    }
  });
  var allowableFilterKeys = ['objectTypeId', 'processingTypes'];
  var hasAllowableFilters = typeof listFilterProperties === 'object' && allowableFilterKeys.some(function (filterKey) {
    return has(filterKey, listFilterProperties);
  });
  var filters = [{
    property: 'hs_is_public',
    operator: 'EQ',
    value: true
  }];

  if (hasAllowableFilters) {
    var objectTypeId = listFilterProperties.objectTypeId,
        processingTypes = listFilterProperties.processingTypes;

    if (objectTypeId) {
      filters.push({
        property: 'hs_object_type_id',
        operator: 'EQ',
        value: objectTypeId
      });
    }

    if (Array.isArray(processingTypes)) {
      filters.push({
        property: 'hs_processing_type',
        operator: 'IN',
        values: processingTypes
      });
    }
  }

  crmSearchQuery.filterGroups = [{
    filters: filters
  }];
  return crmSearchQuery;
};

export var createGetInboundDbListsSearchPage = function createGetInboundDbListsSearchPage(_ref3) {
  var httpClient = _ref3.httpClient;
  return function () {
    var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emptyQuery;
    return httpClient.post('/crm-search/search', {
      data: transformToCrmSearchQuery(query.toJS())
    }).then(function (response) {
      return formatInboundDbListSegments(Object.assign({}, response, {
        count: query.get('count')
      }));
    });
  };
};
export var getInboundDbListsSearchPage = createGetInboundDbListsSearchPage({
  httpClient: http
});