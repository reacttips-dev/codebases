import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import hubspot from 'hubspot';
import { getFullUrl } from 'hubspot-url-utils';
import memoize from 'react-utils/memoize';
import PortalIdParser from 'PortalIdParser';
import BaseReporter from './BaseReporter';
import { isHidden } from '../visibility';
export var ObserverType = {
  FID: 'first-input',
  LongTask: 'longtask'
};
export var THIRTY_SECONDS = 1000 * 30;
export var CartographerEndpoint = {
  Navigation: 'rhumb',
  Performance: 'performance'
};

var formatVersion = function formatVersion(version) {
  if (!version) {
    return 'unknown';
  }

  if (version === 'static') {
    return 'dev';
  }

  return version.replace('static-', '');
};

var getMetricsEndpoint = memoize(function (endpoint, staticAppInfo) {
  var staticAppName = staticAppInfo && staticAppInfo.staticAppName ? staticAppInfo.staticAppName : hubspot.bender.currentProject;
  var staticAppVersion = staticAppInfo && staticAppInfo.staticAppVersion ? staticAppInfo.staticAppVersion : hubspot.bender.currentProjectVersion;
  return getFullUrl('api') + "/cartographer/v1/" + endpoint + "?hs_static_app=" + staticAppName + "&hs_static_app_version=" + formatVersion(staticAppVersion);
});

var CartographerReporter = /*#__PURE__*/function (_BaseReporter) {
  _inherits(CartographerReporter, _BaseReporter);

  function CartographerReporter(options) {
    var _this;

    _classCallCheck(this, CartographerReporter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CartographerReporter).call(this, options));
    _this.performanceActions = [];
    _this.navigationActions = [];
    _this.staticAppInfo = _this.options.staticAppInfo;
    window.addEventListener('unload', function () {
      _this.flushAllQueues();
    }, false);
    return _this;
  }

  _createClass(CartographerReporter, [{
    key: "sendActions",
    value: function sendActions(actions, endpoint) {
      try {
        return navigator.sendBeacon(getMetricsEndpoint(endpoint, this.staticAppInfo), JSON.stringify({
          userAgent: navigator.userAgent,
          portalId: PortalIdParser.get(),
          datapoints: actions
        }));
      } catch (_unused) {
        return null;
      }
    }
  }, {
    key: "logActions",
    value: function logActions(actions) {
      if (!this.debug) {
        return;
      }

      console.group('Cartographer beacon');
      actions.forEach(console.log);
      console.groupEnd();
    }
  }, {
    key: "flushNavigationQueue",
    value: function flushNavigationQueue() {
      if (!this.navigationActions.length) {
        return;
      }

      try {
        var sent = this.sendActions(this.navigationActions, CartographerEndpoint.Navigation);

        if (sent) {
          this.logActions(this.navigationActions);
          this.navigationActions = [];
        }
      } catch (e) {// Do nothing
      }
    }
  }, {
    key: "flushPerformanceQueue",
    value: function flushPerformanceQueue() {
      if (!this.performanceActions.length) {
        return;
      }

      try {
        var sent = this.sendActions(this.performanceActions, CartographerEndpoint.Performance);

        if (sent) {
          this.logActions(this.performanceActions);
          this.performanceActions = [];
        }
      } catch (e) {// Do nothing
      }
    }
  }, {
    key: "flushAllQueues",
    value: function flushAllQueues() {
      this.flushNavigationQueue();
      this.flushPerformanceQueue();
    }
  }, {
    key: "pushNavigationAction",
    value: function pushNavigationAction(routeInfo, previousRouteInfo, status, duration) {
      if (isHidden()) {
        return;
      }

      this.navigationActions.push({
        from: previousRouteInfo,
        to: routeInfo,
        duration: duration,
        status: status
      });
    }
  }, {
    key: "pushPerformanceAction",
    value: function pushPerformanceAction(route, type, data) {
      if (isHidden()) {
        return;
      }

      this.performanceActions.push({
        route: route,
        type: type,
        data: data
      });
    }
  }]);

  return CartographerReporter;
}(BaseReporter);

export { CartographerReporter as default };