'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import * as Operators from '../../../constants/operators';
import * as depth from '../depth';
import I18n from 'I18n';
export var get = function get(spec, config) {
  var _config$filters = config.filters;
  _config$filters = _config$filters === void 0 ? {} : _config$filters;
  var _config$filters$custo = _config$filters.custom,
      custom = _config$filters$custo === void 0 ? [] : _config$filters$custo,
      _config$metrics = config.metrics,
      metrics = _config$metrics === void 0 ? [] : _config$metrics,
      _config$sort = config.sort,
      sort = _config$sort === void 0 ? [] : _config$sort;
  var _spec$metadata = spec.metadata,
      metadata = _spec$metadata === void 0 ? {} : _spec$metadata;
  var properties = Object.keys(metadata);

  if (properties.length === 0) {
    return {
      useForeignIndex: false
    };
  }

  var _depth$get = depth.get(spec, config),
      _depth$get$drilldown = _depth$get.drilldown,
      drilldown = _depth$get$drilldown === void 0 ? {} : _depth$get$drilldown;

  var reducer = function reducer(foreign, _ref) {
    var property = _ref.property;
    return foreign || properties.includes(property);
  };

  var required = [sort, metrics, custom].reduce(function (memo, list) {
    return memo || list.reduce(reducer, false);
  }, drilldown.metadata != null);

  if (!required) {
    return {
      useForeignIndex: false
    };
  }

  var type = function type(property) {
    return typeof metadata[property] === 'string' ? metadata[property] : 'enumeration';
  };

  var fixDateValues = function fixDateValues(property) {
    return function (value) {
      return type(property) === 'datetime' ? I18n.moment(value).format('x') : value;
    };
  };

  var mapFilterToParams = function mapFilterToParams(_ref2) {
    var _ref3;

    var operator = _ref2.operator,
        property = _ref2.property,
        filterValues = _objectWithoutProperties(_ref2, ["operator", "property"]);

    if (!properties.includes(property)) {
      return {};
    }

    var formatValue = fixDateValues(property);
    var value = formatValue(filterValues.value);
    var highValue = formatValue(filterValues.highValue);
    var values = filterValues.values && filterValues.values.map(formatValue);
    var valuesList = value !== null && value !== undefined ? [value] : values;

    switch (operator) {
      case Operators.BETWEEN:
        return _ref3 = {}, _defineProperty(_ref3, "metadata-" + property + "-min", value), _defineProperty(_ref3, "metadata-" + property + "-max", highValue), _ref3;

      case Operators.GT:
      case Operators.GTE:
        return _defineProperty({}, "metadata-" + property + "-min", valuesList);

      case Operators.LT:
      case Operators.LTE:
        return _defineProperty({}, "metadata-" + property + "-max", valuesList);

      default:
        return type(property) === 'string' ? _defineProperty({}, "metadata-" + property + "-contains", valuesList) : _defineProperty({}, "metadata-" + property, valuesList);
    }
  };

  var filters = custom.reduce(function (acc, filter) {
    return Object.assign({}, acc, {}, mapFilterToParams(filter));
  }, {});
  return Object.assign({
    useForeignIndex: true
  }, filters);
};