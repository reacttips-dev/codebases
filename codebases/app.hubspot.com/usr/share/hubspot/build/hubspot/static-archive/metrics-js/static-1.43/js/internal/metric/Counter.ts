"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Counter = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Metric2 = require("./Metric");

/**
 * `Counter`s track the number of occurrences of a given event over the
 * reporting interval. Common usecases are logging the number of times
 * a user clicks a button or the number of HTTP requests made.
 *
 * This class should never be directly constructed, and `flush` should never be
 * called outside of the Daemon. Metric lifecycles should be fully managed by
 * a `Metrics` factory, Managing construction via a central factory allows us
 * to cache metric instances and avoid reporting conflicting values for the
 * same metric in the same reporting period.
 *
 * @example
 * const counter = new Counter('my-metric', {some_dimension: 'val'});
 * counter.increment();
 * counter.increment(3);
 * counter.decrement(2);
 * counter.flush(); // { 'my-metric.count': 2 }
 */
var Counter = /*#__PURE__*/function (_Metric) {
  (0, _inherits2.default)(Counter, _Metric);

  function Counter() {
    var _getPrototypeOf2;

    var _this;

    (0, _classCallCheck2.default)(this, Counter);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(Counter)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _this.count = 0;
    _this.hasUpdated = false;
    return _this;
  }

  (0, _createClass2.default)(Counter, [{
    key: "safeStep",
    value: function safeStep(step) {
      if (typeof step !== 'number' || step % 1 === 0) {
        this.hasUpdated = true;
        this.count += step;
      } else {
        // @ts-expect-error process undefined in our TS environment
        if (process.env.NODE_ENV !== 'production') {
          console.error("[metrics-js] Counter " + this.getName() + " received a non-integer value (" + step + ").\n\nCounters can only record whole number increments. They should be used to track the frequency\nof a recurring action taken by a user or your code. To aggregate other quantitative data\nplease use NewRelic's custom attributes or custom actions. If you have further questions\nplease reach out in #frontend-platform-support.");
        }
      }
    }
  }, {
    key: "increment",
    value: function increment() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.safeStep(step);
    }
  }, {
    key: "decrement",
    value: function decrement() {
      var step = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.safeStep(step * -1);
    }
  }, {
    key: "canFlush",
    value: function canFlush() {
      // we can't just check this.count === 0 because it's possible for a counter
      // to be called with both `increment` and `decrement` in the same reporting
      // in which case the reporting code may find that value significant
      return this.hasUpdated;
    }
  }, {
    key: "flush",
    value: function flush() {
      var report = {
        name: this.getName(),
        values: [this.count],
        type: 'COUNTER',
        dimensions: this.getDimensions()
      };
      this.count = 0;
      this.hasUpdated = false;
      return report;
    }
  }]);
  return Counter;
}(_Metric2.Metric);

exports.Counter = Counter;