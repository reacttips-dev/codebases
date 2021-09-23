"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MetricsFactory = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _MetricsDaemon = require("./daemon/MetricsDaemon");

var _Counter = require("./metric/Counter");

var _Timer = require("./metric/Timer");

var MetricsFactory = /*#__PURE__*/function () {
  function MetricsFactory(namespace) {
    var globalDimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, MetricsFactory);
    this.namespace = namespace;
    this.globalDimensions = globalDimensions;
  }

  (0, _createClass2.default)(MetricsFactory, [{
    key: "namespaceMetric",
    value: function namespaceMetric(name) {
      return this.namespace + "." + name;
    }
  }, {
    key: "counter",
    value: function counter(name) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _Counter.Counter);
    }
  }, {
    key: "timer",
    value: function timer(name) {
      var dimensions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      return _MetricsDaemon.MetricsDaemon.instance().getMetric(this.namespaceMetric(name), Object.assign({}, this.globalDimensions, {}, dimensions), _Timer.Timer);
    }
  }]);
  return MetricsFactory;
}();

exports.MetricsFactory = MetricsFactory;