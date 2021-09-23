'use es6';

import { List, is } from 'immutable';
import { Promise } from '../../lib/promise';
import { SUM } from '../../constants/metricTypes';
var PROPERTY = 'count';
var METRIC_TYPES = List.of(SUM);
export var configure = function configure(config) {
  var metrics = config.get('metrics') || List();
  var index = metrics.findIndex(function (metric) {
    return metric.get('property') === PROPERTY && !is(metric.get('metricTypes'), METRIC_TYPES);
  });
  return Promise.resolve(index >= 0 ? config.updateIn(['metrics', index], function (metric) {
    return metric.set('metricTypes', METRIC_TYPES);
  }) : config);
};