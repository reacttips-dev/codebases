'use es6';

import { PAGE_DEFAULT_LIMIT, SORT_DIR_VALUES, CRM_SEARCH_SORT_VALUES, CRM_SEARCH_CAMPAIGN_PROPERTIES } from '../constants/campaignDaoConstants';
export var getPropertyValue = function getPropertyValue(property) {
  return property ? property.value : null;
};
export var getPropertyValueAsInt = function getPropertyValueAsInt(property) {
  var propertyValue = getPropertyValue(property);
  return propertyValue ? parseInt(propertyValue, 10) : propertyValue;
};
export var getCrmSearchCampaignOptions = function getCrmSearchCampaignOptions(_ref) {
  var _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 0 : _ref$offset,
      _ref$limit = _ref.limit,
      limit = _ref$limit === void 0 ? PAGE_DEFAULT_LIMIT : _ref$limit,
      _ref$guidValue = _ref.guidValue,
      guidValue = _ref$guidValue === void 0 ? null : _ref$guidValue,
      _ref$nameSearch = _ref.nameSearch,
      nameSearch = _ref$nameSearch === void 0 ? null : _ref$nameSearch,
      _ref$sortProperty = _ref.sortProperty,
      sortProperty = _ref$sortProperty === void 0 ? CRM_SEARCH_SORT_VALUES.DISPLAY_NAME : _ref$sortProperty,
      _ref$sortDir = _ref.sortDir,
      sortDir = _ref$sortDir === void 0 ? SORT_DIR_VALUES.ASC : _ref$sortDir,
      _ref$properties = _ref.properties,
      properties = _ref$properties === void 0 ? CRM_SEARCH_CAMPAIGN_PROPERTIES : _ref$properties;
  var guidFilter = null;

  if (Array.isArray(guidValue) && guidValue.length) {
    guidFilter = {
      property: 'hs_origin_asset_id',
      values: guidValue,
      operator: 'IN'
    };
  } else if (guidValue) {
    guidFilter = {
      property: 'hs_origin_asset_id',
      value: guidValue,
      operator: 'EQ'
    };
  }

  return {
    count: limit,
    offset: offset,
    objectTypeId: '0-35',
    requestOptions: {
      properties: properties
    },
    filterGroups: [{
      filters: [guidFilter].filter(Boolean)
    }],
    sorts: [{
      property: sortProperty,
      order: sortDir
    }],
    query: nameSearch
  };
};
export var mapCrmSearchCampaignsToLegacy = function mapCrmSearchCampaignsToLegacy(campaigns) {
  campaigns.results = campaigns.results.map(function (_ref2) {
    var properties = _ref2.properties;
    return {
      createdAt: getPropertyValueAsInt(properties.hs_created_at),
      createdBy: getPropertyValueAsInt(properties.hs_created_by_user_id),
      display_name: getPropertyValue(properties.hs_name),
      guid: getPropertyValue(properties.hs_origin_asset_id),
      colorHex: getPropertyValue(properties.hs_color_hex),
      utm: getPropertyValue(properties.hs_utm)
    };
  });
  return campaigns;
};
export var fetchesToPromiseAll = function fetchesToPromiseAll() {
  for (var _len = arguments.length, requests = new Array(_len), _key = 0; _key < _len; _key++) {
    requests[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var promises = requests.map(function (request) {
      return request.apply(void 0, args);
    });
    return Promise.all(promises);
  };
};