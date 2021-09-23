'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import curry from 'transmute/curry';
import get from 'transmute/get';
import http from 'hub-http/clients/apiClient';
import { formatContactName } from 'reference-resolvers/formatters/formatContacts';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
var BASE_URI = 'contacts/v3/contacts';
var BATCH_URI = BASE_URI + "/batch";
var BATCH_LIMIT = 100;
var IDENTITY_FETCH_MODE_FIRST = 'first';
var PROP_FETCH_MODE_LATEST_VERSION = 'latest_version'; // Creates batches of ids up to the endpoints batch limit

var batchIds = function batchIds(arr, size) {
  return Array.from({
    length: Math.ceil(arr.length / size)
  }, function (__, idx) {
    return arr.slice(idx * size, idx * size + size);
  });
};

var contactGetters = {
  getId: get('vid'),
  getLabel: formatContactName
};
var toResultsList = curry(function (ids, results) {
  return ids.map(function (id) {
    return results[id];
  });
});

var flatten = function flatten(results) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(results));
};

export var createFetchByIds = function createFetchByIds(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return Promise.all(batchIds(ids, BATCH_LIMIT).map(function (batchedIds) {
      return httpClient.get(BATCH_URI, {
        query: {
          id: batchedIds,
          allPropertiesFetchMode: PROP_FETCH_MODE_LATEST_VERSION,
          identitiesFetchMode: IDENTITY_FETCH_MODE_FIRST
        }
      }).then(toResultsList(batchedIds));
    })).then(flatten).then(formatToReferencesList(contactGetters));
  };
};
export var fetchByIds = createFetchByIds({
  httpClient: http
});