'use es6';

import { FETCH_VIEWS_STARTED, FETCH_VIEWS_SUCCEEDED, FETCH_VIEWS_FAILED, SAVE_VIEW_STARTED, SAVE_VIEW_SUCCEEDED, SAVE_VIEW_FAILED, FILTERS_CHANGED, RESET_VIEW, COLUMNS_CHANGED, SORT_CHANGED, DELETE_VIEW_STARTED, DELETE_VIEW_SUCCEEDED, DELETE_VIEW_FAILED, CREATE_VIEW_STARTED, CREATE_VIEW_SUCCEEDED, CREATE_VIEW_FAILED, CACHE_VIEWS } from './viewsActionTypes';
import { createView, delView, fetchViews, writeView } from '../api/viewsAPI';
export var getViewsAction = function getViewsAction(objectTypeId) {
  return function (dispatch) {
    dispatch({
      type: FETCH_VIEWS_STARTED,
      payload: {
        objectTypeId: objectTypeId
      }
    });
    return fetchViews(objectTypeId).then(function (views) {
      dispatch({
        type: FETCH_VIEWS_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          views: views
        }
      });
    }).catch(function (err) {
      dispatch({
        type: FETCH_VIEWS_FAILED,
        payload: {
          objectTypeId: objectTypeId
        }
      });
      throw err;
    });
  };
}; // This is done on the action layer so that we can access state to clean up the view later
// e.g remove deleted property columns, strip duplicates, etc.

export var formatViewForSave = function formatViewForSave(_ref) {
  var objectTypeId = _ref.objectTypeId,
      view = _ref.view;
  return Object.assign({}, view.update('columns', function (columns) {
    return JSON.stringify(columns.map(function (col) {
      return {
        name: col.get('name')
      };
    }));
  }).update('state', JSON.stringify).update('filters', JSON.stringify).toJS(), {
    collectionType: undefined,
    // Remove collectionType
    objectTypeId: objectTypeId
  });
};
export var saveViewAction = function saveViewAction(_ref2) {
  var objectTypeId = _ref2.objectTypeId,
      view = _ref2.view;
  return function (dispatch) {
    dispatch({
      type: SAVE_VIEW_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        view: view
      }
    });
    return writeView({
      objectTypeId: objectTypeId,
      view: formatViewForSave({
        objectTypeId: objectTypeId,
        view: view
      })
    }).then(function () {
      dispatch({
        type: SAVE_VIEW_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          view: view
        }
      });
    }).catch(function (error) {
      dispatch({
        type: SAVE_VIEW_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          view: view
        }
      });
      throw error;
    });
  };
};
export var deleteViewAction = function deleteViewAction(_ref3) {
  var objectTypeId = _ref3.objectTypeId,
      viewId = _ref3.viewId;
  return function (dispatch) {
    dispatch({
      type: DELETE_VIEW_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        viewId: viewId
      }
    });
    return delView(viewId).then(function () {
      dispatch({
        type: DELETE_VIEW_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          viewId: viewId
        }
      });
    }).catch(function (error) {
      dispatch({
        type: DELETE_VIEW_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          viewId: viewId
        }
      });
      throw error;
    });
  };
};
export var createNewViewAction = function createNewViewAction(_ref4) {
  var objectTypeId = _ref4.objectTypeId,
      view = _ref4.view;
  return function (dispatch) {
    dispatch({
      type: CREATE_VIEW_STARTED,
      payload: {
        objectTypeId: objectTypeId
      }
    });
    return createView({
      view: formatViewForSave({
        objectTypeId: objectTypeId,
        view: view
      })
    }).then(function (createdView) {
      dispatch({
        type: CREATE_VIEW_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          view: createdView
        }
      });
      return createdView;
    }).catch(function (error) {
      dispatch({
        type: CREATE_VIEW_FAILED,
        payload: {
          objectTypeId: objectTypeId
        }
      });
      throw error;
    });
  };
};
export var filtersChangedAction = function filtersChangedAction(_ref5) {
  var objectTypeId = _ref5.objectTypeId,
      viewId = _ref5.viewId,
      filters = _ref5.filters;
  return {
    type: FILTERS_CHANGED,
    payload: {
      objectTypeId: objectTypeId,
      viewId: viewId,
      filters: filters
    }
  };
};
export var resetViewAction = function resetViewAction(_ref6) {
  var objectTypeId = _ref6.objectTypeId,
      viewId = _ref6.viewId,
      isDefault = _ref6.isDefault;
  return {
    type: RESET_VIEW,
    payload: {
      objectTypeId: objectTypeId,
      viewId: viewId,
      isDefault: isDefault
    }
  };
};
export var columnsChangedAction = function columnsChangedAction(_ref7) {
  var objectTypeId = _ref7.objectTypeId,
      viewId = _ref7.viewId,
      columns = _ref7.columns;
  return {
    type: COLUMNS_CHANGED,
    payload: {
      objectTypeId: objectTypeId,
      viewId: viewId,
      columns: columns
    }
  };
};
export var sortChangedAction = function sortChangedAction(_ref8) {
  var sortKey = _ref8.sortKey,
      sortColumnName = _ref8.sortColumnName,
      order = _ref8.order,
      objectTypeId = _ref8.objectTypeId,
      viewId = _ref8.viewId;
  return {
    type: SORT_CHANGED,
    payload: {
      sortKey: sortKey,
      sortColumnName: sortColumnName,
      order: order,
      objectTypeId: objectTypeId,
      viewId: viewId
    }
  };
};
export var cacheViews = function cacheViews(_ref9) {
  var objectTypeId = _ref9.objectTypeId,
      views = _ref9.views;
  return {
    type: CACHE_VIEWS,
    payload: {
      objectTypeId: objectTypeId,
      views: views
    }
  };
};