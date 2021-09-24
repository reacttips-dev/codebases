'use es6';

import keyMirror from 'react-utils/keyMirror';
import PortalIdParser from 'PortalIdParser';
export var Formats = {
  CSV: 'csv',
  XLS: 'xls',
  XLSX: 'xlsx'
};
export var FormatValues = Object.values(Formats || {});
export var ExportStates = keyMirror({
  NOT_REQUESTED: null,
  PENDING: null,
  SUCCEEDED: null,
  FAILED: null
});
export var PreferenceState = keyMirror({
  NOT_REQUESTED: null,
  PENDING: null,
  SUCCEEDED: null,
  FAILED: null
});
export var FailureReasons = keyMirror({
  NO_NETWORK: null,
  UNBOUNCE_FAILED: null,
  UNKNOWN: null
});
export var DefaultFieldKeys = {
  EMAIL: 'email',
  FORMAT: 'format'
};
export var EmailValidationStates = keyMirror({
  VALID: null,
  INVALID: null
});
export var EmailValidationStateNames = Object.keys(EmailValidationStates);
export var ExportPreferences = {
  SEND: 'SEND',
  DO_NOT_SEND: 'DO_NOT_SEND'
};
export var Urls = {
  allowlistUrl: 'https://knowledge.hubspot.com/articles/KCS_Article/Email/What-steps-can-I-take-to-ensure-HubSpot-emails-get-delivered-to-my-inbox',
  notificationUrl: 'https://knowledge.hubspot.com/articles/kcs_article/messages/why-am-i-not-receiving-push-notifications-for-messages-in-my-browser',
  notificationCenterUrl: "/notification-preferences/" + PortalIdParser.get()
};