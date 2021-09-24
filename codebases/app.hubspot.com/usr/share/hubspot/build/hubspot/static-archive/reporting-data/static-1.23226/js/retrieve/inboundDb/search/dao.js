'use es6';

import * as http from '../../../request/http';
export var search = function search(searchUrl, payload) {
  return http.post(searchUrl, {
    data: payload,
    query: {
      allPropertiesFetchMode: 'latest_version'
    }
  });
};