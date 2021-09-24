'use es6';

import http from 'hub-http/clients/apiClient';
import { buildFolderFromAttrs } from '../utils/FoldersAndFiles';
var BASE_URI = 'filemanager/api/v2/folders';
export function remove(folderId) {
  return http.delete(BASE_URI + "/" + folderId);
}
export function rename(folderId, newName) {
  var URI = BASE_URI + "/" + folderId + "/move-folder";
  return http.post(URI, {
    data: {
      name: newName
    }
  }).then(buildFolderFromAttrs);
}
export function move(folderId, parentId) {
  var URI = BASE_URI + "/" + folderId + "/move-folder";
  return http.post(URI, {
    data: {
      parent_folder_id: parentId
    }
  }).then(buildFolderFromAttrs);
}
export function add(folder) {
  var folderData = {
    name: folder.name,
    parent_folder_id: folder.parentId
  };
  return http.post(BASE_URI, {
    data: folderData
  }).then(buildFolderFromAttrs);
}