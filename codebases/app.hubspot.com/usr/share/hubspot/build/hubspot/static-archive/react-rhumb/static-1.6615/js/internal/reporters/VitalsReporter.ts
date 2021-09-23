import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import CartographerReporter, { THIRTY_SECONDS, ObserverType } from './CartographerReporter';
import { onVisibilityHidden } from '../visibility';
import { resetFirstInputPolyfill, firstInputPolyfill } from '../BFCacheRestore';

var createPerfObserver = function createPerfObserver(type, processEntry) {
  try {
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) {
      return;
    }

    var observer = new PerformanceObserver(function (entryList) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = entryList.getEntries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var perfEntry = _step.value;
          processEntry(perfEntry);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
    observer.observe({
      type: type,
      buffered: true
    });
    onVisibilityHidden(function () {
      var visibleEntries = observer.takeRecords();
      observer.disconnect();
      visibleEntries.map(processEntry);
    });
  } catch (_unused) {// do nothing
  }
};

var onBFCacheRestore = function onBFCacheRestore(callback) {
  window.addEventListener('pageshow', function (event) {
    if (event.persisted) {
      callback(event);
    }
  }, true);
};

var VitalsReporter = /*#__PURE__*/function (_CartographerReporter) {
  _inherits(VitalsReporter, _CartographerReporter);

  function VitalsReporter(options) {
    var _this;

    _classCallCheck(this, VitalsReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VitalsReporter).call(this, options));
    _this.resolved = {};
    _this.stopped = false;
    _this.firstHiddenTime = document.visibilityState === 'hidden' ? 0 : Infinity;
    window.addEventListener('visibilitychange', function (event) {
      _this.firstHiddenTime = Math.min(_this.firstHiddenTime, event.timeStamp);
    }, {
      once: true
    });

    var debounce = function debounce() {
      clearTimeout(_this.flushQueueTimeout);
      _this.flushQueueTimeout = setTimeout(function () {
        _this.flushPerformanceQueue();
      }, THIRTY_SECONDS);
    };

    var processFIDEntry = function processFIDEntry(perfEntry) {
      var _toJSON = perfEntry.toJSON(),
          processingStart = _toJSON.processingStart,
          startTime = _toJSON.startTime,
          perfData = _objectWithoutProperties(_toJSON, ["processingStart", "startTime"]); // ignore entries if the page was not in the foreground when the first input occured


      if (startTime < _this.firstHiddenTime) {
        var inputDelay = processingStart - startTime;

        _this.pushPerformanceAction(_this.lastRouteInfo, ObserverType.FID, Object.assign({}, perfData, {
          processingStart: processingStart,
          startTime: startTime,
          inputDelay: inputDelay
        }));

        debounce();
      }
    };

    var entryHandler = function entryHandler(entry) {
      processFIDEntry(entry);
    };
    /*
      When the page is restored from the back/forward cache, re-add event listeners for FID
      and manually push FID data to the performance actions queue since the performance observer
      won't be able to catch it.
    */


    onBFCacheRestore(function () {
      resetFirstInputPolyfill();
      firstInputPolyfill(entryHandler);
    }); // Create performance observers for FID, etc

    createPerfObserver(ObserverType.LongTask, function (perfEntry) {
      var _toJSON2 = perfEntry.toJSON(),
          __attribution = _toJSON2.attribution,
          perfData = _objectWithoutProperties(_toJSON2, ["attribution"]);

      _this.pushPerformanceAction(_this.lastRouteInfo, ObserverType.LongTask, perfData);

      debounce();
    });
    createPerfObserver(ObserverType.FID, function (perfEntry) {
      processFIDEntry(perfEntry);
    });
    return _this;
  }

  _createClass(VitalsReporter, [{
    key: "__setFirstHiddenTime",
    value: function __setFirstHiddenTime(time) {
      this.firstHiddenTime = time;
    }
  }, {
    key: "report",
    value: function report(action) {
      if (action.type === 'COMPONENT_RENDERED' || this.resolved[action.payload.entry.id] || this.stopped) {
        return;
      }

      switch (action.type) {
        case 'ROUTE_TIMEOUT_EXPIRED':
          {
            var route = action.payload.routeSpec.route;
            this.lastRouteInfo = {
              route: route
            };
            break;
          }

        case 'ROUTE_FAILED':
          {
            var _action$payload = action.payload,
                pathname = _action$payload.entry.pathname,
                routeSpec = _action$payload.routeSpec;
            var _route = routeSpec.route;
            this.lastRouteInfo = {
              pathname: pathname,
              route: _route
            };
            break;
          }

        case 'ROUTE_SUCCEEDED':
          {
            var _action$payload2 = action.payload,
                _pathname = _action$payload2.entry.pathname,
                scenario = _action$payload2.extra.scenario,
                _routeSpec = _action$payload2.routeSpec;
            var _route2 = _routeSpec.route;
            this.lastRouteInfo = {
              pathname: _pathname,
              route: _route2,
              scenario: scenario
            };
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

        case 'ROUTE_SUCCEEDED':
        case 'ROUTE_TIMEOUT_EXPIRED':
        case 'ROUTE_FAILED':
          {
            this.resolved[action.payload.entry.id] = true;
            break;
          }

        default:
      }
    }
  }]);

  return VitalsReporter;
}(CartographerReporter);

export { VitalsReporter as default };