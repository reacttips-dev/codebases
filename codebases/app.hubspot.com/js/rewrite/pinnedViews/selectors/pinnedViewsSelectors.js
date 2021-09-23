'use es6';

import get from 'transmute/get';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { createFrozenSelector } from '../../utils/createFrozenSelector';
export var getPinnedViewsSlice = function getPinnedViewsSlice(state) {
  return state.pinnedViews;
};
export var getPinnedViewsFetchStatuses = createFrozenSelector([getPinnedViewsSlice], function (_ref) {
  var status = _ref.status;
  return status;
});
export var getPinnedViewsData = createFrozenSelector([getPinnedViewsSlice], function (_ref2) {
  var data = _ref2.data;
  return data;
});
export var getPinnedViewsFetchStatus = createFrozenSelector([getPinnedViewsFetchStatuses, getCurrentObjectTypeId], function (status, typeId) {
  return get(typeId, status) || UNINITIALIZED;
});
export var getPinnedViewIds = createFrozenSelector([getPinnedViewsData, getCurrentObjectTypeId], function (data, typeId) {
  return get(typeId, data) || [];
});