'use es6';

export var get = function get(spec, config) {
  var d0 = spec.d0,
      d1 = spec.d1,
      d2 = spec.d2;
  var _config$dimensions = config.dimensions,
      dimensions = _config$dimensions === void 0 ? [] : _config$dimensions,
      _config$filters = config.filters;
  _config$filters = _config$filters === void 0 ? {} : _config$filters;
  var _config$filters$custo = _config$filters.custom,
      custom = _config$filters$custo === void 0 ? [] : _config$filters$custo;
  var dimensionality = dimensions.length;
  var drilldown = custom.some(function (_ref) {
    var property = _ref.property;
    return property === 'd2';
  }) ? d2 : custom.some(function (_ref2) {
    var property = _ref2.property;
    return property === 'd1';
  }) ? d1 : d0;
  return {
    drilldown: drilldown,
    dimensionality: dimensionality
  };
};