'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function updateUsage(query) {
  var url = 'salescontentsearch/v1/recent-usage';
  return apiClient.put(url, {
    query: query
  }).then(fromJS);
}