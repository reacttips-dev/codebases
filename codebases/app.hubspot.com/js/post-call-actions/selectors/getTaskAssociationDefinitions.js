'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
import { getData } from 'conversations-async-data/async-data/operators/getters';
export var getTaskAssociationDefinitionsAsyncDataFromState = get('taskAssociationDefinitions');
export var getTaskAssociationDefinitionsFromState = createSelector([getTaskAssociationDefinitionsAsyncDataFromState], function (asyncData) {
  return getData(asyncData);
});