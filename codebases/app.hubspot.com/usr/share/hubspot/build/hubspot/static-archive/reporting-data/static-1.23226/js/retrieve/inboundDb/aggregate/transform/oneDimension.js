'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import getBucketMetrics from './bucketMetrics';
import normalizeProperty from '../../common/normalizeProperty';
export default (function (config, response) {
  var dimension = config.getIn(['dimensions', 0]);
  var aggregations = response.getIn(['aggregations', dimension], List());
  return ImmutableMap({
    dimension: ImmutableMap({
      property: dimension,
      buckets: aggregations.map(function (breakdown) {
        return ImmutableMap({
          key: normalizeProperty(breakdown.get('key'), dimension),
          metrics: getBucketMetrics(config, breakdown)
        });
      })
    }),
    metrics: getBucketMetrics(config, response),
    total: aggregations.count() || 0
  });
});