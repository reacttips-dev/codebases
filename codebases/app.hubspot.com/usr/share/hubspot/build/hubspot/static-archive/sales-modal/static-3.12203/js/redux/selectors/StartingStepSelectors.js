'use es6';

import { Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import { nameForStartingStepType } from 'sales-modal/utils/enrollmentStartingStepName';
import memoize from 'transmute/memoize';
import getVisibleSteps from 'sales-modal/utils/enrollModal/getVisibleSteps';
var memoizedStepInfo = memoize(function (stepOrder, taskType, action) {
  return ImmutableMap({
    stepOrder: stepOrder,
    taskType: taskType,
    action: action
  });
});

var getStartingStepOrder = function getStartingStepOrder(sequenceEnrollment) {
  return sequenceEnrollment.get('startingStepOrder');
};

var toOption = function toOption(stepInfo) {
  return {
    text: nameForStartingStepType(stepInfo.get('action'), stepInfo.get('taskType'), stepInfo.get('stepOrder') + 1),
    value: stepInfo.get('stepOrder').toString()
  };
};

var getStepInfo = createSelector([getVisibleSteps], function (visibleSteps) {
  return visibleSteps.map(function (step) {
    return memoizedStepInfo(step.get('stepOrder'), step.getIn(['actionMeta', 'taskMeta', 'taskType']), step.get('action'));
  });
});
export var getInitialStepOptions = createSelector([getStepInfo, getStartingStepOrder], function (stepInfoList, startingStepOrder) {
  return stepInfoList.filter(function (step) {
    return step.get('stepOrder') >= startingStepOrder;
  }).map(toOption).toArray();
});
export var getInitialStepOptionsNonReenroll = createSelector([getStepInfo], function (stepInfoList) {
  return stepInfoList.map(toOption).toArray();
});