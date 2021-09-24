'use es6';

import { fromJS } from 'immutable';
import { PERCENTILES } from '../constants/metricTypes';
export var injectCombination = function injectCombination(primaryDataset, comboDataset, comboMetric) {
  var comboBuckets = comboDataset.getIn(['dimension', 'buckets']).reduce(function (bucketObj, curr) {
    return bucketObj.set(curr.get('key'), curr);
  }, fromJS({}));
  return primaryDataset.updateIn(['dimension', 'buckets'], function (primaryBuckets) {
    return primaryBuckets.map(function (bucket) {
      return bucket.setIn(['metrics', comboMetric, PERCENTILES], comboBuckets.getIn([bucket.get('key'), 'metrics', comboMetric, PERCENTILES]));
    });
  });
};