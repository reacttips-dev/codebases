'use es6';

import http from 'hub-http/clients/apiClient';
import { FOLDER_BY_PARENT_REQUEST_LIMIT } from '../constants/Api';
import pick from '../utils/pick';
var BASE_URI = 'filemanager/api/v2/folders';
var BASE_URI_V3 = 'filemanager/api/v3/folders';
var DEFAULT_QUERY = {
  deleted_at: 0,
  order_by: 'name',
  offset: 0,
  limit: FOLDER_BY_PARENT_REQUEST_LIMIT
};
var PASSTHROUGH_QUERY_PARAMS = ['offset', 'limit', 'parent_folder_id', 'hostApp'];

var buildQueryObject = function buildQueryObject(options) {
  var query = Object.assign({}, DEFAULT_QUERY, {}, pick(options, PASSTHROUGH_QUERY_PARAMS));

  if (options.search) {
    query.name__icontains = options.search;
  }

  return query;
};

export var fetchSingleFolder = function fetchSingleFolder(folderId) {
  return http.get(BASE_URI + "/" + folderId);
};
export var fetchFolderWithBreadcrumbs = function fetchFolderWithBreadcrumbs(folderIdOrPath) {
  return http.get(BASE_URI_V3 + "/breadcrumbs/" + folderIdOrPath);
};
export var fetchFolders = function fetchFolders() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return http.get(BASE_URI, {
    query: buildQueryObject(options)
  });
};