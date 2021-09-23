'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
export var getCallDispositionsAsyncDataFromState = get('callDispositions');
export var getCallDispositionsFromState = createSelector([getCallDispositionsAsyncDataFromState], function (dispositions) {
  return getData(dispositions);
});