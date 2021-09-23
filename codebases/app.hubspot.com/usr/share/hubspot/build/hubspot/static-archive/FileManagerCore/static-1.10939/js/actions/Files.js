'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import Raven from 'Raven';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import imagePlaceholderUrl from 'bender-url!FileManagerImages/images/image-placeholder.png';
import * as FilesApi from '../api/Files';
import * as VideoPlayersApi from '../api/VideoPlayers';
import { FileTypes, IMPORTED_IMAGE_FOLDER_PATH, RequestStatus } from '../Constants';
import { getAsyncDimensions } from '../utils/dimensions';
import tempFileId from '../utils/tempFileId';
import { splitNameAndExtension, getType, getUpdatedPlayerIdVideoFile, softDeleteVidyardPlayerIdFromFile, canPreviewLocalFile } from '../utils/file';
import { DELETE_FILE_FAILED, DELETE_FILE_SUCCEEDED, FETCH_FILES_ATTEMPTED, FETCH_FILES_FAILED, FETCH_FILES_SUCCEEDED, MOVE_FILE_ATTEMPTED, MOVE_FILE_FAILED, MOVE_FILE_SUCCEEDED, RENAME_FILE_ATTEMPTED, RENAME_FILE_FAILED, RENAME_FILE_SUCCEEDED, REPLACE_FILE_ATTEMPTED, REPLACE_FILE_PROGRESS, REPLACE_FILE_SUCCEEDED, REPLACE_FILE_FAILED, SAVE_EDIT_ATTEMPTED, SAVE_EDIT_SUCCEEDED, UPLOAD_FILE_ATTEMPTED, UPLOAD_FILE_FAILED, UPLOAD_FILE_PROGRESS, UPLOAD_FILE_SUCCEEDED, CREATE_VIDYARD_PLAYERID_SUCCEEDED, CREATE_VIDYARD_PLAYERID_ATTEMPTED, CREATE_VIDYARD_PLAYERID_FAILED, SOFT_DELETE_VIDYARD_PLAYERID_FAILED, SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED, BULK_UPLOAD_FILES_ATTEMPTED, IMAGE_TO_EDIT_SELECTED, IMAGE_TO_EDIT_DESELECTED, UPLOAD_EDITED_IMAGE_ATTEMPTED, UPLOAD_EDITED_IMAGE_FAILED, UPLOAD_EDITED_IMAGE_SUCCEEDED, FETCH_SIGNED_URL_FAILED, DOWNLOAD_FROM_EXTERNAL_URL_ATTEMPTED, DOWNLOAD_FROM_EXTERNAL_URL_SUCCEEDED } from './ActionTypes';
import { getDecreaseVideoQuantityUsedAction } from './Limits';
import { isHubLVideo } from '../utils/hubLVideo';
import { getFetchSignedURLFailedNotification, getReadOnlyPermissionCopy } from '../utils/notifications';
import { reportError } from '../utils/logging';
import { getReadOnlyReason } from '../selectors/Permissions';
import { getFileAccess } from '../utils/fileAccessibility';
import { getIsUngatedForRecycleBin } from '../selectors/Auth';
import FormattedMessage from 'I18n/components/FormattedMessage';
export function receiveFileDelete(file, isUngatedForRecycleBin) {
  var keyBase = "FileManagerCore.notifications." + (isUngatedForRecycleBin ? 'trashFile' : 'deleteFile') + ".success";
  return {
    type: DELETE_FILE_SUCCEEDED,
    fileId: file.get('id'),
    meta: {
      notification: {
        type: 'success',
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: keyBase + ".title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: keyBase + ".message",
          options: {
            filename: file.get('name')
          }
        })
      }
    }
  };
}
export function attemptFilesFetch(query) {
  return {
    type: FETCH_FILES_ATTEMPTED,
    status: RequestStatus.PENDING,
    query: query
  };
}
export function receiveFilesFetch(query, data) {
  return {
    type: FETCH_FILES_SUCCEEDED,
    status: RequestStatus.SUCCEEDED,
    query: query,
    data: data
  };
}
export function failFilesFetch(query, error) {
  return {
    type: FETCH_FILES_FAILED,
    status: error.status === 404 ? RequestStatus.NOTFOUND : RequestStatus.FAILED,
    query: query,
    error: error
  };
}
export function removeFile(file) {
  return function (dispatch, getState) {
    FilesApi.remove(file.get('id')).then(function () {
      if (isHubLVideo(file.toJS())) {
        dispatch(getDecreaseVideoQuantityUsedAction(1));
      }

      dispatch(receiveFileDelete(file, getIsUngatedForRecycleBin(getState())));
    }, function (error) {
      var isUngatedForRecycleBin = getIsUngatedForRecycleBin(getState());
      var keyBase = "FileManagerCore.notifications." + (isUngatedForRecycleBin ? 'trashFile' : 'deleteFile') + ".error";
      dispatch({
        type: DELETE_FILE_FAILED,
        meta: {
          notification: {
            type: 'danger',
            titleText: /*#__PURE__*/_jsx(FormattedMessage, {
              message: keyBase + ".title"
            }),
            message: /*#__PURE__*/_jsx(FormattedMessage, {
              message: keyBase + ".message",
              options: {
                filename: file.get('name')
              }
            })
          }
        },
        error: error,
        file: file
      });
    }).done();
  };
}

