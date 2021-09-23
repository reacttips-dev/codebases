'use es6';

import I18n from 'I18n';
import { defineFactory } from 'general-store';
import { Map as ImmutableMap, fromJS } from 'immutable';
import ViewsActionTypes from './ViewsActionTypes';
import ViewDefaults from 'crm_universal/view/ViewDefaults';
import TaskDynamicFilters from '../../tasks/filters/TaskDynamicFilters';
import * as PriorityFilters from '../../views/PriorityFilters';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import ViewsActions from './ViewsActions';
import * as ActionTypes from 'crm_data/actions/ActionTypes';
import * as LoadingStatus from 'crm_data/flux/LoadingStatus';
import * as ViewTypes from 'customer-data-objects/view/ViewTypes';
import CustomPropertyHelper from '../../utils/CustomPropertyHelper';
import getIn from 'transmute/getIn';
import get from 'transmute/get';
import has from 'transmute/has';
import memoize from 'transmute/memoize';
import once from 'transmute/once';
import { updateGridState, deleteGridState, clearLastAccessedView, reconcileWithCache } from '../../grid/utils/gridStateLocalStorage';
var OBJECT_TYPES_WITHOUT_BACKEND_VIEWS = [TASK];
var FetchStatus = {
  UNINITIALIZED: 'UNINITIALIZED',
  STARTED: 'STARTED',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED'
};

var addDefaultFilters = function addDefaultFilters(views, objectType) {
  return views.concat(PriorityFilters.getDefaults(objectType));
};

var getDefaultViews = once(function () {
  return fromJS(ViewDefaults).reduce(function (map, views, key) {
    views = addDefaultFilters(views, key).forEach(function (view) {
      view = ViewRecord.fromJS(view).merge({
        name: view.get('translationKey') ? I18n.text(view.get('translationKey')) : view.get('id'),
        ownerId: -1
      }); // the "default: true" is used to track what filters are part of the
      // default view and what are filters have been added by the user

      var filters = view.get('filters').map(function (filter) {
        return filter.set('default', true);
      });
      view = view.set('filters', filters);
      var viewId = String(view.get('id'));
      return map = map.setIn([key, viewId], view);
    });
    return map;
  }, ImmutableMap());
});
var fetchedViews = ImmutableMap();
var fetchStatus = ImmutableMap();

var getStatus = function getStatus(objectType) {
  return fetchStatus.get(objectType, FetchStatus.UNINITIALIZED);
};

var getViewKey = memoize(function (_ref) {
  var viewId = _ref.viewId,
      objectType = _ref.objectType;
  return ImmutableMap({
    viewId: "" + viewId,
    objectType: objectType
  });
}, function (_ref2) {
  var viewId = _ref2.viewId,
      objectType = _ref2.objectType;
  return viewId + objectType;
});

var filtersAreEqual = function filtersAreEqual(view1, view2) {
  if (!view1 || !view2) {
    return null;
  }

  var filters1 = view1.get('filters').map(function (filter) {
    return filter.delete('default');
  });
  var filters2 = view2.get('filters').map(function (filter) {
    return filter.delete('default');
  });
  return filters1.equals(filters2);
};

var columnsAreEqual = function columnsAreEqual(columns1, columns2) {
  if (!columns1 || !columns2) {
    return null;
  }

  columns1 = columns1.map(function (column) {
    return column.get('name');
  });
  columns2 = columns2.map(function (column) {
    return column.get('name');
  });
  return columns1.equals(columns2);
};

var sortIsEqual = function sortIsEqual(viewState1, viewState2) {
  if (!viewState1 || !viewState2) {
    return null;
  }

  return ['order', 'sortColumnName', 'sortKey'].every(function (key) {
    return viewState1.get(key) === viewState2.get(key);
  });
};

var isViewModified = function isViewModified(view1, view2) {
  if (!filtersAreEqual(view1, view2)) {
    return true;
  }

  if (view1.get('type') !== ViewTypes.DEFAULT) {
    if (!columnsAreEqual(view1.get('columns'), view2.get('columns'))) {
      return true;
    }
  }

  if (!sortIsEqual(view1.get('state'), view2.get('state'))) {
    return true;
  }

  return false;
};

