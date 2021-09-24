'use es6';

import http from 'hub-http/clients/apiClient';
import get from 'transmute/get';
import { formatToReferencesList } from 'reference-resolvers/lib/formatReferences';
import { Map as ImmutableMap, fromJS } from 'immutable';
var URL = 'campaigns/v1/campaigns/guids';
var CRM_SEARCH_URL = 'crm-search/search';
var PAGE_SIZE = 30;

var getCrmSearchCampaignOptions = function getCrmSearchCampaignOptions(_ref) {
  var _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 0 : _ref$offset,
      _ref$nameSearch = _ref.nameSearch,
      nameSearch = _ref$nameSearch === void 0 ? null : _ref$nameSearch,
      _ref$count = _ref.count,
      count = _ref$count === void 0 ? PAGE_SIZE : _ref$count;
  return {
    count: count,
    offset: offset,
    objectTypeId: '0-35',
    requestOptions: {
      properties: ['hs_origin_asset_id', 'hs_name']
    },
    query: nameSearch
  };
};

export var createFetchCampaignsById = function createFetchCampaignsById(_ref2) {
  var httpClient = _ref2.httpClient;
  return function (ids) {
    return httpClient.get(URL, {
      query: {
        guid: ids,
        includeDeletes: true
      }
    }).then(formatToReferencesList({
      getId: get('guid'),
      getLabel: get('display_name')
    }));
  };
};
export var fetchCampaignsById = createFetchCampaignsById({
  httpClient: http
});
export var createSearchCampaigns = function createSearchCampaigns(_ref3) {
  var httpClient = _ref3.httpClient;
  return function () {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap({
      offset: 0,
      query: '',
      count: PAGE_SIZE
    });

    var _args$toJS = args.toJS(),
        offset = _args$toJS.offset,
        count = _args$toJS.count,
        queryString = _args$toJS.query;

    return httpClient.post(CRM_SEARCH_URL, {
      data: getCrmSearchCampaignOptions({
        count: count,
        offset: offset,
        nameSearch: queryString
      })
    }).then(fromJS).then(function (response) {
      var results = formatToReferencesList({
        getId: function getId(campaign) {
          return campaign.getIn(['properties', 'hs_origin_asset_id', 'value']);
        },
        getLabel: function getLabel(campaign) {
          return campaign.getIn(['properties', 'hs_name', 'value']);
        }
      })(response.get('results'));
      return ImmutableMap({
        count: results.length,
        offset: offset + results.length,
        hasMore: count + offset < response.get('total'),
        results: results,
        total: response.get('total')
      });
    });
  };
};
export var searchCampaigns = createSearchCampaigns({
  httpClient: http
});