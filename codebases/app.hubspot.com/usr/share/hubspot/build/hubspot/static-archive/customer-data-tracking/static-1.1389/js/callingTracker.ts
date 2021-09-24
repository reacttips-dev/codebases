import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import enviro from 'enviro';
import { createTracker } from 'usage-tracker';
import { COMMUNICATOR } from './constants/namespaces';
import communicatorEvents from 'customer-data-tracking/tracking/communicator/events.yaml';
var validNamespaces = [COMMUNICATOR];

var _tracker = createTracker({
  events: communicatorEvents,
  properties: {
    namespace: COMMUNICATOR
  },
  onError: function onError(err) {
    console.error(err);
  },
  lastKnownEventProperties: ['screen', 'subscreen'],
  debug: function debug() {
    return enviro.debug('customer-data-tracker');
  }
});

var _trackerSendImmediate = _tracker.clone({
  isBeforeUnload: true
});

var UsageTracker = /*#__PURE__*/function () {
  function UsageTracker() {
    _classCallCheck(this, UsageTracker);
  }

  _createClass(UsageTracker, null, [{
    key: "init",
    value: function init(properties) {
      _tracker.setProperties(properties);

      _trackerSendImmediate.setProperties(properties);
    }
  }, {
    key: "track",
    value: function track(evt, evtData) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var _options$sendImmediat = options.sendImmediate,
          sendImmediate = _options$sendImmediat === void 0 ? false : _options$sendImmediat;
      var tracker = sendImmediate ? _tracker : _trackerSendImmediate;
      tracker.track(evt, evtData);
    }
  }]);

  return UsageTracker;
}();

export var CommunicatorLogger = {
  externalData: {},
  init: function init(data) {
    CommunicatorLogger.externalData = data;
    UsageTracker.init(data);
  },
  logImmediate: function logImmediate(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      namespace: COMMUNICATOR
    };
    return CommunicatorLogger.log(eventName, eventProps, Object.assign({}, trackerOptions, {
      sendImmediate: true
    }));
  },
  log: function log(eventName) {
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      sendImmediate: false,
      namespace: COMMUNICATOR
    };

    if (validNamespaces.indexOf(trackerOptions.namespace || '') === -1) {
      if (enviro.isProd() !== true) {
        console.warn("[UsageLogger]: " + trackerOptions.namespace + " is not a valid namespace. Event will not be logged");
      }
    } else {
      CommunicatorLogger._log(eventName, eventProps, trackerOptions);
    }
  },
  _log: function _log() {
    var eventName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var eventProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var trackerOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
      sendImmediate: false,
      namespace: COMMUNICATOR
    };
    UsageTracker.track(eventName, eventProps, trackerOptions);
  }
};