var ViewsStore = defineFactory().defineName('ViewsStore').defineGet(function (state, options) {
  if (options) {
    var objectType = get('objectType', options);

    if (has('viewId', options)) {
      var viewId = String(get('viewId', options));
      var view = state.getIn([objectType, viewId]);

      if (view) {
        var sortedColumns = view.get('columns').map(function (column, index) {
          var preOrder = CustomPropertyHelper.get(objectType, column.get('name')).get('order');
          var columnOrder = isNaN(column.get('order')) ? index : parseInt(column.get('order'), 10);
          return column.set('order', preOrder || columnOrder);
        }).sortBy(function (column) {
          return column.get('order');
        });
        view = view.set('columns', sortedColumns);

        if (objectType === TASK && TaskDynamicFilters.has(viewId)) {
          view = view.set('filters', TaskDynamicFilters.get(viewId)());
        }

        var fetchedView = fetchedViews.getIn([objectType, viewId]);
        var existingView = fetchedView != null ? fetchedView : getDefaultViews().getIn([objectType, viewId]);
        var isModified = isViewModified(view, existingView);
        view = view.set('modified', isModified);
      }

      return view;
    } else if (objectType) {
      var status = getStatus(objectType);

      if (status === FetchStatus.UNINITIALIZED && // Tasks don't have backend views
      !OBJECT_TYPES_WITHOUT_BACKEND_VIEWS.includes(objectType)) {
        fetchStatus = fetchStatus.set(objectType, FetchStatus.STARTED);
        ViewsActions.fetch(objectType);

        if (objectType !== TASK) {
          return LoadingStatus.LOADING;
        }
      }

      if (objectType !== TASK && status !== FetchStatus.SUCCEEDED) {
        return LoadingStatus.LOADING;
      }

      return state.get(objectType) || ImmutableMap();
    }
  }

  return state;
}).defineGetInitialState(function () {
  return ImmutableMap().mergeDeep(getDefaultViews());
}).defineResponseTo(ViewsActionTypes.VIEW_COLUMNS_CHANGED, function (state, options) {
  if (options) {
    var objectType = get('objectType', options);
    var viewId = "" + get('viewId', options);
    var view = state.getIn([objectType, viewId]);
    var updateCachedView = get('updateCachedView', options);

    if (view) {
      if (updateCachedView) {
        var fetchedView = fetchedViews.getIn([objectType, viewId]);

        if (fetchedView) {
          fetchedViews = fetchedViews.setIn([objectType, viewId, 'columns'], get('columns', options));
        }
      } else {
        state = state.setIn([objectType, viewId, 'modified'], true);
      }

      updateGridState({
        objectType: objectType,
        viewId: viewId,
        key: 'columns',
        value: get('columns', options)
      });
      return state.setIn([objectType, viewId, 'columns'], get('columns', options));
    }
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_FILTERS_CHANGED, function (state, options) {
  if (options) {
    var objectType = get('objectType', options);
    var viewId = "" + get('viewId', options);
    state = state.setIn([objectType, viewId, 'modified'], true);
    updateGridState({
      objectType: objectType,
      viewId: viewId,
      key: 'filters',
      value: get('filters', options)
    });
    return state.setIn([objectType, viewId, 'filters'], get('filters', options));
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_FILTER_GROUPS_CHANGED, function (state, options) {
  if (!options) {
    return state;
  }

  var objectType = get('objectType', options);
  var viewId = "" + get('viewId', options);
  state = state.setIn([objectType, viewId, 'modified'], true);
  return state.setIn([objectType, viewId, 'filterGroups'], get('filterGroups', options));
}).defineResponseTo(ViewsActionTypes.VIEW_RESET_FILTERS, function (state, options) {
  if (options) {
    var objectType = get('objectType', options);
    var viewId = String(get('viewId', options));
    var fetchedView = fetchedViews.getIn([objectType, viewId]);

    if (fetchedView) {
      return state.setIn([objectType, viewId, 'filters'], fetchedView.get('filters'));
    }

    var defaultView = getDefaultViews().getIn([objectType, viewId]);
    deleteGridState({
      objectType: objectType,
      viewId: viewId
    });

    if (!defaultView) {
      return state;
    }

    return state.setIn([objectType, viewId, 'filters'], defaultView.get('filters'));
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_RESET, function (state, options) {
  if (options) {
    var objectType = get('objectType', options);
    var viewId = String(get('viewId', options));
    var fetchedView = fetchedViews.getIn([objectType, viewId]);
    deleteGridState({
      objectType: objectType,
      viewId: viewId
    });
    clearLastAccessedView(objectType);

    if (fetchedView) {
      return state.setIn([objectType, viewId], fetchedView);
    }

    var defaultView = getDefaultViews().getIn([objectType, viewId]);

    if (!defaultView) {
      return state;
    }

    return state.setIn([objectType, viewId], defaultView);
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_SORTED, function (state, options) {
  var _options$toJS = options.toJS(),
      objectType = _options$toJS.objectType,
      viewId = _options$toJS.viewId,
      direction = _options$toJS.direction,
      sortKey = _options$toJS.sortKey,
      sortColumnName = _options$toJS.sortColumnName;

  state = state.setIn([objectType, "" + viewId, 'modified'], true);
  updateGridState({
    objectType: objectType,
    viewId: viewId,
    key: 'state',
    value: {
      sortColumnName: sortColumnName,
      sortKey: sortKey,
      order: direction
    }
  });
  return state.mergeIn([objectType, "" + viewId, 'state'], {
    sortColumnName: sortColumnName,
    sortKey: sortKey,
    order: direction
  });
}).defineResponseTo(ViewsActionTypes.VIEW_RENAMED, function (state, options) {
  var _options$toJS2 = options.toJS(),
      objectType = _options$toJS2.objectType,
      viewId = _options$toJS2.viewId,
      name = _options$toJS2.name;

  return state.setIn([objectType, "" + viewId, 'name'], name);
}).defineResponseTo(ViewsActionTypes.VIEWS_UPDATED, function (state, _ref3) {
  var objectType = _ref3.objectType,
      views = _ref3.views;

  if (fetchedViews.has(objectType)) {
    var existingViews = fetchedViews.get(objectType);
    views = existingViews.merge(views);
  }

  fetchStatus = fetchStatus.set(objectType, FetchStatus.SUCCEEDED);
  fetchedViews = fetchedViews.set(objectType, views);
  fetchedViews.forEach(function (existingViews, viewsObjectType) {
    var newViews = existingViews.map(function (view) {
      var viewId = "" + view.get('id');
      var isModified = getIn([viewsObjectType, viewId, 'modified'], state);

      if (isModified) {
        return state.getIn([viewsObjectType, viewId]);
      }

      return view;
    });
    return state = state.mergeIn([viewsObjectType], newViews);
  });
  return state;
}).defineResponseTo([ViewsActionTypes.VIEW_SAVED, ViewsActionTypes.VIEW_FILTERS_FIXED], function (state, _ref4) {
  var objectType = _ref4.objectType,
      view = _ref4.view;
  var viewId = "" + view.get('id');
  fetchedViews = fetchedViews.setIn([objectType, viewId], view);
  deleteGridState({
    objectType: objectType,
    viewId: viewId
  });
  return state.setIn([objectType, viewId], view);
}).defineResponseTo(ViewsActionTypes.VIEW_UPDATED, function (state, _ref5) {
  var objectType = _ref5.objectType,
      view = _ref5.view;
  var viewId = "" + view.get('id');
  deleteGridState({
    objectType: objectType,
    viewId: viewId
  });
  return state.setIn([objectType, viewId], view);
}).defineResponseTo(ViewsActionTypes.RESIZED_COLUMN, function (state, options) {
  var _options$toJS3 = options.toJS(),
      objectType = _options$toJS3.objectType,
      columnName = _options$toJS3.columnName,
      width = _options$toJS3.width;

  var viewId = "" + get('viewId', options);
  var columns = state.getIn([objectType, viewId, 'columns']);
  var entry = columns.findEntry(function (value) {
    return columnName === value.get('name');
  });

  if (entry && entry.length && entry[0] != null) {
    var index = entry[0];
    state = state.setIn([objectType, viewId, 'columns', index, 'width'], width);
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_CREATED, function (state, _ref6) {
  var objectType = _ref6.objectType,
      view = _ref6.view,
      action = _ref6.action;
  var objectTypeViews = fetchedViews.get(objectType);
  var mergedObjectTypeViews = objectTypeViews.merge(view);
  var viewsToSet = action !== 'send' ? mergedObjectTypeViews : objectTypeViews;
  fetchedViews = fetchedViews.set(objectType, viewsToSet);
  var newViews = viewsToSet.map(function (newView) {
    var viewId = "" + newView.get('id');
    var isModified = getIn([objectType, viewId, 'modified'], state);

    if (isModified) {
      return state.getIn([objectType, viewId]);
    }

    return newView;
  });
  return state.mergeIn([objectType], newViews);
}).defineResponseTo(ActionTypes.VIEW_DELETED, function (state, _ref7) {
  var objectType = _ref7.objectType,
      viewId = _ref7.viewId;
  viewId = "" + viewId;
  var views = state.get(objectType);
  var updatedViews = views.delete(viewId);
  fetchedViews = fetchedViews.set(objectType, updatedViews);
  return state = state.set(objectType, updatedViews);
}).defineResponseTo(ViewsActionTypes.VIEW_COLUMN_FAVORITES_UPDATED, function (state, _ref8) {
  var objectType = _ref8.objectType,
      favoriteColumns = _ref8.favoriteColumns;

  if (!(favoriteColumns != null ? favoriteColumns.size : undefined)) {
    return state;
  }

  var updatedColumns = favoriteColumns.map(function (column) {
    return ImmutableMap().set('name', column);
  });
  var updatedObjectType = state.get(objectType).map(function (view) {
    return view.set('columns', updatedColumns);
  });
  return state = state.set(objectType, updatedObjectType);
}).defineResponseTo(ViewsActionTypes.VIEW_PIPELINE_CHANGED, function (state, _ref9) {
  var objectType = _ref9.objectType,
      viewId = _ref9.viewId,
      pipelineId = _ref9.pipelineId;
  viewId = "" + viewId;
  updateGridState({
    objectType: objectType,
    viewId: viewId,
    key: 'state',
    value: {
      pipelineId: pipelineId
    }
  });

  if (!pipelineId) {
    return state.deleteIn([objectType, viewId, 'state', 'pipelineId']);
  }

  state = state.setIn([objectType, "" + viewId, 'modified'], true);
  return state.setIn([objectType, viewId, 'state', 'pipelineId'], pipelineId);
}).defineResponseTo(ViewsActionTypes.VIEW_INITIALIZE_OBJECT_TYPE, function (state, _ref10) {
  var objectType = _ref10.objectType,
      views = _ref10.views;

  if (objectType && views) {
    fetchedViews = fetchedViews.update(objectType, function (existingViews) {
      return views.mergeDeep(existingViews);
    });
    return state.update(objectType, function (existingViews) {
      return views.mergeDeep(existingViews);
    });
  }

  return state;
}).defineResponseTo(ViewsActionTypes.VIEW_DRAFT_RESTORED, function (state, _ref11) {
  var objectType = _ref11.objectType;
  return state.update(objectType, function (views) {
    return views.map(function (view, viewId) {
      if (!view || view.get('modified')) {
        return view;
      }

      var restoredView = reconcileWithCache({
        objectType: objectType,
        viewId: viewId
      }, view);

      if (!isViewModified(view, restoredView)) {
        return view;
      }

      return restoredView.set('modified', true);
    });
  });
}).register();
ViewsStore.getViewKey = getViewKey;
export default ViewsStore;