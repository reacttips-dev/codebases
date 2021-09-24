'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { EMAIL_CAPTURE_RESPONSE } from '../constants/messageTypes';
export var isEmailCaptureResponseMessage = function isEmailCaptureResponseMessage(message) {
  return getTopLevelType(message) === EMAIL_CAPTURE_RESPONSE;
};