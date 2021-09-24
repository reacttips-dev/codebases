'use es6';

import { LOADING, READY, INITIALIZING_OUTBOUND_CALL, RINGING, ANSWERED, ENDING, ENDED } from 'calling-internal-common/widget-status/constants/CallWidgetStates';
export var isClientLoading = function isClientLoading(state) {
  return state === LOADING;
};
export var isClientReady = function isClientReady(state) {
  return state === READY;
};
export var isClientInitializingOutboundCall = function isClientInitializingOutboundCall(state) {
  return state === INITIALIZING_OUTBOUND_CALL;
};
export var isClientRinging = function isClientRinging(state) {
  return state === RINGING;
};
export var isClientAnswered = function isClientAnswered(state) {
  return state === ANSWERED;
};
export var isClientEnding = function isClientEnding(state) {
  return state === ENDING;
};
export var isClientEnded = function isClientEnded(state) {
  return state === ENDED;
};