'use es6';

import * as ActionTypes from './ActionTypes';
import { ShutterstockFolderName, ShutterstockFolderPath } from 'FileManagerCore/Constants';
import { acquire } from 'FileManagerCore/api/Shutterstock';
import { add as addFolder } from 'FileManagerCore/api/Folders';
import { getHomeFolder } from 'FileManagerCore/utils/FoldersAndFiles';
import * as SharedShutterstockActions from 'FileManagerCore/actions/Shutterstock';
import { getFolders } from 'FileManagerCore/selectors/Folders';
import { getShutterstockFolder } from 'FileManagerCore/selectors/Shutterstock';
import { reportError } from 'FileManagerCore/utils/logging';
import { ACQUIRE_IMAGE_FAILED } from './ActionTypes';
export function selectStockFile(selectedFile) {
  return {
    type: ActionTypes.SELECT_STOCK_FILE,
    selectedFile: selectedFile
  };
}
export function deselectStockFile(selectedFile) {
  return {
    type: ActionTypes.SELECT_STOCK_FILE,
    selectedFile: selectedFile
  };
}
export var searchShutterstock = SharedShutterstockActions.searchShutterstock;
export function acquireImage(id, filename, folderId) {
  return function (dispatch, getState) {
    return new Promise(function (resolve, reject) {
      dispatch({
        type: ActionTypes.ACQUIRE_IMAGE_ATTEMPTED,
        id: id,
        filename: filename
      });
      var state = getState();
      var folders = getFolders(state);

      var doAcquire = function doAcquire(folder) {
        var targetFolderId = folder.get('id');
        return acquire({
          id: id,
          filename: filename,
          targetFolderId: targetFolderId
        }).then(function (response) {
          dispatch({
            type: ActionTypes.ACQUIRE_IMAGE_SUCCEEDED,
            data: response
          });
          resolve(response);
        }).catch(function (err) {
          reportError(err, {
            type: ACQUIRE_IMAGE_FAILED
          });
          dispatch({
            type: ACQUIRE_IMAGE_FAILED
          });
          reject(err);
        });
      };

      var targetFolder;

      if (folderId) {
        targetFolder = folders.find(function (folder) {
          return folder.get('id') === folderId;
        });
      } else if (folderId === null) {
        targetFolder = getHomeFolder();
      }

      if (targetFolder) {
        doAcquire(targetFolder);
      } else {
        var defaultFolder = folders.find(function (folder) {
          return folder.get('full_path') === ShutterstockFolderPath;
        });

        if (!defaultFolder) {
          addFolder({
            name: ShutterstockFolderName,
            parentId: null
          }).then(function (folder) {
            dispatch({
              type: ActionTypes.ADD_FOLDER_SUCCEEDED,
              folder: folder
            });
            doAcquire(folder);
          }).catch(reject);
        } else {
          doAcquire(defaultFolder);
        }
      }
    });
  };
}
export var acquireStockImage = function acquireStockImage(stockImage) {
  return function (dispatch, getState) {
    var shutterstockFolder = getShutterstockFolder(getState());
    var folderId = shutterstockFolder ? shutterstockFolder.get('id') : null;
    return dispatch(acquireImage(stockImage.get('id'), stockImage.get('title'), folderId));
  };
};