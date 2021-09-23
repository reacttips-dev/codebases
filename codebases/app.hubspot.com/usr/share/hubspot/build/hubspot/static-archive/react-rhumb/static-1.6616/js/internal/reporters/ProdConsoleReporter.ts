import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import BaseReporter from './BaseReporter';

var ProdConsoleReporter = /*#__PURE__*/function (_BaseReporter) {
  _inherits(ProdConsoleReporter, _BaseReporter);

  function ProdConsoleReporter(options) {
    var _this;

    _classCallCheck(this, ProdConsoleReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ProdConsoleReporter).call(this, options));
    _this.resolved = {};
    return _this;
  }

  _createClass(ProdConsoleReporter, [{
    key: "report",
    value: function report(action) {
      var _this2 = this;

      if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] && action.type !== 'CHECKS_CHANGED') {
        return;
      }

      var _action$payload = action.payload,
          _action$payload$entry = _action$payload.entry,
          pathname = _action$payload$entry.pathname,
          timestamp = _action$payload$entry.timestamp,
          expiredTimestamp = _action$payload$entry.expiredTimestamp,
          checks = _action$payload$entry.checks,
          id = _action$payload$entry.id,
          routeSpec = _action$payload.routeSpec;

      if (!this.debug) {
        return;
      }

      var log = function log() {
        var _console;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return (_console = console).log.apply(_console, ["[" + _this2.libName + "]", pathname].concat(args));
      };

      var formatDuration = function formatDuration(num) {
        return num.toFixed(2) + "ms";
      };

      var logIfOffset = function logIfOffset(duration) {
        if (_this2.options.timingOffset) {
          log("adjusted: " + formatDuration(duration + _this2.options.timingOffset) + " (offset " + _this2.options.timingOffset + ")");
        }
      };

      switch (action.type) {
        case 'ROUTE_STARTED':
          {
            var route = routeSpec.route;
            log("(" + route + ")");
            break;
          }

        case 'ROUTE_UNEXPECTED':
          {
            log("(unexpected)");
            break;
          }

        case 'ROUTE_ABANDONED':
          {
            log("(abandoned)");
            break;
          }

        case 'ROUTE_SUCCEEDED':
          {
            var scenario = action.payload.extra.scenario;
            var duration = this.toDuration(checks, timestamp, routeSpec.success[scenario]);
            log("(success) " + formatDuration(duration));
            logIfOffset(duration);
            break;
          }

        case 'ROUTE_FAILED':
          {
            var error = routeSpec.error;

            var _duration = this.toDuration(checks, timestamp, error);

            log("(failure) " + formatDuration(_duration));
            logIfOffset(_duration);
            break;
          }

        case 'ROUTE_TIMEOUT_EXPIRED':
          {
            var _duration2 = expiredTimestamp - timestamp;

            log("(timeout) " + formatDuration(_duration2));
            logIfOffset(_duration2);
            break;
          }

        case 'CHECKS_CHANGED':
          {
            log("(update)");
            break;
          }

        default:
      }

      switch (action.type) {
        case 'ROUTE_TIMEOUT_EXPIRED':
        case 'ROUTE_UNEXPECTED':
        case 'ROUTE_SUCCEEDED':
        case 'ROUTE_FAILED':
          {
            this.resolved[id] = true;
            break;
          }

        default:
      }
    }
  }]);

  return ProdConsoleReporter;
}(BaseReporter);

export { ProdConsoleReporter as default };