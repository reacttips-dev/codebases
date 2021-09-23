'use es6';

import { List } from 'immutable';
import { Promise } from '../../lib/promise';
import { SUM } from '../../constants/metricTypes';
var METRIC_TYPES = List.of(SUM);
export var configure = function configure(config) {
  return Promise.resolve(config.has('metrics') ? config.update('metrics', function () {
    var metrics = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : List();
    return metrics.map(function (metric) {
      return metric.get('metricTypes', List()).isEmpty() ? metric.set('metricTypes', METRIC_TYPES) : metric;
    });
  }) : config);
};