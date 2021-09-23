import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import hubspot from 'hubspot';
import invariant from 'react-utils/invariant';
import performance from '../../vendor/performance';
import CartographerReporter, { CartographerEndpoint } from './CartographerReporter';
import { onVisibilityChange, visibilityState } from '../visibility';
var STATIC_DOMAIN_REGEX = /https:\/\/(static|local).hsappstatic.net\//; // If the duration of the request is <= 10ms mark the request as a cache hit.

var CACHE_DURATION_MS = 10;

var ReaganCompatReporter = /*#__PURE__*/function (_CartographerReporter) {
  _inherits(ReaganCompatReporter, _CartographerReporter);

  function ReaganCompatReporter(options) {
    var _this;

    _classCallCheck(this, ReaganCompatReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReaganCompatReporter).call(this, options));
    _this.abandonedTimes = [];
    _this.lastAbandonedTimestamp = null;
    _this.finished = false;
    _this.wasHidden = visibilityState() === 'hidden';

    _this.setCustomAttribute('currentVisibility', visibilityState());

    _this.setCustomAttribute('visibility', visibilityState());

    onVisibilityChange(function (state) {
      _this.setCustomAttribute('currentVisibility', state);

      if (state === 'hidden' && !_this.wasHidden) {
        _this.wasHidden = true;

        _this.setCustomAttribute('visibility', 'hidden');
      }
    });
    return _this;
  }

  _createClass(ReaganCompatReporter, [{
    key: "getHubHttpData",
    value: function getHubHttpData(finishedTimestamp) {
      if (typeof hubspot.getAllHttpRequestStats === 'function' && typeof performance.now === 'function') {
        var byStatus = function byStatus(status) {
          return function (_ref) {
            var state = _ref.state,
                started = _ref.started,
                finished = _ref.finished;
            return started < finishedTimestamp && (status === 'pending' ? state === 'pending' || finished > finishedTimestamp : state === status && finished <= finishedTimestamp);
          };
        };

        var MAX_URLS = 10;

        var toUrls = function toUrls(arr) {
          return arr.slice(0, MAX_URLS).map(function (r) {
            return r.url;
          }).join(',');
        };

        var requests = hubspot.getAllHttpRequestStats();
        var succeededRequests = requests.filter(byStatus('succeeded'));
        var failedRequests = requests.filter(byStatus('failed'));
        var abortedRequests = requests.filter(byStatus('aborted'));
        var pendingRequests = requests.filter(byStatus('pending'));
        var timedOutRequests = requests.filter(byStatus('timedOut'));
        var failedRequestsMinus404AndRetries = failedRequests.filter(function (r) {
          return r.status !== 404 && !r.willBeRetried;
        });
        var notFoundRequests = failedRequests.filter(function (r) {
          return r.status === 404;
        });
        return {
          numSucceededRequests: succeededRequests.length,
          numAbortedRequests: abortedRequests.length,
          numPendingRequests: pendingRequests.length,
          numNotFound: notFoundRequests.length,
          numTimedoutRequests: timedOutRequests.length,
          numFailedRequestsMinus404AndRetries: failedRequestsMinus404AndRetries.length,
          numRetriedFailures: failedRequests.filter(function (r) {
            return !!r.willBeRetried;
          }).length,
          failedRequestUrls: toUrls(failedRequestsMinus404AndRetries),
          timedOutRequestUrls: toUrls(timedOutRequests),
          pendingRequestUrls: toUrls(pendingRequests),
          notFoundUrls: toUrls(notFoundRequests)
        };
      }

      return null;
    }
  }, {
    key: "getCacheStatusData",
    value: function getCacheStatusData() {
      var cacheStatusData = {};
      this.performanceEntries().forEach(function (timing) {
        if (timing.name.endsWith('.js')) {
          var fileName = timing.name.replace(STATIC_DOMAIN_REGEX, '');
          cacheStatusData[fileName] = {
            cached: timing.duration <= CACHE_DURATION_MS,
            duration: timing.duration
          };
        }
      });
      return cacheStatusData;
    }
  }, {
    key: "getNumFailedImages",
    value: function getNumFailedImages() {
      return Array.from(document.getElementsByTagName('img')).reduce(function (total, ele) {
        return ele.src && ele.naturalHeight === 0 && ele.naturalWidth === 0 ? total + 1 : total;
      }, 0);
    }
  }, {
    key: "finish",
    value: function finish(attrs, checks) {
      var _this2 = this;

      var finishedTimestamp = attrs.finishedTimestamp;
      var hubHttpData = this.getHubHttpData(finishedTimestamp);
      var avgDurationBeforePreviousReaganAborts = this.abandonedTimes.reduce(function (acc, duration) {
        return acc + duration / _this2.abandonedTimes.length;
      }, 0);
      var cacheData = this.getCacheStatusData();
      var reaganTiming = {};
      Object.keys(checks).forEach(function (marker) {
        if (checks[marker]) {
          reaganTiming["marker_timing_" + marker] = checks[marker].timestamp;
        }
      });
      this.setCustomAttribute('numReaganChecksStarted', this.abandonedTimes.length + 1);
      this.setCustomAttribute('numPreviousReaganChecksAborted', this.abandonedTimes.length);
      this.setCustomAttribute('avgDurationBeforePreviousReaganAborts', avgDurationBeforePreviousReaganAborts);
      this.setCustomAttribute('numPreviousReaganChecksFailed', 0);
      this.setCustomAttribute('numPreviousReaganChecksSuccessful', 0);
      this.setCustomAttribute('supportsUserTiming', typeof performance.mark === 'function');
      this.setCustomAttribute('supportsPerformanceTimeline', typeof performance.getEntriesByType === 'function');
      this.setCustomAttribute('supportsHighResolutionTime', typeof performance.now === 'function');
      this.addPageAction('reaganFinished', Object.assign({}, attrs, {}, hubHttpData, {
        numFailedImages: this.getNumFailedImages(),
        cacheData: JSON.stringify(cacheData),
        allVisibleMarkers: JSON.stringify(Object.keys(checks))
      }, reaganTiming)); // send to Cartographer

      this.sendActions([{
        to: {
          pathname: attrs.pathname,
          route: attrs.route,
          scenario: attrs.scenario
        },
        duration: attrs.timeToAllSuccess || attrs.finishedTimestamp,
        status: attrs.status
      }], CartographerEndpoint.Navigation);
    }
  }, {
    key: "report",
    value: function report(action) {
      if (action.type === 'COMPONENT_RENDERED' || !this || this.finished) {
        return;
      }

      var _action$payload = action.payload,
          _action$payload$entry = _action$payload.entry,
          timestamp = _action$payload$entry.timestamp,
          checks = _action$payload$entry.checks,
          expiredTimestamp = _action$payload$entry.expiredTimestamp,
          pathname = _action$payload$entry.pathname,
          routeSpec = _action$payload.routeSpec;

      switch (action.type) {
        case 'ROUTE_SUCCEEDED':
        case 'ROUTE_FAILED':
        case 'ROUTE_TIMEOUT_EXPIRED':
        case 'ROUTE_UNEXPECTED':
          {
            this.finished = true;
            break;
          }

        default:
      }

      switch (action.type) {
        case 'ROUTE_STARTED':
          {
            if (this.lastAbandonedTimestamp) {
              this.abandonedTimes.push(timestamp - this.lastAbandonedTimestamp);
            }

            break;
          }

        case 'ROUTE_ABANDONED':
          {
            this.lastAbandonedTimestamp = timestamp;
            break;
          }

        case 'ROUTE_SUCCEEDED':
          {
            var success = routeSpec.success,
                route = routeSpec.route;
            var scenario = action.payload.extra.scenario;

            if (process.env.NODE_ENV !== 'production') {
              invariant(success[scenario].length > 0, 'routeSpec for %s must have at least one `success` marker for %s', route, scenario);
            }

            var maxTimestamp = Math.max.apply(Math, _toConsumableArray(success[scenario].map(function (m) {
              return checks[m].timestamp;
            })));
            var duration = Math.max(0, maxTimestamp - timestamp);
            this.finish(Object.assign({
              status: 'success',
              timeToAllSuccess: (timestamp + duration) / 1000,
              scenario: scenario,
              finishedTimestamp: maxTimestamp,
              route: route,
              pathname: pathname
            }, this.options.timingOffset ? {
              adjustedTimeToAllSuccess: (timestamp + duration + this.options.timingOffset) / 1000,
              timingOffset: this.options.timingOffset
            } : {}), checks);
            this.performanceMark("mark_all_success");
            break;
          }

        case 'ROUTE_FAILED':
          {
            var _route = routeSpec.route,
                error = routeSpec.error;
            var markers = error.filter(function (marker) {
              return checks[marker];
            });

            if (process.env.NODE_ENV !== 'production') {
              invariant(markers.length > 0, 'routeSpec for %s must have at least one `failure` marker for', _route);
            } // TODO how to report multiple failed markers without separate page actions


            var _markers = _slicedToArray(markers, 1),
                failedMarker = _markers[0];

            var finishedTimestamp = checks[failedMarker].timestamp;
            this.finish({
              status: 'failure',
              failureType: 'errorSelector',
              selector: failedMarker,
              finishedTimestamp: finishedTimestamp,
              route: _route,
              pathname: pathname
            }, checks);
            this.performanceMark("mark_all_failure");
            break;
          }

        case 'ROUTE_TIMEOUT_EXPIRED':
          {
            var _route2 = routeSpec.route;
            this.finish({
              status: 'failure',
              failureType: 'watchdogExpired',
              finishedTimestamp: expiredTimestamp,
              route: _route2
            }, checks);
            this.performanceMark("mark_all_failure_watchdog_expired");
            break;
          }

        default:
      }
    }
  }]);

  return ReaganCompatReporter;
}(CartographerReporter);

export { ReaganCompatReporter as default };