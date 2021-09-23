'use es6';

export var APP = 'notifications';
export var BROWSER_NOTIFICATIONS_APP = 'browser-notifications'; // EVENT

export var HUBSPOT_ACCOUNT_ID = 53;
export var NOTIFICATIONS_APP = 'notification-station'; // ACTION NAMES

export var NOTIFICATION_CLICKED_ACTION = 'notification-clicked';
export var NOTIFICATION_DISMISSED_ACTION = 'notification-dismissed';
export var NOTIFICATION_SECONDARY_BUTTON_CLICKED_ACTION = 'notification-secondary-button-clicked';
export var TEASE_BTN_STOP_ACTION = 'tease-btn-stop-action';
export var TEASE_LINK_CLICK_ACTION = 'tease-link-click';
export var TEASE_MENU_OPEN_ACTION = 'tease-menu-open';
export var BROWSER_NOTIFICATIONS_IFRAME_LOADED_ACTION = 'browser-notifications-iframe-loaded';
export var DO_NOT_PLAY_FLOATING_SOUND = 'do-not-play-floating-sound'; // LINKS

export var GO_TO_PREFERENCES = 'go-to-preferences';
export var EVENTS = {
  NOTIFICATION_INTERACTION: 'notificationInteraction',
  BROWSER_NOTIFICATIONS_INTERACTION: 'browserNotificationsInteraction'
};
export var BROWSER_NOTIFICATION_ACTIONS = {
  NATIVE_REQUEST_ALLOW_CLICKED: 'native-request-permission-allow',
  NATIVE_REQUEST_DENY_CLICKED: 'native-request-permission-deny',
  NATIVE_REQUEST_PERMISSION_SHOWN: 'native-request-permission-shown',
  PRE_PERMISSION_CONTINUE_CLICKED: 'pre-permission-continue-clicked',
  PRE_PERMISSION_MAYBE_LATER_CLICKED: 'pre-permission-maybe-later-clicked',
  PRE_PERMISSION_SHOWN: 'pre-permission-shown'
};