'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import Notification from '../worker/Notification';
import ServiceWorkerManager from '../manager/ServiceWorkerManager';
import SubscriptionManager from '../manager/SubscriptionManager';
import { canReceiveBrowserNotifications, hasBrowserDeliveryMethod, hasGrantedNotificationsPermission } from '../util/BrowserNotificationUtil';
import { debug } from '../util/DebugUtil';

var BrowserNotificationManager = /*#__PURE__*/function () {
  function BrowserNotificationManager() {
    _classCallCheck(this, BrowserNotificationManager);
  }

  _createClass(BrowserNotificationManager, [{
    key: "start",
    value: function start() {
      if (canReceiveBrowserNotifications() && hasGrantedNotificationsPermission()) {
        ServiceWorkerManager.registerServiceWorker();
        SubscriptionManager.subscribeToPushNotifications();
      }
    }
  }, {
    key: "showBrowserNotification",
    value: function showBrowserNotification(notificationData) {
      debug('Attempting to show the browser notification', notificationData.id);

      if (!hasBrowserDeliveryMethod(notificationData)) {
        debug("Notification doesn't list 'BROWSER' as a delivery method");
        return;
      }

      if (!hasGrantedNotificationsPermission()) {
        debug('User has not granted browser notifications');
      }

      var notification = new Notification(notificationData);
      notification.onClick(function (event) {
        parent.focus();
        window.parent.location.href = event.currentTarget.data.ctaProxyUrl;
      });
    }
  }]);

  return BrowserNotificationManager;
}();

export default new BrowserNotificationManager();