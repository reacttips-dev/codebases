'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var PUBLISH_MESSAGE = createAsyncActionTypes('PUBLISH_MESSAGE');
export var INITIALIZE_PUBSUB = createAsyncActionTypes('INITIALIZE_PUBSUB');