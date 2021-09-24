'use es6';

import { defaultCustomObjectGetters } from 'reference-resolvers/formatters/formatCustomObjects';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import http from 'hub-http/clients/apiClient';
import map from 'transmute/map';
import memoize from 'transmute/memoize';
var BASE_URI = 'inbounddb-objects/v1/crm-objects';
var toBatchFetchUri = memoize(function (objectTypeId) {
  return BASE_URI + "/" + encodeURIComponent(objectTypeId) + "/batch";
}); // Merged Contacts, Companies, Tickets and Deals aren’t stored in CrmObjects yet. The inbounddb-objects endpoint
// transforms these objects to a CrmObject type and does not yet translate the merge audits. Therefore, merged
// objects ids in the response may not match the requested id, so this updates the objectIds to what is expected.

var setIdInObject = function setIdInObject(object, id) {
  if (typeof object.objectId === 'number') {
    id = Number(id);
  }

  if (object.objectId !== id) {
    object.objectId = id;
  }

  return object;
};

var normalizeMergedObjects = map(setIdInObject);
export var createFetchByIds = function createFetchByIds(_ref) {
  var httpClient = _ref.httpClient;
  return function (objectTypeId) {
    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        fetchQueryParams = _ref2.fetchQueryParams,
        _ref2$formatterOption = _ref2.formatterOptions;

    _ref2$formatterOption = _ref2$formatterOption === void 0 ? {} : _ref2$formatterOption;
    var getters = _ref2$formatterOption.getters;
    var referenceGetters = Object.assign({}, defaultCustomObjectGetters, {}, getters);
    var url = toBatchFetchUri(objectTypeId);
    return function (ids) {
      return httpClient.get(url, {
        query: Object.assign({}, fetchQueryParams, {
          includeAllValues: true,
          id: ids
        })
      }).then(normalizeMergedObjects).then(Object.values).then(formatToReferencesList(referenceGetters));
    };
  };
};
export var fetchByIds = createFetchByIds({
  httpClient: http
});