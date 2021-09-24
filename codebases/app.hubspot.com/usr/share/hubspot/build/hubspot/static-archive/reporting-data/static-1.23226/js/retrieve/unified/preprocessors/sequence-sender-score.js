'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { fromJS } from 'immutable';
import { getFilterByProperty } from '../../../config/filters/functions';

var replyRateScore = function replyRateScore(breakdown) {
  if (breakdown.repliesPerCompletionsAndUnenrolls > 0.13) {
    return 3;
  } else if (breakdown.repliesPerCompletionsAndUnenrolls > 0.07) {
    return 2;
  } else {
    // Also catches when the metric is not present
    return 1;
  }
};

var bounceRateScore = function bounceRateScore(breakdown) {
  if (breakdown.bouncesPerCompletionsAndUnenrolls > 0.07) {
    return 1;
  } else if (breakdown.bouncesPerCompletionsAndUnenrolls > 0.03) {
    return 2;
  } else {
    // Also catches when the metric is not present
    return 3;
  }
};

export var getSenderScoreEnum = function getSenderScoreEnum(breakdown, isDrilldown) {
  var score = replyRateScore(breakdown) + bounceRateScore(breakdown); // 100 enrollments are not required for scoring when drilled into sequence breakdowns

  if (breakdown.completionsAndUnenrolls > 100 || isDrilldown) {
    var _$3$4$5$6$score;

    return (_$3$4$5$6$score = {}, _defineProperty(_$3$4$5$6$score, 2, 'LOW'), _defineProperty(_$3$4$5$6$score, 3, 'LOW'), _defineProperty(_$3$4$5$6$score, 4, 'FAIR'), _defineProperty(_$3$4$5$6$score, 5, 'GOOD'), _defineProperty(_$3$4$5$6$score, 6, 'EXCELLENT'), _$3$4$5$6$score)[score] || 'UNKNOWN';
  }

  return 'UNKNOWN';
};

var addSenderScore = function addSenderScore(breakdown, _ref) {
  var isDrilldown = _ref.isDrilldown;
  return Object.assign({}, breakdown, {
    senderScore: getSenderScoreEnum(breakdown, isDrilldown)
  });
};

export var preprocess = function preprocess(__spec, config) {
  return function (_ref2) {
    var _ref2$breakdowns = _ref2.breakdowns,
        breakdowns = _ref2$breakdowns === void 0 ? [] : _ref2$breakdowns,
        _ref2$totals = _ref2.totals,
        totals = _ref2$totals === void 0 ? {} : _ref2$totals,
        rest = _objectWithoutProperties(_ref2, ["breakdowns", "totals"]);

    var isDrilldown = !!getFilterByProperty(fromJS(config), 'd1');
    return Object.assign({}, rest, {
      breakdowns: breakdowns.map(function (breakdown) {
        return addSenderScore(breakdown, {
          isDrilldown: isDrilldown
        });
      }),
      totals: addSenderScore(totals || {}, {
        isDrilldown: isDrilldown
      })
    });
  };
};