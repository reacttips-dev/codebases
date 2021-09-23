'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";

var sortDatasetMetrics = function sortDatasetMetrics(dataset, comparator) {
  dataset = dataset.get('metrics') ? dataset.update('metrics', function (metrics) {
    return metrics.sortBy(function (value, key) {
      return key;
    }, comparator);
  }) : dataset;
  return dataset.get('dimension') ? dataset.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket) {
      return sortDatasetMetrics(bucket, comparator);
    });
  }) : dataset;
};

export var orderMetrics = function orderMetrics(config, dataset) {
  var ordering = config.get('metrics').toOrderedMap().mapEntries(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        index = _ref2[0],
        metric = _ref2[1];

    return [metric.get('property'), index];
  });

  var comparator = function comparator(a, b) {
    return ordering.get(a) - ordering.get(b);
  };

  return sortDatasetMetrics(dataset, comparator);
};