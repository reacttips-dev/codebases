'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export default {
  fetch: function fetch() {
    var url = 'presentations/v1/deck';
    return apiClient.get(url).then(fromJS);
  }
};