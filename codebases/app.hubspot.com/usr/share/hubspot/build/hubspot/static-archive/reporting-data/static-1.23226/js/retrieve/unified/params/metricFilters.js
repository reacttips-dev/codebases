'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import * as Operators from '../../../constants/operators';
export var get = function get(spec, config) {
  var _config$filters = config.filters;
  _config$filters = _config$filters === void 0 ? {} : _config$filters;
  var _config$filters$custo = _config$filters.custom,
      custom = _config$filters$custo === void 0 ? [] : _config$filters$custo;
  var _spec$metrics = spec.metrics,
      metrics = _spec$metrics === void 0 ? {} : _spec$metrics;
  var properties = Object.keys(metrics);

  var mapFilterToParams = function mapFilterToParams(_ref) {
    var _ref2;

    var operator = _ref.operator,
        property = _ref.property,
        value = _ref.value,
        highValue = _ref.highValue,
        values = _ref.values;

    if (!properties.includes(property)) {
      return {};
    }

    var valuesList = value !== null && value !== undefined ? [value] : values;

    switch (operator) {
      case Operators.NEQ:
      case Operators.HAS_PROPERTY:
      case Operators.NOT_HAS_PROPERTY:
        return {};

      case Operators.BETWEEN:
        return _ref2 = {}, _defineProperty(_ref2, "metric-" + property + "-min", value), _defineProperty(_ref2, "metric-" + property + "-max", highValue), _ref2;

      case Operators.GT:
      case Operators.GTE:
        return _defineProperty({}, "metric-" + property + "-min", valuesList);

      case Operators.LT:
      case Operators.LTE:
        return _defineProperty({}, "metric-" + property + "-max", valuesList);

      default:
        return _defineProperty({}, "metric-" + property, valuesList);
    }
  };

  var filters = custom.reduce(function (acc, filter) {
    return Object.assign({}, acc, {}, mapFilterToParams(filter));
  }, {});
  return Object.assign({}, filters);
};