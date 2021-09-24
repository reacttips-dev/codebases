'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _construct from "@babel/runtime/helpers/esm/construct";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { HUBSPOT_NOTIFICATION_PREFERENCES } from './constants/I18nKeys';
import { GO_TO_PREFERENCES_NOTIFICATION_ACTION } from './constants/ServiceWorkerConstants';
import { Actions } from './constants/TrackingConstants';
import { getContextText } from './util/ContextUtil';
import { workerDebug } from './util/DebugUtil';
import { isServiceWorker } from './util/EnvUtil';
import { getLocalizedText } from './util/I18nUtil';
import { trackInteraction } from './util/TrackerUtil';
var NOTIFICATION_ICON = 'https://static.hsappstatic.net/browser-notifications/ex/hubspot-logo.png';
var instances = {};

var Notification = /*#__PURE__*/function () {
  _createClass(Notification, null, [{
    key: "trigger",
    value: function trigger(event) {
      // `Notification.window` attaches the notification to `currentTarget`, the service worker to `notification`
      var _ref = event.notification || event.currentTarget,
          id = _ref.data.id;

      if (event.action) {
        return instances[id].handleActionClick(event.action, event);
      }

      return instances[id].handleClick(event);
    }
  }]);

  function Notification(data) {
    _classCallCheck(this, Notification);

    this.data = data;
    this.actionsListeners = {};
    this.actionsTracking = {};
    this.clickListeners = [];
    workerDebug('Notification data:', data); // Show the notification and track

    this.promise = Promise.all([this.show()]);
  }

  _createClass(Notification, [{
    key: "show",
    value: function show() {
      var _this$data = this.data,
          context = _this$data.context,
          id = _this$data.id,
          _this$data$translated = _this$data.translatedTemplate,
          body = _this$data$translated.body,
          subject = _this$data$translated.subject,
          type = _this$data.type,
          userLang = _this$data.userLang;
      /**
       * In a service worker, you need to catch the event from a global handler, which means you lose track of the `Notification`'s instance.
       * We need to store the instance in a variable so that we can get it from the static method `notify`
       */

      instances[id] = this; // Context text takes preference over body text

      var contextText = getContextText(context, type);
      var bodyText = contextText || body;
      var actions = isServiceWorker() ? [{
        action: GO_TO_PREFERENCES_NOTIFICATION_ACTION,
        title: getLocalizedText(userLang, HUBSPOT_NOTIFICATION_PREFERENCES)
      }] : undefined;
      var args = [subject, {
        actions: actions,
        body: bodyText,
        data: this.data,
        icon: NOTIFICATION_ICON,
        silent: false
      }];

      if (isServiceWorker()) {
        var _self$registration;

        return (_self$registration = self.registration).showNotification.apply(_self$registration, args);
      }

      var notification = _construct(window.Notification, args);

      notification.onclick = this.handleClick.bind(this);
      return notification;
    }
  }, {
    key: "getPromise",
    value: function getPromise() {
      return this.promise;
    }
  }, {
    key: "handleClick",
    value: function handleClick(event) {
      return Promise.all([trackInteraction(Actions.NATIVE_BROWSER_NOTIFICATION_CLICK, this.data)].concat(_toConsumableArray(this.clickListeners.map(function (listener) {
        return listener(event);
      }))));
    }
  }, {
    key: "handleActionClick",
    value: function handleActionClick(action, event) {
      var promises = [trackInteraction(this.actionsTracking[action], this.data)];

      if (this.actionsListeners[action]) {
        promises = promises.concat(this.actionsListeners[action].map(function (listener) {
          return listener(event);
        }));
      }

      return Promise.all(promises);
    }
  }, {
    key: "onClick",
    value: function onClick(listener) {
      this.clickListeners.push(listener);
    }
  }, {
    key: "onActionClick",
    value: function onActionClick(action, tracking, listener) {
      if (!this.actionsListeners[action]) {
        this.actionsListeners[action] = [];
      }

      this.actionsTracking[action] = tracking;
      this.actionsListeners[action].push(listener);
    }
  }]);

  return Notification;
}();

export { Notification as default };