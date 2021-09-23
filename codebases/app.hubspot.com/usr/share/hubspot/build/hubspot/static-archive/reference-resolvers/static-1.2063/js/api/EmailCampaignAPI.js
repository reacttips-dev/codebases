'use es6';

import http from 'hub-http/clients/apiClient';
import { formatEmailCampaignRecord, formatEmailCampaigns } from 'reference-resolvers/formatters/formatEmailCampaigns';
import { Map as ImmutableMap } from 'immutable';
var BASE_URL = '/cosemail/v1/emails/search';
export var createGetEmailCampaignsByid = function createGetEmailCampaignsByid(_ref) {
  var httpClient = _ref.httpClient;
  return function (ids) {
    return httpClient.put(BASE_URL + "/by-ids", {
      data: {
        emailCampaignIds: ids
      }
    }).then(function (response) {
      return ImmutableMap(response).map(formatEmailCampaignRecord);
    });
  };
};
export var getEmailCampaignsByid = createGetEmailCampaignsByid({
  httpClient: http
});
export var createGetEmailCampaignPage = function createGetEmailCampaignPage(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (query) {
    var parsedQuery = {
      query: {
        q: query.get('query') || '',
        offset: query.get('offset') || 0,
        limit: query.get('count') || 100
      }
    };
    return httpClient.get(BASE_URL, parsedQuery).then(formatEmailCampaigns);
  };
};
export var getEmailCampaignPage = createGetEmailCampaignPage({
  httpClient: http
});