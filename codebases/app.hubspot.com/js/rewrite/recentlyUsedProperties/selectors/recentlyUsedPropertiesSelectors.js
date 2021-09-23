'use es6';

import { UNINITIALIZED } from '../../constants/RequestStatus';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';

var getRecentlyUsedPropertiesSlice = function getRecentlyUsedPropertiesSlice(state) {
  return state.recentlyUsedProperties;
};

export var getRecentlyUsedPropertiesStatuses = createFrozenSelector([getRecentlyUsedPropertiesSlice], function (slice) {
  return slice.status;
});
export var getRecentlyUsedPropertiesStatus = createFrozenSelector([getRecentlyUsedPropertiesStatuses, getCurrentObjectTypeId], function (statuses, objectTypeId) {
  return statuses[objectTypeId] || UNINITIALIZED;
});
export var getRecentlyUsedPropertiesData = createFrozenSelector([getRecentlyUsedPropertiesSlice], function (slice) {
  return slice.data;
});
export var getRecentlyUsedProperties = createFrozenSelector([getRecentlyUsedPropertiesData, getCurrentObjectTypeId], function (data, objectTypeId) {
  return data[objectTypeId] || [];
});