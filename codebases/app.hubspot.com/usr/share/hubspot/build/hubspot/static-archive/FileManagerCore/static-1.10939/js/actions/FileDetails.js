'use es6';

import I18n from 'I18n';
import { FETCH_SINGLE_FILE_ATTEMPTED, FETCH_SINGLE_FILE_FAILED, FETCH_SINGLE_FILE_SUCCESS } from './ActionTypes';
import * as FilesApi from '../api/Files';
import { reportError } from '../utils/logging';
import { getSingleFileDetails } from '../selectors/FileDetails';

var getFetchSingleFileFailedNotification = function getFetchSingleFileFailedNotification() {
  return {
    'data-test-id': 'single-file-fetch-failed',
    type: 'danger',
    titleText: I18n.text('FileManagerCore.notifications.fetchSingleFile.error.title')
  };
};

var getFetchSingleFileFailed = function getFetchSingleFileFailed(fileId) {
  return {
    type: FETCH_SINGLE_FILE_FAILED,
    fileId: fileId,
    meta: {
      notification: getFetchSingleFileFailedNotification()
    }
  };
};

var getFetchSingleFileAttempted = function getFetchSingleFileAttempted(fileId) {
  return {
    type: FETCH_SINGLE_FILE_ATTEMPTED,
    fileId: fileId
  };
};

var getFetchSingleFileSuccess = function getFetchSingleFileSuccess(fileId, file) {
  return {
    type: FETCH_SINGLE_FILE_SUCCESS,
    fileId: fileId,
    file: file
  };
};

export function fetchSingleFile(fileId) {
  return function (dispatch) {
    dispatch(getFetchSingleFileAttempted(fileId));
    return FilesApi.fetchSingleFile(fileId).then(function (file) {
      dispatch(getFetchSingleFileSuccess(fileId, file));
      return file;
    }).catch(function (err) {
      reportError(err, {
        type: FETCH_SINGLE_FILE_FAILED
      });
      dispatch(getFetchSingleFileFailed(fileId));
      throw err;
    });
  };
}
export var fetchSingleFileIfNeeded = function fetchSingleFileIfNeeded(fileId) {
  return function (dispatch, getState) {
    var singleFileDetails = getSingleFileDetails(getState());

    if (singleFileDetails.get(fileId)) {
      return Promise.resolve(singleFileDetails.get(fileId));
    }

    return dispatch(fetchSingleFile(fileId));
  };
};