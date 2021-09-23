'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { FILTERED_CHANGE } from '../constants/messageTypes';
export var isFilteredChangeMessage = function isFilteredChangeMessage(message) {
  return getTopLevelType(message) === FILTERED_CHANGE;
};