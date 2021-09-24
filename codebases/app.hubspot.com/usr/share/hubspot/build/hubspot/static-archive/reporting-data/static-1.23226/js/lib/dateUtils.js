'use es6';

import { sunday } from './makeDateRangeByType/uses';
import { WEEK } from '../constants/frequency';
import { get as getMomentUnit } from './makeDateRangeByType/units';
export function startOf(_ref) {
  var initialDate = _ref.date,
      dataType = _ref.dataType,
      frequency = _ref.frequency;
  var date = initialDate.clone();

  var _getMomentUnit = getMomentUnit(frequency, false),
      period = _getMomentUnit.period;

  if (!dataType || frequency !== WEEK) {
    return date.startOf(period);
  }

  if (!sunday.includes(dataType)) {
    return date.startOf('isoWeek');
  } // isoWeekday() returns a 1-index day-of-the-week count for monday-based-weeks
  // isoWeekday() modulo 7 thus returns the 0-index-based day-of-the-week count for sunday-based-weeks


  var dayInSundayWeek = date.isoWeekday() % 7;
  date.subtract(dayInSundayWeek, 'days');
  return date.startOf('day');
}
export function endOf(_ref2) {
  var initialDate = _ref2.date,
      dataType = _ref2.dataType,
      frequency = _ref2.frequency;
  var date = initialDate.clone();

  var _getMomentUnit2 = getMomentUnit(frequency, false),
      period = _getMomentUnit2.period;

  if (!dataType || frequency !== WEEK) {
    return date.endOf(period);
  }

  if (!sunday.includes(dataType)) {
    return date.endOf('isoWeek');
  } // isoWeekday() returns a 1-index day-of-the-week count for monday-based-weeks
  // isoWeekday() modulo 7 thus returns the 0-index-based day-of-the-week count for sunday-based-weeks


  var dayInSundayWeek = date.isoWeekday() % 7;
  date.add(6 - dayInSundayWeek, 'days'); // diff between saturday and current day

  return date.endOf('day');
}