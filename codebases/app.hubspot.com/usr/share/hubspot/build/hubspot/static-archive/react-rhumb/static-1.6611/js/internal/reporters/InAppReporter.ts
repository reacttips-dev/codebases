import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import CartographerReporter, { THIRTY_SECONDS } from './CartographerReporter';

var InAppReporter = /*#__PURE__*/function (_CartographerReporter) {
  _inherits(InAppReporter, _CartographerReporter);

  function InAppReporter(options) {
    var _this;

    _classCallCheck(this, InAppReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InAppReporter).call(this, options));
    _this.resolved = {};
    _this.stopped = false;
    _this.flushQueueTimeout = undefined;
    _this.currentActionStartTimestamp = null;
    _this.previousNavigationAction = null;
    return _this;
  }

  _createClass(InAppReporter, [{
    key: "pushInAppNavigationAction",
    value: function pushInAppNavigationAction(routeInfo, status, duration) {
      if (this.previousNavigationAction) {
        this.pushNavigationAction(routeInfo, this.previousNavigationAction, status, duration);
      }

      this.previousNavigationAction = routeInfo;
    }
  }, {
    key: "report",
    value: function report(action) {
      var _this2 = this;

      if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] || this.stopped) {
        return;
      }

      switch (action.type) {
        case 'ROUTE_TIMEOUT_EXPIRED':
        case 'ROUTE_FAILED':
          {
            var _action$payload = action.payload,
                entry = _action$payload.entry,
                routeSpec = _action$payload.routeSpec;
            var pathname = entry.pathname,
                checks = entry.checks,
                expiredTimestamp = entry.expiredTimestamp;
            var route = routeSpec.route,
                error = routeSpec.error;
            this.pushInAppNavigationAction({
              pathname: pathname,
              route: route,
              scenario: action.type === 'ROUTE_FAILED' && error ? error.join(',') : action.type
            }, 'failure', action.type === 'ROUTE_FAILED' ? this.toDuration(checks, this.currentActionStartTimestamp, error) : expiredTimestamp - this.currentActionStartTimestamp);
            break;
          }

        case 'ROUTE_SUCCEEDED':
          {
            var _action$payload2 = action.payload,
                _entry = _action$payload2.entry,
                _routeSpec = _action$payload2.routeSpec,
                extra = _action$payload2.extra;
            var _pathname = _entry.pathname,
                _checks = _entry.checks;
            var _route = _routeSpec.route;
            var scenario = extra.scenario;
            var markers = _routeSpec.success[scenario] || '';
            this.pushInAppNavigationAction({
              pathname: _pathname,
              route: _route,
              scenario: scenario || markers.join(',')
            }, 'success', this.toDuration(_checks, this.currentActionStartTimestamp, markers));
            break;
          }

        default:
      }

      switch (action.type) {
        case 'ROUTE_UNEXPECTED':
          {
            this.stopped = true;
            break;
          }

        case 'ROUTE_STARTED':
          {
            var _entry2 = action.payload.entry;
            var timestamp = _entry2.timestamp;
            this.currentActionStartTimestamp = this.currentActionStartTimestamp || timestamp;
            break;
          }

        case 'ROUTE_SUCCEEDED':
        case 'ROUTE_TIMEOUT_EXPIRED':
        case 'ROUTE_FAILED':
          {
            this.currentActionStartTimestamp = null;
            this.resolved[action.payload.entry.id] = true;
            clearTimeout(this.flushQueueTimeout);
            this.flushQueueTimeout = setTimeout(function () {
              _this2.flushNavigationQueue();
            }, THIRTY_SECONDS);
            break;
          }

        default:
      }
    }
  }]);

  return InAppReporter;
}(CartographerReporter);

export { InAppReporter as default };