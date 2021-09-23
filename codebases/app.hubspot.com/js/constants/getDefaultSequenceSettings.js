'use es6';

import { fromJS } from 'immutable';
import * as EligibleFollowUpDays from 'SequencesUI/constants/EligibleFollowUpDays';
import * as SendingStrategyTypes from 'SequencesUI/constants/SendingStrategyTypes';
import * as SellingStrategyTypes from 'SequencesUI/constants/SellingStrategyTypes';
var SEND_WINDOW_STARTS_AT_MIN = 8 * 60;
var SEND_WINDOW_ENDS_AT_MIN = 18 * 60;
var DEFAULT_TASK_TIME = 8 * 60;
export default (function () {
  var defaultSequenceSettings = fromJS({
    eligibleFollowUpDays: EligibleFollowUpDays.BUSINESS_DAYS,
    useThreadedFollowUps: true,
    sendingStrategy: SendingStrategyTypes.TIME_RANGE,
    sellingStrategy: SellingStrategyTypes.LEAD_BASED,
    sendWindowStartsAtMin: SEND_WINDOW_STARTS_AT_MIN,
    sendWindowEndsAtMin: SEND_WINDOW_ENDS_AT_MIN,
    timeZone: 'US/Eastern',
    taskReminderMinute: DEFAULT_TASK_TIME,
    individualTaskRemindersEnabled: false
  });
  return defaultSequenceSettings;
});