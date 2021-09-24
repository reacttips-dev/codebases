'use es6';

import { stringify } from 'hub-http/helpers/params';
import { ADD_RESULT, ADD_TEMP_RESULT } from 'SalesContentIndexUI/data/constants/ActionTypes';
import getQueryParams from 'SalesContentIndexUI/data/utils/getQueryParams';
import SearchActions from 'SalesContentIndexUI/data/actions/SearchActions';
import sort from 'SalesContentIndexUI/data/utils/sort';
import SortValues from 'SalesContentIndexUI/data/constants/SortValues';
import { UPDATED_AT_FIELD } from 'SalesContentIndexUI/data/constants/SearchFields';
import { OWNED_BY_ME } from '../../lib/DefaultFilterNames';
var mostRecentlyCreatedSort = sort(UPDATED_AT_FIELD, SortValues.DESC);
export default (function (_ref) {
  var dispatch = _ref.dispatch;
  return function (next) {
    return function (action) {
      next(action);

      if (action.type === ADD_RESULT) {
        var _getQueryParams = getQueryParams(),
            view = _getQueryParams.view;

        var _SearchActions$get = SearchActions.get(),
            searchFromQueryParams = _SearchActions$get.searchFromQueryParams;

        var newQuery = {
          page: 1
        }; // Folders will only appear when the owner filter is set to "Any", so we
        // only maintain one or the other in the URL here.We only maintain the owner
        // filter if it's "ownedByMe" to make sure that the state reflects where the
        // temporary result should appear.

        if (view && view === OWNED_BY_ME) {
          newQuery.view = view;
        } else {
          newQuery.folder = action.payload.folderId;
        }

        window.history.pushState(null, null, "?" + stringify(newQuery));
        var result = action.payload;
        dispatch(searchFromQueryParams({
          queryParams: newQuery,
          selectedSort: mostRecentlyCreatedSort
        })).then(function () {
          return dispatch({
            type: ADD_TEMP_RESULT,
            payload: result
          });
        });
      }
    };
  };
});