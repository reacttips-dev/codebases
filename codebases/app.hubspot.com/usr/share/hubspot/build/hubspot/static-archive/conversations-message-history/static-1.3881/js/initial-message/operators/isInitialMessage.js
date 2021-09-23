'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { INITIAL_MESSAGE } from '../constants/messageType';
export var isInitialMessage = function isInitialMessage(message) {
  return getTopLevelType(message) === INITIAL_MESSAGE;
};