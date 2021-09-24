'use es6';

import { THREAD_COMMENT } from '../constants/messageTypes';
import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
export var isThreadComment = function isThreadComment(message) {
  return getTopLevelType(message) === THREAD_COMMENT;
};