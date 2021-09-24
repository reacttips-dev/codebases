'use es6';

import { createAction } from 'redux-actions';
import { SET_CALL_DATA, SET_CLIENT_STATUS, SET_END_CALL_DATA, SET_SELECTED_FROM_NUMBER, SET_SELECTED_CALL_METHOD, SET_SELECTED_CONNECT_FROM_NUMBER, SET_TO_NUMBER_IDENTIFIER, SET_CALL_END_STATUS, RESET_CALL_DATA, SET_SUBJECT, SET_IS_QUEUE_TASK, SET_THREAD_ID } from './ActionTypes';
export var setCallData = createAction(SET_CALL_DATA);
export var setClientStatus = createAction(SET_CLIENT_STATUS);
export var setEndCallData = createAction(SET_END_CALL_DATA);
export var setSelectedFromNumber = createAction(SET_SELECTED_FROM_NUMBER);
export var setSelectedConnectFromNumber = createAction(SET_SELECTED_CONNECT_FROM_NUMBER);
export var setSelectedCallMethod = createAction(SET_SELECTED_CALL_METHOD);
export var setToNumberIdentifier = createAction(SET_TO_NUMBER_IDENTIFIER);
export var setCallEndStatus = createAction(SET_CALL_END_STATUS);
export var resetCallData = createAction(RESET_CALL_DATA);
export var setSubject = createAction(SET_SUBJECT);
export var setIsQueueTask = createAction(SET_IS_QUEUE_TASK);
export var setThreadId = createAction(SET_THREAD_ID);