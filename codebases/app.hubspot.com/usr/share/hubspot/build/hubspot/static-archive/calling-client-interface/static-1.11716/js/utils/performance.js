'use es6';

import enviro from 'enviro';
import once from 'transmute/once';
import { logPageAction } from 'calling-error-reporting/report/error';
import { CommunicatorLogger } from 'customer-data-tracking/callingTracker';
var CALLING_WIDGET_PERFORMANCE = 'CALLING_WIDGET_PERFORMANCE';
var shouldMeasurePerformance = once(function () {
  if (!window.performance) return false;
  return Math.random() < 0.25;
});
export var mark = function mark(name) {
  if (!shouldMeasurePerformance()) {
    return;
  }

  window.performance.mark("calling_" + name + "_start");
};
export var logPerformance = function logPerformance(_ref) {
  var measurement = _ref.measurement,
      providerName = _ref.providerName,
      _ref$key = _ref.key,
      key = _ref$key === void 0 ? CALLING_WIDGET_PERFORMANCE : _ref$key,
      _ref$extraData = _ref.extraData,
      extraData = _ref$extraData === void 0 ? {} : _ref$extraData;

  if (!shouldMeasurePerformance()) {
    return;
  }
  /* eslint-disable no-console */


  if (enviro.isProd()) {
    logPageAction({
      key: key,
      tags: Object.assign({
        measurement: measurement.name,
        duration: measurement.duration,
        providerName: providerName
      }, extraData)
    });
    CommunicatorLogger.log('callingExtensions_initialLoadTime', {
      action: measurement.name,
      source: 'communicator',
      duration: measurement.duration,
      provider_name: providerName,
      version: '2'
    });
  } else if (enviro.debug('calling-widget-performance') && typeof console.group === 'function') {
    console.groupCollapsed("%c Call Widget Performance%c " + measurement.name, "background-color:#00bda5;color:white;padding:.15em .25em", "color:#33475b");
    console.log("%c duration: %c" + measurement.duration, 'color:#99acc2', 'color:#33475b');

    if (extraData) {
      Object.keys(extraData).forEach(function (dataKey) {
        console.log("%c " + dataKey + ": %c" + extraData[dataKey], 'color:#99acc2', 'color:#33475b');
      });
    }

    console.groupEnd();
    /* eslint-enable no-console */
  }

  performance.clearMeasures(measurement.name);
};
export var measure = function measure(_ref2) {
  var name = _ref2.name,
      providerName = _ref2.providerName,
      _ref2$key = _ref2.key,
      key = _ref2$key === void 0 ? CALLING_WIDGET_PERFORMANCE : _ref2$key,
      _ref2$extraData = _ref2.extraData,
      extraData = _ref2$extraData === void 0 ? {} : _ref2$extraData;

  if (!shouldMeasurePerformance()) {
    return;
  }

  if (window.performance.getEntriesByName("calling_" + name + "_start").length === 0) {
    return;
  }

  window.performance.mark("calling_" + name + "_end");
  window.performance.measure(name, "calling_" + name + "_start", "calling_" + name + "_end");
  var measurement = window.performance.getEntriesByName(name)[0];
  logPerformance({
    measurement: measurement,
    key: key,
    extraData: extraData,
    providerName: providerName
  });
  performance.clearMarks("calling_" + measure.name + "_start");
  performance.clearMarks("calling_" + measure.name + "_end");
};