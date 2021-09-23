'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import Immutable from 'immutable';
import http from 'hub-http/clients/apiClient';
import { buildFileFromAttrs } from './Files';
var API_PATH = 'filemanager/api/v3/shutterstock';
export function search(_ref) {
  var searchQuery = _ref.searchQuery,
      rest = _objectWithoutProperties(_ref, ["searchQuery"]);

  return http.get(API_PATH + "/search", {
    query: Object.assign({
      q: searchQuery
    }, rest)
  }).then(Immutable.fromJS);
}
export function acquire(_ref2) {
  var id = _ref2.id,
      filename = _ref2.filename,
      targetFolderId = _ref2.targetFolderId;
  return http.post(API_PATH + "/acquire", {
    timeout: 30000,
    data: {
      fileName: filename,
      id: id,
      targetFolderId: targetFolderId
    }
  }).then(buildFileFromAttrs);
}