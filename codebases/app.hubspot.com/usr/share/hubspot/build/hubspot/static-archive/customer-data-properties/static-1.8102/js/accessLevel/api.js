'use es6';

import http from 'hub-http/clients/apiClient';
export var fetchAccessLevel = function fetchAccessLevel(objectTypeId) {
  return http.get("/crm-permissions/v1/field-level-permissions/permissions/" + objectTypeId + "/get-all");
};