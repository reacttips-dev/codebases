'use es6';

import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
export default function (_ref) {
  var sequenceEnrollment = _ref.sequenceEnrollment,
      erroringSteps = _ref.erroringSteps;
  var currentStartingStep = sequenceEnrollment.get('startingStepOrder');
  var hasPrivateTemplate = sequenceEnrollment.get('steps').some(function (step, index) {
    if (index < currentStartingStep) {
      return false;
    }

    if (step.get('action') === SEND_TEMPLATE) {
      var body = step.getIn(['actionMeta', 'templateMeta', 'body']);
      return body === null;
    }

    return false;
  });
  return erroringSteps && !erroringSteps.isEmpty() || hasPrivateTemplate;
}