'use es6';

import { List } from 'immutable';
import { dispatchImmediate, dispatchSafe } from 'crm_data/dispatch/Dispatch';
import { fetch, save } from '../api/PinnedViewsAPI';
import { PINNED_VIEWS_USER_UPDATE_STARTED, PINNED_VIEWS_USER_UPDATE_SUCCEEDED, PINNED_VIEWS_USER_UPDATE_FAILED, PINNED_VIEWS_FETCH_STARTED, PINNED_VIEWS_FETCH_SUCCEEDED, PINNED_VIEWS_FETCH_FAILED } from '../actions/PinnedViewsActionTypes';
export var fetchPinnedViews = function fetchPinnedViews(objectTypeId) {
  dispatchSafe(PINNED_VIEWS_FETCH_STARTED, {
    objectTypeId: objectTypeId
  });
  return fetch({
    objectTypeId: objectTypeId
  }).then(function (pinnedViewIds) {
    dispatchSafe(PINNED_VIEWS_FETCH_SUCCEEDED, {
      objectTypeId: objectTypeId,
      pinnedViewIds: List(pinnedViewIds.map(String))
    });
  }).catch(function (error) {
    dispatchSafe(PINNED_VIEWS_FETCH_FAILED, {
      error: error,
      objectTypeId: objectTypeId
    });
  });
};
export var update = function update(objectTypeId, viewIds) {
  dispatchSafe(PINNED_VIEWS_USER_UPDATE_STARTED, {
    objectTypeId: objectTypeId,
    viewIds: viewIds
  });
  return save({
    objectTypeId: objectTypeId,
    viewIds: viewIds
  }).then(function () {
    return dispatchImmediate(PINNED_VIEWS_USER_UPDATE_SUCCEEDED, {
      objectTypeId: objectTypeId,
      viewIds: viewIds
    });
  }).catch(function (error) {
    return dispatchImmediate(PINNED_VIEWS_USER_UPDATE_FAILED, {
      error: error,
      objectTypeId: objectTypeId
    });
  }).done();
};