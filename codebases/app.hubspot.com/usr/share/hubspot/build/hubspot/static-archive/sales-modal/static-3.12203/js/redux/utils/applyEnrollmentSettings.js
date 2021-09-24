'use es6';

import { threadSubject } from 'sales-modal/redux/utils/threadSubject';
import { setEmailSendTimesFromRange } from 'sales-modal/redux/utils/setEmailSendTimesFromRange';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      isBulkEnroll = _ref.isBulkEnroll,
      hasToggledThreadingOff = _ref.hasToggledThreadingOff,
      _ref$hasChangedTimeRa = _ref.hasChangedTimeRange,
      hasChangedTimeRange = _ref$hasChangedTimeRa === void 0 ? true : _ref$hasChangedTimeRa;
  var _sequenceEnrollment$s = sequenceEnrollment.sequenceSettings,
      useThreadedFollowUps = _sequenceEnrollment$s.useThreadedFollowUps,
      sendWindowStartsAtMin = _sequenceEnrollment$s.sendWindowStartsAtMin,
      sendWindowEndsAtMin = _sequenceEnrollment$s.sendWindowEndsAtMin;
  var updatedEnrollment = useThreadedFollowUps || hasToggledThreadingOff ? threadSubject({
    sequenceEnrollment: sequenceEnrollment,
    hasToggledThreadingOff: hasToggledThreadingOff
  }) : sequenceEnrollment;

  if (isBulkEnroll && hasChangedTimeRange) {
    updatedEnrollment = setEmailSendTimesFromRange({
      sequenceEnrollment: updatedEnrollment,
      start: sendWindowStartsAtMin,
      end: sendWindowEndsAtMin
    });
  }

  return updatedEnrollment;
}