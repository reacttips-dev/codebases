'use es6';

import http from 'hub-http/clients/apiClient';
import formatCallDispositions from 'reference-resolvers/formatters/formatCallDispositions';
export var createGetAllDispositionTypes = function createGetAllDispositionTypes(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('twilio/v1/custom-dispositions?includeDeleted=false').then(formatCallDispositions);
  };
};
export var getAllDispositionTypes = createGetAllDispositionTypes({
  httpClient: http
});