'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _processors;

import { Map as ImmutableMap, List } from 'immutable';
import { SUM, MIN, MAX, AVG } from '../../constants/metricTypes';
var COUNT = 'count';

var sum = function sum(metrics, property) {
  return metrics.reduce(function (processed, metric) {
    return processed + metric.getIn([property, SUM], 0);
  }, 0);
};

var min = function min(metrics, property) {
  return metrics.reduce(function (processed, metric) {
    return Math.min(processed, metric.getIn([property, MIN], Infinity));
  }, Infinity);
};

var max = function max(metrics, property) {
  return metrics.reduce(function (processed, metric) {
    return Math.max(processed, metric.getIn([property, MAX], 0));
  }, 0);
};

var avg = function avg(metrics, property) {
  return metrics.reduce(function (processed, metric) {
    return processed + metric.getIn([property, AVG]) * metric.getIn([COUNT, SUM], 0);
  }, 0) / sum(metrics, COUNT);
};

var processors = (_processors = {}, _defineProperty(_processors, SUM, sum), _defineProperty(_processors, MIN, min), _defineProperty(_processors, MAX, max), _defineProperty(_processors, AVG, avg), _processors);
export default (function (groupBy) {
  return function (config, dataset) {
    return dataset.updateIn(['dimension', 'buckets'], function (buckets) {
      return buckets.reduce(function (grouped, bucket) {
        return grouped.update(groupBy(bucket), function () {
          var group = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap({
            key: groupBy(bucket)
          });
          return bucket.has('dimension') ? // group subaggregations
          group.update('dimension', function (dimension) {
            return dimension ? dimension.update('buckets', function (inner) {
              return inner.concat(bucket.getIn(['dimension', 'buckets']));
            }) : bucket.get('dimension');
          }) : // group aggregations
          group.update('metrics', function () {
            var metrics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
            return metrics.push(bucket.get('metrics'));
          });
        });
      }, ImmutableMap()).map(function (bucket) {
        return bucket.has('dimension') ? // group subaggregations
        bucket.updateIn(['dimension', 'buckets'], function (points) {
          return points.reduce(function (memo, point) {
            return memo.update(point.get('key'), function () {
              var grouped = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
              return grouped.push(point.get('metrics'));
            });
          }, ImmutableMap()).map(function (point) {
            return config.get('metrics').map(function (metric) {
              return metric.toJS();
            }).reduce(function (processed, _ref) {
              var property = _ref.property,
                  metricTypes = _ref.metricTypes;
              return metricTypes.reduce(function (memo, metricType) {
                return {}.hasOwnProperty.call(processors, metricType) ? memo.setIn([property, metricType], processors[metricType](point, property)) : memo;
              }, processed);
            }, ImmutableMap());
          }).reduce(function (memo, point, key) {
            return memo.push(ImmutableMap({
              key: key,
              metrics: point
            }));
          }, List());
        }) : // group aggregations
        bucket.update('metrics', function (grouped) {
          return config.get('metrics').map(function (metric) {
            return metric.toJS();
          }).reduce(function (processed, _ref2) {
            var property = _ref2.property,
                metricTypes = _ref2.metricTypes;
            return metricTypes.reduce(function (memo, metricType) {
              return {}.hasOwnProperty.call(processors, metricType) ? memo.setIn([property, metricType], processors[metricType](grouped, property)) : memo;
            }, processed);
          }, ImmutableMap());
        });
      }).toList();
    });
  };
});