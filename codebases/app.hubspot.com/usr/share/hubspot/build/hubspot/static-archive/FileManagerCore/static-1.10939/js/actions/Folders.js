'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import I18n from 'I18n';
import * as ActionTypes from './ActionTypes';
import { add } from '../api/Folders';
import { getTrackingMeta } from './tracking';
import FormattedMessage from 'I18n/components/FormattedMessage';
export function receiveFolderDelete(folder) {
  var keyBase = "FileManagerCore.notifications.deleteFolder.success";
  return {
    type: ActionTypes.DELETE_FOLDER_SUCCEEDED,
    folder: folder,
    meta: {
      notification: {
        type: 'success',
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: keyBase + ".title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: keyBase + ".message",
          options: {
            folder: folder.get('name')
          }
        })
      }
    }
  };
}
export function receiveRenameFolder(folder) {
  return {
    type: ActionTypes.RENAME_FOLDER_SUCCEEDED,
    folder: folder
  };
}

function receiveAddFolder(folder) {
  return {
    type: ActionTypes.ADD_FOLDER_SUCCEEDED,
    meta: Object.assign({}, getTrackingMeta('fileManagerManageFolders', 'create new folder'), {
      notification: {
        type: 'success',
        titleText: I18n.text('FileManagerCore.notifications.addFolder.success.title'),
        message: I18n.text('FileManagerCore.notifications.addFolder.success.message', {
          folder: folder.get('name')
        })
      }
    }),
    folder: folder
  };
}

export function addFolder(_ref) {
  var parentId = _ref.parentId,
      name = _ref.name;
  return function (dispatch) {
    add({
      parentId: parentId,
      name: name
    }).then(function (data) {
      dispatch(receiveAddFolder(data));
    }, function (error) {
      dispatch({
        type: ActionTypes.ADD_FOLDER_FAILED,
        meta: {
          notification: {
            type: 'danger',
            titleText: I18n.text('FileManagerCore.notifications.addFolder.error.title'),
            message: I18n.text('FileManagerCore.notifications.addFolder.error.message', {
              folder: name
            })
          }
        },
        error: error
      });
    }).done();
  };
}