'use es6';

import { Map as ImmutableMap } from 'immutable';
import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
import formatSalesforceCampaigns from 'reference-resolvers/formatters/formatSalesforceCampaigns';
var BATCH_URL = 'sfdc/v1/campaigns/batch';

var campaignSearchFilter = function campaignSearchFilter(search) {
  return function (campaigns) {
    if (!search) {
      return campaigns;
    }

    return campaigns.filter(function (campaign) {
      return campaign.name.toUpperCase().indexOf(search.toUpperCase()) > -1;
    });
  };
};

export var createGetAllSalesforceCampaigns = function createGetAllSalesforceCampaigns(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get("sfdc/v1/campaigns/" + PortalIdParser.get() + "?detailView=false").then(formatSalesforceCampaigns);
  };
};
export var getAllSalesforceCampaigns = createGetAllSalesforceCampaigns({
  httpClient: http
});
export var createGetSalesforceCampaignsById = function createGetSalesforceCampaignsById(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.post(BATCH_URL, {
      data: ids
    }).then(formatSalesforceCampaigns);
  };
};
export var getSalesforceCampaignsById = createGetSalesforceCampaignsById({
  httpClient: http
});
export var createGetSalesforceCampaignsBySearch = function createGetSalesforceCampaignsBySearch(options) {
  return function (props) {
    var _props$toJS = props.toJS(),
        query = _props$toJS.query;

    var getFn = createGetAllSalesforceCampaigns(options);
    return getFn().then(campaignSearchFilter(query)).then(function (campaigns) {
      return ImmutableMap({
        hasMore: false,
        offset: 0,
        count: campaigns.size,
        total: campaigns.size,
        results: campaigns.toList()
      });
    });
  };
};
export var getSalesforceCampaignsBySearch = createGetSalesforceCampaignsBySearch({
  httpClient: http
});