'use es6';

import { TooMuchDataException } from '../../../exceptions';
var limit = 500;
export var get = function get() {
  return function (response) {
    var breakdowns = response.breakdowns;

    if (breakdowns != null && breakdowns.length > limit) {
      throw new TooMuchDataException();
    }

    var dates = Object.keys(response);

    if (dates.length > limit) {
      throw new TooMuchDataException();
    }

    var points = dates.reduce(function (memo, date) {
      return (response[date] || []).length + memo;
    }, 0);

    if (points > limit) {
      throw new TooMuchDataException();
    }
  };
};