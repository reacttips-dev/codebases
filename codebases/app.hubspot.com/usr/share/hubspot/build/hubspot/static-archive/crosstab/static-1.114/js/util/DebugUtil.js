'use es6';

import { getStorageItem } from './StorageUtil';
var CROSS_TAB = 'CROSS_TAB';
var CROSS_TAB_DEBUG = 'CROSS_TAB_DEBUG';
export function isInAppNotificationsDebugEnabled() {
  return getStorageItem(CROSS_TAB_DEBUG) === 'true';
}
export function debug(message, value) {
  if (isInAppNotificationsDebugEnabled()) {
    var logMessage = CROSS_TAB + " - " + message;

    if (value) {
      // eslint-disable-next-line
      console.debug(logMessage, value);
    } else {
      // eslint-disable-next-line
      console.debug(logMessage);
    }
  }
}