'use es6';

import { createFrozenSelector } from '../../utils/createFrozenSelector';
export var getRouterStateSlice = function getRouterStateSlice(_ref) {
  var routerState = _ref.routerState;
  return routerState;
};
export var getCurrentObjectTypeId = createFrozenSelector([getRouterStateSlice], function (_ref2) {
  var currentObjectTypeId = _ref2.currentObjectTypeId;
  return currentObjectTypeId;
});