'use es6';

export default function setPropertyValue(_ref) {
  var __task = _ref.task,
      updates = _ref.updates,
      field = _ref.field,
      value = _ref.value;
  return updates.set(field, value);
}