'use es6';

import { TOGGLE_FOLDER_SELECTION, TOGGLE_ROW_SELECTION } from 'SalesContentIndexUI/data/constants/ActionTypes';
export var toggleFolderSelection = function toggleFolderSelection(searchResult) {
  return function (dispatch) {
    dispatch({
      type: TOGGLE_FOLDER_SELECTION,
      payload: searchResult
    });
  };
};
export var toggleRowSelection = function toggleRowSelection(searchResult) {
  return function (dispatch) {
    dispatch({
      type: TOGGLE_ROW_SELECTION,
      payload: searchResult
    });
  };
};