function renameFileFailed(error, file) {
  var errorType = error && error.responseJSON ? error.responseJSON.errorType : '';
  var message = I18n.text('FileManagerCore.notifications.renameFile.error.message', {
    filename: file.get('name')
  });

  if (errorType === 'FILE_MOVE_CONFLICT') {
    message = I18n.text('FileManagerCore.notifications.renameFile.error.FILE_MOVE_CONFLICT');
  }

  return {
    type: RENAME_FILE_FAILED,
    data: file,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.renameFile.error.title'),
        message: message
      }
    },
    error: error
  };
}

export function renameFile(file, newName) {
  return function (dispatch) {
    var newFile = file.set('name', newName);
    dispatch({
      type: RENAME_FILE_ATTEMPTED,
      data: newFile
    });
    return FilesApi.move(file.get('id'), {
      name: newName
    }).then(function (data) {
      dispatch({
        type: RENAME_FILE_SUCCEEDED,
        data: data
      });
      return data;
    }, function (error) {
      reportError(error, {
        type: RENAME_FILE_FAILED
      });
      dispatch(renameFileFailed(error, file));
      throw error;
    });
  };
}
export function moveFile(file, destination) {
  return function (dispatch) {
    dispatch({
      type: MOVE_FILE_ATTEMPTED
    });
    FilesApi.move(file.get('id'), {
      folder_id: destination
    }).then(function (data) {
      dispatch({
        type: MOVE_FILE_SUCCEEDED,
        data: data
      });
    }, function (error) {
      var errorType = error && error.responseJSON ? error.responseJSON.errorType : '';
      var titleText = I18n.text('FileManagerCore.notifications.moveFile.error.title'); // default message

      var message = I18n.text('FileManagerCore.notifications.moveFile.error.message', {
        filename: file.get('name')
      });

      if (errorType === 'FILE_MOVE_CONFLICT') {
        message = I18n.text('FileManagerCore.notifications.moveFile.error.FILE_MOVE_CONFLICT');
      }

      dispatch({
        type: MOVE_FILE_FAILED,
        meta: {
          notification: {
            type: 'danger',
            titleText: titleText,
            message: message
          }
        },
        error: error
      });
    }).done();
  };
}

function getUploadError(response) {
  var errorData = null;

  if (response.data) {
    if (typeof response.data === 'string') {
      try {
        errorData = JSON.parse(response.data);
      } catch (e) {} // eslint-disable-line no-empty

    } else if (typeof response.data === 'object') {
      errorData = response.data;
    }
  }

  return errorData;
}

export var showUploadDisabledNotification = function showUploadDisabledNotification(readOnlyReason) {
  var copyInfo = getReadOnlyPermissionCopy(readOnlyReason);
  FloatingAlertStore.addAlert({
    'data-test-id': 'upload-attempted-while-disabled-alert',
    type: 'danger',
    titleText: copyInfo.explanation
  });
};

var handleUploadInReadOnly = function handleUploadInReadOnly(readOnlyReason) {
  showUploadDisabledNotification(readOnlyReason);
  var err = new Error("Attempted upload while readOnly, reason: " + readOnlyReason);
  err.readOnlyReason = readOnlyReason;
  return Promise.reject(err);
};

