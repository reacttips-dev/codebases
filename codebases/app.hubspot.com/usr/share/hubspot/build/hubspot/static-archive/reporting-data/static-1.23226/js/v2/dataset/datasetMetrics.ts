import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var METRIC_DELIMITER = '|';
export var DEFAULT_METRIC_TYPE = 'SUM';
export var isMetricWithType = function isMetricWithType(possibleMetric) {
  return possibleMetric.includes(METRIC_DELIMITER);
};
export var toMetricKey = function toMetricKey(_ref) {
  var property = _ref.property,
      _ref$type = _ref.type,
      type = _ref$type === void 0 ? DEFAULT_METRIC_TYPE : _ref$type;
  return [type, property].join(METRIC_DELIMITER);
};
export var fromMetricKey = function fromMetricKey() {
  var metric = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var _metric$split$filter = metric.split(METRIC_DELIMITER).filter(function (str) {
    return str !== '';
  }),
      _metric$split$filter2 = _slicedToArray(_metric$split$filter, 2),
      first = _metric$split$filter2[0],
      second = _metric$split$filter2[1];

  return second ? {
    property: second,
    type: first
  } : {
    property: first,
    type: DEFAULT_METRIC_TYPE
  };
};