'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var FETCH_USER_SETTINGS = createAsyncActionTypes('FETCH_USER_SETTINGS');
export var SAVE_USER_SETTING = createAsyncActionTypes('SAVE_USER_SETTING');