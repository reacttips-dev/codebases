'use es6';

import { createSelector } from 'reselect';
import get from 'transmute/get';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { getCallableObjects } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
import { isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
export var getCalleesFromState = get('callees');
export var getCalleesDataFromState = createSelector([getCalleesFromState], function (callees) {
  return getData(callees);
});
export var getCallableObjectsFromState = createSelector([getCalleesDataFromState], function (calleesData) {
  return getCallableObjects(calleesData);
});
export var getHasNoAssociatedCalleesFromState = createSelector([getCallableObjectsFromState, getCalleesFromState], function (callableObjects, callees) {
  if (!isSucceeded(callees)) {
    return false;
  }

  return callableObjects.size === 0;
});
export var getCallableObjectListFromState = createSelector([getCallableObjectsFromState], function (callableObjects) {
  return callableObjects;
});