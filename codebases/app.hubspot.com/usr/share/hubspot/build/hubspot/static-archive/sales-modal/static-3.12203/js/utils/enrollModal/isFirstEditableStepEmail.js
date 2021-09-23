'use es6';

import memoize from 'transmute/memoize';
import { SEND_TEMPLATE } from 'sales-modal/constants/SequenceStepTypes';
import getFirstEditableStepIndex from './getFirstEditableStepIndex';
var isFirstEditableStepEmail = memoize(function (sequenceEnrollment) {
  var firstEditableStepIndex = getFirstEditableStepIndex(sequenceEnrollment);
  var firstEditableStep = sequenceEnrollment.steps.get(firstEditableStepIndex);
  return firstEditableStep.get('action') === SEND_TEMPLATE;
});
export default isFirstEditableStepEmail;