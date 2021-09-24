'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetchLink(id, query) {
  var url = "presentations/v1/deck/" + id + "/share";
  return apiClient.post(url, {
    query: query
  }).then(fromJS);
}