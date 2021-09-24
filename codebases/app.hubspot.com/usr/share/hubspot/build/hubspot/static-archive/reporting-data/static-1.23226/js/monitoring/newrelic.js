'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { List } from 'immutable';
import { TIME_SERIES } from '../constants/configTypes';
import getErrorTypeFromException from '../lib/getErrorTypeFromException';
import * as overrides from '../lib/overrides';
import { ReportingPerf } from '../lib/performance';
import { replaceFunctions, stableStringify } from '../lib/stringify.js';
var SAMPLE_RATE = Math.random();
var PERCENT = 5; // Cleans request urls to allow for grouping

var cleanRequestUrl = function cleanRequestUrl(requestUrl) {
  return requestUrl ? requestUrl.split(/\/\d/)[0] : requestUrl;
};

var stringifyDisplayParams = function stringifyDisplayParams(displayParams) {
  return stableStringify(replaceFunctions(displayParams.toJS(), 'FUNCTION'), null, 2);
};

var getRandomDisplayParamKey = function getRandomDisplayParamKey(displayParams) {
  var randomIndex = Math.round(displayParams.count() * Math.random());
  return displayParams.keySeq().get(randomIndex);
};

var deriveReportDefinitionAttributes = function deriveReportDefinitionAttributes(reportDefinition) {
  var getTableList = function getTableList(table) {
    return List([table].concat(_toConsumableArray((table.get('join') || List()).map(function (join) {
      return join.get('target');
    }).flatMap(getTableList))));
  };

  var tableList = getTableList(reportDefinition.get('table'));
  var primaryTableName = reportDefinition.getIn(['table', 'name']);
  var nonPrimaryTableNames = tableList.map(function (t) {
    return t.get('name');
  }).filter(function (name) {
    return name !== primaryTableName;
  });
  return {
    reportDefinition: stableStringify(reportDefinition),
    reportDefinitionVisualType: reportDefinition.getIn(['visual', 'type']),
    reportDefinitionTableCount: tableList.count(),
    reportDefinitionPrimaryTableName: reportDefinition.getIn(['table', 'name']),
    reportDefinitionNonPrimaryTableName: stableStringify(nonPrimaryTableNames)
  };
};

var isMismatchedComparison = function isMismatchedComparison(config) {
  return config.get('configType') === TIME_SERIES && config.get('compare') && (config.get('dimensions') || List()).length > 0 && config.getIn(['dimensions', 0]) !== config.getIn(['filters', 'dateRange', 'property']);
};

var deriveReportConfigAttributes = function deriveReportConfigAttributes(config) {
  return {
    visualization: config.get('v2'),
    configType: config.get('configType'),
    dataType: config.get('dataType'),
    template: config.get('template'),
    dimensions: stableStringify(config.get('dimensions')),
    filters: stableStringify(config.get('filters')),
    metrics: stableStringify(config.get('metrics')),
    config: stableStringify(config),
    mismatchedDateComparison: stableStringify(isMismatchedComparison(config))
  };
};
/**
 * @param {Map} config
 * @param {Map?} maybeDisplayParams - optional
 */


var deriveNonReportDefinitionAttributes = function deriveNonReportDefinitionAttributes(config, maybeDisplayParams) {
  var displayParamAttributes = maybeDisplayParams ? {
    displayParams: stringifyDisplayParams(maybeDisplayParams),
    displayParam: getRandomDisplayParamKey(maybeDisplayParams)
  } : {};
  return Object.assign({}, displayParamAttributes, {}, deriveReportConfigAttributes(config));
};

var deriveReportAttributes = function deriveReportAttributes(report) {
  var maybeReportDefinition = report.get('reportDefinition');
  var reportDefinitionAttributes = maybeReportDefinition ? deriveReportDefinitionAttributes(maybeReportDefinition) : {};
  var maybeConfig = report.get('config');
  var maybeDisplayParams = report.get('displayParams');
  var nonReportDefinitionAttributes = maybeConfig ? deriveNonReportDefinitionAttributes(maybeConfig, maybeDisplayParams) : {};
  return Object.assign({
    reportName: report.get('name'),
    chartType: report.get('chartType'),
    reportId: report.get('id')
  }, nonReportDefinitionAttributes, {}, reportDefinitionAttributes);
};

var measurePerformance = function measurePerformance(reportingPerf) {
  return Object.assign({
    timeToResolve: reportingPerf.markEnd()
  }, reportingPerf.getMarks().toJS());
};

