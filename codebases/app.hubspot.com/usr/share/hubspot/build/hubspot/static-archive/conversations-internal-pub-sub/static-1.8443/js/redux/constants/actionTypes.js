'use es6';

import { createAsyncActionTypes } from 'conversations-async-data/async-action/createAsyncActionTypes';
export var INITIALIZE_PUBSUB = createAsyncActionTypes('INITIALIZE_PUBSUB');
export var UPDATE_SUBSCRIPTIONS = createAsyncActionTypes('UPDATE_SUBSCRIPTIONS');
export var RECONNECT = createAsyncActionTypes('RECONNECT');
export var RESUBSCRIBE = createAsyncActionTypes('RESUBSCRIBE');
export var PUBSUB_READY = 'PUBSUB_READY';
export var PUBSUB_RECONNECTED = 'PUBSUB_RECONNECTED';
export var PUBSUB_RECONNECTING = 'PUBSUB_RECONNECTING';
export var PUBSUB_DISCONNECTED = 'PUBSUB_DISCONNECTED';
export var PUBSUB_SUSPENDED = 'PUBSUB_SUSPENDED';