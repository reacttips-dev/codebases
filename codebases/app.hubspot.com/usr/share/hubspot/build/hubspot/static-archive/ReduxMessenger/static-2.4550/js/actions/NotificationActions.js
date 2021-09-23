'use es6';

import ActionTypes from './ActionTypes';
export function postNotification(notification) {
  return {
    type: ActionTypes.ADD_NOTIFICATION,
    payload: notification
  };
}
export function removeNotification(id) {
  return {
    type: ActionTypes.REMOVE_NOTIFICATION,
    payload: {
      id: id
    }
  };
}