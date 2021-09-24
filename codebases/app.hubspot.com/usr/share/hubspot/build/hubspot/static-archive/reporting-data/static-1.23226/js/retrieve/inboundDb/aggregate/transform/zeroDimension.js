'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { DURATION, NUMBER, PERCENT, CURRENCY } from '../../../../constants/property-types';
import { metricToCamelCase } from '../../../../lib/metricToCamelCase';

var getValue = function getValue(response, property, type) {
  var responseValue = response.getIn(['metrics', property.get('name'), metricToCamelCase(type)]);

  if ([DURATION, NUMBER, PERCENT, CURRENCY].includes(property.get('type')) && isNaN(responseValue)) {
    return 0;
  }

  return responseValue;
};

export default (function (config, response, properties) {
  var metrics = config.get('metrics', List());
  return ImmutableMap({
    total: response.get('count'),
    metrics: metrics.reduce(function (buckets, metric) {
      return metric.get('metricTypes', List()).reduce(function (transformed, type) {
        var property = metric.get('property');
        return transformed.setIn([property, type], property === 'count' ? response.get('count') : getValue(response, properties.get(property), type));
      }, buckets);
    }, ImmutableMap())
  });
});