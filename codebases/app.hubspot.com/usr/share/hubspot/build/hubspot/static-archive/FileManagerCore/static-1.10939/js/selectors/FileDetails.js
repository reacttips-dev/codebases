'use es6';

import { createSelector } from 'reselect';
import { getFetchFilesTimestamp } from './Files';
import { filterRecentlyUploadedFiles } from '../utils/FoldersAndFiles';
import { RequestStatus } from '../Constants';
export var getSingleFileDetails = function getSingleFileDetails(state) {
  return state.fileDetails.get('fileDetails');
};
export var getUploadRequestsById = function getUploadRequestsById(state) {
  return state.fileDetails.get('uploadRequestsById');
};

var getCurrentFolderId = function getCurrentFolderId(state, _ref) {
  var folderId = _ref.folderId;
  return folderId;
};

export var getRecentlyUploadedFiles = createSelector([getCurrentFolderId, getFetchFilesTimestamp, getSingleFileDetails, getUploadRequestsById], function (currentFolderId, timestamp, singleFileDetails, uploadRequests) {
  return filterRecentlyUploadedFiles(singleFileDetails, uploadRequests, currentFolderId);
});
export var getIsDownloadFromExternalUrlPending = function getIsDownloadFromExternalUrlPending(state) {
  return state.fileDetails.get('downloadFromExternalUrlStatus') === RequestStatus.PENDING;
};