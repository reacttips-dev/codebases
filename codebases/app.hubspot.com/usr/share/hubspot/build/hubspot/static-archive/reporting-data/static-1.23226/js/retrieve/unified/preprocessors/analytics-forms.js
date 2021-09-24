'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var calculated = function calculated() {
  var breakdown = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _breakdown$submission = breakdown.submissions,
      submissions = _breakdown$submission === void 0 ? 0 : _breakdown$submission,
      _breakdown$formViews = breakdown.formViews,
      formViews = _breakdown$formViews === void 0 ? 0 : _breakdown$formViews,
      _breakdown$visibles = breakdown.visibles,
      visibles = _breakdown$visibles === void 0 ? 0 : _breakdown$visibles,
      submissionsPerFormView = breakdown.submissionsPerFormView;
  return Object.assign({}, breakdown, {
    submissionsPerFormView: submissionsPerFormView <= 1 ? submissionsPerFormView : undefined,
    conversionRate: submissions && formViews ? submissions / formViews : 0,
    clickThroughRate: visibles && formViews ? visibles / formViews : 0,
    formConversionRate: submissions && visibles ? submissions / visibles : 0
  });
};

var breakdown = function breakdown(response) {
  return Object.assign({}, response, {
    totals: calculated(response.totals || {}),
    breakdowns: (response.breakdowns || []).map(calculated)
  });
};

var points = function points(response) {
  return Object.keys(response).reduce(function (recalculated, date) {
    return Object.assign({}, recalculated, _defineProperty({}, date, response[date].map(calculated)));
  }, {});
};

export var preprocess = function preprocess(spec, config) {
  return function (response) {
    var _config$dimensions = config.dimensions;
    _config$dimensions = _config$dimensions === void 0 ? [] : _config$dimensions;

    var _config$dimensions2 = _slicedToArray(_config$dimensions, 1),
        primary = _config$dimensions2[0];

    return primary === 'sessionDate' ? points(response) : breakdown(response);
  };
};