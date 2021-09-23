'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { AWAY_MODE_CHANGE } from '../constants/messageTypes';
export var isAgentAvailabilityMessage = function isAgentAvailabilityMessage(message) {
  return getTopLevelType(message) === AWAY_MODE_CHANGE;
};