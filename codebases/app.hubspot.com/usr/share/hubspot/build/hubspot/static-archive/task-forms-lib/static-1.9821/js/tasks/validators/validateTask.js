'use es6';

import { Map as ImmutableMap } from 'immutable';
import applyUpdatesToTask from '../../utils/applyUpdatesToTask';
export default function validateTask(_ref) {
  var task = _ref.task,
      updates = _ref.updates,
      validators = _ref.validators;
  var updatedTask = applyUpdatesToTask(task, updates);
  return validators.reduce(function (validationState, validator) {
    var validatorState = validator(updatedTask, {
      updates: updates
    });
    return validationState.mergeDeep(validatorState);
  }, ImmutableMap({
    errors: ImmutableMap(),
    messages: ImmutableMap()
  })).toObject();
}