'use es6';

import PortalIdParser from 'PortalIdParser';
import { getStorageItem } from 'notification-storage';
import { CACHE_TIMEOUT, PERSISTENT_NOTIFICATIONS_HAS_BANNER_NOTIFICATIONS, PERSISTENT_NOTIFICATIONS_LAST_CHECKED } from '../constants/PersistentNotificationConstants';
import { PERSISTENT_STORAGE_KEY } from '../constants/StorageConstants';
import { NEW_NAV_ID, OLD_NAV_ID } from '../constants/ViewConstants';
import { debug, isNotificationsDebugEnabled } from './DebugUtil';
import { getPortalKey } from './StorageUtil';
var BANNER_SRC = "/banner-notifications/" + PortalIdParser.get();
var BANNER_IFRAME_ID = 'notifications-banner-iframe';
var PROMPT_SOURCE_NAME = 'PROMPTS';

function getNav() {
  return window.top.document.getElementById(OLD_NAV_ID) || window.top.document.getElementById(NEW_NAV_ID);
}

export function bannerIframeExists() {
  return window.top.document.getElementById(BANNER_IFRAME_ID);
}
export function loadBannerIframe() {
  var nav = getNav();

  if (!nav) {
    debug('Nav is not available, returning');
    return;
  }

  var iframe = window.top.document.createElement('iframe');
  iframe.setAttribute('src', BANNER_SRC);
  iframe.setAttribute('id', BANNER_IFRAME_ID);
  var iframeStyle = iframe.style;
  iframeStyle.border = '0';
  iframeStyle.display = 'block';
  iframeStyle.height = '0';
  iframeStyle.transitionDuration = '.2s';
  iframeStyle.width = '100%';
  nav.parentNode.insertBefore(iframe, nav);
}
export function shouldCheckForNotifications() {
  var hasBannerNotifications = getStorageItem(PERSISTENT_STORAGE_KEY, getPortalKey(PERSISTENT_NOTIFICATIONS_HAS_BANNER_NOTIFICATIONS));
  var lastChecked = getStorageItem(PERSISTENT_STORAGE_KEY, getPortalKey(PERSISTENT_NOTIFICATIONS_LAST_CHECKED));
  var now = Date.now();
  var timeSinceLastChecked = now - lastChecked;
  return isNotificationsDebugEnabled() || !lastChecked || hasBannerNotifications || timeSinceLastChecked > CACHE_TIMEOUT;
}
export function isPromptNotification(notification) {
  var source = notification.origin && notification.origin.name;
  return source === PROMPT_SOURCE_NAME;
}