var getUploadOptionsWithThumbnailGenerationMethod = function getUploadOptionsWithThumbnailGenerationMethod(options) {
  return Object.assign({
    forceSynchronousImageProcessing: true
  }, options);
};

export function uploadFile(file) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var readOnlyReason = getReadOnlyReason(getState());

    if (readOnlyReason) {
      return handleUploadInReadOnly(readOnlyReason);
    }

    var tempId = options.tempId || tempFileId();

    var progress = function progress(event) {
      dispatch({
        type: UPLOAD_FILE_PROGRESS,
        progress: event.loaded / event.total * 95,
        tempId: tempId
      });
    };

    var _splitNameAndExtensio = splitNameAndExtension(file),
        name = _splitNameAndExtensio.name,
        extension = _splitNameAndExtensio.extension;

    var type = getType(extension);
    var isImage = type === FileTypes.IMG;
    Raven.captureBreadcrumb({
      type: 'message',
      message: UPLOAD_FILE_ATTEMPTED,
      data: Object.assign({}, options, {
        tempId: tempId,
        name: name,
        extension: extension,
        type: type,
        size: file.size
      })
    });
    var tempUrl = '';

    if (canPreviewLocalFile(file)) {
      tempUrl = window.URL.createObjectURL(file);
    } else if (isImage) {
      tempUrl = imagePlaceholderUrl;
    }

    var upload = function upload() {
      var dimensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      dispatch({
        type: UPLOAD_FILE_ATTEMPTED,
        tempFile: file,
        folderId: options.folderId,
        dimensions: dimensions,
        tempUrl: tempUrl,
        tempId: tempId
      });
      var uploadPromise;

      if (options.access) {
        uploadPromise = FilesApi.uploadFileV3(file, options.access, options, {
          updateProgress: progress
        });
      } else {
        uploadPromise = FilesApi.uploadFile(file, progress, getUploadOptionsWithThumbnailGenerationMethod(options));
      }

      return uploadPromise.then(function (data) {
        var uploadedFile = data.getIn(['objects', 0]);
        dispatch({
          type: UPLOAD_FILE_SUCCEEDED,
          file: uploadedFile,
          tempId: tempId
        });

        if (tempUrl) {
          window.URL.revokeObjectURL(tempUrl);
        }

        Raven.captureBreadcrumb({
          type: 'message',
          message: UPLOAD_FILE_SUCCEEDED,
          data: Object.assign({}, options, {
            tempId: tempId,
            file: uploadedFile.toJS()
          })
        });
        return uploadedFile;
      }, function (response) {
        var message = I18n.text('FileManagerCore.notifications.upload.error.message', {
          filename: name
        });
        var errorData = getUploadError(response);

        if (errorData && errorData.errorType === 'VIRUS_FOUND') {
          message = I18n.text('FileManagerCore.notifications.upload.error.virusFoundMessage', {
            filename: name
          });
        }

        dispatch({
          type: UPLOAD_FILE_FAILED,
          meta: {
            notification: {
              type: 'danger',
              titleText: I18n.text('FileManagerCore.notifications.upload.error.title'),
              message: message
            }
          },
          error: response,
          tempId: tempId
        });

        if (tempUrl) {
          window.URL.revokeObjectURL(tempUrl);
        }

        reportError(response, {
          action: UPLOAD_FILE_FAILED,
          fileType: type,
          fileExtension: extension,
          fileSize: file.size,
          usingFileUploadV3: Boolean(options.access)
        });
      });
    };

    if (isImage && tempUrl) {
      return getAsyncDimensions(tempUrl).then(upload);
    }

    return upload();
  };
}
export function getEditedImageUploadSucceeded(file, titleText) {
  return {
    type: UPLOAD_EDITED_IMAGE_SUCCEEDED,
    file: file,
    tempId: null,
    meta: {
      notification: {
        type: 'success',
        titleText: titleText
      }
    }
  };
}
export function getEditedImageUploadFailed() {
  return {
    type: UPLOAD_EDITED_IMAGE_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.uploadEditedFile.error.title'),
        message: I18n.text('FileManagerCore.notifications.uploadEditedFile.error.message')
      }
    }
  };
}

