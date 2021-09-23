'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { postNotification, removeNotification } from '../actions/NotificationActions';
import { FLOATING_ALERT_DEFAULT_TIMING } from 'HubStyleTokens/times';
var defaultTimeout = parseInt(FLOATING_ALERT_DEFAULT_TIMING, 10);
var defaultId = 0;
var timeouts = {};
export default (function (store) {
  return function (next) {
    return function (action) {
      var dispatch = store.dispatch;
      var result = next(action);

      if (!action.meta) {
        return result;
      }

      if (action.meta.removeNotification && action.meta.removeNotification.id) {
        dispatch(removeNotification(action.meta.removeNotification.id));
      }

      if (!action.meta.notification) {
        return result;
      }

      var _action$meta$notifica = action.meta.notification,
          id = _action$meta$notifica.id,
          timeout = _action$meta$notifica.timeout,
          message = _action$meta$notifica.message,
          titleText = _action$meta$notifica.titleText,
          type = _action$meta$notifica.type,
          sticky = _action$meta$notifica.sticky,
          rest = _objectWithoutProperties(_action$meta$notifica, ["id", "timeout", "message", "titleText", "type", "sticky"]);

      var notificationId = id || "ReduxMessenger-" + defaultId++;
      var notification = Object.assign({}, rest, {
        id: notificationId,
        message: message,
        sticky: !!sticky,
        timeout: timeout != null ? timeout : defaultTimeout,
        timestamp: Date.now(),
        titleText: titleText,
        type: type
      });

      if (!sticky && type !== 'danger') {
        // clear any existing timeouts. If another alert is being
        // created for the same id, the timeout should be reset.
        clearTimeout(timeouts[notificationId]);
        timeouts[notificationId] = setTimeout(function () {
          dispatch(removeNotification(notification.id));
        }, notification.timeout);
      }

      dispatch(postNotification(notification));
      return result;
    };
  };
});