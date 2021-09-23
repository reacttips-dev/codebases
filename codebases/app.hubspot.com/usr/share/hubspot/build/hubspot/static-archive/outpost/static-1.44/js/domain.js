'use es6';

import getHubletSuffix from 'forms-embed-utils-lib/hublets/getHubletSuffix';
var APP_ROUTE = 'outpost';

var getFormsSubdomain = function getFormsSubdomain() {
  var hublet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "forms" + getHubletSuffix(hublet);
};

var getExceptionsSubdomain = function getExceptionsSubdomain() {
  var hublet = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return "exceptions" + getHubletSuffix(hublet);
};

var getHubspotDomain = function getHubspotDomain() {
  var isQa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (isQa) {
    return 'hubspotqa.com';
  }

  return 'hubspot.com';
};

var getEmbedReportingDomain = function getEmbedReportingDomain() {
  var isQa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  if (isQa) {
    return 'hs-embed-reportingqa.com';
  }

  return 'hs-embed-reporting.com';
};

export var getHubspotReportingUrl = function getHubspotReportingUrl() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$hublet = _ref.hublet,
      hublet = _ref$hublet === void 0 ? '' : _ref$hublet,
      _ref$isQa = _ref.isQa,
      isQa = _ref$isQa === void 0 ? false : _ref$isQa;

  return "https://" + getFormsSubdomain(hublet) + "." + getHubspotDomain(isQa) + "/" + APP_ROUTE;
};
export var getEmbedAppReportingUrl = function getEmbedAppReportingUrl() {
  var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref2$hublet = _ref2.hublet,
      hublet = _ref2$hublet === void 0 ? '' : _ref2$hublet,
      _ref2$isQa = _ref2.isQa,
      isQa = _ref2$isQa === void 0 ? false : _ref2$isQa;

  return "https://" + getExceptionsSubdomain(hublet) + "." + getEmbedReportingDomain(isQa) + "/" + APP_ROUTE;
};