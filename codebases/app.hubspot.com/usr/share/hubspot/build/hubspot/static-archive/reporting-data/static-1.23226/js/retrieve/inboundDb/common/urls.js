/* deprecated, use spec */
'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import * as DataTypes from '../../../constants/dataTypes';
import { SEARCH } from '../../../constants/configTypes';

var getEngagementUrl = function getEngagementUrl(serviceType) {
  return "contacts/search/v1/" + serviceType + "/engagements";
};

var getCrossObjectUrl = function getCrossObjectUrl(configType, crossObjectConfig) {
  var serviceType = configType === SEARCH ? 'search' : 'aggregate';
  var deduplicationMode = crossObjectConfig.get('deduplicate') ? 'PER_BUCKET' : 'NONE';
  var reportId = crossObjectConfig.get('reportId');
  return "cross-object-reports/v1/reports/" + reportId + "/" + serviceType + "?deduplicationMode=" + deduplicationMode;
};

var getCrmSearchUrl = function getCrmSearchUrl(serviceType) {
  return "crm-search/" + serviceType + "/beta";
};

var getUrlByDataType = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, DataTypes.ATTRIBUTION_TOUCH_POINTS, function (serviceType) {
  return "crm-search/" + serviceType;
}), _defineProperty(_ImmutableMap, DataTypes.CALLS, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.COMPANIES, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/companies";
}), _defineProperty(_ImmutableMap, DataTypes.CONTACTS, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/contacts";
}), _defineProperty(_ImmutableMap, DataTypes.CONTACT_CREATE_ATTRIBUTION, function (serviceType) {
  return "crm-search/" + serviceType;
}), _defineProperty(_ImmutableMap, DataTypes.CONVERSATIONS, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.DEALS, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/deals";
}), _defineProperty(_ImmutableMap, DataTypes.ENGAGEMENT, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.ENGAGEMENT_EMAILS, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.FEEDBACK, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.FEEDBACK_SUBMISSIONS, function (serviceType) {
  return "crm-search/" + serviceType;
}), _defineProperty(_ImmutableMap, DataTypes.LINE_ITEMS, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/lineitems";
}), _defineProperty(_ImmutableMap, DataTypes.MEETINGS, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.NOTES, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.PRODUCTS, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/products";
}), _defineProperty(_ImmutableMap, DataTypes.SOCIAL_POSTS, function (serviceType) {
  return "social-reporting/v1/" + serviceType + "/posts";
}), _defineProperty(_ImmutableMap, DataTypes.TASKS, getEngagementUrl), _defineProperty(_ImmutableMap, DataTypes.TICKETS, function (serviceType) {
  return "contacts/search/v1/" + serviceType + "/services/tickets";
}), _ImmutableMap));
export var getUrlForServiceType = function getUrlForServiceType(serviceType, dataType) {
  return getUrlByDataType.get(dataType)(serviceType);
};
export var getUrl = function getUrl(config, runtimeOptions) {
  var dataType = config.get('dataType');
  var configType = config.get('configType');

  if (dataType === DataTypes.CROSS_OBJECT) {
    return getCrossObjectUrl(configType, config.get('crossObject'), runtimeOptions);
  }

  var serviceType = configType === SEARCH ? 'search' : 'report';

  if (runtimeOptions.useCrmSearch) {
    return getCrmSearchUrl(serviceType, dataType);
  }

  return getUrlForServiceType(serviceType, dataType);
};