'use es6';

import { createFrozenSelector } from '../../utils/createFrozenSelector';
import getIn from 'transmute/getIn';

var getSlice = function getSlice(state) {
  return state.doubleOptIn;
};

export var getDoubleOptInFetchStatus = createFrozenSelector([getSlice], function (slice) {
  return slice.status;
});
export var getIsDoubleOptInEnabled = createFrozenSelector([getSlice], function (slice) {
  return getIn(['data', 'enabledInAnyWay'], slice) || false;
});