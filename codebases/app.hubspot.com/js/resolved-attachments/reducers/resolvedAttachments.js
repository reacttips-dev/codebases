'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _reducer;

import { handleActions } from 'flux-actions';
import get from 'transmute/get';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateEntries } from 'conversations-async-data/indexed-async-data/operators/updateEntries';
import { getEntries } from 'conversations-async-data/indexed-async-data/operators/getters';
import { isSucceeded } from 'conversations-async-data/async-data/operators/statusComparators';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import ResolvedAttachmentRecord from 'conversations-internal-schema/resolved-attachment/records/ResolvedAttachmentRecord';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { RESOLVE_ATTACHMENTS } from '../constants/resolvedAttachmentsActionTypes';
import { FETCH_THREAD_HISTORY } from '../../thread-histories/constants/ActionTypes';
import { ATTACHMENT_UPLOAD_COMPLETE } from '../../file-uploads/constants/fileUploadsActionTypes';
var initialState = IndexedAsyncData({
  notSetValue: AsyncData({
    data: null
  })
}); // this reducer is the main store for attachments inside a thread view
// fileUploads.js is the store that holds uploads in the file component

var reducer = (_reducer = {}, _defineProperty(_reducer, RESOLVE_ATTACHMENTS.STARTED, function (state, action) {
  var fileIds = action.payload.requestArgs.fileIds;
  var entries = getEntries(state);
  var newFileIds = fileIds.filter(function (fileId) {
    var entry = entries.get("" + fileId);

    if (isSucceeded(entry)) {
      return false;
    }

    return true;
  });
  return updateEntries(newFileIds, function (fileId, asyncData) {
    return requestStarted(asyncData);
  }, state);
}), _defineProperty(_reducer, RESOLVE_ATTACHMENTS.SUCCEEDED, function (state, action) {
  var _action$payload = action.payload,
      fileIds = _action$payload.requestArgs.fileIds,
      resolvedAttachments = _action$payload.data;
  return updateEntries(fileIds, function (fileId, asyncData) {
    return requestSucceededWithOperator(function () {
      var resolvedAttachment = get(fileId, resolvedAttachments);
      return resolvedAttachment;
    }, asyncData);
  }, state);
}), _defineProperty(_reducer, ATTACHMENT_UPLOAD_COMPLETE, function (state, action) {
  var _action$payload2 = action.payload,
      fileId = _action$payload2.fileId,
      uploadedFile = _action$payload2.uploadedFile;
  var attachmentRecord = new ResolvedAttachmentRecord({
    fileMetadata: uploadedFile,
    fileId: fileId
  });
  return updateEntry(fileId, function (entry) {
    return requestSucceededWithOperator(function () {
      return attachmentRecord;
    }, entry);
  }, state);
}), _defineProperty(_reducer, FETCH_THREAD_HISTORY.SUCCEEDED, function (state, action) {
  var resolvedAttachments = action.payload.data.files;
  var fileIds = resolvedAttachments.keySeq().toList();
  return updateEntries(fileIds, function (fileId, asyncData) {
    return requestSucceededWithOperator(function () {
      var resolvedAttachment = get(fileId, resolvedAttachments);
      return resolvedAttachment;
    }, asyncData);
  }, state);
}), _defineProperty(_reducer, RESOLVE_ATTACHMENTS.FAILED, function (state, action) {
  var fileIds = action.payload.requestArgs.fileIds;
  return updateEntries(fileIds, function (fileId, asyncData) {
    return requestFailed(asyncData);
  }, state);
}), _reducer);
export default handleActions(reducer, initialState);