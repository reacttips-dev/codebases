'use es6';

import { FETCH_PINNED_VIEWS_STARTED, FETCH_PINNED_VIEWS_SUCCEEDED, FETCH_PINNED_VIEWS_FAILED, SET_PINNED_VIEWS_STARTED, SET_PINNED_VIEWS_SUCCEEDED, SET_PINNED_VIEWS_FAILED } from './pinnedViewsActionTypes';
import { getPinnedViews, writePinnedViews } from '../api/pinnedViewsAPI';
export var fetchPinnedViewsSucceededAction = function fetchPinnedViewsSucceededAction(objectTypeId, pinnedViews) {
  return {
    type: FETCH_PINNED_VIEWS_SUCCEEDED,
    payload: {
      objectTypeId: objectTypeId,
      pinnedViews: pinnedViews
    }
  };
};
export var fetchPinnedViewsAction = function fetchPinnedViewsAction(objectTypeId) {
  return function (dispatch) {
    dispatch({
      type: FETCH_PINNED_VIEWS_STARTED,
      payload: {
        objectTypeId: objectTypeId
      }
    });
    return getPinnedViews(objectTypeId).then(function (pinnedViews) {
      return dispatch(fetchPinnedViewsSucceededAction(objectTypeId, pinnedViews));
    }).catch(function (err) {
      dispatch({
        type: FETCH_PINNED_VIEWS_FAILED,
        payload: {
          objectTypeId: objectTypeId
        }
      });
      throw err;
    });
  };
};
export var setPinnedViewsAction = function setPinnedViewsAction(_ref) {
  var objectTypeId = _ref.objectTypeId,
      ids = _ref.ids;
  return function (dispatch) {
    dispatch({
      type: SET_PINNED_VIEWS_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        ids: ids
      }
    });
    return writePinnedViews({
      objectTypeId: objectTypeId,
      ids: ids
    }).then(function () {
      dispatch({
        type: SET_PINNED_VIEWS_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          ids: ids
        }
      });
    }).catch(function (err) {
      dispatch({
        type: SET_PINNED_VIEWS_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          ids: ids
        }
      });
      throw err;
    });
  };
};