function getTextForUploadEditedImgSuccess(file) {
  return I18n.text('FileManagerCore.notifications.uploadEditedFile.success.title', {
    fileName: file.get('name')
  });
}

export function uploadEditedImage(file, fileName, folderId, uploadedFileAccess, onSaveComplete) {
  return function (dispatch) {
    dispatch({
      type: UPLOAD_EDITED_IMAGE_ATTEMPTED
    });
    return FilesApi.uploadFileV3(file, uploadedFileAccess, {
      fileName: fileName,
      folderId: folderId
    }).then(function (data) {
      var savedFile = data.getIn(['objects', 0]);
      dispatch(getEditedImageUploadSucceeded(savedFile, getTextForUploadEditedImgSuccess(savedFile)));

      if (onSaveComplete) {
        onSaveComplete(savedFile.get('url'), savedFile);
      }
    }, function () {
      dispatch(getEditedImageUploadFailed());
    }).done();
  };
}
export function uploadResizedImage(fileId, newWidth, uploadedFileAccess, onSaveComplete) {
  return function (dispatch) {
    dispatch({
      type: UPLOAD_EDITED_IMAGE_ATTEMPTED
    });
    return FilesApi.uploadResizedImage(fileId, newWidth).then(function (file) {
      dispatch(getEditedImageUploadSucceeded(file, getTextForUploadEditedImgSuccess(file)));

      if (onSaveComplete) {
        onSaveComplete(file.get('url'), file);
      }
    }, function () {
      dispatch(getEditedImageUploadFailed());
    }).done();
  };
}
export var getBulkUploadAttemptedAction = function getBulkUploadAttemptedAction(uploadingFiles, path, folderId) {
  return {
    type: BULK_UPLOAD_FILES_ATTEMPTED,
    uploadingFiles: uploadingFiles,
    path: path,
    folderId: folderId
  };
};
export var uploadFiles = function uploadFiles(fileList) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, getState) {
    var files = Array.prototype.slice.call(fileList);
    var readOnlyReason = getReadOnlyReason(getState());

    if (readOnlyReason) {
      return handleUploadInReadOnly(readOnlyReason);
    }

    dispatch(getBulkUploadAttemptedAction(files, options.path, options.folderId));
    return Promise.all(files.map(function (file) {
      return dispatch(uploadFile(file, options));
    }));
  };
};
export function replaceFile(existingFile, localFile) {
  return function (dispatch) {
    var fileId = existingFile.get('id');

    var progress = function progress(event) {
      dispatch({
        type: REPLACE_FILE_PROGRESS,
        progress: event.loaded / event.total * 95,
        fileId: fileId
      });
    };

    var _splitNameAndExtensio2 = splitNameAndExtension(localFile),
        extension = _splitNameAndExtensio2.extension;

    var type = getType(extension);
    var isImage = type === FileTypes.IMG;
    var tempUrl = '';

    if (canPreviewLocalFile(localFile)) {
      tempUrl = window.URL.createObjectURL(localFile);
    }

    var upload = function upload() {
      var dimensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      dispatch({
        type: REPLACE_FILE_ATTEMPTED,
        tempFile: localFile,
        dimensions: dimensions,
        tempUrl: tempUrl,
        fileId: fileId
      });
      return FilesApi.replaceFile(fileId, localFile, getFileAccess(existingFile), {
        updateProgress: progress
      }).then(function (response) {
        var updatedFile = response.getIn(['objects', 0]);
        updatedFile = updatedFile.merge({
          replaced: true
        });
        dispatch({
          type: REPLACE_FILE_SUCCEEDED,
          file: updatedFile
        });

        if (tempUrl) {
          window.URL.revokeObjectURL(tempUrl);
        }
      }, function (response) {
        var message = I18n.text('FileManagerCore.notifications.replace.error.message', {
          filename: existingFile.get('name')
        });
        var errorData = getUploadError(response);

        if (errorData && errorData.errorType === 'VIRUS_FOUND') {
          message = I18n.text('FileManagerCore.notifications.replace.error.virusFoundMessage', {
            filename: name
          });
        }

        dispatch({
          type: REPLACE_FILE_FAILED,
          meta: {
            notification: {
              type: 'danger',
              titleText: I18n.text('FileManagerCore.notifications.replace.error.title'),
              message: message
            }
          },
          file: existingFile,
          error: response
        });

        if (tempUrl) {
          window.URL.revokeObjectURL(tempUrl);
        }
      }).done();
    };

    if (isImage && tempUrl) {
      getAsyncDimensions(tempUrl).then(upload);
    } else {
      upload();
    }
  };
}
export function saveEdit(originalId, file, url, uploadedFileAccess) {
  return function (dispatch) {
    var tempId = tempFileId();
    dispatch({
      type: SAVE_EDIT_ATTEMPTED,
      tempUrl: url,
      fileId: originalId,
      originalId: originalId,
      file: file,
      tempId: tempId
    });
    return FilesApi.downloadFromUrl(file, url, uploadedFileAccess).then(function (response) {
      dispatch({
        type: SAVE_EDIT_SUCCEEDED,
        file: response,
        originalId: originalId,
        tempId: tempId
      });
      return response;
    });
  };
}
export var downloadFromExternalUrl = function downloadFromExternalUrl(url, uploadedFileAccess) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      name = _ref.name;

  return function (dispatch) {
    dispatch({
      type: DOWNLOAD_FROM_EXTERNAL_URL_ATTEMPTED
    });
    var fileDownloadOptions = {
      name: name,
      folderPath: IMPORTED_IMAGE_FOLDER_PATH
    };
    return FilesApi.downloadFromUrl(fileDownloadOptions, url, uploadedFileAccess).then(function (file) {
      dispatch({
        type: DOWNLOAD_FROM_EXTERNAL_URL_SUCCEEDED,
        file: file
      });
      return file;
    }).catch(function (err) {
      reportError(err, {
        type: 'DOWNLOAD_FROM_EXTERNAL_URL'
      });
      throw err;
    });
  };
};

