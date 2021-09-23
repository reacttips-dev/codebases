'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { READ_THREAD } from '../constants/messageTypes';
export var isReadThreadMessage = function isReadThreadMessage(message) {
  return getTopLevelType(message) === READ_THREAD;
};