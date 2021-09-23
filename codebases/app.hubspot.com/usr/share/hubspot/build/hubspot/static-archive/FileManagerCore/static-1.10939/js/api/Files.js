'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { List, Map as ImmutableMap, fromJS } from 'immutable';
import http from 'hub-http/clients/apiClient';
import getApiUrl from '../utils/getApiUrl';
import { ObjectCategory } from '../Constants';
import { FileAccessValues } from '../enums/InternalFileManagerFileAccess';
var BASE_URI = 'filemanager/api/v2/files';
var BASE_V3_URI = 'filemanager/api/v3/files';
var DEFAULT_QUERY = {
  archived: 0,
  is_cta_image: 0,
  order_by: '-updated'
};
var QUERY_PARAM_OPTIONS = ['folder_path', 'folder_id', 'offset', 'limit', 'type', 'archived', 'order_by', 'provider', 'hostApp'];
var ATTACHMENT_QUERY_PARAM = {
  'response-content-disposition': 'attachment'
};
export function parseQuery(options) {
  var query = {};

  if (options.get('search')) {
    query.name__icontains = options.get('search');
  }

  if (options.get('archived')) {
    query.archived = options.get('archived') ? 1 : 0;
  }

  var filtered = options.filter(function (val, key) {
    return QUERY_PARAM_OPTIONS.includes(key) && typeof val !== 'undefined';
  });
  return Object.assign({}, DEFAULT_QUERY, {}, filtered.toJS(), {}, query);
}
export var buildFileFromAttrs = function buildFileFromAttrs(attrs) {
  attrs.category = ObjectCategory.FILE;
  return fromJS(attrs);
};

var buildFilesPayload = function buildFilesPayload(resp) {
  return ImmutableMap(Object.assign({}, resp, {
    objects: List(resp.objects.map(buildFileFromAttrs))
  }));
};

export function archiveFile(fileId) {
  var URI = BASE_URI + "/" + fileId + "/archive";
  return http.post(URI, {
    data: {
      archived: true
    }
  }).then(buildFileFromAttrs);
}
export function unarchiveFile(fileId) {
  var URI = BASE_URI + "/" + fileId + "/archive";
  return http.post(URI, {
    data: {
      archived: false
    }
  }).then(buildFileFromAttrs);
}
export function fetchFiles() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var promise = http.get(BASE_URI, {
    query: parseQuery(options),
    timeout: 30000
  });
  return promise.then(buildFilesPayload);
}
export function fetchSingleFile(fileId) {
  return http.get(BASE_V3_URI + "/" + fileId).then(buildFileFromAttrs);
}
export function fetchIntegratedVideos() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return http.get(BASE_URI + "/integrated-videos", {
    query: parseQuery(options),
    timeout: 15000
  }).then(buildFilesPayload);
}
export function move(fileId, options) {
  var URI = BASE_URI + "/" + fileId + "/move-file";
  return http.post(URI, {
    data: options
  }).then(buildFileFromAttrs);
}

var sanitizeFileName = function sanitizeFileName(fileName) {
  return fileName.replace(/\./gm, '-');
};

