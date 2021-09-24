'use es6';

import { getPersistedFromNumberWithFallback } from 'calling-lifecycle-internal/utils/getLocalCallSettings';
export var setFromNumberWithFallback = function setFromNumberWithFallback(_ref) {
  var fromNumberKey = _ref.fromNumberKey,
      fromNumbers = _ref.fromNumbers,
      state = _ref.state;
  var defaultFromNumber = getPersistedFromNumberWithFallback({
    fromNumberKey: fromNumberKey,
    fromNumbers: fromNumbers
  });
  return state.set(fromNumberKey, defaultFromNumber);
};