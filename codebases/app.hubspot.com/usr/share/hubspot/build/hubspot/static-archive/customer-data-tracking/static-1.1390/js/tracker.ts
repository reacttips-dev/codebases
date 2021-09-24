import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _CRM, _SETTINGS, _CALLING, _COMMUNICATOR, _LISTS, _QUOTES, _PRODUCTS, _LINEITEMS, _REPORTING, _TASKS, _trackers2;

import enviro from 'enviro';
import { createTracker } from 'usage-tracker';
import events from 'customer-data-tracking/events.yaml';
import { CRM, CALLING, SETTINGS, LISTS, QUOTES, PRODUCTS, LINEITEMS, COMMUNICATOR, REPORTING, TASKS } from './constants/namespaces';
import { setPrimaryTracker } from 'usage-tracker-container';
var TRACKER = 'tracker';
var SEND_IMMEDIATE = 'trackerSendImmediate';
export var _tracker = createTracker({
  events: events,
  properties: {
    namespace: CRM
  },
  onError: function onError(err) {
    console.error(err);
  },
  lastKnownEventProperties: ['screen', 'subscreen'],
  debug: function debug() {
    return enviro.debug('customer-data-tracker');
  }
});
export var _trackerSendImmediate = _tracker.clone({
  isBeforeUnload: true
});
export var _trackers = (_trackers2 = {}, _defineProperty(_trackers2, CRM, (_CRM = {}, _defineProperty(_CRM, TRACKER, _tracker), _defineProperty(_CRM, SEND_IMMEDIATE, _trackerSendImmediate), _CRM)), _defineProperty(_trackers2, SETTINGS, (_SETTINGS = {}, _defineProperty(_SETTINGS, TRACKER, _tracker.clone({
  properties: {
    namespace: SETTINGS
  }
})), _defineProperty(_SETTINGS, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: SETTINGS
  }
})), _SETTINGS)), _defineProperty(_trackers2, CALLING, (_CALLING = {}, _defineProperty(_CALLING, TRACKER, _tracker.clone({
  properties: {
    namespace: CALLING
  }
})), _defineProperty(_CALLING, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: CALLING
  }
})), _CALLING)), _defineProperty(_trackers2, COMMUNICATOR, (_COMMUNICATOR = {}, _defineProperty(_COMMUNICATOR, TRACKER, _tracker.clone({
  properties: {
    namespace: COMMUNICATOR
  }
})), _defineProperty(_COMMUNICATOR, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: COMMUNICATOR
  }
})), _COMMUNICATOR)), _defineProperty(_trackers2, LISTS, (_LISTS = {}, _defineProperty(_LISTS, TRACKER, _tracker.clone({
  properties: {
    namespace: LISTS
  }
})), _defineProperty(_LISTS, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: LISTS
  }
})), _LISTS)), _defineProperty(_trackers2, QUOTES, (_QUOTES = {}, _defineProperty(_QUOTES, TRACKER, _tracker.clone({
  properties: {
    namespace: QUOTES
  }
})), _defineProperty(_QUOTES, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: QUOTES
  }
})), _QUOTES)), _defineProperty(_trackers2, PRODUCTS, (_PRODUCTS = {}, _defineProperty(_PRODUCTS, TRACKER, _tracker.clone({
  properties: {
    namespace: PRODUCTS
  }
})), _defineProperty(_PRODUCTS, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: PRODUCTS
  }
})), _PRODUCTS)), _defineProperty(_trackers2, LINEITEMS, (_LINEITEMS = {}, _defineProperty(_LINEITEMS, TRACKER, _tracker.clone({
  properties: {
    namespace: LINEITEMS
  }
})), _defineProperty(_LINEITEMS, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: LINEITEMS
  }
})), _LINEITEMS)), _defineProperty(_trackers2, REPORTING, (_REPORTING = {}, _defineProperty(_REPORTING, TRACKER, _tracker.clone({
  properties: {
    namespace: REPORTING
  }
})), _defineProperty(_REPORTING, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: REPORTING
  }
})), _REPORTING)), _defineProperty(_trackers2, TASKS, (_TASKS = {}, _defineProperty(_TASKS, TRACKER, _tracker.clone({
  properties: {
    namespace: TASKS
  }
})), _defineProperty(_TASKS, SEND_IMMEDIATE, _trackerSendImmediate.clone({
  properties: {
    namespace: TASKS
  }
})), _TASKS)), _trackers2);
export var UsageTracker = /*#__PURE__*/function () {
  function UsageTracker() {
    _classCallCheck(this, UsageTracker);
  }

  _createClass(UsageTracker, null, [{
    key: "init",
    value: function init(properties) {
      setPrimaryTracker(_tracker);
      Object.keys(_trackers).forEach(function (namespace) {
        _trackers[namespace][TRACKER].setProperties(properties);

        _trackers[namespace][SEND_IMMEDIATE].setProperties(properties);
      });
    }
  }, {
    key: "track",
    value: function track(evt, evtData) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _options$sendImmediat = options.sendImmediate,
          sendImmediate = _options$sendImmediat === void 0 ? false : _options$sendImmediat,
          _options$namespace = options.namespace,
          namespace = _options$namespace === void 0 ? CRM : _options$namespace;
      var tracker = _trackers[namespace][sendImmediate ? SEND_IMMEDIATE : TRACKER];
      tracker.track(evt, evtData);
    }
  }]);

  return UsageTracker;
}();