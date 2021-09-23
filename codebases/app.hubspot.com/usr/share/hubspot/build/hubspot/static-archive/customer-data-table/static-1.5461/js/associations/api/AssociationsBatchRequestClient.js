'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import BatchRequestClient from '../../api/BatchRequestClient';
import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
var BASE_ASSOCIATIONS_URL = 'associations/v1/associations-frontend/single-portal-queries';
var MAX_REQUEST_SIZE = 50;
export var makeRequestKey = function makeRequestKey(_ref) {
  var associationCategory = _ref.associationCategory,
      associationTypeId = _ref.associationTypeId,
      objectId = _ref.objectId;
  return associationCategory + "." + associationTypeId + "." + objectId;
};
export var makeRequestBody = function makeRequestBody(requestOptionsByKey) {
  return Object.keys(requestOptionsByKey).map(function (requestKey) {
    var _requestOptionsByKey$ = requestOptionsByKey[requestKey],
        associationCategory = _requestOptionsByKey$.associationCategory,
        associationTypeId = _requestOptionsByKey$.associationTypeId,
        objectId = _requestOptionsByKey$.objectId;
    return {
      portalId: PortalIdParser.get(),
      fromObjectId: objectId,
      associationCategory: associationCategory,
      associationTypeId: associationTypeId,
      limit: 100,
      offset: 0
    };
  });
};
export var api = function api(_ref2) {
  var requestBody = _ref2.requestBody;
  return http.post(BASE_ASSOCIATIONS_URL, {
    data: requestBody
  }).then(function (response) {
    return response.reduce(function (acc, _ref3) {
      var associationTypeId = _ref3.associationTypeId,
          category = _ref3.category,
          fromObjectId = _ref3.fromObjectId,
          results = _ref3.results;
      // We have to make the request key here using the result of the response
      // because we have to map the result from our API to the requestKeys in
      // the BatchRequestClient.
      var requestKey = makeRequestKey({
        associationCategory: category,
        associationTypeId: associationTypeId,
        objectId: fromObjectId
      });
      return Object.assign({}, acc, _defineProperty({}, requestKey, results));
    }, {});
  });
};
var AssociationsBatchRequestClient = new BatchRequestClient({
  api: api,
  makeRequestBody: makeRequestBody,
  makeRequestKey: makeRequestKey,
  options: {
    MAX_REQUEST_SIZE: MAX_REQUEST_SIZE
  }
});
export default AssociationsBatchRequestClient;