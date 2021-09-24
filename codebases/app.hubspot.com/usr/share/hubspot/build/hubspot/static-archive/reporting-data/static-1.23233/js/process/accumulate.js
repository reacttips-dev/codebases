'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { TIME_SERIES } from '../constants/configTypes';
import { SUM, COUNT } from '../constants/metricTypes';

var getSize = function getSize(config, property) {
  return config.get(property, List()).size || config.get(property, []).length;
};

var validate = function validate(config) {
  var configType = config.get('configType');

  if (configType !== TIME_SERIES) {
    console.error('accumulate only supported for configType TIME_SERIES but %s was found', configType);
    return false;
  }

  var dimensionsSize = getSize(config, 'dimensions');
  var metricSize = getSize(config, 'metrics');

  if (!(dimensionsSize === 1 || metricSize === 1)) {
    console.error('accumulate not supported for %s-dimensional data with %s metrics', dimensionsSize, metricSize);
    return false;
  }

  return true;
};

var hasValidMetric = function hasValidMetric(metric, key) {
  return (key === SUM || key === COUNT) && typeof metric.get(key) === 'number';
};

var accumulate = function accumulate(data) {
  return data.updateIn(['dimension', 'buckets'], function () {
    var buckets = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableMap();
    var accumulated = ImmutableMap();
    return buckets.map(function (bucket) {
      if (bucket.has('dimension')) {
        /*
          data has 2 dimensions, 1 metric
          accumulate using sub-dimension as key
        */
        return bucket.updateIn(['dimension', 'buckets'], function (subBuckets) {
          return subBuckets.map(function (subBucket) {
            var key = subBucket.get('key');
            return subBucket.update('metrics', function (metrics) {
              return metrics.map(function (metric) {
                var metricType = metric.keySeq().first();
                return hasValidMetric(metric, metricType) ? metric.update(metricType, function (value) {
                  if (accumulated.has(key)) {
                    var sum = accumulated.get(key) + value;
                    accumulated = accumulated.set(key, sum);
                    return sum;
                  } else {
                    accumulated = accumulated.set(key, value);
                    return value;
                  }
                }) : metric;
              });
            });
          });
        });
      } else {
        /*
          data has 1 dimension, 1 or more metrics
          accumulate using metric as key
        */
        return bucket.update('metrics', function (metrics) {
          return metrics.map(function (metric, key) {
            var metricType = metric.keySeq().first();
            return hasValidMetric(metric, metricType) ? metric.update(metricType, function (value) {
              if (accumulated.has(key)) {
                var sum = accumulated.get(key) + value;
                accumulated = accumulated.set(key, sum);
                return sum;
              } else {
                accumulated = accumulated.set(key, value);
                return value;
              }
            }) : metric;
          });
        });
      }
    });
  });
};

export default (function (_ref) {
  var dataConfig = _ref.dataConfig,
      dataset = _ref.dataset;
  return validate(dataConfig) ? accumulate(dataset) : dataset;
});