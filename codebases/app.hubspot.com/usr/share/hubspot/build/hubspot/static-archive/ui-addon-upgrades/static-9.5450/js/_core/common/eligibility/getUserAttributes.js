'use es6';

import http from 'hub-http/clients/apiClient';
import { getFullUrl } from 'hubspot-url-utils';
import logError from '../reliability/logError'; // TODO: the http request setup should be done in self-service-api and imported/consumed here

export var getUserAttributes = function getUserAttributes(optionalKey) {
  var queryString = '';

  if (optionalKey) {
    queryString = "?key=" + optionalKey;
  }

  return http.get(getFullUrl('api') + "/users/v1/app/attributes" + queryString).then(function (response) {
    return response.attributes;
  }).catch(function (err) {
    logError('getUserAttributes', err);
    return [];
  });
}; // TODO: setUserAttributes should live in self-service-api

export var setUserAttribute = function setUserAttribute(key, value) {
  return http.post(getFullUrl('api') + "/users/v1/app/attributes", {
    data: {
      key: key,
      value: value
    }
  }).catch(function (err) {
    logError('setUserAttributes', err);
    return {};
  });
};