'use es6';

import http from 'hub-http/clients/apiClient';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import get from 'transmute/get';
var BASE_URL = 'inbounddb-io/imports';
var GET_NAMES_URL = BASE_URL + "/get-names";
export var createFetchImportNamesById = function createFetchImportNamesById(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return httpClient.put(GET_NAMES_URL, {
      data: ids
    }).then(function (response) {
      return ids.map(function (id) {
        return {
          id: id,
          importName: response.hits[id] || null
        };
      });
    }).then(formatToReferencesList({
      getId: get('id'),
      getLabel: get('importName')
    }));
  };
};
export var fetchImportNamesById = createFetchImportNamesById({
  httpClient: http
});