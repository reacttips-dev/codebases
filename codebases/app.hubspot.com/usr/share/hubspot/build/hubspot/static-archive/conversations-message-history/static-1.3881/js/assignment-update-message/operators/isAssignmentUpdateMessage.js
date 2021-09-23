'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { ASSIGNMENT_UPDATE } from '../constants/messageTypes';
export var isAssignmentUpdateMessage = function isAssignmentUpdateMessage(message) {
  return getTopLevelType(message) === ASSIGNMENT_UPDATE;
};