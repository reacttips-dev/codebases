import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import enviro from 'enviro';
import Raven from 'Raven';

var BaseReporter = /*#__PURE__*/function () {
  function BaseReporter() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, BaseReporter);

    this.options = options;
    this.debug = enviro.debug('react-rhumb') === 'true';
    this.libName = "react-rhumb";
  }

  _createClass(BaseReporter, [{
    key: "performanceMark",
    value: function performanceMark(name) {
      if (typeof performance.mark === 'function') {
        performance.mark(name);
      }
    }
  }, {
    key: "performanceEntries",
    value: function performanceEntries() {
      if (typeof performance.getEntries === 'function') {
        return performance.getEntries() || [];
      }

      return [];
    }
  }, {
    key: "toDuration",
    value: function toDuration(checks, timestamp, markers) {
      var longest = Math.max.apply(Math, _toConsumableArray(markers.filter(function (marker) {
        return Object.prototype.hasOwnProperty.call(checks, marker);
      }).map(function (marker) {
        return checks[marker].timestamp;
      })));
      return Math.max(0, longest - timestamp);
    }
  }, {
    key: "setCustomAttribute",
    value: function setCustomAttribute(attributeName, attributeValue) {
      if (window.newrelic) {
        window.newrelic.setCustomAttribute(attributeName, attributeValue);
      }
    }
  }, {
    key: "addPageAction",
    value: function addPageAction(actionName, actionPayload) {
      if (window.newrelic) {
        window.newrelic.addPageAction(actionName, actionPayload);
      }
    }
  }, {
    key: "captureError",
    value: function captureError(error, attributes) {
      var data = {};
      var tags = {};

      if (attributes) {
        data = attributes.data;
        tags = attributes.tags;
      }

      if (window.newrelic) {
        window.newrelic.noticeError(error, Object.assign({}, data, {}, tags));
      }

      Raven.captureException(error, {
        extra: data,
        tags: tags
      });
    }
  }, {
    key: "report",
    value: function report(__action) {
      throw new Error('Reporters must define a custom report() function');
    }
  }]);

  return BaseReporter;
}();

export { BaseReporter as default };