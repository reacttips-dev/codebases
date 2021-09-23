'use es6';

import { SUM, PERCENTILES } from '../../../../constants/metricTypes';

var zeroPercentConversion = function zeroPercentConversion(data) {
  return data.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket, index, entire) {
      var conversion = index + 1 < entire.size ? 0 : undefined;
      return bucket.setIn(['metrics', 'funnel.conversion', PERCENTILES], conversion).setIn(['metrics', 'funnel.stepwiseConversion', PERCENTILES], conversion).setIn(['metrics', 'funnel.cumulativeConversion', PERCENTILES], conversion);
    });
  }).setIn(['metrics', 'funnel.conversion', PERCENTILES], 0);
};

var netConversion = function netConversion(data) {
  return data.setIn(['metrics', 'funnel.conversion', PERCENTILES], data.getIn(['dimension', 'buckets']).size === 1 ? undefined : data.getIn(['dimension', 'buckets']).last().getIn(['metrics', 'count', SUM]) / data.getIn(['dimension', 'buckets', 0, 'metrics', 'count', SUM]));
};

var stepwiseConversion = function stepwiseConversion(data) {
  return data.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket, index, entire) {
      var count = bucket.getIn(['metrics', 'count', SUM]);
      var nextCount = entire.getIn([index + 1, 'metrics', 'count', SUM]);

      if (nextCount === undefined) {
        return bucket.setIn(['metrics', 'funnel.conversion', PERCENTILES], undefined).setIn(['metrics', 'funnel.stepwiseConversion', PERCENTILES], undefined);
      } else {
        var ratio = count === 0 ? 0 : nextCount / count;
        return bucket.setIn(['metrics', 'funnel.conversion', PERCENTILES], ratio).setIn(['metrics', 'funnel.stepwiseConversion', PERCENTILES], ratio);
      }
    });
  });
};

var cumulativeConversion = function cumulativeConversion(data) {
  return data.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket, index, entire) {
      return bucket.setIn(['metrics', 'funnel.cumulativeConversion', PERCENTILES], index + 1 < entire.size ? buckets.getIn([index + 1, 'metrics', 'count', SUM], 0) / data.getIn(['dimension', 'buckets', 0, 'metrics', 'count', SUM], 0) : undefined);
    });
  });
};

export var calculate = function calculate(data) {
  return data.getIn(['dimension', 'buckets', 0, 'metrics', 'count', SUM], 0) === 0 ? zeroPercentConversion(data) : cumulativeConversion(stepwiseConversion(netConversion(data)));
};