'use es6';

import getIn from 'transmute/getIn';
import { CAPTURE_VISITOR_EMAIL_ADDRESS, CLIENT_TRIGGERS, CONSENT_TO_COMMUNICATE_SUBSCRIPTION_ID, CUSTOM_CONSENT_TO_COMMUNICATE_MESSAGE, CUSTOM_CONSENT_TO_PROCESS_MESSAGE, CUSTOM_EMAIL_CAPTURE_DELAY, GDPR_CONSENT_TO_COMMUNICATE_ENABLED, GDPR_CONSENT_TO_PROCESS_ENABLED, GDPR_EXPLICIT_CONSENT_REQUIRED, GDPR_COOKIE_CONSENT_PROMPT, ID, INBOX_ID, LANGUAGE, POP_MESSAGE_ON_SMALL_SCREENS, POP_OPEN_WELCOME_MESSAGE, POP_OPEN_WIDGET, ROUTING_RULES, SEND_FROM_ROUTING_RULES, TYPE } from '../constants/keyPaths';
export var getCaptureVisitorEmailAddress = getIn(CAPTURE_VISITOR_EMAIL_ADDRESS);
export var getChatHeadingConfig = getIn(['chatHeadingConfig']);
export var getClientTriggers = getIn(CLIENT_TRIGGERS);
export var getConsentToCommunicateSubscriptionId = getIn(CONSENT_TO_COMMUNICATE_SUBSCRIPTION_ID);
export var getCustomConsentToCommunicateMessage = function getCustomConsentToCommunicateMessage(message) {
  return getIn(CUSTOM_CONSENT_TO_COMMUNICATE_MESSAGE, message) || '';
};
export var getCustomConsentToProcessMessage = function getCustomConsentToProcessMessage(message) {
  return getIn(CUSTOM_CONSENT_TO_PROCESS_MESSAGE, message) || '';
};
export var getCustomEmailCaptureDelay = getIn(CUSTOM_EMAIL_CAPTURE_DELAY);
export var getGdprConsentToCommunicateEnabled = getIn(GDPR_CONSENT_TO_COMMUNICATE_ENABLED);
export var getGdprConsentToProcessEnabled = getIn(GDPR_CONSENT_TO_PROCESS_ENABLED);
export var getGdprExplicitConsentRequired = getIn(GDPR_EXPLICIT_CONSENT_REQUIRED);
export var getGdprCookieConsentPrompt = getIn(GDPR_COOKIE_CONSENT_PROMPT);
export var getId = getIn(ID);
export var getInboxId = getIn(INBOX_ID);
export var getLanguage = getIn(LANGUAGE);
export var getPopMessageOnSmallScreens = getIn(POP_MESSAGE_ON_SMALL_SCREENS);
export var getPopOpenWelcomeMessage = getIn(POP_OPEN_WELCOME_MESSAGE);
export var getPopOpenWidget = getIn(POP_OPEN_WIDGET);
export var getRoutingRules = getIn(ROUTING_RULES);
export var getSendFromRoutingRules = getIn(SEND_FROM_ROUTING_RULES);
export var getType = getIn(TYPE);