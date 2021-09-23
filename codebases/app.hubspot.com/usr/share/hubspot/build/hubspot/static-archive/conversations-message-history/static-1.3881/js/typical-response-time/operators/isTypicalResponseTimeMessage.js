'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { TYPICAL_RESPONSE_TIME } from '../constants/messageTypes';
export var isTypicalResponseTimeMessage = function isTypicalResponseTimeMessage(message) {
  return getTopLevelType(message) === TYPICAL_RESPONSE_TIME;
};