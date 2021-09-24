'use es6';

import { getunreadNotificationsCount, getUnreadNotificationsNode, setOldNavNotificationsUnread, updateUnreadNotificationsCount } from '../util/CounterUtil';

function incrementUnreadNotificationsCount() {
  var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
  var oldCount = getunreadNotificationsCount();
  updateUnreadNotificationsCount(oldCount + count);
  setOldNavNotificationsUnread(true);
}

function clearCounter() {
  var unreadNotificationsNode = getUnreadNotificationsNode();
  unreadNotificationsNode.parentElement.removeChild(unreadNotificationsNode);
  setOldNavNotificationsUnread(false);
}

export default {
  clearCounter: clearCounter,
  incrementUnreadNotificationsCount: incrementUnreadNotificationsCount
};