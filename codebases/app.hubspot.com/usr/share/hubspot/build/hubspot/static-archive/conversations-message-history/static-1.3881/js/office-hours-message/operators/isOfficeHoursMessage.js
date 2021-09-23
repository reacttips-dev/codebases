'use es6';

import { getTopLevelType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { OFFICE_HOURS } from '../constants/messageTypes';
export var isOfficeHoursMessage = function isOfficeHoursMessage(message) {
  return getTopLevelType(message) === OFFICE_HOURS;
};