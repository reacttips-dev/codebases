'use es6';

var computeTotals = function computeTotals(response) {
  var _response$breakdowns = response.breakdowns,
      breakdowns = _response$breakdowns === void 0 ? [] : _response$breakdowns,
      totals = response.totals;
  var mobileBucket = breakdowns.find(function (_ref) {
    var breakdown = _ref.breakdown;
    return breakdown === 'MOBILE';
  });
  var mobileSessionRate = mobileBucket ? mobileBucket.visits / totals.visits : undefined;
  return Object.assign({}, totals, {
    mobileSessionRate: mobileSessionRate
  });
};

export var preprocess = function preprocess(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions,
        dimensions = _config$dimensions === void 0 ? [] : _config$dimensions;

    if (dimensions.length === 0) {
      return Object.assign({}, response, {
        totals: computeTotals(response)
      });
    }

    return response;
  };
};