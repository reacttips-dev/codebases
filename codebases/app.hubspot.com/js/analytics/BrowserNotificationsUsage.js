'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { EVENTS, BROWSER_NOTIFICATION_ACTIONS } from '../constants/TrackingConstants';
import { BrowserNotificationsUsageTracker } from '../lib/usageTracker';

var BrowserNotificationsUsage = /*#__PURE__*/function () {
  function BrowserNotificationsUsage() {
    _classCallCheck(this, BrowserNotificationsUsage);
  }

  _createClass(BrowserNotificationsUsage, [{
    key: "trackBrowserNotificationEvent",
    value: function trackBrowserNotificationEvent(action, additionalParams) {
      BrowserNotificationsUsageTracker.track(EVENTS.BROWSER_NOTIFICATIONS_INTERACTION, BrowserNotificationsUsage.getEvent(action, additionalParams));
    }
  }, {
    key: "trackNativeRequestPermissionShown",
    value: function trackNativeRequestPermissionShown() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.NATIVE_REQUEST_PERMISSION_SHOWN);
    }
  }, {
    key: "trackNativeRequestAllowClicked",
    value: function trackNativeRequestAllowClicked() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.NATIVE_REQUEST_ALLOW_CLICKED);
    }
  }, {
    key: "trackNativeRequestDenyClicked",
    value: function trackNativeRequestDenyClicked() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.NATIVE_REQUEST_DENY_CLICKED);
    }
  }, {
    key: "trackPrePermissionPopupShown",
    value: function trackPrePermissionPopupShown() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.PRE_PERMISSION_SHOWN);
    }
  }, {
    key: "trackPrePermissionContinueClicked",
    value: function trackPrePermissionContinueClicked() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.PRE_PERMISSION_CONTINUE_CLICKED);
    }
  }, {
    key: "trackPrePermissionMaybeLaterClicked",
    value: function trackPrePermissionMaybeLaterClicked() {
      this.trackBrowserNotificationEvent(BROWSER_NOTIFICATION_ACTIONS.PRE_PERMISSION_MAYBE_LATER_CLICKED);
    }
  }], [{
    key: "getScreen",
    value: function getScreen() {
      return window.top.location.pathname;
    }
  }, {
    key: "getEvent",
    value: function getEvent(action) {
      var additionalParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return Object.assign({
        action: action
      }, additionalParams, {
        screen: BrowserNotificationsUsage.getScreen()
      });
    }
  }]);

  return BrowserNotificationsUsage;
}();

export default new BrowserNotificationsUsage();