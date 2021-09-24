'use es6';

import http from 'hub-http/clients/apiClient';
export var BASE_URL = 'crm-permissions/v1/object-access-control/permissions/PIPELINES';
export var fetchPipelinePermissions = function fetchPipelinePermissions(objectTypeId) {
  return http.post(BASE_URL + "/" + encodeURIComponent(objectTypeId) + "/read-all", {}).then(function (response) {
    return response.permissionsByObjectTypeIdAndTargetIdentifier[objectTypeId] || {};
  });
};