'use es6';

import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { DYNAMIC, MANUAL, SNAPSHOT, STATIC } from 'crm_schema/list/ProcessingTypes';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import ILSListRecord from 'crm_schema/list/ILSListRecord';
import indexBy from 'transmute/indexBy';
import PaginatedSearchResponse from 'customer-data-objects/search/PaginatedSearchResponse';
import PaginatedSearchResult from 'customer-data-objects/search/PaginatedSearchResult';
import PortalIdParser from 'PortalIdParser';
var BASE_URI = 'inbounddb-lists/v1';

var mapSearchResultsToListRecords = function mapSearchResultsToListRecords(lists) {
  return indexBy(getIn(['properties', 'hs_list_id', 'value']), lists).map(function (listResults) {
    return ILSListRecord({
      id: getIn(['properties', 'hs_list_id', 'value'], listResults),
      name: getIn(['properties', 'hs_list_name', 'value'], listResults)
    });
  });
};

export var addToStaticList = function addToStaticList(_ref) {
  var ids = _ref.ids,
      listId = _ref.listId,
      objectTypeId = _ref.objectTypeId,
      userId = _ref.userId;
  return ImmutableAPI.post(BASE_URI + "/static-lists/validated", {
    entityId: userId,
    listId: listId,
    objectIdsToAdd: ids,
    objectTypeId: objectTypeId,
    portalId: PortalIdParser.get()
  });
};
export var removeFromStaticList = function removeFromStaticList(_ref2) {
  var ids = _ref2.ids,
      listId = _ref2.listId,
      objectTypeId = _ref2.objectTypeId,
      userId = _ref2.userId;
  return ImmutableAPI.post(BASE_URI + "/static-lists/validated", {
    entityId: userId,
    listId: listId,
    objectIdsToRemove: ids,
    objectTypeId: objectTypeId,
    portalId: PortalIdParser.get()
  });
};
export var getObjectListsSearchPage = function getObjectListsSearchPage(_ref3) {
  var count = _ref3.count,
      isUnused = _ref3.isUnused,
      objectTypeId = _ref3.objectTypeId,
      offset = _ref3.offset,
      _ref3$processingTypes = _ref3.processingTypes,
      processingTypes = _ref3$processingTypes === void 0 ? [DYNAMIC, MANUAL, SNAPSHOT, STATIC] : _ref3$processingTypes,
      query = _ref3.query;
  return ImmutableAPI.post(BASE_URI + "/segments-ui/searchLists", {
    count: count,
    listFilterProperties: {
      isUnused: isUnused,
      objectTypeId: objectTypeId,
      processingTypes: processingTypes
    },
    offset: offset,
    properties: ['hs_list_id', 'hs_list_name'],
    query: query
  }).then(function (results) {
    return PaginatedSearchResponse({
      searchResult: PaginatedSearchResult({
        hasMore: get('hasMore', results),
        offset: get('offset', results),
        query: query,
        results: mapSearchResultsToListRecords(get('results', results)),
        total: get('total', results)
      })
    });
  }, function (error) {
    throw error;
  });
};