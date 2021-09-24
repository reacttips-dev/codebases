'use es6';

import { List, Map as ImmutableMap, Range } from 'immutable';
import I18n from 'I18n';
import * as Frequency from '../constants/frequency';
import { ACCUMULATE } from '../constants/processorTypes';
var DATE_FORMAT = 'YYYY-MM-DD';
export function isAccumulated(report) {
  var processors = report.getIn(['config', 'processors'], []);
  return processors.includes('accumulator') || processors.includes(ACCUMULATE);
}
export var getFrequencyEndDate = function getFrequencyEndDate(_ref) {
  var date = _ref.date,
      frequency = _ref.frequency;
  var day = I18n.moment(date);

  switch (frequency) {
    case Frequency.DAY:
      {
        return day.add(1, 'days').format(DATE_FORMAT);
      }

    case Frequency.WEEK:
      {
        return day.add(1, 'weeks').format(DATE_FORMAT);
      }

    case Frequency.MONTH:
      {
        return day.add(1, 'months').format(DATE_FORMAT);
      }

    case Frequency.QUARTER:
      {
        return day.add(3, 'months').format(DATE_FORMAT);
      }

    case Frequency.YEAR:
      {
        return day.add(1, 'years').format(DATE_FORMAT);
      }

    default:
      return day.format(DATE_FORMAT);
  }
};
/**
 * Explode goalsByMonth to goals daily
 */

export var getDailyGoals = function getDailyGoals(_ref2) {
  var goalsByMonth = _ref2.goalsByMonth;
  return goalsByMonth.flatMap(function (goal) {
    var date = I18n.moment(goal.get('date'));
    var daysInMonth = date.daysInMonth();
    var value = goal.get('value');
    var partial = value / daysInMonth;

    var pad = function pad(number) {
      return ("00" + number).slice(-2);
    };

    var toDate = function toDate(day) {
      return I18n.moment(date.format("YYYY-MM-" + pad(day))).format(DATE_FORMAT);
    };

    return Range(1, daysInMonth + 1).map(toDate).map(function (day) {
      return ImmutableMap({
        date: day,
        value: partial
      });
    });
  });
};
export var padBuckets = function padBuckets(_ref3) {
  var _ref3$goalsByMonth = _ref3.goalsByMonth,
      goalsByMonth = _ref3$goalsByMonth === void 0 ? List() : _ref3$goalsByMonth,
      startDate = _ref3.startDate,
      endDate = _ref3.endDate;
  var goalsKeyedByMonth = goalsByMonth.toMap().mapKeys(function (k, v) {
    return v.get('date');
  });
  var result = [];
  var date = I18n.moment(startDate);

  while (!date.isAfter(endDate)) {
    var key = date.format(DATE_FORMAT);
    var value = goalsKeyedByMonth.getIn([key, 'value'], 0);
    result.push(ImmutableMap({
      date: key,
      value: value
    }));
    date.add(1, 'months');
  }

  return List(result);
};
/**
 * Gives back a list of Map({ date, value })s that
 * correspond to the list of dates provided
 */

export var rebucket = function rebucket(_ref4) {
  var dailyGoals = _ref4.dailyGoals,
      dates = _ref4.dates;
  var result = [];
  var goalIndex = 0;
  var dataIndex = 0;

  var getGoalDate = function getGoalDate(index) {
    return I18n.moment(dailyGoals.getIn([index, 'date']));
  };

  var getGoalValue = function getGoalValue(index) {
    return dailyGoals.getIn([index, 'value']);
  };

  var getDataDate = function getDataDate(index) {
    return I18n.moment(dates.get(index));
  };

  if (dailyGoals.count() > 0) {
    var firstDataDate = getDataDate(dataIndex); // if the goals start before our data
    // skip goals until we get to the start of the data

    while (getGoalDate(goalIndex).isBefore(firstDataDate) && goalIndex < dailyGoals.count()) {
      goalIndex++;
    }

    while (dataIndex < dates.count() - 1) {
      var startDate = getDataDate(dataIndex);
      var endDate = getDataDate(dataIndex + 1);
      var sum = 0;

      if (getGoalDate(goalIndex).isBefore(endDate)) {
        while (goalIndex < dailyGoals.count() && !getGoalDate(goalIndex).isSame(endDate)) {
          sum += getGoalValue(goalIndex);
          goalIndex++;
        }
      }

      result.push(ImmutableMap({
        date: startDate.format(DATE_FORMAT),
        value: sum
      }));
      dataIndex++;
    }
  }

  return List(result);
};