'use es6';

import { createAction } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes'; // this is dispatched when a thread is created and the pubsub client is finished connecting
// this is needed because createNewThread.SUCCEDED has no garuntee that the pub sub connection is complete

export var onThreadCreatedAndNetworkOnline = createAction(ActionTypes.THREAD_CREATED_AND_NETWORK_ONLINE);