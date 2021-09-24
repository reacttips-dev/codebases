'use es6';

import NotificationTypes from '../constants/NotificationTypeConstants';
export function getTypeNameFromId(id) {
  return NotificationTypes[id];
}