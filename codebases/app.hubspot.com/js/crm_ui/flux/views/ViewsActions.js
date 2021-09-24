'use es6';

import I18n from 'I18n';
import * as dispatch from 'crm_data/flux/dispatch';
import * as Dispatch from 'crm_data/dispatch/Dispatch';
import ViewsActionTypes from './ViewsActionTypes';
import { TASK } from 'customer-data-objects/constants/ObjectTypes';
import * as ViewsAPI from '../../api/views/ViewsAPI';
import * as Alerts from 'customer-data-ui-utilities/alerts/Alerts';
import ViewRecord from 'customer-data-objects/view/ViewRecord';
import * as ActionTypes from 'crm_data/actions/ActionTypes';
import RouterContainer from '../../../containers/RouterContainer';
import links from 'crm-legacy-links/links';
import { getShouldFetchDefaultView } from 'crm_data/views/DefaultViewStore';
var DEFAULT_VIEW_UPDATED = ActionTypes.DEFAULT_VIEW_UPDATED,
    VIEW_DELETED = ActionTypes.VIEW_DELETED;
export default {
  resize: function resize(options) {
    dispatch.dispatch(ViewsActionTypes.RESIZED_COLUMN, options);
  },
  changeColumns: function changeColumns(options) {
    if (options.get('dispatchSafe')) {
      Dispatch.dispatchSafe(ViewsActionTypes.VIEW_COLUMNS_CHANGED, options).done();
    } else {
      dispatch.dispatch(ViewsActionTypes.VIEW_COLUMNS_CHANGED, options);
    }
  },
  changeFilters: function changeFilters(options) {
    if (options.get('dispatchSafe')) {
      Dispatch.dispatchSafe(ViewsActionTypes.VIEW_FILTERS_CHANGED, options).done();
    } else {
      dispatch.dispatch(ViewsActionTypes.VIEW_FILTERS_CHANGED, options);
    }
  },
  changeFilterGroups: function changeFilterGroups(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_FILTER_GROUPS_CHANGED, options);
  },
  reset: function reset(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_RESET, options);
  },
  resetFilters: function resetFilters(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_RESET_FILTERS, options);
  },
  sort: function sort(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_SORTED, options);
  },
  rename: function rename(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_RENAMED, options);
  },
  create: function create(_ref) {
    var objectType = _ref.objectType,
        view = _ref.view,
        action = _ref.action;
    return ViewsAPI.create({
      objectType: objectType,
      view: view
    }).then(function (viewMap) {
      dispatch.dispatch(ViewsActionTypes.VIEW_CREATED, {
        objectType: objectType,
        view: viewMap,
        action: action
      });
      return viewMap.first();
    }, function () {
      action = I18n.text('genericActions.progressiveTense.create');
      var type = I18n.text('genericTypes.singular.view');
      Alerts.addError('genericMessages.actionError', {
        action: action,
        type: type
      });
    });
  },
  setDefault: function setDefault(objectType, viewId) {
    dispatch.dispatch(DEFAULT_VIEW_UPDATED, {
      objectType: objectType,
      viewId: viewId
    });
  },
  makeDefault: function makeDefault(objectType, viewId, name) {
    var shouldAlert = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    return ViewsAPI.makeDefault(objectType, viewId).then(function () {
      dispatch.dispatch(DEFAULT_VIEW_UPDATED, {
        objectType: objectType,
        viewId: viewId
      });

      if (shouldAlert) {
        Alerts.addSuccess('filterSidebar.modifyView.defaultChanged', {
          name: name
        });
      }
    });
  },
  updateQueue: function updateQueue(_ref2) {
    var view = _ref2.view,
        newTaskIds = _ref2.newTaskIds;
    var filters = view.get('filters');
    var queueIndex = filters.findIndex(function (filter) {
      return filter.get('property') === 'engagement.id';
    });
    var newTaskIdsFilter = filters.get(queueIndex).set('values', newTaskIds);
    var newFilters = filters.delete(queueIndex).push(newTaskIdsFilter);
    var updatedView = view.set('filters', newFilters);
    return this.update({
      objectType: TASK,
      view: updatedView
    });
  },
  update: function update(_ref3) {
    var objectType = _ref3.objectType,
        view = _ref3.view;
    return ViewsAPI.update({
      objectType: objectType,
      view: view
    }).then(function (viewMap) {
      var updatedView = viewMap.first();
      dispatch.dispatch(ViewsActionTypes.VIEW_SAVED, {
        objectType: objectType,
        view: updatedView
      });
      return updatedView;
    }, function () {
      var action = I18n.text('genericActions.progressiveTense.update');
      var type = I18n.text('genericTypes.singular.view');
      Alerts.addError('genericMessages.actionError', {
        action: action,
        type: type
      });
    });
  },
  updateFavoriteColumns: function updateFavoriteColumns(options) {
    dispatch.dispatch(ViewsActionTypes.VIEW_COLUMN_FAVORITES_UPDATED, options);
  },
  fetch: function fetch(objectType) {
    return ViewsAPI.fetch(objectType).then(function (_ref4) {
      var views = _ref4.views,
          defaultViewId = _ref4.defaultViewId;
      dispatch.dispatch(ViewsActionTypes.VIEWS_UPDATED, {
        objectType: objectType,
        views: views
      });

      if (!getShouldFetchDefaultView(objectType)) {
        dispatch.dispatch(DEFAULT_VIEW_UPDATED, {
          objectType: objectType,
          viewId: defaultViewId
        });
      }
    });
  },
  delete: function _delete(options) {
    var objectType = options.objectType;
    var viewId = "" + options.viewId;
    return ViewsAPI.del({
      objectType: objectType,
      viewId: viewId
    }).then(function () {
      dispatch.dispatch(VIEW_DELETED, {
        objectType: objectType,
        viewId: viewId
      });
      RouterContainer.get().navigate(links.indexFromObjectType(objectType, false), {
        trigger: true
      });
    }, function () {
      var action = I18n.text('genericActions.progressiveTense.delete');
      var type = I18n.text('genericTypes.singular.view');
      Alerts.addError('genericMessages.actionError', {
        action: action,
        type: type
      });
    });
  },
  filtersFixed: function filtersFixed(_ref5) {
    var objectType = _ref5.objectType,
        view = _ref5.view;
    view = ViewRecord.fromJS(view);
    Dispatch.dispatchSafe(ViewsActionTypes.VIEW_FILTERS_FIXED, {
      objectType: objectType,
      view: view
    }).done();
  },
  updated: function updated(_ref6) {
    var objectType = _ref6.objectType,
        view = _ref6.view;
    view = ViewRecord.fromJS(view);
    Dispatch.dispatchSafe(ViewsActionTypes.VIEW_UPDATED, {
      objectType: objectType,
      view: view
    }).done();
  },
  changePipeline: function changePipeline(objectType, viewId, pipelineId) {
    Dispatch.dispatchSafe(ViewsActionTypes.VIEW_PIPELINE_CHANGED, {
      objectType: objectType,
      viewId: viewId,
      pipelineId: pipelineId
    });
  },
  initializeObjectType: function initializeObjectType(_ref7) {
    var objectType = _ref7.objectType,
        views = _ref7.views;
    return Dispatch.dispatchQueue(ViewsActionTypes.VIEW_INITIALIZE_OBJECT_TYPE, {
      objectType: objectType,
      views: views
    });
  },
  restoreDraft: function restoreDraft(_ref8) {
    var objectType = _ref8.objectType,
        viewId = _ref8.viewId;
    return Dispatch.dispatchSafe(ViewsActionTypes.VIEW_DRAFT_RESTORED, {
      objectType: objectType,
      viewId: viewId
    });
  }
};