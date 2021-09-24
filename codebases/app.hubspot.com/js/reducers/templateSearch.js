'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { TEMPLATE_SEARCH_FETCH_SUCCEEDED, V2_TEMPLATE_SEARCH_FETCH_SUCCEEDED, TEMPLATE_SEARCH_UPDATE_QUERY, CREATE_SUCCESS, TEMPLATE_SEARCH_FETCH_FAILED } from '../constants/TemplateActionTypes';
import SearchContentTypes from 'SalesContentIndexUI/data/constants/SearchContentTypes';
import SearchStatus from 'SalesContentIndexUI/data/constants/SearchStatus';
import SearchQueryRecord from 'SalesContentIndexUI/data/records/SearchQueryRecord';
import SearchFilterRecord from 'SalesContentIndexUI/data/records/SearchFilterRecord';
import { CONTENT_TYPE_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
var templateTypeFilter = SearchFilterRecord({
  field: CONTENT_TYPE_FIELD,
  values: List.of(SearchContentTypes.TEMPLATE)
});
var initialState = {
  requestStatus: SearchStatus.LOADING,
  query: new SearchQueryRecord({
    filters: List.of(templateTypeFilter)
  }),
  result: null
};
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TEMPLATE_SEARCH_UPDATE_QUERY:
      return Object.assign({}, state, {
        query: action.payload
      });

    case TEMPLATE_SEARCH_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        requestStatus: SearchStatus.SUCCEEDED,
        result: action.payload
      });

    case V2_TEMPLATE_SEARCH_FETCH_SUCCEEDED:
      {
        var currentResults = state.result && state.result.get('results');
        return Object.assign({}, state, {
          requestStatus: SearchStatus.SUCCEEDED,
          result: action.payload.update('results', function (results) {
            return currentResults.concat(results);
          })
        });
      }

    case TEMPLATE_SEARCH_FETCH_FAILED:
      return Object.assign({}, state, {
        result: null,
        requestStatus: SearchStatus.FAILED
      });

    case CREATE_SUCCESS:
      {
        var template = action.payload;
        return Object.assign({}, state, {
          result: state.result && state.result.update('results', function (results) {
            return results.push(ImmutableMap({
              name: template.get('name'),
              contentType: SearchContentTypes.TEMPLATE,
              userId: template.get('userId'),
              portalId: template.get('portalId'),
              contentId: template.get('id'),
              createdAt: template.get('createdAt')
            }));
          })
        });
      }

    default:
      return state;
  }
});