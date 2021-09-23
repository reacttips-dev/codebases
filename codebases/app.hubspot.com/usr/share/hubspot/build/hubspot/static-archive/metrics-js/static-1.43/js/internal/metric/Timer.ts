"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Timer = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Metric2 = require("./Metric");

function isThenable(obj) {
  return obj && typeof obj.then === 'function';
}
/**
 * `Timer`s track the duration of a given task over the reporting interval.
 * A `Timer` reports a collection of values, which a consumer can use to either
 * report on individually, or aggregate into summary metrics (e.g. p99). Common
 * timers might be the amount of time an event handler takes to run, or the
 * runtime duration of some expensive initialization code.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const timer = new Timer('my-metric', {some_dimention: 'val'})
 * timer.update(performance.now() - startTime);
 * timer.time(() => handleEvent());
 * timer.time(() => fetchData(params)).then(processResponse);
 * timer.flush(); // { 'my-metric': [5, 6, 7] }
 */


var Timer = /*#__PURE__*/function (_Metric) {
  (0, _inherits2.default)(Timer, _Metric);

  function Timer() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, Timer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Timer)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.values = [];
    return _this;
  }

  (0, _createClass2.default)(Timer, [{
    key: "update",
    value: function update(durationMs) {
      this.values.push(durationMs);
    }
  }, {
    key: "time",
    value: function time(timed) {
      var _this2 = this;

      var start = performance.now();
      var result = timed();

      if (isThenable(result)) {
        return result.then(function (next) {
          _this2.update(performance.now() - start);

          return next;
        });
      }

      this.update(performance.now() - start);
      return result;
    }
  }, {
    key: "canFlush",
    value: function canFlush() {
      return this.values.length > 0;
    }
  }, {
    key: "flush",
    value: function flush() {
      var report = {
        name: this.getName(),
        type: 'TIMER',
        values: this.values.slice(),
        dimensions: this.getDimensions()
      };
      this.values = [];
      return report;
    }
  }]);
  return Timer;
}(_Metric2.Metric);

exports.Timer = Timer;