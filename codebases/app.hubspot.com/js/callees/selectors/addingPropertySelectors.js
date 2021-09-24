'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getAddingPropertyFromState = get('addingProperty');
export var getUpdateTypeFromState = createSelector([getAddingPropertyFromState], get('updateType'));
export var getIsUpdatingPropertyFromState = createSelector([getUpdateTypeFromState], function (updateType) {
  return Boolean(updateType);
});
export var getCalleeToUpdateFromState = createSelector([getAddingPropertyFromState], get('calleeToUpdate'));