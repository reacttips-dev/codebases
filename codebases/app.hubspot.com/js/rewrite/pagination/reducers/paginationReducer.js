'use es6';

import { getFrom } from 'crm_data/settings/LocalSettings';
import { RESTORE_CACHED_VALUES, SYNC_ROUTER_VALUES } from '../../init/actions/initActionTypes';
import { FILTERS_CHANGED, SORT_CHANGED } from '../../views/actions/viewsActionTypes';
import { PAGE_CHANGED, PAGE_SIZE_CHANGED } from '../actions/paginationActionTypes';
import { PIPELINE_CHANGED } from '../../pipelines/actions/currentPipelineIdActionTypes';
import { produce } from 'immer';
import { SYNC_SEARCH_TERM } from '../../search/actions/searchActionTypes';
var initialState = {
  page: 0,
  pageSize: getFrom(localStorage, 'gridPageSize') || 25
};
export var paginationReducer = produce(function (draft, action) {
  switch (action.type) {
    case PAGE_CHANGED:
      {
        var page = action.payload.page;
        draft.page = page;
        return draft;
      }

    case PAGE_SIZE_CHANGED:
      {
        var pageSize = action.payload.pageSize;
        draft.page = 0;
        draft.pageSize = pageSize;
        return draft;
      }

    case RESTORE_CACHED_VALUES:
      {
        var _action$payload = action.payload,
            _page = _action$payload.page,
            hasData = _action$payload.hasData;

        if (hasData) {
          draft.page = _page;
        }

        return draft;
      }

    case SYNC_ROUTER_VALUES:
    case SYNC_SEARCH_TERM:
    case FILTERS_CHANGED:
    case PIPELINE_CHANGED:
    case SORT_CHANGED:
      {
        draft.page = 0;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);