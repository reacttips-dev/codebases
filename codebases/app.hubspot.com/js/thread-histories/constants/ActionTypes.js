'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var FETCH_THREAD_HISTORY = createAsyncActionTypes('FETCH_THREAD_HISTORY');
export var REMOVE_MESSAGE_IN_CONVERSATION = 'REMOVE_MESSAGE_IN_CONVERSATION';