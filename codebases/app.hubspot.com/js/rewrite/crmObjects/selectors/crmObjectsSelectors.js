'use es6';

import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { getLocallyCreatedObjectIdsForCurrentType } from '../../localMutations/selectors/localCrmObjectMutationsSelectors';
import get from 'transmute/get';
import { createFrozenSelector } from '../../utils/createFrozenSelector';
export var getCrmObjectsSlice = function getCrmObjectsSlice(state) {
  return state.crmObjects;
};
export var getCrmObjects = createFrozenSelector([getCurrentObjectTypeId, getCrmObjectsSlice], function (objectTypeId, slice) {
  return slice[objectTypeId] || {};
});
export var getLocallyCreatedObjectsForCurrentType = createFrozenSelector([getCrmObjects, getLocallyCreatedObjectIdsForCurrentType], function (objects, createdObjectIds) {
  return createdObjectIds.map(function (objectId) {
    return get(objectId, objects);
  }).filter(Boolean);
});