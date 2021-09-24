'use es6';

import http from 'hub-http/clients/apiClient';
import { generatePath } from 'react-router-dom';
import { makeQuickFetchedRequest } from '../../../utils/makeQuickFetchedRequest';
var BASE_URL = "properties/v4";
export var getProperties = makeQuickFetchedRequest('properties', function (objectTypeId) {
  return http.get(generatePath(BASE_URL + "/:objectTypeId", {
    objectTypeId: objectTypeId
  }), {
    query: {
      includeFieldLevelPermission: true
    }
  });
});