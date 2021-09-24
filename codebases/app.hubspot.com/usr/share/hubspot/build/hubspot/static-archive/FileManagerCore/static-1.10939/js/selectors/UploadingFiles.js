'use es6';

import { createSelector } from 'reselect';
import { getAreFilesBeingReplaced } from './Files';
export var getUploadingFiles = function getUploadingFiles(state) {
  return state.uploadingFiles.get('files');
};
export var getAreFilesUploading = createSelector([getUploadingFiles, getAreFilesBeingReplaced], function (uploadingFiles, areFilesBeingReplaced) {
  return !uploadingFiles.isEmpty() || areFilesBeingReplaced;
});