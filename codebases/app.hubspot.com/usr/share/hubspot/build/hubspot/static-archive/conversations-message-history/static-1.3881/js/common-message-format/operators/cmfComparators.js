'use es6';

import get from 'transmute/get';
import { LIVE_CHAT } from 'conversations-internal-schema/constants/ThreadSources';
import { CRM, EMAIL } from '../constants/contentTypes';
import { VISITOR_SENDER } from '../constants/cmfSenderTypes';
import { COMMON_MESSAGE } from '../constants/messageTypes';
import { getStatusSource, getSenderTypeForCMF } from './commonMessageFormatGetters';
export var isCommonMessageFormat = function isCommonMessageFormat(message) {
  return get('@type', message) === COMMON_MESSAGE;
};
export var isCrmMessage = function isCrmMessage(message) {
  return isCommonMessageFormat(message) && getStatusSource(message) === CRM;
};
export var isEmailCMF = function isEmailCMF(message) {
  return isCommonMessageFormat(message) && getStatusSource(message) === EMAIL;
};
export var isChatMessage = function isChatMessage(message) {
  return isCommonMessageFormat(message) && !isEmailCMF(message);
};
export var isLiveChatPlainText = function isLiveChatPlainText(message) {
  return isCommonMessageFormat(message) && getSenderTypeForCMF(message) === VISITOR_SENDER && getStatusSource(message) === LIVE_CHAT;
};
export var isForwardableCMF = function isForwardableCMF(message) {
  return isCommonMessageFormat(message) && (isEmailCMF(message) || isCrmMessage(message));
};