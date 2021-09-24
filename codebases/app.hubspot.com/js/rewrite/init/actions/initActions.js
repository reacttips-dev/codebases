'use es6';

import { APP_INIT, SYNC_ROUTER_VALUES, RESTORE_CACHED_VALUES } from './initActionTypes';
export var appInit = function appInit(auth) {
  return {
    type: APP_INIT,
    payload: {
      auth: auth
    }
  };
};
export var syncRouterValuesAction = function syncRouterValuesAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      viewId = _ref.viewId,
      pageType = _ref.pageType,
      searchTerm = _ref.searchTerm;
  return {
    type: SYNC_ROUTER_VALUES,
    payload: {
      objectTypeId: objectTypeId,
      viewId: viewId,
      pageType: pageType,
      searchTerm: searchTerm
    }
  };
};
export var restoreCachedValuesAction = function restoreCachedValuesAction(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      viewId = _ref2.viewId,
      pageType = _ref2.pageType,
      searchTerm = _ref2.searchTerm,
      page = _ref2.page,
      views = _ref2.views,
      hasData = _ref2.hasData;
  return {
    type: RESTORE_CACHED_VALUES,
    payload: {
      objectTypeId: objectTypeId,
      viewId: viewId,
      pageType: pageType,
      searchTerm: searchTerm,
      page: page,
      views: views,
      hasData: hasData
    }
  };
};