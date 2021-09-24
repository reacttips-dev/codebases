'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { BROWSER_NOTIFICATIONS_IFRAME_LOADED_ACTION, DO_NOT_PLAY_FLOATING_SOUND, EVENTS, NOTIFICATION_CLICKED_ACTION, NOTIFICATION_DISMISSED_ACTION, NOTIFICATION_SECONDARY_BUTTON_CLICKED_ACTION, TEASE_BTN_STOP_ACTION, TEASE_LINK_CLICK_ACTION, TEASE_MENU_OPEN_ACTION } from '../constants/TrackingConstants';
import tracker from '../lib/usageTracker';

var NotificationsUsageTracker = /*#__PURE__*/function () {
  _createClass(NotificationsUsageTracker, null, [{
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
        screen: NotificationsUsageTracker.getScreen()
      });
    }
  }, {
    key: "getInteractionEvent",
    value: function getInteractionEvent(action, additionalParams) {
      tracker.track(EVENTS.NOTIFICATION_INTERACTION, NotificationsUsageTracker.getEvent(action, additionalParams));
    }
  }, {
    key: "getUsageEvent",
    value: function getUsageEvent(action, additionalParams) {
      tracker.track(EVENTS.NOTIFICATION_USAGE, NotificationsUsageTracker.getEvent(action, additionalParams));
    }
  }, {
    key: "trackBrowserNotificationLoadedIframe",
    value: function trackBrowserNotificationLoadedIframe() {
      NotificationsUsageTracker.getInteractionEvent(BROWSER_NOTIFICATIONS_IFRAME_LOADED_ACTION);
    }
  }]);

  function NotificationsUsageTracker(notification, deliveryMethod) {
    _classCallCheck(this, NotificationsUsageTracker);

    this.notification = notification;
    this.deliveryMethod = deliveryMethod;
    this.appName = window.top.HublyticsTracker && window.top.HublyticsTracker.app;
  }

  _createClass(NotificationsUsageTracker, [{
    key: "getAdditionalParams",
    value: function getAdditionalParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return Object.assign({}, params, {
        'delivery-method': this.deliveryMethod,
        'notification-origin-name': this.notification.origin && this.notification.origin.name,
        'notification-template-id': this.notification.template,
        'notification-type-id': this.notification.type
      });
    }
  }, {
    key: "trackNotificationInteractionEvent",
    value: function trackNotificationInteractionEvent(action, params) {
      NotificationsUsageTracker.getInteractionEvent(action, this.getAdditionalParams(params));
    }
  }, {
    key: "trackClick",
    value: function trackClick() {
      this.trackNotificationInteractionEvent(NOTIFICATION_CLICKED_ACTION);
    }
  }, {
    key: "trackSecondaryClick",
    value: function trackSecondaryClick() {
      this.trackNotificationInteractionEvent(NOTIFICATION_SECONDARY_BUTTON_CLICKED_ACTION);
    }
  }, {
    key: "trackDismiss",
    value: function trackDismiss() {
      this.trackNotificationInteractionEvent(NOTIFICATION_DISMISSED_ACTION);
    }
  }, {
    key: "trackMenuOpen",
    value: function trackMenuOpen() {
      this.trackNotificationInteractionEvent(TEASE_MENU_OPEN_ACTION);
    }
  }, {
    key: "trackMenuItemClick",
    value: function trackMenuItemClick(link) {
      this.trackNotificationInteractionEvent(TEASE_LINK_CLICK_ACTION, {
        link: link
      });
    }
  }, {
    key: "trackDontPlayFloatingSound",
    value: function trackDontPlayFloatingSound() {
      this.trackNotificationInteractionEvent(DO_NOT_PLAY_FLOATING_SOUND);
    }
  }, {
    key: "trackDontShowAgain",
    value: function trackDontShowAgain() {
      this.trackNotificationInteractionEvent(TEASE_BTN_STOP_ACTION);
    }
  }]);

  return NotificationsUsageTracker;
}();

export default NotificationsUsageTracker;