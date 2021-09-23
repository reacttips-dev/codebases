'use es6';

import { Set as ImmutableSet } from 'immutable';
import { MEETING } from '../engagement/EngagementTypes';
import { LINKED_IN, LINKED_IN_CONNECT, LINKED_IN_MESSAGE } from '../engagement/TaskTypes';
/**
 * Filters an array of task types, removing deprecated types
 * @param {String} taskType type of current task. Impacts which task types are filtered out
 * @param {Array} typeOptions list of task types to filter. Each object in the array should have a 'value' property equal to the task type
 * @param {Boolean} removeLinkedInTypes if true, will remove some or all LinkedIn types based on the current task's type. If false, removes none.
 * @returns filtered array of task types
 */

export var getFilteredTaskTypes = function getFilteredTaskTypes(taskType, typeOptions) {
  var removeLinkedInTypes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  if (!typeOptions) {
    return [];
  } // Deprecated task types to always filter out
  // LINKED_IN is duplicate of LINKED_IN_MESSAGE but can still be present in task objects,
  // so want to keep LINKED_IN_MESSAGE in those cases


  var taskTypesToRemove = ImmutableSet([LINKED_IN, MEETING]);

  if (removeLinkedInTypes) {
    taskTypesToRemove = taskTypesToRemove.union([LINKED_IN_MESSAGE, LINKED_IN_CONNECT]);

    if (taskType === LINKED_IN || taskType === LINKED_IN_MESSAGE) {
      taskTypesToRemove = taskTypesToRemove.delete(LINKED_IN_MESSAGE);
    }

    if (taskType === LINKED_IN_CONNECT) {
      taskTypesToRemove = taskTypesToRemove.delete(LINKED_IN_CONNECT);
    }
  }

  return typeOptions.filter(function (taskTypeOption) {
    return !taskTypesToRemove.includes(taskTypeOption.value);
  });
};