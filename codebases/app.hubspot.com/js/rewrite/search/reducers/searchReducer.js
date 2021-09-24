'use es6';

import { isOfMinSearchLength } from 'crm_data/elasticSearch/ElasticSearchValidation';
import { RESTORE_CACHED_VALUES } from '../../init/actions/initActionTypes';
import { produce } from 'immer';
import { SYNC_SEARCH_TERM } from '../actions/searchActionTypes';
var initialState = {
  searchTerm: undefined,
  lastValidSearchTerm: undefined
};
export var searchReducer = produce(function (draft, action) {
  switch (action.type) {
    case RESTORE_CACHED_VALUES:
    case SYNC_SEARCH_TERM:
      {
        var searchTerm = action.payload.searchTerm;
        var isValid = isOfMinSearchLength(searchTerm) || !searchTerm;
        draft.searchTerm = searchTerm;

        if (isValid) {
          draft.lastValidSearchTerm = searchTerm;
        }

        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);