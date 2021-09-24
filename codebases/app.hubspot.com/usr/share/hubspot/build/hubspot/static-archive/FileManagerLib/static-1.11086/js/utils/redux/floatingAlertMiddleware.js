'use es6';

import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import { NOTIFICATION_EVENT } from 'FileManagerCore/Constants';
export default function floatingAlertMiddleware() {
  return function () {
    return function (next) {
      return function (action) {
        if (!action.meta || !action.meta[NOTIFICATION_EVENT]) {
          return next(action);
        }

        var payload = action.meta[NOTIFICATION_EVENT];
        FloatingAlertStore.addAlert(payload);
        return next(action);
      };
    };
  };
}