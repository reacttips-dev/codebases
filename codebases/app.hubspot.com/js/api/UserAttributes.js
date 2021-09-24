'use es6';

import http from 'hub-http/clients/apiClient';
import { ATTRIBUTE_KEY } from '../constants/userAttributes';
var USER_ATTRINUTES_URL = 'users/v1/app/attributes';
export function getUserAttributes(userId) {
  return http.get(USER_ATTRINUTES_URL, {
    query: {
      key: ATTRIBUTE_KEY,
      'user-id': userId
    }
  });
}
export function setUserAttribute(userId, attributes) {
  return http.post(USER_ATTRINUTES_URL, {
    data: {
      key: ATTRIBUTE_KEY,
      userId: userId,
      value: JSON.stringify(attributes)
    }
  });
}