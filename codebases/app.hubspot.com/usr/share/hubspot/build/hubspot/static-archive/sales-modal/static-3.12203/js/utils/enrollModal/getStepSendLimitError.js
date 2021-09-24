'use es6';

import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
export var getStepSendLimitError = function getStepSendLimitError(_ref) {
  var stepsWithSendTimeErrors = _ref.stepsWithSendTimeErrors,
      sequenceEnrollment = _ref.sequenceEnrollment,
      index = _ref.index;

  if (sequenceEnrollment.getIn(['steps', index, 'action']) !== SEND_TEMPLATE) {
    return null;
  }

  return stepsWithSendTimeErrors.get(index);
};