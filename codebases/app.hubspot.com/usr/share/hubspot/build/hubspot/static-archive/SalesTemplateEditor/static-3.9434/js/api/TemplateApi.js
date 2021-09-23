'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var BASE_URL_V2 = 'sales-templates/v2/templates';
export function create(template) {
  return apiClient.post(BASE_URL_V2, {
    data: template
  }).then(fromJS);
}
export function update(template) {
  var id = template.get('id');
  var url = BASE_URL_V2 + "/" + id;
  return apiClient.put(url, {
    data: template
  }).then(fromJS);
}