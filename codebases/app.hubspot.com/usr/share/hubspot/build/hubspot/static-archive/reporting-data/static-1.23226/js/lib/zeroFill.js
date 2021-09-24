'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import I18n from 'I18n';
import { Map as ImmutableMap, List, OrderedSet, OrderedMap } from 'immutable';
import makeDateRangeByType from './makeDateRangeByType';
import * as Frequency from '../constants/frequency';
import { TIME_SERIES } from '../constants/configTypes';
import { RANGE_TYPES } from '../constants/dateRangeTypes';
import { CROSS_OBJECT } from '../constants/dataTypes';
var DATE_FORMAT = 'YYYY-MM-DD';
var defaultOptions = {
  format: DATE_FORMAT,
  empty: false,
  leading: true,
  trailing: true,
  sustain: false
};
var frequencyToPeriodMap = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, Frequency.DAY, 'day'), _defineProperty(_ImmutableMap, Frequency.WEEK, 'week'), _defineProperty(_ImmutableMap, Frequency.MONTH, 'month'), _defineProperty(_ImmutableMap, Frequency.QUARTER, 'quarter'), _defineProperty(_ImmutableMap, Frequency.YEAR, 'year'), _ImmutableMap)); // NOTE: RA-1957 - normalize for locale agnostic logic
// NOTE: RA-2430 - but keep start of the week control

var normalizeDateTime = function normalizeDateTime(isWeekly, weekStartSunday) {
  return function () {
    var _I18n$moment;

    return (_I18n$moment = I18n.moment).portalTz.apply(_I18n$moment, arguments).locale(isWeekly && !weekStartSunday ? 'fr' : 'en-us');
  };
};

function clearPoint(point) {
  var clearValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var clearMetric = function clearMetric(metric) {
    return metric.map(function () {
      return clearValue;
    });
  };

  return point.update('metrics', ImmutableMap(), function (metrics) {
    return metrics.map(clearMetric);
  }).updateIn(['dimension', 'buckets'], List(), function (points) {
    return points.map(function (p) {
      return clearPoint(p, clearValue);
    });
  });
}

function fillPointsWithRange(points, frequency, _ref, _ref2) {
  var startDate = _ref.startDate,
      endDate = _ref.endDate,
      rangeType = _ref.rangeType;
  var format = _ref2.format,
      empty = _ref2.empty,
      leading = _ref2.leading,
      trailing = _ref2.trailing,
      sustain = _ref2.sustain;
  var unit = frequencyToPeriodMap.get(frequency);
  var first = points.first();
  var last = points.last(); // Check if weeks start on Sunday or Monday for this dataset

  var tempStart = I18n.moment(first.get('key'), DATE_FORMAT); // 7 if Sunday, 1 if Monday

  var weekStartSunday = tempStart.isoWeekday() === 7;
  var normalizedDateTime = normalizeDateTime(frequency === 'WEEK', weekStartSunday);
  var start = normalizedDateTime(startDate, DATE_FORMAT);
  var end = normalizedDateTime(endDate, DATE_FORMAT);
  var leftMostDate = normalizedDateTime(first.get('key'), DATE_FORMAT);
  var rightMostDate = normalizedDateTime(last.get('key'), DATE_FORMAT);
  var zeroPoint = clearPoint(first, 0);
  var nullPoint = clearPoint(first, null);
  var keyed = points.reduce(function (memo, point) {
    return memo.set(point.get('key'), point);
  }, OrderedMap());
  var leadingPoints = [];

  if (leading || empty) {
    for (var i = leftMostDate.clone().subtract(1, unit); i.isSameOrAfter(start, unit) && ![RANGE_TYPES.ALL, RANGE_TYPES.IS_BEFORE_DATE].includes(rangeType); i.subtract(1, unit)) {
      var formatted = i.format(format);
      var point = empty ? nullPoint.set('key', formatted) : zeroPoint.set('key', formatted);
      leadingPoints.unshift(point);
    }
  }

  var lastPoint = null;
  var innerPoints = [];

  for (var n = leftMostDate.clone(); n.isSameOrBefore(rightMostDate, unit); n.add(1, unit)) {
    var _formatted = n.format(format);

    var _point = keyed.has(_formatted) ? keyed.get(_formatted) : sustain ? lastPoint : zeroPoint.set('key', _formatted);

    innerPoints.push(_point);
    lastPoint = _point;
  }

  var trailingPoints = [];

  if (trailing) {
    var endOfDay = I18n.moment.portalTz().endOf('day');

    for (var j = rightMostDate.clone().add(1, unit); j.isSameOrBefore(end, unit); j.add(1, unit)) {
      var _formatted2 = j.format(format);

      var emptyPoint = j.isSameOrAfter(endOfDay, unit) ? nullPoint : sustain ? lastPoint : zeroPoint;

      var _point2 = emptyPoint.set('key', _formatted2);

      trailingPoints.push(_point2);
    }
  }

  return List([].concat(leadingPoints, innerPoints, trailingPoints));
}

function addAllSubaggsToAllBuckets(config, data) {
  var subAggKeyList = data.getIn(['dimension', 'buckets'], List()).reduce(function (reduction, bucket) {
    return bucket.getIn(['dimension', 'buckets'], List()).reduce(function (memo, innerBucket) {
      return memo.add(innerBucket.get('key'));
    }, reduction);
  }, OrderedSet()).toList();

  if (subAggKeyList.isEmpty()) {
    return data;
  }

  return data.updateIn(['dimension', 'buckets'], function (buckets) {
    return buckets.map(function (bucket) {
      return bucket.updateIn(['dimension', 'buckets'], function (innerBuckets) {
        return subAggKeyList.map(function (subAggKey) {
          var filler = ImmutableMap(config.get('metrics', List()).map(function (metricWithTypes) {
            return [metricWithTypes.get('property'), ImmutableMap(metricWithTypes.get('metricTypes', List()).map(function (metric) {
              return [metric, 0];
            }).toJS())];
          }).toJS());
          var found = innerBuckets.find(function (b) {
            return b.get('key') === subAggKey;
          });
          return found ? found.update('metrics', function (metrics) {
            return !metrics || metrics.isEmpty() ? filler : metrics;
          }) : ImmutableMap({
            key: subAggKey,
            metrics: filler
          });
        });
      });
    });
  });
}

export default function zeroFill(config, data) {
  var overrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var configType = config.get('configType');
  var dateRange = config.getIn(['filters', 'dateRange']);

  if (configType !== TIME_SERIES || !dateRange) {
    if (config.get('dataType') === CROSS_OBJECT) {
      return addAllSubaggsToAllBuckets(config, data);
    }

    return data;
  }

  var options = Object.assign({}, defaultOptions, {}, overrides);
  var dataType = config.get('dataType');
  var frequency = config.get('frequency');
  var fullDateRange = makeDateRangeByType(dateRange.get('value').toJS(), options.format, dataType);

  var fillPoints = function fillPoints(points) {
    return !points || points.isEmpty() ? points : fillPointsWithRange(points, frequency, fullDateRange, options);
  };

  var filledData = addAllSubaggsToAllBuckets(config, data).withMutations(function (base) {
    base.updateIn(['dimension', 'buckets'], fillPoints);
    base.set('total', base.getIn(['dimension', 'buckets'], List()).size);
  });
  return filledData;
}