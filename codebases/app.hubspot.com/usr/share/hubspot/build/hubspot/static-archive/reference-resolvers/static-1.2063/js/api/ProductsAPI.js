'use es6';

import http from 'hub-http/clients/apiClient';
import { List, fromJS } from 'immutable';
import ReferenceRecord from 'reference-resolvers/schema/ReferenceRecord';
export var createGetProductsByIds = function createGetProductsByIds(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    var url = 'inbounddbproducts/v1/products/batch';
    return httpClient.get(url, {
      query: {
        id: ids,
        allPropertiesFetchMode: 'latest_version'
      }
    }).then(function (response) {
      var referenceRecords = ids.map(function (id) {
        return new ReferenceRecord({
          id: String(id),
          label: response[id] && response[id].properties.name.value || String(id),
          referencedObject: fromJS(response[id])
        });
      });
      return List(referenceRecords);
    });
  };
};
export var getProductsByIds = createGetProductsByIds({
  httpClient: http
});