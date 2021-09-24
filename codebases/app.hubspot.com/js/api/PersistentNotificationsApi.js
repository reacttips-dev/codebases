'use es6';

import http from 'hub-http/clients/apiClient';
var PERSISTENT_API = '/persistent-notifications/v1';
export function markAs(id, deliveryMethod, action) {
  return http.put(PERSISTENT_API + "/notifications/notification/" + id + "/deliveryMethod/" + deliveryMethod + "/action/" + action);
}
export function getNotifications() {
  return http.get(PERSISTENT_API + "/notifications");
}