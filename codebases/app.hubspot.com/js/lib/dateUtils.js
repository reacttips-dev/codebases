'use es6';

import I18n from 'I18n';
import { TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_YEAR, LAST_THIRTY_DAYS, LAST_THREE_MONTHS, LAST_YEAR, THIS_QUARTER, LAST_QUARTER } from 'UIComponents/dates/dateRangePresets';
import * as UIComponentsDateRangePresets from 'UIComponents/dates/dateRangePresets';
import { fromMoment, SimpleDate, toMoment, now } from 'UIComponents/core/SimpleDate';
import { SIMPLE_DATE_FORMAT } from './constants';
import keyMirror from 'react-utils/keyMirror';
import { parse } from 'hub-http/helpers/params';
export var safeParseDate = function safeParseDate(date) {
  return date ? fromMoment(I18n.moment.portalTz(date)) : null;
};
/** Accepts string, Date, SimpleDate or Moment object and returns date string in a specified format
 * @param {string, Date, SimpleDate, Moment} date
 * @param {string} format
 * @returns string
 */

export var safeStringifyDate = function safeStringifyDate(date) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SIMPLE_DATE_FORMAT;
  if (!date) return null;else if (date instanceof SimpleDate) {
    date = toMoment(date);
  } else if (!(date instanceof I18n.moment)) {
    date = I18n.moment(date);
  }
  return date.format(format);
};
export var safeConvertStringToStartOfDayTimestamp = function safeConvertStringToStartOfDayTimestamp(stringDate) {
  return stringDate ? I18n.moment.portalTz(stringDate).startOf('day').valueOf() : null;
};
export var safeConvertStringToEndOfDayTimestamp = function safeConvertStringToEndOfDayTimestamp(stringDate) {
  return stringDate ? I18n.moment.portalTz(stringDate).endOf('day').valueOf() : null;
};
export var ALL_TIME_PRESET = {
  presetId: 'ALL',
  getText: function getText() {
    return I18n.text("sui.manageDashboard.filters.dateRangeTypes.ALL");
  },
  getValue: function getValue() {
    return {
      startDate: null,
      endDate: null
    };
  }
}; // use it mostly for BE endpoints that require start and end dates.

export var PSEUDO_ALL_TIME_PRESET = {
  presetId: 'ALL',
  getText: function getText() {
    return I18n.text("sui.manageDashboard.filters.dateRangeTypes.ALL");
  },
  getValue: function getValue(tz) {
    return {
      startDate: new SimpleDate(2000, 0, 1),
      endDate: now(tz)
    };
  }
};
export var DATE_RANGE_PRESETS = [ALL_TIME_PRESET, TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, LAST_THIRTY_DAYS, LAST_THREE_MONTHS, THIS_QUARTER, LAST_QUARTER, THIS_YEAR, LAST_YEAR];
export var SHORT_DATE_RANGE_PRESETS = [THIS_WEEK, THIS_MONTH, LAST_THIRTY_DAYS, LAST_MONTH, LAST_THREE_MONTHS];
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
export var getDateRangePreset = function getDateRangePreset(rangeType) {
  if (UIComponentsDateRangePresets[rangeType]) {
    return UIComponentsDateRangePresets[rangeType];
  }

  switch (rangeType) {
    case RANGE_TYPES.THIS_DAY:
      return UIComponentsDateRangePresets.TODAY;

    case RANGE_TYPES.LAST_DAY:
      return UIComponentsDateRangePresets.YESTERDAY;

    case RANGE_TYPES.ALL:
      return ALL_TIME_PRESET;

    default:
      return null;
  }
};
export var getDateRangePresetValue = function getDateRangePresetValue(rangeType) {
  var preset = getDateRangePreset(rangeType);
  return preset ? preset.getValue('portalTz') : null;
};
/**
 *
 * @param {string} search url query search pamater
 * @param {object} defaultPreset default date range preset to use as a fallback
 * @returns object of type { presetId: string, startDate: SimpleDate, endDate: SimpleDate }
 */

export var parseDateRangeValueFromURL = function parseDateRangeValueFromURL(search, defaultPreset) {
  var queryParams = parse(search.substring(1));
  var endDate = queryParams.endDate,
      startDate = queryParams.startDate;
  var rangeType = queryParams.rangeType; // it is acceptable for "All Time" selection not to have start and end dates

  if ((!endDate || !startDate) && rangeType !== RANGE_TYPES.ALL) {
    var rangeTypePresetValue = getDateRangePresetValue(rangeType);
    if (rangeTypePresetValue) return Object.assign({}, rangeTypePresetValue, {
      presetId: rangeType
    });
    return Object.assign({
      presetId: defaultPreset.presetId
    }, defaultPreset.getValue('portalTz'));
  } // if start or end date are selected, then the range type stops being 'All Time'


  if (rangeType === RANGE_TYPES.ALL && (startDate || endDate)) {
    rangeType = RANGE_TYPES.CUSTOM;
  }

  return {
    presetId: rangeType || defaultPreset.presetId,
    endDate: safeParseDate(endDate),
    startDate: safeParseDate(startDate)
  };
};