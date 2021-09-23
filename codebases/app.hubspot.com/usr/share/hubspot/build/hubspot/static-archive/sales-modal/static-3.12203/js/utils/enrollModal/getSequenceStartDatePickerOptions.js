'use es6';

import I18n from 'I18n';
import memoize from 'transmute/memoize';
import { SEND_TEMPLATE, SCHEDULE_TASK } from 'sales-modal/constants/SequenceStepTypes';
import { SEND_IMMEDIATELY, SEND_SPECIFIC_TIME } from 'sales-modal/constants/FirstSendTypes';
import { EnrollTypes } from 'sales-modal/constants/EnrollTypes';

var getTemplateOptions = function getTemplateOptions(_ref) {
  var enrollType = _ref.enrollType,
      startingStepOrder = _ref.startingStepOrder,
      stepIndex = _ref.stepIndex;
  var sequenceIsBeingEdited = enrollType === EnrollTypes.EDIT || enrollType === EnrollTypes.RESUME;

  if (sequenceIsBeingEdited && stepIndex !== startingStepOrder) {
    return [{
      text: I18n.text('enrollModal.sendTimes.firstSendTime.sendLater'),
      value: SEND_SPECIFIC_TIME
    }];
  }

  return [{
    text: I18n.text('enrollModal.sendTimes.firstSendTime.sendNow'),
    value: SEND_IMMEDIATELY
  }, {
    text: I18n.text('enrollModal.sendTimes.firstSendTime.sendLater'),
    value: SEND_SPECIFIC_TIME
  }];
};

var getTaskOptions = function getTaskOptions() {
  return [{
    text: I18n.text('enrollModal.sendTimes.firstSendTime.createImmediately'),
    value: SEND_IMMEDIATELY
  }, {
    text: I18n.text('enrollModal.sendTimes.firstSendTime.createOnSpecificDate'),
    value: SEND_SPECIFIC_TIME
  }];
};

export default memoize(function (_ref2) {
  var enrollType = _ref2.enrollType,
      startingStepOrder = _ref2.startingStepOrder,
      stepIndex = _ref2.stepIndex,
      stepType = _ref2.stepType;

  if (stepType === SEND_TEMPLATE) {
    return getTemplateOptions({
      enrollType: enrollType,
      startingStepOrder: startingStepOrder,
      stepIndex: stepIndex
    });
  }

  if (stepType === SCHEDULE_TASK) {
    return getTaskOptions();
  }

  return [];
});