'use es6';

import SafeStorage from 'SafeStorage';
import { NOTIFICATIONS } from './constants/Common';

function getNotificationsItem() {
  try {
    // If the item is set to a valid json value like `true`
    // It won't be usable
    var notifications = JSON.parse(SafeStorage.getItem(NOTIFICATIONS)) || {};
    return typeof notifications === 'object' ? notifications : {};
  } catch (e) {
    return {};
  }
}

function getNotificationsProjectItem(project) {
  try {
    return getNotificationsItem()[project] || {};
  } catch (e) {
    return {};
  }
}

export function setStorageItem(project, key, value) {
  try {
    var notifications = getNotificationsItem();
    var notificationProjectItem = getNotificationsProjectItem(project);
    notificationProjectItem[key] = value;
    notifications[project] = notificationProjectItem;
    SafeStorage.setItem(NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {// Do nothing
  }
}
export function getStorageItem(project, key) {
  try {
    return getNotificationsProjectItem(project)[key];
  } catch (e) {
    return null;
  }
}