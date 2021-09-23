'use es6';

import { NEW_COUNTER_NODE_CLASS, NEW_NAV_ID, NEW_NAV_NOTIFICATIONS_ID, OLD_COUNTER_NODE_CLASS, OLD_ICON_UNREAD_CLASS, OLD_NAV_NOTIFICATIONS_ICON, OLD_NAV_NOTIFICATIONS_ICON_CONTAINER, OLD_NAV_NOTIFICATIONS_ICON_NODE } from '../constants/ViewConstants';

function isNewNav() {
  var nav;

  try {
    nav = window.parent.document.querySelector("#" + NEW_NAV_ID);
  } catch (error) {
    document.domain = window.location.hostname.indexOf('qa') > 0 ? 'hubspotqa.com' : 'hubspot.com'; // Some pages top frame domain are prefixed e.g. app.hubspotqa.com

    try {
      nav = window.parent.document.querySelector("#" + NEW_NAV_ID);
    } catch (e) {
      document.domain = window.location.hostname;
      nav = window.parent.document.querySelector("#" + NEW_NAV_ID);
    }
  }

  return nav;
}

export function getNavNotificationsBellNode() {
  if (isNewNav()) {
    return window.parent.document.querySelector("#" + NEW_NAV_NOTIFICATIONS_ID);
  }

  return window.parent.document.querySelector("." + OLD_NAV_NOTIFICATIONS_ICON_CONTAINER + " ." + OLD_NAV_NOTIFICATIONS_ICON_NODE);
}

function createUnreadNotificationsNode() {
  var unreadNotificationsNode = document.createElement('span');

  if (isNewNav()) {
    unreadNotificationsNode.classList.add(NEW_COUNTER_NODE_CLASS);
  } else {
    unreadNotificationsNode.classList.add(OLD_COUNTER_NODE_CLASS);
  }

  getNavNotificationsBellNode().appendChild(unreadNotificationsNode);
  return unreadNotificationsNode;
}

export function getUnreadNotificationsNode() {
  var unreadNotificationsNode;

  if (isNewNav()) {
    unreadNotificationsNode = window.parent.document.querySelector("." + NEW_COUNTER_NODE_CLASS);
  } else {
    unreadNotificationsNode = window.parent.document.querySelector("." + OLD_COUNTER_NODE_CLASS);
  }

  return unreadNotificationsNode || createUnreadNotificationsNode();
}
export function getunreadNotificationsCount() {
  var unreadNotificationsNode = getUnreadNotificationsNode();
  return parseInt(unreadNotificationsNode.innerHTML, 10) || 0;
}
export function updateUnreadNotificationsCount(count) {
  var unreadNotificationsNode = getUnreadNotificationsNode();

  if (count > 99) {
    count = '99+';
  }

  unreadNotificationsNode.innerHTML = count;
}
export function removeCounterNode() {
  var unreadNotificationsNode = getUnreadNotificationsNode();
  unreadNotificationsNode.parentElement.removeChild(unreadNotificationsNode);
}
export function setOldNavNotificationsUnread(isUnread) {
  if (!isNewNav()) {
    var oldNavNotificationsIcon = window.parent.document.querySelector("." + OLD_NAV_NOTIFICATIONS_ICON);

    if (isUnread) {
      oldNavNotificationsIcon.classList.add(OLD_ICON_UNREAD_CLASS);
    } else {
      oldNavNotificationsIcon.classList.remove(OLD_ICON_UNREAD_CLASS);
    }
  }
}