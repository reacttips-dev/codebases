'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var CALLEE_PROPERTIES = createAsyncActionTypes('CALLEE_PROPERTIES');
export var ADD_PHONE_NUMBER_PROPERTY = createAsyncActionTypes('ADD_PHONE_NUMBER_PROPERTY');
export var RESET_ADD_PHONE_NUMBER_PROPERTY = 'RESET_ADD_PHONE_NUMBER_PROPERTY';
export var REMOVE_PHONE_NUMBER_PROPERTY = createAsyncActionTypes('REMOVE_PHONE_NUMBER_PROPERTY');