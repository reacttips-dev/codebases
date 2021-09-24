'use es6';

import createAction from './createAction';
import Raven from 'Raven';
import FolderApi from 'SalesTemplateEditor/api/FolderApi';
import ActionTypes from 'SalesTemplateEditor/constants/ActionTypes';

var _fetching;

export var fetchFolders = function fetchFolders() {
  return function (dispatch) {
    if (_fetching) {
      return;
    }

    _fetching = true;
    dispatch(createAction(ActionTypes.FETCH_FOLDERS_STARTED));
    FolderApi.fetch().then(function (res) {
      dispatch(createAction(ActionTypes.FETCH_FOLDERS_SUCCESS, res));
    }, function (err) {
      dispatch(createAction(ActionTypes.FETCH_FOLDERS_ERROR));

      if (!err || err.status === 0) {
        return;
      }

      Raven.captureMessage("[SalesTemplateEditor] Folder fetch error " + err.status, {
        extra: {
          err: err
        }
      });
    }).finally(function () {
      return _fetching = false;
    });
  };
};