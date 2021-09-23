'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap, List } from 'immutable';
import { SUM, MIN, MAX, AVG, COUNT, PERCENTILES } from '../constants/metricTypes';
var COMBINE = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, SUM, function (a, b) {
  return a.get(SUM, 0) + b.get(SUM, 0);
}), _defineProperty(_ImmutableMap, MIN, function (a, b) {
  return Math.min(a.get(MIN, 0), b.get(MIN, 0));
}), _defineProperty(_ImmutableMap, MAX, function (a, b) {
  return Math.max(a.get(MAX, 0), b.get(MAX, 0));
}), _defineProperty(_ImmutableMap, AVG, function () {
  return null;
}), _defineProperty(_ImmutableMap, COUNT, function (a, b) {
  return a.get(SUM, 0) + b.get(SUM, 0);
}), _defineProperty(_ImmutableMap, PERCENTILES, function () {
  return null;
}), _ImmutableMap));
/* Combines values of sum from both metrics */

export var combineMetrics = function combineMetrics() {
  var metricA = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var metricB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  return metricA.merge(metricB).filter(function (_, type) {
    return COMBINE.has(type);
  }).map(function (_, type) {
    return COMBINE.get(type)(metricA, metricB);
  });
};
/* Combines all properties of two Metrics objects */

export var merge = function merge() {
  var metricsA = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
  var metricsB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableMap();
  return metricsA.merge(metricsB).map(function (_, property) {
    return combineMetrics(metricsA.get(property, ImmutableMap()), metricsB.get(property, ImmutableMap()));
  });
};
export var summarize = function summarize(bucket) {
  if (!bucket.has('dimension')) {
    return bucket;
  }

  var updatedBucket = bucket.updateIn(['dimension', 'buckets'], List(), function (buckets) {
    return buckets.map(summarize);
  });
  var childMetrics = updatedBucket.getIn(['dimension', 'buckets'], List()).map(function (updated) {
    return updated.get('metrics', ImmutableMap());
  });
  return updatedBucket.update('metrics', function (metrics) {
    return metrics && !metrics.isEmpty() ? metrics : childMetrics.reduce(merge, ImmutableMap());
  });
};