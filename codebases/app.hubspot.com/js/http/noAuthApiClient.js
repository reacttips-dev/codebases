'use es6';

import noAuthHttp from 'conversations-http/clients/noAuthApiClient';
import applyDefaults from './applyDefaults';
var noAuthApiClient = {
  post: function post(url, data) {
    return applyDefaults(noAuthHttp.post, url, data);
  },
  put: function put(url, data) {
    return applyDefaults(noAuthHttp.put, url, data);
  },
  get: function get(url, data) {
    return applyDefaults(noAuthHttp.get, url, data);
  },
  getWithResponse: function getWithResponse(url, data) {
    return applyDefaults(noAuthHttp.getWithResponse, url, data);
  },
  delete: function _delete(url, data) {
    return applyDefaults(noAuthHttp.delete, url, data);
  }
};
export default noAuthApiClient;