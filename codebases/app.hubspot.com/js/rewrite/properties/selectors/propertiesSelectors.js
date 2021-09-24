'use es6';

import { UNINITIALIZED } from '../../constants/RequestStatus';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';
export var getPropertiesSlice = function getPropertiesSlice(state) {
  return state.properties;
};
export var getPropertiesFetchStatuses = createFrozenSelector([getPropertiesSlice], function (slice) {
  return slice.status;
});
export var getPropertiesData = createFrozenSelector([getPropertiesSlice], function (slice) {
  return slice.data;
});
export var getPropertiesFetchStatus = createFrozenSelector([getPropertiesFetchStatuses, getCurrentObjectTypeId], function (status, objectTypeId) {
  return status[objectTypeId] || UNINITIALIZED;
});
export var getProperties = createFrozenSelector([getPropertiesData, getCurrentObjectTypeId], function (data, objectTypeId) {
  return data[objectTypeId];
});