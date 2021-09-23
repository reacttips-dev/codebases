'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { DURATION } from '../constants/property-types';
var SMALL_SCALE_MS_THRESHOLD = 2000;

var checkV1Data = function checkV1Data(data, property, metricType) {
  return data.has('dimension') ? data.getIn(['dimension', 'buckets'], List()).every(function (bucket) {
    return checkV1Data(bucket, property, metricType);
  }) : Math.abs(data.getIn(['metrics', property, metricType], 0)) < SMALL_SCALE_MS_THRESHOLD;
};

export var shouldBeSmallScaleV1 = function shouldBeSmallScaleV1(dataset, config, properties) {
  var metrics = config.get('metrics').reduce(function (acc, metric) {
    return acc.update(metric.get('property'), function (types) {
      return types ? types.concat(metric.get('metricTypes')) : List(metric.get('metricTypes'));
    });
  }, ImmutableMap());
  return metrics.map(function (types, property) {
    return types.reduce(function (acc, type) {
      return acc.set(type, properties.getIn([config.get('dataType'), property, 'type']) === DURATION ? checkV1Data(dataset, property, type) : false);
    }, ImmutableMap());
  });
};
export var shouldBeSmallScale = function shouldBeSmallScale(dataset, metrics) {
  return metrics.reduce(function (acc, metric) {
    return acc.set(metric, dataset.getIn(['properties', metric, 'type']) === DURATION && dataset.get('data', List()).every(function (row) {
      return Math.abs(row.get(metric)) < SMALL_SCALE_MS_THRESHOLD;
    }));
  }, ImmutableMap());
};