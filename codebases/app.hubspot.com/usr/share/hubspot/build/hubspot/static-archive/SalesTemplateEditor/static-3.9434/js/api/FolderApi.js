'use es6';

import { fromJS } from 'immutable';
import apiClient from 'hub-http/clients/apiClient';
export default {
  fetch: function fetch() {
    var url = 'sales-templates/v1/templates/folders';
    return apiClient.get(url).then(fromJS);
  }
};