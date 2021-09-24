'use es6';

import I18n from 'I18n';
import * as Actions from 'FileManagerCore/actions/Files';
import { getValidator } from '../utils/validation';
import { SEARCH_SHUTTERSTOCK_RESET } from 'FileManagerCore/actions/ActionTypes';
import { trackInteraction } from 'FileManagerCore/actions/tracking';
import { FETCH_FILE_FOR_EDITING_ATTEMPTED, FETCH_FILE_FOR_EDITING_FAILED, FETCH_FILE_FOR_EDITING_SUCCEEDED, SAVE_FILE_EDIT_ATTEMPTED, SAVE_FILE_EDIT_SUCCEEDED, SAVE_FILE_EDIT_FAILED } from './ActionTypes';
import * as VideoPlayersApi from 'FileManagerCore/api/VideoPlayers';
import * as FilesApi from 'FileManagerCore/api/Files';
import { getIsShutterstockEnabled, getUploadedFileAccess } from '../selectors/Configuration';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { getFileUploadSuccessAlert, getHublVideoUploadSuccessAlert } from 'FileManagerCore/utils/notifications';
import { DrawerTypes, FETCH_FILES_LIMIT, PAGE_SIZE } from '../Constants';
import { HiddenInAppFileAccessList } from 'FileManagerCore/enums/InternalFileManagerFileAccess';
import { getProviderParam } from '../utils/network';
import { fetchInitialFiles } from './Actions';
import { searchShutterstock } from './Shutterstock';
export function moveFile(file, destination) {
  return function (dispatch) {
    dispatch(Actions.moveFile(file, destination));
    dispatch(trackInteraction('Manage Files', 'move'));
  };
}
export function removeFile(file) {
  return function (dispatch) {
    dispatch(Actions.removeFile(file));
    dispatch(trackInteraction('Manage Files', 'delete'));
  };
}
export function renameFile(file, newName) {
  return function (dispatch) {
    dispatch(trackInteraction('Manage Files', 'rename'));
    return dispatch(Actions.renameFile(file, newName));
  };
}
export function uploadFiles(fileList, options) {
  return function (dispatch, getState) {
    var type = options.type;
    var files = Array.prototype.slice.call(fileList);
    var validator = getValidator(type);
    var validFiles = [];

    if (validator) {
      files.forEach(function (file) {
        if (validator(file)) {
          validFiles.push(file);
        }
      });
    } else {
      validFiles = files;
    }

    options.access = getUploadedFileAccess(getState());
    return dispatch(Actions.uploadFiles(validFiles, options)).then(function (response) {
      if (response && response.length && HiddenInAppFileAccessList.indexOf(options.access) === -1) {
        if (options.type === DrawerTypes.HUBL_VIDEO) {
          FloatingAlertStore.addAlert(getHublVideoUploadSuccessAlert(validFiles.length));
        } else {
          FloatingAlertStore.addAlert(getFileUploadSuccessAlert(options.access, validFiles.length, function () {
            dispatch(trackInteraction('Alert interaction', 'clicked-file-visibility-learn-more'));
          }));
        }
      }
    });
  };
}
export function getFetchVideoFileByPlayerIdAttemptedAction() {
  return {
    type: FETCH_FILE_FOR_EDITING_ATTEMPTED
  };
}
export function getFetchVideoFileByPlayerIdFailedAction() {
  return {
    type: FETCH_FILE_FOR_EDITING_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.editVideo.error.title'),
        message: I18n.text('FileManagerCore.notifications.editVideo.error.message')
      }
    }
  };
}
export function getFetchVideoFileByPlayerIdSuccessAction(file) {
  return {
    type: FETCH_FILE_FOR_EDITING_SUCCEEDED,
    file: file
  };
}
export function fetchVideoFileByPlayerId(playerId) {
  return function (dispatch) {
    dispatch(getFetchVideoFileByPlayerIdAttemptedAction());
    VideoPlayersApi.fetchVideoFileByPlayerId(playerId).then(function (resp) {
      dispatch(getFetchVideoFileByPlayerIdSuccessAction(resp.get(0)));
    }, function () {
      dispatch(getFetchVideoFileByPlayerIdFailedAction());
    }).done();
  };
}
export function getSaveFileEditAttemptedAction() {
  return {
    type: SAVE_FILE_EDIT_ATTEMPTED
  };
}
export function getSaveFileEditSuccessAction(file) {
  return {
    type: SAVE_FILE_EDIT_SUCCEEDED,
    file: file
  };
}
export function getSaveFileEditFailedAction() {
  return {
    type: SAVE_FILE_EDIT_FAILED,
    meta: {
      notification: {
        type: 'danger',
        titleText: I18n.text('FileManagerCore.notifications.editFile.error.title'),
        message: I18n.text('FileManagerCore.notifications.editFile.error.message')
      }
    }
  };
}
export function updateFileMeta(fileId, data) {
  return function (dispatch) {
    dispatch(getSaveFileEditAttemptedAction());
    return FilesApi.updateFileMeta(fileId, data).then(function (file) {
      dispatch(getSaveFileEditSuccessAction(file));
      return file;
    }, function (err) {
      dispatch(getSaveFileEditFailedAction());
      throw err;
    });
  };
}
export var fetchFilesForNavigator = function fetchFilesForNavigator(_ref) {
  var type = _ref.type,
      searchQuery = _ref.searchQuery,
      selectedFolder = _ref.selectedFolder;
  return function (dispatch, getState) {
    var query = Object.assign({
      type: type
    }, getProviderParam(type), {
      search: searchQuery,
      folder_id: selectedFolder ? selectedFolder.get('id') || 'None' : null,
      limit: FETCH_FILES_LIMIT
    });
    dispatch(fetchInitialFiles(query, type));

    if (searchQuery && type === DrawerTypes.IMAGE && getIsShutterstockEnabled(getState())) {
      dispatch({
        type: SEARCH_SHUTTERSTOCK_RESET
      });
      dispatch(searchShutterstock({
        searchQuery: searchQuery,
        page: 1,
        pageSize: PAGE_SIZE
      }));
    }
  };
};