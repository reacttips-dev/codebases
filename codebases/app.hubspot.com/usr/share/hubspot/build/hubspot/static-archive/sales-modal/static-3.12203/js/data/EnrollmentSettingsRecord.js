'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { Record } from 'immutable';
import { TIME_RANGE } from 'sales-modal/constants/SendTimesTypes';
import * as DefaultSendTimeRange from 'sales-modal/constants/DefaultSendTimeRange';
import { BUSINESS_DAYS } from 'sales-modal/constants/EligibleFollowUpDays';
import { LEAD_BASED } from 'sales-modal/constants/SellingStrategyTypes';
var EnrollmentSettingsBase = Record({
  eligibleFollowUpDays: BUSINESS_DAYS,
  useThreadedFollowUps: true,
  sendingStrategy: TIME_RANGE,
  // TODO BE requires this but we dont need it anymore
  sendWindowStartsAtMin: DefaultSendTimeRange.START_MINUTES,
  sendWindowEndsAtMin: DefaultSendTimeRange.END_MINUTES,
  sellingStrategy: LEAD_BASED,
  timeZone: 'US/Eastern',
  taskReminderMinute: DefaultSendTimeRange.START_MINUTES,
  individualTaskRemindersEnabled: false
}, 'EnrollmentSettingsRecord');

var EnrollmentSettingsRecord = /*#__PURE__*/function (_EnrollmentSettingsBa) {
  _inherits(EnrollmentSettingsRecord, _EnrollmentSettingsBa);

  function EnrollmentSettingsRecord() {
    _classCallCheck(this, EnrollmentSettingsRecord);

    return _possibleConstructorReturn(this, _getPrototypeOf(EnrollmentSettingsRecord).apply(this, arguments));
  }

  _createClass(EnrollmentSettingsRecord, null, [{
    key: "init",
    value: function init(_ref) {
      var sequenceSettings = _ref.sequenceSettings;

      // In case there's a really old enrollment without settings
      if (!sequenceSettings) {
        return new EnrollmentSettingsRecord();
      }

      return new EnrollmentSettingsRecord({
        eligibleFollowUpDays: sequenceSettings.get('eligibleFollowUpDays'),
        sellingStrategy: sequenceSettings.get('sellingStrategy'),
        sendWindowStartsAtMin: sequenceSettings.get('sendWindowStartsAtMin'),
        sendWindowEndsAtMin: sequenceSettings.get('sendWindowEndsAtMin'),
        sendingStrategy: sequenceSettings.get('sendingStrategy'),
        timeZone: sequenceSettings.get('timeZone'),
        useThreadedFollowUps: sequenceSettings.get('useThreadedFollowUps'),
        taskReminderMinute: sequenceSettings.get('taskReminderMinute'),
        individualTaskRemindersEnabled: sequenceSettings.get('individualTaskRemindersEnabled')
      });
    }
  }]);

  return EnrollmentSettingsRecord;
}(EnrollmentSettingsBase);

export { EnrollmentSettingsRecord as default };