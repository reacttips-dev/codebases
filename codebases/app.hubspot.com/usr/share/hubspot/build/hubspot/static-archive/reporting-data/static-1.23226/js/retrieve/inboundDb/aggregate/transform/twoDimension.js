'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import getBucketMetrics from './bucketMetrics';
import normalizeProperty from '../../common/normalizeProperty';
export default (function (config, response) {
  var firstDimension = config.getIn(['dimensions', 0]);
  var secondDimension = config.getIn(['dimensions', 1]);
  var aggregations = response.getIn(['aggregations', firstDimension], List());
  return ImmutableMap({
    dimension: ImmutableMap({
      property: firstDimension,
      buckets: aggregations.map(function (breakdown) {
        return ImmutableMap({
          key: normalizeProperty(breakdown.get('key'), firstDimension),
          metrics: getBucketMetrics(config, breakdown),
          dimension: ImmutableMap({
            property: secondDimension,
            buckets: breakdown.getIn(['aggregations', secondDimension], List()).map(function (innerBreakdown) {
              return ImmutableMap({
                key: normalizeProperty(innerBreakdown.get('key'), secondDimension),
                metrics: getBucketMetrics(config, innerBreakdown)
              });
            })
          })
        });
      })
    }),
    metrics: getBucketMetrics(config, response),
    total: aggregations.count() || 0
  });
});