'use es6';

var calculated = function calculated(breakdown) {
  var _breakdown$ampViews = breakdown.ampViews,
      ampViews = _breakdown$ampViews === void 0 ? 0 : _breakdown$ampViews,
      _breakdown$rawViews = breakdown.rawViews,
      rawViews = _breakdown$rawViews === void 0 ? 0 : _breakdown$rawViews;
  return Object.assign({}, breakdown, {
    standardViews: rawViews - ampViews
  });
};

export var preprocess = function preprocess() {
  return function (response) {
    var breakdowns = response.breakdowns,
        totals = response.totals;

    if (breakdowns && totals) {
      return Object.assign({}, response, {
        breakdowns: breakdowns.map(calculated),
        totals: calculated(totals)
      });
    }

    return response;
  };
};