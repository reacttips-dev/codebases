'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _reducer;

import getIn from 'transmute/getIn';
import { handleActions } from 'flux-actions';
import { Map as ImmutableMap, OrderedMap } from 'immutable';
import { setFileId, setUploadProgress } from 'conversations-internal-schema/file-upload/operators/fileUploadSetters';
import { getLocalId } from 'conversations-internal-schema/file-upload/operators/fileUploadGetters';
import { ATTACHMENT_UPLOAD_PROGRESS, ATTACHMENT_UPLOAD_START, ATTACHMENT_UPLOAD_COMPLETE, REMOVE_ATTACHMENT, ATTACHMENT_ERROR, CLEAR_ATTACHMENTS } from '../constants/fileUploadsActionTypes';
import { RESET_STUBBED_THREAD } from '../../stubbed-thread-history/constants/StubbedThreadHistoryActionTypes';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import { fileIsUploadingInThread } from '../operators/fileIsUploadingInThread';
var initialState = new ImmutableMap(); // this reducer is the main store for the file upload component
// resolvedAttachments is where we store files for the thread view

var reducer = (_reducer = {}, _defineProperty(_reducer, ATTACHMENT_UPLOAD_START, function (state, action) {
  var _action$payload = action.payload,
      attachment = _action$payload.attachment,
      threadId = _action$payload.threadId;
  return state.withMutations(function (mutableState) {
    if (!getIn([threadId], mutableState)) {
      mutableState.set(threadId, new OrderedMap());
    }

    mutableState.setIn([threadId, getLocalId(attachment)], attachment);
  });
}), _defineProperty(_reducer, ATTACHMENT_UPLOAD_PROGRESS, function (state, action) {
  var _action$payload2 = action.payload,
      localId = _action$payload2.localId,
      progress = _action$payload2.progress,
      threadId = _action$payload2.threadId;

  if (!fileIsUploadingInThread({
    localId: localId,
    threadId: threadId
  }, state)) {
    return state;
  }

  return state.updateIn([threadId, localId], function (attachment) {
    return setUploadProgress(progress, attachment);
  });
}), _defineProperty(_reducer, ATTACHMENT_UPLOAD_COMPLETE, function (state, action) {
  var _action$payload3 = action.payload,
      fileId = _action$payload3.fileId,
      localId = _action$payload3.localId,
      threadId = _action$payload3.threadId;

  if (!fileIsUploadingInThread({
    localId: localId,
    threadId: threadId
  }, state)) {
    return state;
  }

  return state.updateIn([threadId, localId], function (attachment) {
    return attachment.withMutations(function (mutableAttachment) {
      setUploadProgress(100, mutableAttachment);
      setFileId(fileId, mutableAttachment);
    });
  });
}), _defineProperty(_reducer, REMOVE_ATTACHMENT, function (state, action) {
  var _action$payload4 = action.payload,
      localId = _action$payload4.localId,
      threadId = _action$payload4.threadId;
  return state.deleteIn([threadId, localId]);
}), _defineProperty(_reducer, CLEAR_ATTACHMENTS, function (state, action) {
  var threadId = action.payload.threadId;
  return state.delete(threadId);
}), _defineProperty(_reducer, RESET_STUBBED_THREAD, function (state) {
  return state.delete(STUBBED_THREAD_ID);
}), _defineProperty(_reducer, ATTACHMENT_ERROR, function (state, action) {
  var threadId = action.payload.threadId;
  return state.deleteIn([threadId]);
}), _reducer);
export default handleActions(reducer, initialState);