'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function search(searchQueryRecord) {
  return apiClient.post('salescontentsearch/v2/search', {
    data: searchQueryRecord.toJS()
  }).then(fromJS);
}