'use es6';

import SafeStorage from 'SafeStorage';
var NOTIFICATIONS = 'NOTIFICATIONS';
var NOTIFICATIONS_DEBUG = 'NOTIFICATIONS_DEBUG';
var NOTIFICATIONS_DISABLE = 'NOTIFICATIONS_DISABLE';
export function isNotificationsDebugEnabled() {
  return SafeStorage.getItem(NOTIFICATIONS_DEBUG) === 'true';
}
export function isNotificationsDisabled() {
  return SafeStorage.getItem(NOTIFICATIONS_DISABLE);
}
export function debug(message, value) {
  if (isNotificationsDebugEnabled()) {
    var debugMessage = NOTIFICATIONS + " - " + message;

    if (value) {
      console.debug(debugMessage, value);
    } else {
      console.debug(debugMessage);
    }
  }
}