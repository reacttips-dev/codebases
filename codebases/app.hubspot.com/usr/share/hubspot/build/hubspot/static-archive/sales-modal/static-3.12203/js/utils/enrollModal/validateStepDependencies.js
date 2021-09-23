'use es6';

import { List } from 'immutable';
export default (function (sequenceEnrollment) {
  return sequenceEnrollment.update('steps', function (steps) {
    return steps.map(function (step) {
      return step.get('stepOrder') <= sequenceEnrollment.get('startingStepOrder') ? step.set('dependencies', List()) : step;
    });
  });
});