var COMMON_FILE_UPLOAD_PARAMS = {
  timeout: 0,
  headers: {
    'content-type': false
  }
};
export var uploadFileV3 = function uploadFileV3(file, uploadedFileAccess) {
  var fileUploadOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      updateProgress = _ref.updateProgress,
      xhrCallback = _ref.xhrCallback,
      _ref$httpClient = _ref.httpClient,
      httpClient = _ref$httpClient === void 0 ? http : _ref$httpClient;

  if (!file) {
    throw new Error('`file` arg is required and must be a local File');
  }

  if (!Object.keys(FileAccessValues).includes(uploadedFileAccess)) {
    throw new Error('[FileManagerCore/uploadFile(V3)] Missing or invalid uploadedFileAccess param. Visit https://product.hubteam.com/docs/file-manager-manual/Frontend/index.html for details.');
  }

  var folderId = fileUploadOptions.folderId,
      folderPath = fileUploadOptions.folderPath,
      fileName = fileUploadOptions.fileName,
      extraOptions = _objectWithoutProperties(fileUploadOptions, ["folderId", "folderPath", "fileName"]);

  extraOptions.access = uploadedFileAccess;
  var formData = new FormData();
  formData.append('file', file);

  if (folderId) {
    formData.append('folderId', folderId);
  }

  if (folderPath) {
    formData.append('folderPath', folderPath);
  }

  if (fileName) {
    formData.append('fileName', sanitizeFileName(fileName));
  }

  formData.append('options', JSON.stringify(extraOptions));
  return httpClient.post(BASE_V3_URI + "/upload", Object.assign({}, COMMON_FILE_UPLOAD_PARAMS, {
    data: formData,
    withXhr: function withXhr(xhr) {
      xhr.upload.addEventListener('progress', updateProgress, false);

      if (xhrCallback) {
        xhrCallback(xhr);
      }
    }
  })).then(buildFilesPayload);
};
export var uploadFile = uploadFileV3;
export var replaceFile = function replaceFile(fileId, file, uploadedFileAccess) {
  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      updateProgress = _ref2.updateProgress;

  var formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify({
    access: uploadedFileAccess
  }));
  return http.post(BASE_V3_URI + "/" + fileId + "/replace", Object.assign({}, COMMON_FILE_UPLOAD_PARAMS, {
    data: formData,
    withXhr: function withXhr(xhr) {
      xhr.upload.addEventListener('progress', updateProgress, false);
    }
  })).then(buildFilesPayload);
};
export function uploadResizedImage(fileId, newWidth) {
  return http.post(BASE_URI + "/" + fileId + "/resize-image", {
    timeout: 0,
    query: {
      width: newWidth
    }
  }).then(buildFileFromAttrs);
}
export function recalculateImageDimensions(fileId) {
  return http.post(BASE_V3_URI + "/" + fileId + "/recalculate-image-dimensions", {
    timeout: 5000
  }).then(buildFileFromAttrs);
}
export function saveThumbnail(sourceFileId, targetFileId) {
  return http.post(BASE_V3_URI + "/" + targetFileId + "/thumbnails/replace", {
    data: {
      sourceFileId: sourceFileId
    }
  }).then(buildFileFromAttrs);
}
export function generateAndUpdateThumbnail(targetFileId, thumbnailTimestamp) {
  return http.post(BASE_V3_URI + "/" + targetFileId + "/thumbnails/generate?", {
    timeout: 35000,
    data: {
      thumbnailTimestamp: thumbnailTimestamp
    }
  }).then(buildFileFromAttrs);
}
export function exportFiles(emailAddress) {
  var filesAndFolders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var uri = BASE_URI + "/export-all-files";
  return http.post(uri, {
    data: Object.assign({
      email_address: emailAddress
    }, filesAndFolders)
  }).then(fromJS);
}
export function downloadFromUrl() {
  var fileDownloadOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var url = arguments.length > 1 ? arguments[1] : undefined;
  var uploadedFileAccess = arguments.length > 2 ? arguments[2] : undefined;

  if (!Object.keys(FileAccessValues).includes(uploadedFileAccess)) {
    throw new Error('[FileManagerCore/downloadFromUrl] Missing or invalid uploadedFileAccess param. Visit https://product.hubteam.com/docs/file-manager-manual/Frontend/index.html for details.');
  }

  return http.post(BASE_V3_URI + "/synchronous-download-from-url", {
    timeout: 60000,
    data: Object.assign({}, fileDownloadOptions, {
      access: uploadedFileAccess,
      url: url
    })
  }).then(buildFileFromAttrs);
}
export function remove(fileId) {
  return http.delete(BASE_URI + "/" + fileId);
}
export function getDownloadUrl(path, version) {
  return getApiUrl(BASE_URI + "/download/" + path, {
    version: version
  });
}
export function removeCanvaId(fileId) {
  return http.delete(BASE_V3_URI + "/" + fileId + "/canva").then(buildFileFromAttrs);
}
export function setCanvaId(fileId, canvaId) {
  return http.put(BASE_V3_URI + "/" + fileId + "/canva", {
    data: {
      canvaId: canvaId
    }
  }).then(buildFileFromAttrs);
}
export function updateFileMeta(fileId, data) {
  return http.patch(BASE_V3_URI + "/" + fileId + "/meta", {
    data: data
  }).then(buildFileFromAttrs);
}
export function getSignedUrl(fileId) {
  var query = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return http.get(BASE_URI + "/" + fileId + "/signed-url", {
    query: query
  });
}
export function getDownloadableSignedUrl(fileId) {
  return getSignedUrl(fileId, ATTACHMENT_QUERY_PARAM);
}
export function getSignedUrlRedirectViewUrl(fileId) {
  return getApiUrl(BASE_URI + "/" + fileId + "/signed-url-redirect");
}
export function getSignedUrlRedirectDownloadUrl(fileId) {
  return getApiUrl(BASE_URI + "/" + fileId + "/signed-url-redirect", ATTACHMENT_QUERY_PARAM);
}