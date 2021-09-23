'use es6';

import { Map as ImmutableMap } from 'immutable';

var toUniqueMetrics = function toUniqueMetrics(metrics) {
  return metrics.reduce(function (uniqueMetrics, metric) {
    return uniqueMetrics.update(metric.get('property'), function (uniqueMetric) {
      return uniqueMetric ? uniqueMetric.update('metricTypes', function (uniqueTypes) {
        return uniqueTypes.concat(metric.get('metricTypes').filter(function (type) {
          return !uniqueTypes.includes(type);
        }));
      }) : metric;
    });
  }, ImmutableMap());
};

export var countUniqueMetrics = function countUniqueMetrics(metrics) {
  return toUniqueMetrics(metrics).reduce(function (sumOfMetrics, metric) {
    return sumOfMetrics + metric.get('metricTypes').count();
  }, 0);
};