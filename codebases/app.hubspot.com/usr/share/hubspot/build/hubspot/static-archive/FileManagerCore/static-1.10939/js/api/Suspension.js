'use es6';

import http from 'hub-http/clients/apiClient';
import { FILE_MANAGER_WRITE_SCOPE } from '../Constants';
var BASE_URL = "vetting/public/v1/account-verification/state/scope";
export var requestSuspensionStatus = function requestSuspensionStatus() {
  return http.get(BASE_URL + "/" + FILE_MANAGER_WRITE_SCOPE);
};