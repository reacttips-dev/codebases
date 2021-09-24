'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import * as tracker from './lib/tracker';

var ExposureLogger = /*#__PURE__*/function () {
  function ExposureLogger(experimentInstance) {
    _classCallCheck(this, ExposureLogger);

    this._experiment = experimentInstance;
    this._hasLogged = false;
    this._tracker = null;
  }

  _createClass(ExposureLogger, [{
    key: "logExposure",
    value: function logExposure() {
      var extras = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.initializeTracker();

      if (!this._experiment.inExperiment() || !this._tracker) {
        return;
      }

      this._hasLogged = true;
      this.formatAndLog(extras);
    }
  }, {
    key: "previouslyLogged",
    value: function previouslyLogged() {
      return this._hasLogged;
    }
  }, {
    key: "formatAndLog",
    value: function formatAndLog(extras) {
      var eventProperties = this.getEventProperties(extras);
      tracker.trackExposure(this._tracker.track, eventProperties);
    }
  }, {
    key: "getReportedParam",
    value: function getReportedParam() {
      var params = this._experiment.getParams();

      return Object.keys(params).map(function (key) {
        return key + ":" + params[key];
      }).join('|');
    }
  }, {
    key: "getEventProperties",
    value: function getEventProperties(extras) {
      var reportedParam = this.getReportedParam();

      var name = this._experiment.getName();

      var eventProperties = {
        experimentName: name,
        experimentParams: reportedParam
      };

      if (extras) {
        Object.keys(extras).forEach(function (extraKey) {
          eventProperties[extraKey] = extras[extraKey];
        });
      }

      return eventProperties;
    }
  }, {
    key: "initializeTracker",
    value: function initializeTracker() {
      if (this._tracker) {
        return;
      }

      var version = this._experiment.version || 'v1';
      this._tracker = tracker.create(version);
    }
  }]);

  return ExposureLogger;
}();

export default ExposureLogger;