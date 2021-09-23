'use es6';

import { Map as ImmutableMap } from 'immutable';
import memoize from 'transmute/memoize';
import { stringify } from 'hub-http/helpers/params';
var getBodyParams = memoize(function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  return ImmutableMap({
    formSubmissionMode: ['none'],
    identityProfileMode: ['all'],
    propertyMode: ['value_only'],
    resolveAssociations: [false],
    resolveOwner: [false],
    showAnalyticsDetails: [false],
    showListMemberships: [options.get('showListMemberships')],
    showPastListMemberships: [false],
    showPublicToken: [false],
    showSourceMetadata: [false]
  });
});
var getQueryParams = memoize(function (options) {
  return getBodyParams(options).map(function (value) {
    return value[0];
  });
});
var getQueryParamStr = memoize(function (options) {
  return stringify(getQueryParams(options).toJS());
});
export { getBodyParams, getQueryParams, getQueryParamStr };