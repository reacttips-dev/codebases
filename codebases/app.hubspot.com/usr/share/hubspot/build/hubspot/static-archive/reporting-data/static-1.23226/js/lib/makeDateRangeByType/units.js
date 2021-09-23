'use es6';

import * as Frequency from '../../constants/frequency';

var build = function build(period) {
  var interval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : period;
  return {
    period: period,
    interval: interval
  };
};

export var get = function get(unit, isoweek) {
  switch (unit) {
    case Frequency.DAY:
      return build('day');

    case Frequency.WEEK:
      return isoweek ? build('isoWeek', 'week') : build('week');

    case Frequency.MONTH:
      return build('month');

    case Frequency.QUARTER:
      return build('quarter');

    case Frequency.YEAR:
      return build('year');

    default:
      return build(null);
  }
};