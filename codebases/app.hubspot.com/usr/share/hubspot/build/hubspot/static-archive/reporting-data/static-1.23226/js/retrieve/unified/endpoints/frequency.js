'use es6';

import invariant from '../../../lib/invariant';
import * as Frequency from '../../../constants/frequency';
export var get = function get(_ref) {
  var frequency = _ref.frequency;

  switch (frequency) {
    case Frequency.DAY:
      return 'd';

    case Frequency.WEEK:
      return 'w';

    case Frequency.MONTH:
      return 'm';

    case Frequency.QUARTER:
      return 'q';

    case Frequency.YEAR:
      return 'y';

    default:
      invariant(false, 'expected frequency to be one of %s, but got %s', [Frequency.DAY, Frequency.WEEK, Frequency.MONTH], frequency);
      return null;
  }
};