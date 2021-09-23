'use es6';

import { Map as ImmutableMap } from 'immutable';
import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
export var getActivityTypesAsyncDataFromState = get('activityTypes');
export var getActivityTypesFromState = createSelector([getActivityTypesAsyncDataFromState], function (types) {
  return getData(types).map(function (type) {
    var optionName = type.get('text');
    return ImmutableMap({
      text: optionName,
      value: optionName
    });
  });
});