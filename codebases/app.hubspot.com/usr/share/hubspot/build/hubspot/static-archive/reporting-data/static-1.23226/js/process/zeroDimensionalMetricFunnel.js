'use es6';

import { fromJS, List } from 'immutable';
import { toMetricKey } from '../v2/dataset/datasetMetrics';
export var ZERO_DIMENSIONAL_METRIC_FUNNEL_DIMENSION = 'funnelStage';
export var ZERO_DIMENSIONAL_METRIC_FUNNEL_METRIC = toMetricKey({
  property: 'count'
});

var reshapeDataset = function reshapeDataset(_ref) {
  var dataset = _ref.dataset,
      dataConfig = _ref.dataConfig;

  if (!dataConfig.get('dimensions', List()).isEmpty()) {
    return dataset;
  }

  return fromJS({
    total: dataset.get('metrics').count(),
    dimension: {
      property: ZERO_DIMENSIONAL_METRIC_FUNNEL_DIMENSION,
      buckets: dataset.get('metrics').map(function (metric, key, entire) {
        var metricIndex = dataConfig.get('metrics').findIndex(function (m) {
          return m.get('property') === key;
        });
        var nextMetric = entire.get(dataConfig.getIn(['metrics', metricIndex + 1, 'property']));
        var currentValue = metric.first();
        var nextValue = nextMetric && nextMetric.first();
        var conversionValue = nextValue && nextValue / currentValue;
        return fromJS({
          key: key,
          metrics: {
            count: metric,
            'funnel.stepwiseConversion': {
              PERCENTILES: conversionValue
            }
          }
        });
      }).toList()
    }
  });
};

export default (function (props) {
  return Promise.resolve(reshapeDataset(props));
});