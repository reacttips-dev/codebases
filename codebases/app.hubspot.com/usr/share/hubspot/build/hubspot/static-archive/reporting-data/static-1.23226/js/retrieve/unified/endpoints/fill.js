'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import I18n from 'I18n';
import { has } from '../../../lib/has';
import * as dates from '../params/dates';
import { RANGE_TYPES } from '../../../constants/dateRangeTypes';
import { startOf } from '../../../lib/dateUtils';
var formats = {
  INPUT: 'YYYYMMDD',
  OUTPUT: 'YYYY-MM-DD'
};

var result = function result(maybe) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return typeof maybe === 'function' ? maybe.apply(void 0, args) : maybe;
};

export var fill = function fill(getter) {
  return function (spec, config) {
    return function (response) {
      var responseKeys = Object.keys(response);

      if (responseKeys.length === 0) {
        return response;
      }

      var dataType = config.dataType,
          frequency = config.frequency,
          rangeType = config.filters.dateRange.value.rangeType;

      var _dates$get = dates.get(spec, config),
          start = _dates$get.start,
          end = _dates$get.end;

      var first = I18n.moment.apply(I18n, _toConsumableArray(rangeType === RANGE_TYPES.ALL ? [responseKeys[0], formats.OUTPUT] : [start, formats.INPUT]));
      var last = I18n.moment(end, formats.INPUT);
      var filled = {};
      var previous = null;

      for (var current = startOf({
        date: first,
        frequency: frequency,
        dataType: dataType
      }); current.isSameOrBefore(last, 'day'); current.add(1, frequency)) {
        var date = current.format(formats.OUTPUT);
        var point = result(getter, {
          date: date,
          previous: previous,
          response: response
        });
        filled[date] = has(response, date) ? response[date] : point;
        previous = filled[date];
      }

      return filled;
    };
  };
};
export var zero = fill([]);
export var sustain = fill(function (_ref) {
  var previous = _ref.previous;
  return previous || [];
});