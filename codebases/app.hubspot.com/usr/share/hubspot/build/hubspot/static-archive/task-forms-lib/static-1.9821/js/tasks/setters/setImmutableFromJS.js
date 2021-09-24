'use es6';

import { fromJS } from 'immutable';
export default function setImmutableFromJS(_ref) {
  var __task = _ref.task,
      updates = _ref.updates,
      field = _ref.field,
      value = _ref.value;
  return updates.set(field, fromJS(value));
}