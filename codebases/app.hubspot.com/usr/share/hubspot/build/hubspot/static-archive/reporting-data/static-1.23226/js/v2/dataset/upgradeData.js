'use es6';
/* This is very early wip converting logic to sample v2 datasets */

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { List, Map as ImmutableMap } from 'immutable';
import { toMetricKey } from './datasetMetrics';
var METRICS_TO_FLATTEN = ['associatedcompanyid', 'associations.company', 'associations.contact'];

var upgradeMetric = function upgradeMetric(types, key, pluck) {
  return types.mapKeys(function (type) {
    return toMetricKey({
      property: key,
      type: type
    });
  }).map(function (value) {
    return pluck(value);
  });
};

var upgradeMetrics = function upgradeMetrics(metrics) {
  var pluck = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (metric) {
    return metric.get('raw');
  };
  return metrics.toMap().flatMap(function (types, key) {
    return upgradeMetric(types, key, METRICS_TO_FLATTEN.includes(key) ? function (metric) {
      var rawValue = pluck(metric);
      return List.isList(rawValue) && rawValue.count() === 1 ? rawValue.first() : rawValue;
    } : pluck);
  });
};

var upgradeBucket = function upgradeBucket(bucket) {
  var dimension = bucket.get('dimension');

  if (dimension && dimension.get('buckets')) {
    var name = dimension.get('property');
    var rows = dimension.get('buckets').toList().flatMap(function (innerBucket) {
      var value = innerBucket.get('key');
      var baseRow = ImmutableMap(_defineProperty({}, name, value));
      var childRows = upgradeBucket(innerBucket);
      return childRows.map(function (row) {
        return baseRow.merge(row);
      });
    });
    return rows;
  }

  return List.of(upgradeMetrics(bucket.get('metrics', ImmutableMap())));
};

export var upgradeData = function upgradeData(oldDataset) {
  return upgradeBucket(oldDataset);
};