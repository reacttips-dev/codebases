'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var baseUrl = 'sequences/v1/folder';
var baseUrlV2 = 'sequences/v2/folders';
export function createFolder(data) {
  return apiClient.post(baseUrlV2, {
    data: data
  }).then(fromJS);
}
export function updateFolder(id, data) {
  return apiClient.put(baseUrlV2 + "/" + id, {
    data: data
  }).then(fromJS);
}
export function deleteFolder(id) {
  return apiClient.delete(baseUrl + "/" + id);
}