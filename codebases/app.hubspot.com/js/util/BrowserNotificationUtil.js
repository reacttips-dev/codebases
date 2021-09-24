'use es6';

import { getStorageItem } from 'notification-storage';
import { BROWSER_NOTIFICATION_LAST_SUBSCRIBED, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_ACCEPT_TIME, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_DISMISS_TIME, BROWSER_SUBSCRIPTION_TIMEOUT, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_RESHOW_THRESHOLD, GRANTED, DENY } from '../constants/BrowserNotificationConstants';
import { BROWSER } from '../constants/DeliveryMethods';
import { BROWSER_STORAGE_KEY } from '../constants/StorageConstants';
import { debug } from './DebugUtil';
export function hasDeniedNotificationsPermission() {
  return window.Notification.permission === DENY;
}
export function hasGrantedNotificationsPermission() {
  return window.Notification.permission === GRANTED;
}
export function shouldShowPrePermissionPopup() {
  if (hasDeniedNotificationsPermission() || hasGrantedNotificationsPermission()) {
    return false;
  }

  var lastAcceptTime = getStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_ACCEPT_TIME) || 0;
  var lastDenyTime = getStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_DISMISS_TIME) || 0;
  var sinceLastInteraction = Date.now() - Math.max(lastAcceptTime, lastDenyTime);
  return sinceLastInteraction > BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_RESHOW_THRESHOLD;
}
export function supportsNotifications() {
  return 'Notification' in window;
}
export function supportsServiceWorkers() {
  return 'serviceWorker' in navigator;
}
export function hasBrowserDeliveryMethod(notification) {
  return notification.deliveryMethods && notification.deliveryMethods.indexOf(BROWSER) > -1;
}
export function hasInteractedWithPrePermissionsPopup() {
  return getStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_ACCEPT_TIME) || getStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_PRE_PERMISSION_POPUP_DISMISS_TIME);
}
export function hasSubscribedToday() {
  var lastSubscribed = getStorageItem(BROWSER_STORAGE_KEY, BROWSER_NOTIFICATION_LAST_SUBSCRIBED);
  var now = Date.now();
  var timeSinceLastSubscribed = now - lastSubscribed;
  return timeSinceLastSubscribed < BROWSER_SUBSCRIPTION_TIMEOUT;
}
export var canReceiveBrowserNotifications = function canReceiveBrowserNotifications() {
  if (!supportsNotifications()) {
    debug('Browser does not support notifications - not subscribing');
    return false;
  }

  if (hasDeniedNotificationsPermission()) {
    debug('Browser notification permission denied - not subscribing');
    return false;
  }

  if (!supportsServiceWorkers()) {
    debug("Browser doesn't support service workers");
    return false;
  }

  return true;
};