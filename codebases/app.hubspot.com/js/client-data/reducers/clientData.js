'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import ClientData from 'conversations-internal-schema/client-data/records/ClientData';
var initialState = ClientData({
  isPubNubClientConnected: true
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionTypes.APP_IN_FOREGROUND, function (state) {
  return state.set('isInForeground', true);
}), _defineProperty(_handleActions, ActionTypes.APP_IN_BACKGROUND, function (state) {
  return state.set('isInForeground', false);
}), _defineProperty(_handleActions, ActionTypes.NETWORK_ONLINE, function (state) {
  return state.set('isPubNubClientConnected', true);
}), _defineProperty(_handleActions, ActionTypes.NETWORK_OFFLINE, function (state) {
  return state.set('isPubNubClientConnected', false);
}), _handleActions), initialState);