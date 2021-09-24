'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetchRecommendations(_ref) {
  var data = _ref.data,
      query = _ref.query;
  var url = "email-recommendations/v1/sendtime";
  return apiClient.post(url, {
    data: data,
    query: query
  }).then(fromJS);
}