'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import * as ImmutableAPI from 'crm_data/api/ImmutableAPI';
import { POST } from 'crm_data/constants/HTTPVerbs';
import fromJS from 'transmute/fromJS';
import get from 'transmute/get';
import getIn from 'transmute/getIn';
import indexBy from 'transmute/indexBy';
import map from 'transmute/map';
import pipe from 'transmute/pipe';
import valueSeq from 'transmute/valueSeq';
import PortalIdParser from 'PortalIdParser';
var BASE_URI = 'contactslistseg/v1/lists';
export function addToList(vid, listId) {
  return ImmutableAPI.post(BASE_URI + "/multi", {
    vids: [vid],
    lists: [listId]
  });
}
export function bulkAddToList(_ref) {
  var vids = _ref.vids,
      listId = _ref.listId;
  return ImmutableAPI.post(BASE_URI + "/bulk-add-to-list", {
    vids: vids,
    multipleLists: [listId]
  });
}
export function bulkAddAllToList(toListId, fromList) {
  return ImmutableAPI.post(BASE_URI + "/bulk-add-to-list", {
    multipleLists: [toListId],
    fromList: fromList
  });
}
export var deserialize = pipe(get('lists'), valueSeq, map(fromJS), indexBy(function (list) {
  return "" + list.get('listId');
}), // indexBy returns an OrderedMap but we want a regular one for consistency
function (result) {
  return result.toMap();
});
export function fetch() {
  var listIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return ImmutableAPI.send({
    type: POST,
    query: Object.assign({
      includeListReferenceCount: 'true'
    }, opts)
  }, BASE_URI + "/batch", listIds, function (result) {
    return deserialize(result).map(function (list) {
      return list.set('usedIn', getIn(['metaData', 'listReferencesCount'], list) || 0);
    });
  });
}
export function removeFromList(vid, listId) {
  return ImmutableAPI.post(BASE_URI + "/multi/delete", {
    vids: [vid],
    lists: [listId]
  });
}
export function removeAllFromList(list, searchQuery) {
  var params = searchQuery ? {
    list: list,
    contactsSearch: searchQuery
  } : {
    fromList: list,
    list: list
  };
  return ImmutableAPI.post(BASE_URI + "/bulk-remove-from-list", params);
}
export function bulkRemoveFromList(_ref2) {
  var vids = _ref2.vids,
      listId = _ref2.listId;
  return ImmutableAPI.post(BASE_URI + "/multi/delete", {
    vids: vids,
    lists: [listId]
  });
}
export function staticListCheckFromJS(response) {
  return ImmutableMap({
    hasStaticLists: response.lists.length > 0
  });
}
export function staticListCheck() {
  return ImmutableAPI.get(BASE_URI + "/static", {
    property: 'listId',
    includeInternal: false,
    portalId: PortalIdParser.get(),
    count: 1
  }, staticListCheckFromJS);
}
export function getListUsage() {
  var query = {
    includeInternal: false,
    portalId: PortalIdParser.get()
  };
  return ImmutableAPI.get(BASE_URI + "/usage", query);
}