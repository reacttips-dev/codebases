'use es6';

import http from 'hub-http/clients/apiClient';
import { HIDDEN_FOLDER_PATH } from '../lib/constants';
import { HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE } from '../lib/FileAccess';
/**
 * @param {File} file
 * @param {Object} options
 * @param {Function} options.onProgress
 * @param {String} options.access One of the FileAccess enums from FileManagerLib
 */

export function uploadFile(file) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var hideAndProtectFile = options.hideAndProtectFile,
      onProgress = options.onProgress,
      query = options.query,
      access = options.access;

  if (query || hideAndProtectFile || !access) {
    console.warn('draft-plugins has migrated off of the deprecated v2 FileManagerApi. ' + 'To set file visibility for non-image files, specify access type in the FileDrop plugin. ' + 'e.g. `{ fileOptions: { access: SOME_FILE_ACCESS_ENUM } }`. ' + 'Do not use a `query` object or `hideAndProtectFile`.');
  }

  var finalFormData = new FormData();
  finalFormData.append('file', file);
  finalFormData.append('folderPath', HIDDEN_FOLDER_PATH);
  var formDataOptions = {
    access: access || HIDDEN_IN_APP_PRIVATE_NOT_INDEXABLE
  };
  finalFormData.append('options', JSON.stringify(formDataOptions));
  return http.post('filemanager/api/v3/files/upload', {
    timeout: 0,
    headers: {
      'content-type': false
    },
    data: finalFormData,
    withXhr: function withXhr(xhr) {
      if (onProgress) {
        xhr.upload.addEventListener('progress', onProgress, false);
      }
    }
  });
}
export function getFileInfo(path) {
  var encodedPath = encodeURIComponent(path);
  return http.get("filemanager/api/v2/files/info/" + encodedPath);
}
/*
tl;dr we need to make each user a Vidyard account and associate it with their
Vidyard organization (previously-created) as a quirk of the Vidyard/GoVideo
ecosystem. This endpoint ensures that everything is squared away on the backend
and should be called once per user when they insert their first video into a
composition (the BE handles accidental repeat calls but let's avoid that).
*/

export function notifyOfVideoCreation() {
  return http.post('filemanager/api/v3/vidyard-accounts');
}
export function fetchVideoSharingPage(uuid, vyemail, customId) {
  return http.post("filemanager/api/v3/videos/" + uuid + "/personalization-token", {
    data: {
      vyemail: vyemail,
      custom_id: customId
    }
  });
}