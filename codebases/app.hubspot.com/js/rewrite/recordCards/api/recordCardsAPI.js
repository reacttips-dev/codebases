'use es6';

import http from 'hub-http/clients/apiClient';
import { generatePath } from 'react-router-dom';
import { makeQuickFetchedRequest } from '../../../utils/makeQuickFetchedRequest';
var BASE_URL = 'crm-record-cards/v3/views';
export var getRecordCard = makeQuickFetchedRequest('boardCard', function (_ref) {
  var objectTypeId = _ref.objectTypeId,
      location = _ref.location;
  return http.get(generatePath(BASE_URL + "/:objectTypeId", {
    objectTypeId: objectTypeId
  }), {
    query: {
      location: location
    }
  });
});