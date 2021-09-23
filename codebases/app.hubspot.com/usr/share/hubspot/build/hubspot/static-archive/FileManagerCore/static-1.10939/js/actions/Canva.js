'use es6';

import * as FileApi from '../api/Files';
import { getCanvaDownloadFailedNotification } from '../utils/notifications';
import { CanvaFolderPath } from '../Constants';
import { CANVA_INIT_ATTEMPTED, CANVA_INIT_FAILED, CANVA_INIT_SUCCEEDED, DOWNLOAD_FROM_CANVA_ATTEMPTED, DOWNLOAD_FROM_CANVA_FAILED, DOWNLOAD_FROM_CANVA_SUCCEEDED, REMOVE_CANVA_ID_SUCCEEDED } from './ActionTypes';
import { CANVA_DEFAULT_DESIGN_NAME, CANVA_DEFAULT_FILE_TITLE } from '../constants/Canva';
import { fetchFolderById } from './FolderFetch';
import { getTrackingMeta } from './tracking';
import { reportError } from '../utils/logging';
export function canvaInitAttempted() {
  return {
    type: CANVA_INIT_ATTEMPTED
  };
}
export function canvaInitSucceeded() {
  return {
    type: CANVA_INIT_SUCCEEDED
  };
}
export function canvaInitFailed() {
  return {
    type: CANVA_INIT_FAILED
  };
}

function canvaDownloadAttempted(_ref) {
  var meta = _ref.meta;
  return {
    type: DOWNLOAD_FROM_CANVA_ATTEMPTED,
    meta: meta
  };
}

function canvaDownloadFailed(_ref2) {
  var meta = _ref2.meta;
  return {
    type: DOWNLOAD_FROM_CANVA_FAILED,
    meta: meta
  };
}

function canvaDownloadSucceeded(_ref3) {
  var file = _ref3.file,
      meta = _ref3.meta;
  return {
    type: DOWNLOAD_FROM_CANVA_SUCCEEDED,
    file: file,
    meta: meta
  };
}

function removeCanvaIdSucceeded(_ref4) {
  var file = _ref4.file;
  return {
    type: REMOVE_CANVA_ID_SUCCEEDED,
    file: file
  };
}

export var getFileNameForCanvaDesign = function getFileNameForCanvaDesign(fileName, canvaDesignId) {
  if (!fileName || fileName === CANVA_DEFAULT_DESIGN_NAME) {
    return CANVA_DEFAULT_FILE_TITLE + " " + canvaDesignId;
  }

  return fileName;
};
export function acquireFileFromCanva(_ref5) {
  var canvaDesignId = _ref5.canvaDesignId,
      fileUrl = _ref5.fileUrl,
      folder = _ref5.folder,
      originalFileId = _ref5.originalFileId,
      fileName = _ref5.fileName,
      uploadedFileAccess = _ref5.uploadedFileAccess;
  return function (dispatch) {
    var fileDownloadOptions = {
      name: getFileNameForCanvaDesign(fileName, canvaDesignId),
      url: fileUrl
    };

    if (folder) {
      fileDownloadOptions.folderId = folder.get('id');
    } else {
      fileDownloadOptions.folderPath = CanvaFolderPath;
    }

    dispatch(canvaDownloadAttempted({
      meta: getTrackingMeta('Manage Files', 'upload-canva-attempt')
    }));
    return FileApi.downloadFromUrl(fileDownloadOptions, fileUrl, uploadedFileAccess).then(function (newCanvaFile) {
      FileApi.setCanvaId(newCanvaFile.get('id'), canvaDesignId).then(function (updatedCanvaFile) {
        dispatch(canvaDownloadSucceeded({
          file: updatedCanvaFile,
          meta: getTrackingMeta('Manage Files', 'upload-canva-success')
        }));

        if (!folder && newCanvaFile.get('folder_id')) {
          dispatch(fetchFolderById(newCanvaFile.get('folder_id')));
        }
      });

      if (originalFileId) {
        FileApi.removeCanvaId(originalFileId).then(function (updatedOriginalFile) {
          dispatch(removeCanvaIdSucceeded({
            file: updatedOriginalFile
          }));
        });
      }
    }).catch(function (error) {
      reportError(error, {
        action: DOWNLOAD_FROM_CANVA_FAILED
      });
      dispatch(canvaDownloadFailed({
        meta: {
          notification: getCanvaDownloadFailedNotification(fileDownloadOptions.name)
        }
      }));
    });
  };
}