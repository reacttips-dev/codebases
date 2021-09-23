'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetchTemplateUsage() {
  return apiClient.get('sales-templates/v2/templates/usage').then(fromJS);
}