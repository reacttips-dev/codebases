'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { EMAIL_CAPTURE_PROMPT } from '../constants/messageTypes';
export var isEmailCapturePromptMessage = function isEmailCapturePromptMessage(message) {
  return getTopLevelType(message) === EMAIL_CAPTURE_PROMPT;
};