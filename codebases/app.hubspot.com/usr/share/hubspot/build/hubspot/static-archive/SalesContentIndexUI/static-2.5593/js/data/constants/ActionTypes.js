'use es6';

export var SEARCH_FETCH_STARTED = 'SEARCH_FETCH_STARTED';
export var SEARCH_FETCH_FAILED = 'SEARCH_FETCH_FAILED';
export var SEARCH_FETCH_SUCCEEDED = 'SEARCH_FETCH_SUCCEEDED';
export var FOLDER_FETCH_SUCCEEDED = 'FOLDER_FETCH_SUCCEEDED';
export var SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
export var SET_SORT = 'SET_SORT';
export var SET_SELECTED_FOLDER = 'SET_SELECTED_FOLDER';
export var SET_VIEW_FILTER = 'SET_VIEW_FILTER';
export var SET_FROM_MODAL = 'SET_FROM_MODAL';
export var SET_FROM_QUERY_PARAMS = 'SET_FROM_QUERY_PARAMS';
export var TOGGLE_FOLDER_SELECTION = 'TOGGLE_FOLDER_SELECTION';
export var TOGGLE_ROW_SELECTION = 'TOGGLE_ROW_SELECTION';
export var ADD_RESULT = 'ADD_RESULT';
export var UPDATE_RESULT = 'UPDATE_RESULT';
export var UPDATE_RESULTS = 'UPDATE_RESULTS';
export var REMOVE_RESULT = 'REMOVE_RESULT';
export var REMOVE_RESULTS = 'REMOVE_RESULTS';
export var REPLACE_RESULT = 'REPLACE_RESULT';
export var REPLACE_RESULT_AFTER_SEARCH = 'REPLACE_RESULT_AFTER_SEARCH';
export var ADD_TEMP_RESULT = 'ADD_TEMP_RESULT';
/* eslint-env commonjs */
// This temporary hack ensures module system compatibility.
// Read more at go/treeshaking

if (!!module && !!module.exports) {
  module.exports.default = Object.assign({}, module.exports);
}