function getCreateVidyardPlayerSucceededAction(file) {
  return {
    type: CREATE_VIDYARD_PLAYERID_SUCCEEDED,
    file: file
  };
}

function getCreateVidyardPlayerAttemptedAction() {
  return {
    type: CREATE_VIDYARD_PLAYERID_ATTEMPTED
  };
}

function getCreateVidyardPlayerFailedAction() {
  return {
    type: CREATE_VIDYARD_PLAYERID_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.syncToVidyard.error.title'),
        message: I18n.text('FileManagerCore.notifications.syncToVidyard.error.message')
      }
    }
  };
}

export function setVidyardSyncState(file) {
  return function (dispatch) {
    dispatch(getCreateVidyardPlayerAttemptedAction());
    VideoPlayersApi.createPlayerForVideo(file.get('id')).then(function (newHostingInfo) {
      dispatch(getCreateVidyardPlayerSucceededAction(getUpdatedPlayerIdVideoFile(file, newHostingInfo)));
    }, function () {
      return dispatch(getCreateVidyardPlayerFailedAction());
    }).done();
  };
}

function getDeleteVidyardPlayerFailedAction() {
  return {
    type: SOFT_DELETE_VIDYARD_PLAYERID_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.unsyncFromVidyard.error.title'),
        message: I18n.text('FileManagerCore.notifications.unsyncFromVidyard.error.message')
      }
    }
  };
}

function getDeleteVidyardPlayerSucceededAction(file) {
  return {
    type: SOFT_DELETE_VIDYARD_PLAYERID_SUCCEEDED,
    file: file
  };
}

export function softDeleteHubLVideoPlayer(playerId, file) {
  return function (dispatch) {
    VideoPlayersApi.softDeleteHubLVideoPlayer(playerId).then(function () {
      return dispatch(getDeleteVidyardPlayerSucceededAction(softDeleteVidyardPlayerIdFromFile(file, playerId)));
    }, function () {
      return dispatch(getDeleteVidyardPlayerFailedAction());
    }).done();
  };
}
export function getSelectImageToEditAction(file, selectedImgFrom) {
  return {
    type: IMAGE_TO_EDIT_SELECTED,
    file: file,
    selectedImgFrom: selectedImgFrom
  };
}
export function getDeselectImageToEditAction() {
  return {
    type: IMAGE_TO_EDIT_DESELECTED
  };
}
export function getFetchSignedURLFailedAction() {
  return {
    type: FETCH_SIGNED_URL_FAILED,
    meta: {
      notification: getFetchSignedURLFailedNotification()
    }
  };
}