'use es6';

import { FETCH_VIEWS_STARTED, FETCH_VIEWS_SUCCEEDED, FETCH_VIEWS_FAILED, FILTERS_CHANGED, COLUMNS_CHANGED, RESET_VIEW, SAVE_VIEW_SUCCEEDED, SAVE_VIEW_STARTED, SAVE_VIEW_FAILED, SORT_CHANGED, DELETE_VIEW_SUCCEEDED, CREATE_VIEW_SUCCEEDED, CACHE_VIEWS } from '../actions/viewsActionTypes';
import { fromJS } from 'immutable';
import { PENDING, SUCCEEDED, FAILED } from '../../constants/RequestStatus';
import { RESTORE_CACHED_VALUES, SYNC_ROUTER_VALUES } from '../../init/actions/initActionTypes';
import { PIPELINE_CHANGED } from '../../pipelines/actions/currentPipelineIdActionTypes';
import { ALL_PIPELINES_VALUE } from '../../pipelines/constants/AllPipelinesValue';
export var initialState = fromJS({
  status: {},
  data: {},
  cachedData: {},
  cachedDataBeforeSave: {},
  currentViewId: null,
  currentPageType: null
});
export var viewsReducer = function viewsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case FETCH_VIEWS_STARTED:
      {
        var objectTypeId = action.payload.objectTypeId;
        return state.setIn(['status', objectTypeId], PENDING);
      }

    case FETCH_VIEWS_SUCCEEDED:
      {
        var _action$payload = action.payload,
            _objectTypeId = _action$payload.objectTypeId,
            views = _action$payload.views;
        return state.setIn(['status', _objectTypeId], SUCCEEDED) // This is the 'live' state. Changes to views made on the client are reflected under this key
        .setIn(['data', _objectTypeId], views) // This is the 'cached' state. This key is updated only when views are fetched or saved.
        .setIn(['cachedData', _objectTypeId], views);
      }

    case FETCH_VIEWS_FAILED:
      {
        var _objectTypeId2 = action.payload.objectTypeId;
        return state.setIn(['status', _objectTypeId2], FAILED);
      }

    case SAVE_VIEW_STARTED:
      {
        var _action$payload2 = action.payload,
            _objectTypeId3 = _action$payload2.objectTypeId,
            view = _action$payload2.view;
        var viewId = String(view.id);
        var currentState = state.getIn(['cachedData', _objectTypeId3, viewId]);
        return state.setIn(['cachedDataBeforeSave', _objectTypeId3, viewId], currentState).setIn(['cachedData', _objectTypeId3, viewId], view).setIn(['data', _objectTypeId3, viewId], view);
      }

    case SAVE_VIEW_SUCCEEDED:
      {
        var _action$payload3 = action.payload,
            _objectTypeId4 = _action$payload3.objectTypeId,
            _view = _action$payload3.view;

        var _viewId = String(_view.id);

        return state.removeIn(['cachedDataBeforeSave', _objectTypeId4, _viewId]);
      }

    case SAVE_VIEW_FAILED:
      {
        var _action$payload4 = action.payload,
            _objectTypeId5 = _action$payload4.objectTypeId,
            _view2 = _action$payload4.view;

        var _viewId2 = String(_view2.id);

        var previousState = state.getIn(['cachedDataBeforeSave', _objectTypeId5, _viewId2]);
        return state.setIn(['data', _objectTypeId5, _viewId2], previousState).setIn(['cachedData', _objectTypeId5, _viewId2], previousState).removeIn(['cachedDataBeforeSave', _objectTypeId5, _viewId2]);
      }

    case DELETE_VIEW_SUCCEEDED:
      {
        var _action$payload5 = action.payload,
            _objectTypeId6 = _action$payload5.objectTypeId,
            _viewId3 = _action$payload5.viewId;
        var stringViewId = String(_viewId3);
        return state.removeIn(['data', _objectTypeId6, stringViewId]).removeIn(['cachedData', _objectTypeId6, stringViewId]);
      }

    case CREATE_VIEW_SUCCEEDED:
      {
        var _action$payload6 = action.payload,
            _objectTypeId7 = _action$payload6.objectTypeId,
            _view3 = _action$payload6.view;

        var _viewId4 = String(_view3.id);

        return state.setIn(['data', _objectTypeId7, _viewId4], _view3).setIn(['cachedData', _objectTypeId7, _viewId4], _view3);
      }

    case SORT_CHANGED:
      {
        var _action$payload7 = action.payload,
            _objectTypeId8 = _action$payload7.objectTypeId,
            _viewId5 = _action$payload7.viewId,
            sortKey = _action$payload7.sortKey,
            sortColumnName = _action$payload7.sortColumnName,
            order = _action$payload7.order;
        return state.mergeIn(['data', _objectTypeId8, _viewId5, 'state'], {
          sortKey: sortKey,
          sortColumnName: sortColumnName,
          order: order
        });
      }

    case FILTERS_CHANGED:
      {
        var _action$payload8 = action.payload,
            _objectTypeId9 = _action$payload8.objectTypeId,
            _viewId6 = _action$payload8.viewId,
            filters = _action$payload8.filters;
        return state.setIn(['data', _objectTypeId9, _viewId6, 'filters'], fromJS(filters));
      }

    case RESET_VIEW:
      {
        var _action$payload9 = action.payload,
            _objectTypeId10 = _action$payload9.objectTypeId,
            _viewId7 = _action$payload9.viewId,
            isDefault = _action$payload9.isDefault;

        if (isDefault) {
          return state.removeIn(['data', _objectTypeId10, _viewId7]);
        }

        return state.setIn(['data', _objectTypeId10, _viewId7], state.getIn(['cachedData', _objectTypeId10, _viewId7]));
      }

    case COLUMNS_CHANGED:
      {
        var _action$payload10 = action.payload,
            _objectTypeId11 = _action$payload10.objectTypeId,
            _viewId8 = _action$payload10.viewId,
            columns = _action$payload10.columns;
        return state.setIn(['data', _objectTypeId11, _viewId8, 'columns'], columns);
      }

    case PIPELINE_CHANGED:
      {
        var _action$payload11 = action.payload,
            _objectTypeId12 = _action$payload11.objectTypeId,
            pipelineId = _action$payload11.pipelineId;

        var _viewId9 = state.get('currentViewId');

        if (pipelineId === ALL_PIPELINES_VALUE) {
          return state.removeIn(['data', _objectTypeId12, _viewId9, 'state', 'pipelineId']);
        }

        return state.setIn(['data', _objectTypeId12, _viewId9, 'state', 'pipelineId'], pipelineId);
      }

    case SYNC_ROUTER_VALUES:
      {
        var _action$payload12 = action.payload,
            _viewId10 = _action$payload12.viewId,
            pageType = _action$payload12.pageType;
        return state.set('currentViewId', _viewId10).set('currentPageType', pageType);
      }

    case RESTORE_CACHED_VALUES:
      {
        var _action$payload13 = action.payload,
            _objectTypeId13 = _action$payload13.objectTypeId,
            _viewId11 = _action$payload13.viewId,
            _pageType = _action$payload13.pageType,
            _views = _action$payload13.views,
            hasData = _action$payload13.hasData;

        if (!hasData) {
          return state;
        }

        return state.mergeIn(['data', _objectTypeId13], _views).set('currentViewId', _viewId11).set('currentPageType', _pageType);
      }

    case CACHE_VIEWS:
      {
        var _action$payload14 = action.payload,
            _objectTypeId14 = _action$payload14.objectTypeId,
            _views2 = _action$payload14.views;
        return state.mergeIn(['data', _objectTypeId14], _views2).mergeIn(['cachedData', _objectTypeId14], _views2);
      }

    default:
      {
        return state;
      }
  }
};