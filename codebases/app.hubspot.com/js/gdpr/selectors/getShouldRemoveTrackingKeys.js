'use es6';

import { createSelector } from 'reselect';
import { getLatestWidgetData } from '../../widget-data/selectors/getLatestWidgetData';
import { getGlobalCookieOptOut } from '../../visitor-identity/selectors/getGlobalCookieOptOut';
import { getIsPortal53Prod } from '../../widget-data/operators/getIsPortal53Prod';
import { getShouldListenToGdprBannerConsent } from '../../widget-data/operators/getShouldListenToGdprBannerConsent';
export var getShouldRemoveTrackingKeys = createSelector([getLatestWidgetData, getGlobalCookieOptOut], function (widgetData, globalCookieOptOut) {
  var isPortal53 = getIsPortal53Prod();
  var shouldListenToGdprBannerConsent = getShouldListenToGdprBannerConsent(widgetData);

  if (isPortal53) {
    return !shouldListenToGdprBannerConsent && globalCookieOptOut;
  }

  return globalCookieOptOut;
});