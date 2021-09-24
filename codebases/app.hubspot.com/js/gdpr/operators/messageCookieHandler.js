'use es6';

import { gdprCookieConsentOnExitIntentEnabled, gdprCookieConsentOnWidgetLoadEnabled } from '../../utils/gdprCookieConsentPromptHelpers';
import { getIsPrivateLoad } from '../../widget-data/operators/getIsPrivateLoad';
import { getShouldRemoveTrackingKeys } from '../selectors/getShouldRemoveTrackingKeys';
import { getGlobalCookieOptOut } from '../../visitor-identity/selectors/getGlobalCookieOptOut';
import { gdprConsentToProcessEnabled } from 'conversations-internal-schema/widget-data/operators/gdprConsentToProcessEnabled';
import { getAPIEnableWidgetCookieBannerOnExitIntent } from '../../widget-ui/selectors/getAPIEnableWidgetCookieBannerOnExitIntent';
import { getAPIEnableWidgetCookieBanner } from '../../widget-ui/selectors/getAPIEnableWidgetCookieBanner';
import { getIsFirstVisitorSession } from '../../visitor-identity/selectors/getIsFirstVisitorSession';
import { localStorageKeys } from '../../localStorage/constants/storageKeys';
export var messageCookieHandler = function messageCookieHandler(_ref) {
  var currentState = _ref.currentState,
      widgetData = _ref.widgetData;
  var cookieConsentOnExitEnabled = gdprCookieConsentOnExitIntentEnabled(currentState, widgetData);
  var cookieConsentOnWidgetLoadEnabled = gdprCookieConsentOnWidgetLoadEnabled(widgetData);
  var isPrivateLoad = getIsPrivateLoad(widgetData);
  var shouldRemoveTrackingKeys = getShouldRemoveTrackingKeys(currentState);
  var globalOptOut = getGlobalCookieOptOut(currentState);
  var shouldStoreMessagesCookie = !gdprConsentToProcessEnabled(widgetData) && !cookieConsentOnExitEnabled && !getAPIEnableWidgetCookieBannerOnExitIntent(currentState) && !cookieConsentOnWidgetLoadEnabled && !getAPIEnableWidgetCookieBanner(currentState) && !isPrivateLoad && !globalOptOut;
  var shouldRemoveLocalStorageKeys = !shouldStoreMessagesCookie && getIsFirstVisitorSession(currentState) && shouldRemoveTrackingKeys;

  if (shouldRemoveLocalStorageKeys) {
    try {
      localStorage.removeItem(localStorageKeys.HUBLYTICS_EVENTS_53);
      localStorage.removeItem(localStorageKeys.HMPL);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Unable to access localStorage');
    }
  }

  return shouldStoreMessagesCookie;
};