'use es6';

import User from 'hub-http-shims/UserDataJS/user';
import { CRM_UI } from 'customer-data-objects/property/PropertySourceTypes';
import { PATCH, POST, PUT, DELETE } from 'crm_data/constants/HTTPVerbs';
import { send } from 'crm_data/api/ImmutableAPI';

var doSend = function doSend(type) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return send.apply(void 0, [{
    type: type,
    headers: {
      'X-Source': CRM_UI,
      'X-SourceId': User.get().get('email'),
      'X-Properties-Source': CRM_UI,
      'X-Properties-SourceId': User.get().get('email')
    }
  }].concat(args));
};

export function patch(url, data, callback) {
  return doSend(PATCH, url, data, callback);
}
export function post(url, data, callback) {
  return doSend(POST, url, data, callback);
}
export function put(url, data, callback) {
  return doSend(PUT, url, data, callback);
}
export function del(url) {
  return doSend(DELETE, url);
}