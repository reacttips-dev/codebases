'use es6';

var calculated = function calculated(breakdown) {
  var _breakdown$searchResu = breakdown.searchResultsFounds,
      searchResultsFounds = _breakdown$searchResu === void 0 ? 0 : _breakdown$searchResu;
  return Object.assign({}, breakdown, {
    hasResults: searchResultsFounds > 0
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