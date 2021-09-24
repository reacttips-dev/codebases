'use es6';

import { FINISH_ENROLLMENT } from 'sales-modal/constants/SequenceStepTypes';
export default function getVisibleSteps(sequenceEnrollment) {
  return sequenceEnrollment.get('steps').filter(function (step) {
    return step.get('action') !== FINISH_ENROLLMENT;
  });
}