"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetCachedMetricsDaemonForTesting = resetCachedMetricsDaemonForTesting;
exports.MetricsDaemon = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _stableStringify = require("../stableStringify");

var _time = require("../time");

var _metricsApi = require("../metricsApi");

var _instance = null;

function resetCachedMetricsDaemonForTesting() {
  if (_instance) {
    _instance.stop();

    _instance = null;
  }
} // Borrowed from Google's `idlize`
// https://github.com/GoogleChromeLabs/idlize/blob/836cbc2c975749e259e94589e3d064c835836d1a/IdleQueue.mjs#L24


var isSafari = function isSafari() {
  return !!(typeof window.safari === 'object' && window.safari.pushNotification);
};

var MetricsDaemon = /*#__PURE__*/function () {
  /** prevent external instantiation */
  function MetricsDaemon() {
    var _this = this;

    (0, _classCallCheck2.default)(this, MetricsDaemon);
    this.metrics = new Map();
    this.interval = undefined;

    this.flush = function () {
      var datapointsToSend = [];

      _this.metrics.forEach(function (metric) {
        if (metric.canFlush()) {
          datapointsToSend.push(metric.flush());
        }
      });

      if (datapointsToSend.length > 0) {
        (0, _metricsApi.send)(datapointsToSend);
      }
    };

    this.eagerlyFlushQueueOnUnload = function () {
      if (document.visibilityState === 'hidden' || _this.listenTo === 'beforeunload') {
        _this.stop();
      }
    };

    // the most correct way to listen for the page unloading is the
    // visibilitychange event, except for a couple cases where it's buggy
    // in Safari
    // https://philipwalton.com/articles/idle-until-urgent/
    this.listenTo = isSafari() ? 'beforeunload' : 'visibilitychange';
  }

  (0, _createClass2.default)(MetricsDaemon, [{
    key: "clearMetricCache",
    value: function clearMetricCache() {
      this.metrics.clear();
    }
    /**
     * `run` is idempotent and may be called repeatedly without side effects.
     */

  }, {
    key: "run",
    value: function run() {
      if (!this.interval) {
        this.interval = setInterval(this.flush, _time.ONE_MINUTE);
        window.addEventListener(this.listenTo, this.eagerlyFlushQueueOnUnload, true);
      }
    }
  }, {
    key: "stop",
    value: function stop() {
      clearInterval(this.interval);
      this.interval = undefined;
      this.flush();
      this.clearMetricCache();
      window.removeEventListener(this.listenTo, this.eagerlyFlushQueueOnUnload);
    }
  }, {
    key: "getMetricCacheKey",
    value: function getMetricCacheKey(name, dimensions) {
      return name + "-" + (0, _stableStringify.stableStringify)(dimensions);
    }
  }, {
    key: "getMetric",
    value: function getMetric(name, dimensions, MetricCtor) {
      var cacheKey = this.getMetricCacheKey(name, dimensions);

      if (this.metrics.has(cacheKey)) {
        return this.metrics.get(cacheKey);
      }

      var newMetric = new MetricCtor(name, dimensions);
      this.metrics.set(cacheKey, newMetric);
      return newMetric;
    }
  }], [{
    key: "instance",
    value: function instance() {
      _instance = _instance || new MetricsDaemon();
      return _instance;
    }
  }]);
  return MetricsDaemon;
}();

exports.MetricsDaemon = MetricsDaemon;