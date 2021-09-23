'use es6';

import applyEnrollmentSettings from 'sales-modal/redux/utils/applyEnrollmentSettings';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      startOfTimeRange = _ref.startOfTimeRange,
      endOfTimeRange = _ref.endOfTimeRange,
      eligibleFollowUpDays = _ref.eligibleFollowUpDays,
      useThreadedFollowUps = _ref.useThreadedFollowUps,
      taskReminderMinute = _ref.taskReminderMinute,
      individualTaskRemindersEnabled = _ref.individualTaskRemindersEnabled,
      isBulkEnroll = _ref.isBulkEnroll;
  var originalSettings = sequenceEnrollment.get('sequenceSettings');
  var hasToggledThreadingOff = originalSettings.get('useThreadedFollowUps') && !useThreadedFollowUps;
  var hasChangedTimeRange = originalSettings.get('sendWindowStartsAtMin') !== startOfTimeRange || originalSettings.get('sendWindowEndsAtMin') !== endOfTimeRange;
  var updatedEnrollment = sequenceEnrollment.mergeIn(['sequenceSettings'], {
    eligibleFollowUpDays: eligibleFollowUpDays,
    useThreadedFollowUps: useThreadedFollowUps,
    sendWindowStartsAtMin: startOfTimeRange,
    sendWindowEndsAtMin: endOfTimeRange,
    taskReminderMinute: taskReminderMinute,
    individualTaskRemindersEnabled: individualTaskRemindersEnabled,
    // The FE doesn't care about these properties anymore, but we need to include them when
    // enrolling or we'll fail BE validation. The new sequence object won't have these.
    sendingStrategy: originalSettings.sendingStrategy
  });
  return applyEnrollmentSettings({
    sequenceEnrollment: updatedEnrollment,
    hasToggledThreadingOff: hasToggledThreadingOff,
    hasChangedTimeRange: hasChangedTimeRange,
    isBulkEnroll: isBulkEnroll
  });
}