'use es6';

import { createSelector } from 'reselect';
import { Map as ImmutableMap } from 'immutable';
import { getCurrentObjectTypeId } from '../../init/selectors/routerStateSelectors';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { BOARD as LEGACY_BOARD, INDEX as LEGACY_INDEX } from 'customer-data-objects/view/PageTypes';
import { BOARD } from '../constants/PageType';
export var getViewsSlice = function getViewsSlice(state) {
  return state.views;
};
export var getViewsData = createSelector([getViewsSlice], function (slice) {
  return slice.get('data');
});
export var getCachedViewsData = createSelector([getViewsSlice], function (slice) {
  return slice.get('cachedData');
});
export var getViewsFetchStatuses = createSelector([getViewsSlice], function (slice) {
  return slice.get('status');
});
export var getCurrentViewId = createSelector([getViewsSlice], function (slice) {
  return slice.get('currentViewId');
});
export var getCurrentPageType = createSelector([getViewsSlice], function (slice) {
  return slice.get('currentPageType');
});
export var getInitializedTypes = createSelector([getViewsSlice], function (slice) {
  return slice.get('initializedTypes');
});
export var getRestoredTypes = createSelector([getViewsSlice], function (slice) {
  return slice.get('restoredTypes');
});
export var getLegacyPageType = createSelector([getCurrentPageType], function (pageType) {
  return pageType === BOARD ? LEGACY_BOARD : LEGACY_INDEX;
});
export var getViewsFetchStatus = createSelector([getViewsFetchStatuses, getCurrentObjectTypeId], function (statuses, objectTypeId) {
  return statuses.get(objectTypeId) || UNINITIALIZED;
});
export var getViewsInState = createSelector([getViewsData, getCurrentObjectTypeId], function (views, objectTypeId) {
  return views.get(objectTypeId) || ImmutableMap();
});
export var getCachedViews = createSelector([getCachedViewsData, getCurrentObjectTypeId], function (views, objectTypeId) {
  return views.get(objectTypeId) || ImmutableMap();
});