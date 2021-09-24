'use es6';

import { createSelector } from 'reselect';
import { getFiles } from 'FileManagerCore/selectors/Files';
import { getSingleFileDetails } from 'FileManagerCore/selectors/FileDetails';
import { addSupportInfoToFiles } from '../utils/fileFiltering';
import { getFilter } from './Filter';
import { getSelectedFileId } from './Panel';
import { getIsHostAppContextPrivate } from './Configuration';

var getUploadingFiles = function getUploadingFiles(state) {
  return state.uploadingFiles.get('files').toList();
};

var getSelectedFolder = function getSelectedFolder(state) {
  return state.panel.getIn(['present', 'selectedFolder']);
};

var filterUploadingFiles = function filterUploadingFiles(uploadingFiles, selectedFolder) {
  if (selectedFolder) {
    var selectedFolderId = selectedFolder.get('id');
    return uploadingFiles.filter(function (file) {
      return file.get('folder_id') === selectedFolderId;
    });
  }

  return uploadingFiles;
};

var replaceFileInList = function replaceFileInList(files, fileToReplace) {
  var index = files.findIndex(function (f) {
    return f.get('id') === fileToReplace.get('id');
  });

  if (index >= 0) {
    var full_path = files.get(index).get('full_path');
    files = files.set(index, fileToReplace.merge({
      full_path: full_path
    }));
  }

  return files;
};

var getFilteredUploadingFiles = createSelector([getUploadingFiles, getSelectedFolder], filterUploadingFiles);
export var getUploadingFilesWithSupportInfo = createSelector([getFilteredUploadingFiles, getFilter, getIsHostAppContextPrivate], addSupportInfoToFiles);
export var getSelectedSingleFile = createSelector([getSelectedFileId, getSingleFileDetails], function (selectedFileId, singleFileDetails) {
  return selectedFileId ? singleFileDetails.get(selectedFileId) : null;
});
export var getIsSelectedSingleFileFetched = createSelector([getSelectedSingleFile], function (selectedFile) {
  return Boolean(selectedFile);
});
export var getFilesWithSupportInfo = createSelector([getFiles, getFilter, getSelectedSingleFile, getIsHostAppContextPrivate], function (files, filter, selectedSingleFile, isHostAppContextPrivate) {
  if (selectedSingleFile) {
    files = replaceFileInList(files, selectedSingleFile);
  }

  return addSupportInfoToFiles(files, filter, isHostAppContextPrivate);
});