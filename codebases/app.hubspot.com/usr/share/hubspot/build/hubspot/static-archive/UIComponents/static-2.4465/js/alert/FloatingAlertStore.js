'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { FLOATING_ALERT_DEFAULT_TIMING } from 'HubStyleTokens/times';

var newFloatingAlertStore = function newFloatingAlertStore() {
  var alertId = 0;
  var alerts = {};
  var subscriptions = {};

  var alertsToArray = function alertsToArray() {
    return Object.keys(alerts).map(function (alertKey) {
      return alerts[alertKey];
    });
  };

  var setAlerts = function setAlerts(nextAlerts) {
    alerts = nextAlerts;
    var alertArray = alertsToArray();
    Object.keys(subscriptions).forEach(function (key) {
      subscriptions[key](alertArray);
    });
  };

  return {
    getAlerts: function getAlerts() {
      return alerts;
    },
    getSubscriptions: function getSubscriptions() {
      return subscriptions;
    },
    subscribe: function subscribe(key, updateCallback) {
      subscriptions[key] = updateCallback;
      updateCallback(alertsToArray());
    },
    unsubscribe: function unsubscribe(key) {
      var newSubscriptions = Object.assign({}, subscriptions);
      delete newSubscriptions[key];
      subscriptions = newSubscriptions;
    },
    addAlert: function addAlert(_ref) {
      var _this = this;

      var _ref$id = _ref.id,
          id = _ref$id === void 0 ? "Store-" + alertId++ : _ref$id,
          sticky = _ref.sticky,
          timeout = _ref.timeout,
          _ref$timestamp = _ref.timestamp,
          timestamp = _ref$timestamp === void 0 ? Date.now() : _ref$timestamp,
          type = _ref.type,
          _onClose = _ref.onClose,
          alert = _objectWithoutProperties(_ref, ["id", "sticky", "timeout", "timestamp", "type", "onClose"]);

      var newAlert = Object.assign({}, alert, {
        id: id,
        onClose: function onClose() {
          if (_onClose) _onClose.apply(void 0, arguments);

          _this.removeAlert(id);
        },
        timestamp: timestamp,
        type: type
      });
      setAlerts(Object.assign({}, alerts, _defineProperty({}, id, newAlert)));

      if (!sticky && type !== 'danger') {
        var defaultTimeout = parseInt(FLOATING_ALERT_DEFAULT_TIMING, 10);
        var alertTimeout = timeout != null ? timeout : defaultTimeout;
        setTimeout(function () {
          _this.removeAlert(id);
        }, alertTimeout);
      }
    },
    removeAlert: function removeAlert(id) {
      var newAlerts = Object.assign({}, alerts);
      delete newAlerts[id];
      setAlerts(newAlerts);
    }
  };
}; // Workaround to avoid mixed exports, but still have access to a generator
// function for ease of testing.


var FloatingAlertStore = newFloatingAlertStore();
FloatingAlertStore.newFloatingAlertStore = newFloatingAlertStore;
export default FloatingAlertStore;