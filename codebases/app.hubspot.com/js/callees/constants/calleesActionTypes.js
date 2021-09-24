'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var FETCH_CALLEES = createAsyncActionTypes('FETCH_CALLEES');
export var SEARCH_CALLEES = createAsyncActionTypes('SEARCH_CALLEES');
export var CLEAR_CALLEES_SEARCH = 'CLEAR_CALLEES_SEARCH';
export var ADD_CALLEE = 'ADD_CALLEE';
export var REMOVE_CALLEE = 'REMOVE_CALLEE';
export var SET_SEARCH_TEXT = 'SET_SEARCH_TEXT';
export var CLEAR_CALLEES = 'CLEAR_CALLEES';