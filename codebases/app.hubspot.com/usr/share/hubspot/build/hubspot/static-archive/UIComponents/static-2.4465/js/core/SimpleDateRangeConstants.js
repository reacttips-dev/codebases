'use es6';

import keyMirror from 'react-utils/keyMirror';
export var RANGE_TYPES = keyMirror({
  ALL: null,
  THIS_DAY: null,
  LAST_DAY: null,
  THIS_WEEK: null,
  LAST_WEEK: null,
  THIS_MONTH: null,
  LAST_MONTH: null,
  LAST_THIRTY_DAYS: null,
  LAST_THREE_MONTHS: null,
  THIS_QUARTER: null,
  LAST_QUARTER: null,
  THIS_YEAR: null,
  LAST_YEAR: null,
  CUSTOM: null
});
export var RANGE_PERIODS = keyMirror({
  DAY: null,
  WEEK: null,
  MONTH: null
});