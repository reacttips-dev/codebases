'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
var URL = 'integrators/v1/portal-installs';
export function fetch() {
  return apiClient.get(URL).then(fromJS);
}