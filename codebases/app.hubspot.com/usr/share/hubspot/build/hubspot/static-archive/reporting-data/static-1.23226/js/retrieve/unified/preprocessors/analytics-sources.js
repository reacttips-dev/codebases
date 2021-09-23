'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var computeCalculatedMetrics = function computeCalculatedMetrics() {
  var breakdown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _breakdown$visits = breakdown.visits,
      visits = _breakdown$visits === void 0 ? 0 : _breakdown$visits,
      _breakdown$visitors = breakdown.visitors,
      visitors = _breakdown$visitors === void 0 ? 0 : _breakdown$visitors;
  return Object.assign({}, breakdown, {
    returningVisits: visits - visitors // (visitors means new visits)

  });
};

var calculateForBreakdown = function calculateForBreakdown(response) {
  return Object.assign({}, response, {
    totals: computeCalculatedMetrics(response.totals || {}),
    breakdowns: (response.breakdowns || []).map(computeCalculatedMetrics)
  });
};

var calculateForPoints = function calculateForPoints(response) {
  return Object.keys(response).reduce(function (recalculated, date) {
    return Object.assign({}, recalculated, _defineProperty({}, date, response[date].map(computeCalculatedMetrics)));
  }, {});
};

export var preprocess = function preprocess(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions;
    _config$dimensions = _config$dimensions === void 0 ? [] : _config$dimensions;

    var _config$dimensions2 = _slicedToArray(_config$dimensions, 1),
        primaryDimension = _config$dimensions2[0];

    return primaryDimension === 'sessionDate' ? calculateForPoints(response) : calculateForBreakdown(response);
  };
};