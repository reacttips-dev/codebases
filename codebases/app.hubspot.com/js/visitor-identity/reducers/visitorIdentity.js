'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions } from 'flux-actions';
import { UPDATE_GLOBAL_COOKIE_OPT_OUT, UPDATE_IS_FIRST_VISITOR_SESSION } from '../constants/ActionTypes';
import VisitorIdentity from '../records/VisitorIdentity';
import { setGlobalCookieOptOut } from '../operators/setGlobalCookieOptOut';
import { setIsFirstVisitorSession } from '../operators/setIsFirstVisitorSession';
var visitorIdentity = handleActions((_handleActions = {}, _defineProperty(_handleActions, UPDATE_GLOBAL_COOKIE_OPT_OUT, function (state, action) {
  var globalCookieOptOut = action.payload.globalCookieOptOut;
  return setGlobalCookieOptOut(globalCookieOptOut, state);
}), _defineProperty(_handleActions, UPDATE_IS_FIRST_VISITOR_SESSION, function (state, action) {
  var isFirstVisitorSession = action.payload.isFirstVisitorSession;
  return setIsFirstVisitorSession(isFirstVisitorSession, state);
}), _handleActions), new VisitorIdentity());
export default visitorIdentity;