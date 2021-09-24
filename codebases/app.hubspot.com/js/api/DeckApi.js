'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export function fetch() {
  var deckUrl = 'presentations/v1/deck';
  return apiClient.get(deckUrl).then(function (res) {
    return fromJS(res.results);
  });
}