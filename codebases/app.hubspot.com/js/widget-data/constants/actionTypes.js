'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var REFRESH_WIDGET_DATA = 'REFRESH_WIDGET_DATA';
export var UPDATE_SESSION_ID = 'UPDATE_SESSION_ID';
export var REFRESH_SESSION_ID = 'REFRESH_SESSION_ID';
export var FETCH_SESSION_ID = createAsyncActionTypes('FETCH_SESSION_ID');