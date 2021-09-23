'use es6';

import http from 'hub-http/clients/apiClient';
import formatMarketingContactReason from 'reference-resolvers/formatters/formatMarketingContactReason';
export var createGetMarketingReasonById = function createGetMarketingReasonById(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return httpClient.post('marketable-contacts/v1/marketable-labels/vids', {
      data: ids
    }).then(formatMarketingContactReason);
  };
};
export var getMarketingReasonById = createGetMarketingReasonById({
  httpClient: http
});