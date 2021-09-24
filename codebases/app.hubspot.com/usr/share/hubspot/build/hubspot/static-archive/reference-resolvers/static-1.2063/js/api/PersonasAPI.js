'use es6';

import http from 'hub-http/clients/apiClient';
import formatPersonas from 'reference-resolvers/formatters/formatPersonas';
export var createGetAllPersonas = function createGetAllPersonas(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('contacts/v1/personas').then(formatPersonas);
  };
};
export var getAllPersonas = createGetAllPersonas({
  httpClient: http
});