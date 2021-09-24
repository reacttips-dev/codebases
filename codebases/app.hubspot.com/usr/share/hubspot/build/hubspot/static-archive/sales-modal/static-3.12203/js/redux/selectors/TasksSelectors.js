'use es6';

import { createSelector } from 'reselect';

var tasksMap = function tasksMap(state) {
  return state.tasks;
};

export var taskIdFromCompletedStep = function taskIdFromCompletedStep(state, ownProps) {
  return ownProps.completedStep ? ownProps.completedStep.getIn(['executedMeta', 'taskId'], null) : null;
};
export var hasRequestedTaskForCompletedStep = createSelector([tasksMap, taskIdFromCompletedStep], function (tasks, taskId) {
  return tasks.has(taskId);
});
export var taskForCompletedStep = createSelector([tasksMap, taskIdFromCompletedStep], function (tasks, taskId) {
  return tasks.get(taskId, null);
});