export var NewRelicInteraction = /*#__PURE__*/function () {
  function NewRelicInteraction() {
    var sampleRate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : SAMPLE_RATE;

    _classCallCheck(this, NewRelicInteraction);

    this.sampleRate = sampleRate;
    this.attributes = {
      lib: 'reporting-data',
      debugging: !!overrides.newrelic.enabled
    };
    this.perf = new ReportingPerf();
    this.perf.markStart();
  }

  _createClass(NewRelicInteraction, [{
    key: "enabled",
    value: function enabled() {
      return this.sampleRate * 100 < PERCENT;
    }
  }, {
    key: "addAttribute",
    value: function addAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
  }, {
    key: "addAttributes",
    value: function addAttributes(map) {
      this.attributes = Object.assign({}, map, {}, this.attributes);
    }
  }, {
    key: "addReportAttributes",
    value: function addReportAttributes(report) {
      try {
        this.addAttributes(deriveReportAttributes(report));
      } catch (error) {
        console.error('Error thrown in addReportAttributes:', error);
      }
    }
  }, {
    key: "addReportConfigAttributes",
    value: function addReportConfigAttributes(config) {
      try {
        this.addAttributes(deriveReportConfigAttributes(config));
      } catch (error) {
        console.error('Error thrown in addReportConfigAttributes:', error);
      }
    }
    /**
     * @param {Error?} exception - optional
     * @param {string} currentPhase
     * @param {string?} pageActionName - optional
     */

  }, {
    key: "logError",
    value: function logError() {
      var exception = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var currentPhase = arguments.length > 1 ? arguments[1] : undefined;
      var pageActionName = arguments.length > 2 ? arguments[2] : undefined;
      var message = exception.message,
          responseText = exception.responseText,
          stack = exception.stack,
          status = exception.status;
      this.addAttributes(Object.assign({}, measurePerformance(this.perf), {
        exception: exception,
        reportErrorType: getErrorTypeFromException(exception),
        reportExceptionMessage: message || 'no message',
        reportExceptionResponse: responseText,
        reportExceptionStack: stack || Error().stack,
        reportExceptionStatus: status,
        reportSuccess: false,
        benignError: [0, 401, 403, 404].includes(status),
        reportErrorPhase: currentPhase
      }));
      this.sendPageAction(pageActionName);
    }
  }, {
    key: "logHttpError",
    value: function logHttpError(err, request, requestDuration) {
      var requestUrl = request.url;
      var status = err.status,
          data = err.data,
          message = err.message,
          _err$options = err.options;
      _err$options = _err$options === void 0 ? {} : _err$options;
      var method = _err$options.method,
          _err$options$appInfo = _err$options.appInfo;
      _err$options$appInfo = _err$options$appInfo === void 0 ? {} : _err$options$appInfo;
      var name = _err$options$appInfo.name;
      this.addAttributes({
        requestSuccess: false,
        method: method,
        requestUrl: cleanRequestUrl(requestUrl),
        fullRequestUrl: requestUrl,
        status: status,
        errorResponse: data,
        appName: name,
        errorMessage: message,
        requestDuration: requestDuration
      });
      this.sendPageAction('ReportingHttpRequest');
    }
  }, {
    key: "logHttpSuccess",
    value: function logHttpSuccess(request, requestDuration) {
      var requestUrl = request.url;
      this.addAttributes({
        requestSuccess: true,
        requestUrl: cleanRequestUrl(requestUrl),
        fullRequestUrl: requestUrl,
        requestDuration: requestDuration
      });
      this.sendPageAction('ReportingHttpRequest');
    }
    /**
     * @param {string?} pageActionName - optional
     */

  }, {
    key: "logSuccess",
    value: function logSuccess(pageActionName) {
      this.addAttributes(Object.assign({}, measurePerformance(this.perf), {
        reportSuccess: true
      }));
      this.sendPageAction(pageActionName);
    }
  }, {
    key: "sendPageAction",
    value: function sendPageAction() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ReportingDataResolve';
      var isEnabled = window.newrelic && window.newrelic.setCurrentRouteName && window.newrelic.addPageAction && (this.enabled() || overrides.newrelic.enabled);

      if (isEnabled) {
        window.newrelic.addPageAction(name, this.attributes);
      }
    }
  }]);

  return NewRelicInteraction;
}();