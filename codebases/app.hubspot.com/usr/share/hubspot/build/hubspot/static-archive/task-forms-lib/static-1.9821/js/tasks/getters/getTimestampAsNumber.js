'use es6';

import getPropertyValue from './getPropertyValue';
import safeTimestampAsNumber from '../../utils/safeTimestampAsNumber';
export default function getTimestampAsNumber(_ref) {
  var task = _ref.task,
      updates = _ref.updates,
      _ref$field = _ref.field,
      field = _ref$field === void 0 ? 'hs_timestamp' : _ref$field;
  var propertyValue = getPropertyValue({
    task: task,
    updates: updates,
    field: field
  });
  return safeTimestampAsNumber(propertyValue);
}