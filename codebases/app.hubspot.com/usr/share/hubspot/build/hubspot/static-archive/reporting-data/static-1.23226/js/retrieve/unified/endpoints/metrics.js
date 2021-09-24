'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var pairs = function pairs(_ref) {
  var _ref$metrics = _ref.metrics,
      metrics = _ref$metrics === void 0 ? [] : _ref$metrics;
  return metrics.reduce(function (memo, _ref2) {
    var property = _ref2.property,
        _ref2$metricTypes = _slicedToArray(_ref2.metricTypes, 1),
        metricType = _ref2$metricTypes[0];

    return [].concat(_toConsumableArray(memo), [[property, metricType]]);
  }, []);
};