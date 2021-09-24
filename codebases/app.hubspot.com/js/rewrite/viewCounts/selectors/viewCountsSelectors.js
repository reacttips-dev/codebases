'use es6';

import get from 'transmute/get';
import getIn from 'transmute/getIn';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { createFrozenSelector } from '../../utils/createFrozenSelector';

var getViewCountsSlice = function getViewCountsSlice(state) {
  return state.viewCounts;
};

export var getViewCountsFetchStatus = createFrozenSelector([getViewCountsSlice], function (slice) {
  return slice.status;
});
export var getViewCountsData = createFrozenSelector([getViewCountsSlice], function (slice) {
  return slice.data;
});
export var getViewCountDeltas = createFrozenSelector([getViewCountsSlice], function (slice) {
  return slice.deltas;
});
export var getViewCountDeltaForCurrentObjectType = createFrozenSelector([getViewCountDeltas, getCurrentObjectTypeId], function (deltas, objectTypeId) {
  return get(objectTypeId, deltas) || 0;
});
export var getViewCountLimit = createFrozenSelector([getViewCountsData], function (data) {
  return get('perObjectTypeIdViewLimit', data);
});
export var getViewCountForCurrentObjectType = createFrozenSelector([getViewCountsData, getCurrentObjectTypeId, getViewCountDeltaForCurrentObjectType], function (data, objectTypeId, delta) {
  // If there are 0 views for a given collectionType, the BE just omits that type from the
  // response. So, if a collectionType is missing from the map, we can safely assume that means
  // there are 0 views for that type.
  var count = getIn(['viewCountPerObjectTypeId', objectTypeId], data) || 0;
  return count + delta;
});