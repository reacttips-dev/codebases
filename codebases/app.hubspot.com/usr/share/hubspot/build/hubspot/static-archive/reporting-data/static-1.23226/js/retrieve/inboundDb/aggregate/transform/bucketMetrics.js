'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Map as ImmutableMap, OrderedMap } from 'immutable';
import { SUM } from '../../../../constants/metricTypes';
import * as dealprogress from '../../../../configure/bucket/dealprogress';
import { metricToCamelCase } from '../../../../lib/metricToCamelCase';
var COUNT = 'count';

var hasBucketProcessor = function hasBucketProcessor(processors) {
  return processors.includes(dealprogress.PROCESSOR);
};

export default (function (config, breakdown) {
  var metrics = config.get('metrics');
  var initial = hasBucketProcessor(config.get('processors')) ? OrderedMap(_defineProperty({}, COUNT, ImmutableMap(_defineProperty({}, SUM, breakdown.get(COUNT))))) : OrderedMap(); // there may be extra metrics returned in the response
  // so only copy over the metrics that were requested

  return metrics.reduce(function (bucketMetrics, metric) {
    var metricProperty = metric.get('property');
    return metric.get('metricTypes').reduce(function (memo, metricType) {
      var key = metricToCamelCase(metricType);
      var value = metricProperty === COUNT ? breakdown.get(COUNT) : breakdown.getIn(['metrics', metricProperty, key], null);
      return memo.setIn([metricProperty, metricType], isNaN(value) ? 0 : value);
    }, bucketMetrics);
  }, initial);
});