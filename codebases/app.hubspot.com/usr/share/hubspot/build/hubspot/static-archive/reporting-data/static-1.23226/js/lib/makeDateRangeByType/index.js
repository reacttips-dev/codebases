'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import I18n from 'I18n';
import { DEFAULT_START } from '../../constants/dates';
import { RANGE_TYPES, ROLLING_DATE_TYPES } from '../../constants/dateRangeTypes';
import normalizeDateTime from '../normalizeDateTime';
import * as uses from './uses';
import * as units from './units';
import { startOf, endOf } from '../dateUtils';
var FORMAT = 'YYYYMMDD';
/*
 * interface DateRange {
 *   rangeType: RangeType;
 *   rollingDays?: RollingDateType;
 *   startDate?: string;
 *   endDate?: string;
 *   entireCurrentUnit?: boolean;
 * }
 */

/**
 * Make date range from range type
 *
 * @param {DateRange} filter Sparce date range filter
 * @param {string} format Output date format
 * @returns {DateRange} Complete date range filter
 */

export default (function () {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$rangeType = _ref.rangeType,
      rangeType = _ref$rangeType === void 0 ? RANGE_TYPES.THIS_MONTH : _ref$rangeType,
      _ref$rollingDays = _ref.rollingDays,
      rollingDays = _ref$rollingDays === void 0 ? ROLLING_DATE_TYPES['7'] : _ref$rollingDays,
      _ref$entireCurrentUni = _ref.entireCurrentUnit,
      entireCurrentUnit = _ref$entireCurrentUni === void 0 ? false : _ref$entireCurrentUni,
      startDate = _ref.startDate,
      endDate = _ref.endDate,
      date = _ref.date;

  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';
  var dataType = arguments.length > 2 ? arguments[2] : undefined;

  var _uses$get = uses.get(dataType),
      utc = _uses$get.utc,
      sunday = _uses$get.sunday; // NOTE: RA-1957 - normalize for locale agnostic logic


  var normalizedDateTime = normalizeDateTime(utc ? I18n.moment.utc : I18n.moment.portalTz);

  var _rangeType$split = rangeType.split('_'),
      _rangeType$split2 = _slicedToArray(_rangeType$split, 2),
      timeFrame = _rangeType$split2[0],
      dateUnit = _rangeType$split2[1];

  var _units$get = units.get(dateUnit, !sunday),
      interval = _units$get.interval;

  var isSingleDateType = [RANGE_TYPES.IS_EQUAL_TO, RANGE_TYPES.IS_BEFORE_DATE, RANGE_TYPES.IS_AFTER_DATE].includes(rangeType) || timeFrame === 'CUSTOM' && dateUnit; // NOTE: providing default value(s) for CUSTOM, IS_EQUAL_TO, IS_BEFORE_DATE, IS_AFTER_DATE

  if (rangeType === RANGE_TYPES.CUSTOM && startDate == null) {
    startDate = I18n.moment.portalTz().subtract(1, 'week').startOf('day').format('YYYY-MM-DD');
    endDate = I18n.moment.portalTz().endOf('day').format('YYYY-MM-DD');
  } else if (isSingleDateType && date == null) {
    date = I18n.moment.portalTz().startOf('day').format('YYYY-MM-DD');
  }

  if (rangeType === RANGE_TYPES.CUSTOM) {
    startDate = normalizedDateTime(startDate, FORMAT).startOf('day');
    endDate = normalizedDateTime(endDate, FORMAT).endOf('day');
  } else if (rangeType === RANGE_TYPES.ROLLING) {
    startDate = normalizedDateTime().subtract(rollingDays, 'days').startOf('day');
    endDate = normalizedDateTime().subtract(1, 'day').endOf('day');
  } else if (rangeType === RANGE_TYPES.ALL) {
    startDate = normalizedDateTime(DEFAULT_START, 'YYYY-MM-DD');
    endDate = normalizedDateTime().endOf('day');
  } else if (timeFrame === 'LAST') {
    entireCurrentUnit = true;
    startDate = startOf({
      date: normalizedDateTime(),
      dataType: dataType,
      frequency: dateUnit
    }).subtract(1, interval);
    endDate = endOf({
      date: normalizedDateTime().subtract(1, interval),
      frequency: dateUnit,
      dataType: dataType
    });
  } else if (timeFrame === 'NEXT') {
    startDate = startOf({
      date: normalizedDateTime(),
      dataType: dataType,
      frequency: dateUnit
    }).add(1, interval);
    endDate = endOf({
      date: normalizedDateTime().add(1, interval),
      frequency: dateUnit,
      dataType: dataType
    });
  } else if (timeFrame === 'CUSTOM') {
    startDate = startOf({
      date: normalizedDateTime(date),
      frequency: dateUnit,
      dataType: dataType
    });
    endDate = endOf({
      date: normalizedDateTime(date),
      frequency: dateUnit,
      dataType: dataType
    });
  } else if (rangeType === RANGE_TYPES.IS_AFTER_DATE) {
    startDate = normalizedDateTime(date).add(1, 'day'); // add a day since date itself not included

    endDate = entireCurrentUnit ? endOf({
      date: normalizedDateTime(),
      frequency: dateUnit,
      dataType: dataType
    }) : normalizedDateTime().endOf('day');
  } else if (rangeType === RANGE_TYPES.IS_BEFORE_DATE) {
    startDate = normalizedDateTime(DEFAULT_START, 'YYYY-MM-DD');
    endDate = normalizedDateTime(date);
  } else if (rangeType === RANGE_TYPES.IS_EQUAL_TO) {
    startDate = normalizedDateTime(date);
    endDate = startDate;
  } else {
    startDate = startOf({
      date: normalizedDateTime(),
      frequency: dateUnit,
      dataType: dataType
    });
    endDate = entireCurrentUnit ? endOf({
      date: normalizedDateTime(),
      frequency: dateUnit,
      dataType: dataType
    }) : normalizedDateTime().endOf('day');
  }

  return {
    rangeType: rangeType,
    rollingDays: rangeType === RANGE_TYPES.ROLLING ? rollingDays : null,
    entireCurrentUnit: entireCurrentUnit,
    startDate: startDate.format(format),
    endDate: endDate.format(format),
    date: isSingleDateType ? date : null
  };
});