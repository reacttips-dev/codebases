'use es6';

import { Map as ImmutableMap } from 'immutable';
import { getProperty } from 'customer-data-objects/model/ImmutableModel';
export default function getPropertyValue(_ref) {
  var task = _ref.task,
      _ref$updates = _ref.updates,
      updates = _ref$updates === void 0 ? ImmutableMap() : _ref$updates,
      field = _ref.field;

  if (updates.has(field)) {
    return updates.get(field);
  }

  return getProperty(task, field);
}