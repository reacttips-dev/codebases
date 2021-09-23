'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
var HALF_PERCENT = 0.5;
var THRESHOLD = 200;

var parseBreakdown = function parseBreakdown(_ref) {
  var breakdown = _ref.breakdown;
  return Number(breakdown) + 1;
};

var bySegment = function bySegment(a, b) {
  return parseBreakdown(a) - parseBreakdown(b);
};

var labelDuration = function labelDuration(breakdown) {
  var padding = 2;
  var duration = parseBreakdown(breakdown);
  var seconds = ("00" + duration % 60).slice(-padding);
  var minutes = ("00" + Math.floor(duration / 60)).slice(-padding);
  return minutes + ":" + seconds;
};

var labelPercent = function labelPercent(breakdown) {
  var slice = parseBreakdown(breakdown);
  return I18n.formatPercentage(slice * HALF_PERCENT, {
    precision: 2
  });
};

export var preprocess = function preprocess() {
  return function (response) {
    var breakdowns = response.breakdowns;

    if (breakdowns) {
      var label = breakdowns.length < THRESHOLD ? labelDuration : labelPercent;
      var sorted = breakdowns.sort(bySegment);
      var labeled = sorted.map(function (point) {
        return Object.assign({}, point, {
          breakdown: label(point)
        });
      });
      var firstBreakdown = sorted[0];
      var realFirstBreakdown = Object.assign({}, firstBreakdown, {
        breakdown: label({
          breakdown: -1
        })
      });
      return Object.assign({}, response, {
        breakdowns: [realFirstBreakdown].concat(_toConsumableArray(labeled))
      });
    }

    return response;
  };
};