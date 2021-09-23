'use es6';

export var ReferenceError = function ReferenceError(_ref) {
  var type = _ref.type,
      error = _ref.error;
  return {
    type: type,
    reason: error
  };
};