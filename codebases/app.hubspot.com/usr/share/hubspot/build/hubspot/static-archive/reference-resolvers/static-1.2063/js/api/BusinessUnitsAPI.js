'use es6';

import http from 'hub-http/clients/apiClient';
import formatBusinessUnits from 'reference-resolvers/formatters/formatBusinessUnits';
export var createGetAllBusinessUnits = function createGetAllBusinessUnits(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('business-units/v1/business-units').then(formatBusinessUnits);
  };
};
export var getAllBusinessUnits = createGetAllBusinessUnits({
  httpClient: http
});