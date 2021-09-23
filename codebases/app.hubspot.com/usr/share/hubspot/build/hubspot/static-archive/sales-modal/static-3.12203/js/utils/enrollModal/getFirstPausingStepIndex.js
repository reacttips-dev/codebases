'use es6';

import { List } from 'immutable';
import memoize from 'transmute/memoize';
import { wasExecuted } from 'sales-modal/utils/stepEnrollmentStates';

var getFirstPausingStepIndex = function getFirstPausingStepIndex(dependencies) {
  var stepEnrollments = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : List();
  var startingStepOrder = arguments.length > 2 ? arguments[2] : undefined;
  var finishedStepIndexes = stepEnrollments.filter(wasExecuted).map(function (completedStep) {
    return completedStep.get('stepOrder');
  });
  return dependencies.keySeq().toList().filterNot(function (stepOrder) {
    return stepOrder < startingStepOrder || finishedStepIndexes.includes(stepOrder);
  }).min();
};

export default memoize(getFirstPausingStepIndex);