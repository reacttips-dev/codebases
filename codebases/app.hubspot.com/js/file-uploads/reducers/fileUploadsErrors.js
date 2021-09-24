'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _reducer;

import { handleActions } from 'flux-actions';
import { Map as ImmutableMap } from 'immutable';
import { ATTACHMENT_ERROR, DISMISS_ATTACHMENTS_ERROR, ATTACHMENT_UPLOAD_START, REMOVE_ATTACHMENT } from '../constants/fileUploadsActionTypes';
var initialState = new ImmutableMap();
var reducer = (_reducer = {}, _defineProperty(_reducer, ATTACHMENT_ERROR, function (state, action) {
  var _action$payload = action.payload,
      error = _action$payload.error,
      threadId = _action$payload.threadId;
  return state.set(threadId, error);
}), _defineProperty(_reducer, DISMISS_ATTACHMENTS_ERROR, function (state, action) {
  var threadId = action.payload.threadId;
  return state.delete(threadId);
}), _defineProperty(_reducer, ATTACHMENT_UPLOAD_START, function (state, action) {
  var threadId = action.payload.threadId;
  return state.delete(threadId);
}), _defineProperty(_reducer, REMOVE_ATTACHMENT, function (state, action) {
  var threadId = action.payload.threadId;
  return state.delete(threadId);
}), _reducer);
export default handleActions(reducer, initialState);