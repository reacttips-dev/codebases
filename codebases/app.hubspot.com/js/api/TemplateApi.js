'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var baseUrl = 'sales-templates/v1/templates'; // Only use v2 for GET/PUT template by template id.
// TODO: Within the next weeks, move POST template & PUT/POST folder to v2

var baseUrlV2 = 'sales-templates/v2/templates';
export function fetchTemplate(id) {
  return apiClient.get(baseUrlV2 + "/" + id).then(fromJS);
}
export function fetchFolders() {
  return apiClient.get(baseUrl + "/folders").then(fromJS);
}
export function createTemplate(template) {
  return apiClient.post(baseUrl, {
    data: template
  }).then(fromJS);
}
export function deleteTemplate(templateId) {
  return apiClient.delete(baseUrl + "/" + templateId);
}
export function fetchTemplateUsage() {
  return apiClient.get('sales-templates/v2/templates/usage');
}