'use es6';

import { Map as ImmutableMap } from 'immutable';
import { TOGGLE_FOLDER_SELECTION, TOGGLE_ROW_SELECTION, SET_SEARCH_QUERY, SET_SELECTED_FOLDER, ADD_TEMP_RESULT, REMOVE_RESULT, REMOVE_RESULTS, UPDATE_RESULT } from 'SalesContentIndexUI/data/constants/ActionTypes';
var initialState = {
  selectedFolders: ImmutableMap(),
  selectedRows: ImmutableMap()
};

var updateSelection = function updateSelection(selectedResults, searchResult) {
  var contentId = searchResult.contentId;
  return selectedResults.has(contentId) ? selectedResults.remove(contentId) : selectedResults.set(contentId, searchResult);
};

export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case TOGGLE_FOLDER_SELECTION:
      {
        var selectedFolders = state.selectedFolders;
        var searchResult = action.payload;
        return Object.assign({}, state, {
          selectedFolders: updateSelection(selectedFolders, searchResult)
        });
      }

    case TOGGLE_ROW_SELECTION:
      {
        var selectedRows = state.selectedRows;
        var _searchResult = action.payload;
        return Object.assign({}, state, {
          selectedRows: updateSelection(selectedRows, _searchResult)
        });
      }

    case UPDATE_RESULT:
      return {
        selectedFolders: state.selectedFolders.map(function (folderRecord) {
          return folderRecord.id === action.payload.id ? action.payload : folderRecord;
        }),
        selectedRows: state.selectedRows.map(function (contentRecord) {
          return contentRecord.id === action.payload.id ? action.payload : contentRecord;
        })
      };

    case ADD_TEMP_RESULT:
    case REMOVE_RESULT:
    case REMOVE_RESULTS:
    case SET_SEARCH_QUERY:
    case SET_SELECTED_FOLDER:
      return initialState;

    default:
      return state;
  }
});