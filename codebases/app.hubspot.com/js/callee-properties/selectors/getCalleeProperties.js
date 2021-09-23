'use es6';

import get from 'transmute/get';
import { Seq, Map as ImmutableMap } from 'immutable';
import { createSelector } from 'reselect';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
export var getCalleePropertiesFromState = get('calleeProperties');

var callableObjectListFromProps = function callableObjectListFromProps(__state) {
  var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return props.callableObjectList;
};

var callableObjectIdFromProps = createSelector([callableObjectListFromProps], function (callableObjectList) {
  if (!callableObjectList) {
    return Seq();
  }

  return callableObjectList.keySeq();
});
export var getPropertiesByCalleeFromState = createSelector([getCalleePropertiesFromState, callableObjectIdFromProps], function (properties, callableObjectIds) {
  if (!callableObjectIds) {
    return ImmutableMap();
  }

  return getEntries(properties, callableObjectIds) || ImmutableMap();
});