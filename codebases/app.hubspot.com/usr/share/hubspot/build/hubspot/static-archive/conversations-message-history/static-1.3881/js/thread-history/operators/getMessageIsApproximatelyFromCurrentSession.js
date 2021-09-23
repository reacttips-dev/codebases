'use es6';

import { getTimestamp } from '../../common-message-format/operators/commonMessageFormatGetters';
import { SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS } from '../constants/ThreadHistoryConstants';
export var getMessageIsApproximatelyFromCurrentSession = function getMessageIsApproximatelyFromCurrentSession(message) {
  return Date.now() - getTimestamp(message) < SESSION_EXPIRY_TIME_APPROXIMATION_IN_MS;
};