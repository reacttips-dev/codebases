'use es6';

import get from 'transmute/get';
import { List, Map as ImmutableMap } from 'immutable';
import getPropertyValue from './getPropertyValue';
import safeTimestampAsNumber from '../../utils/safeTimestampAsNumber';

function unwrap(maybeArray) {
  if (Array.isArray(maybeArray) || List.isList(maybeArray)) {
    return get(0, maybeArray);
  }

  return maybeArray;
}

export default function getFirstReminder(_ref) {
  var task = _ref.task,
      _ref$updates = _ref.updates,
      updates = _ref$updates === void 0 ? ImmutableMap() : _ref$updates,
      _ref$field = _ref.field,
      field = _ref$field === void 0 ? 'hs_task_reminders' : _ref$field;
  return safeTimestampAsNumber(unwrap(getPropertyValue({
    task: task,
    updates: updates,
    field: field
  })));
}