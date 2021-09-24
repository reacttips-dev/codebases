'use es6';

import http from 'hub-http/clients/apiClient';
import { debug } from '../util/DebugUtil';
var NOTIFICATION_STATION_API_URL = 'notification-station/general/v1/notifications';
export function markAsDelivered(_ref, method) {
  var id = _ref.id;
  var url = NOTIFICATION_STATION_API_URL + "/delivered/" + id + "/" + method;
  http.put(url).catch(function (error) {
    debug("Error while marking " + method + " as delivered", error);
    throw error;
  });
}
export function getUnseenNotificationCount() {
  return http.get(NOTIFICATION_STATION_API_URL + "/count").catch(function (error) {
    throw error;
  });
}
export function markNotificationsAsSeen() {
  return http.put(NOTIFICATION_STATION_API_URL + "/seen").catch(function (error) {
    throw error;
  });
}