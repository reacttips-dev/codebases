'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _OptionValueToRolling;

import * as RollingDateOptionValues from './RollingDateOptionValues';
import { BACKWARD, FORWARD } from './RollingDateDirections';
import { DAY, MONTH, QUARTER, WEEK, YEAR } from './TimeUnits';
import { Map as ImmutableMap, Record, is } from 'immutable';
import isNumber from 'transmute/isNumber';

var isValidDirection = function isValidDirection(direction) {
  return direction === FORWARD || direction === BACKWARD;
};

var isValidTimeUnit = function isValidTimeUnit(timeUnit) {
  return [DAY, MONTH, QUARTER, WEEK, YEAR].includes(timeUnit);
};

var isValidBoolean = function isValidBoolean(maybeBool) {
  return maybeBool === true || maybeBool === false;
};

var RollingDateConfig = Record({
  direction: BACKWARD,
  // Determines whether or not to include days after today in the date range
  includeFutureDates: true,
  // Determines whether the final day in the range is included or not
  isInclusive: true,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 1
}, 'RollingDateConfig');
export var validateRollingDateConfig = function validateRollingDateConfig() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var direction = opts.direction,
      includeFutureDates = opts.includeFutureDates,
      isInclusive = opts.isInclusive,
      timeUnit = opts.timeUnit,
      value = opts.value;

  if (!isValidDirection(direction)) {
    return false;
  }

  if (!isValidTimeUnit(timeUnit)) {
    return false;
  }

  if (!isValidBoolean(isInclusive)) {
    return false;
  }

  if (!isValidBoolean(includeFutureDates)) {
    return false;
  }

  if (!isNumber(value) || value < 0) {
    return false;
  }

  return true;
};
var OptionValueToRollingDateConfig = (_OptionValueToRolling = {}, _defineProperty(_OptionValueToRolling, RollingDateOptionValues.TODAY, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.YESTERDAY, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.TOMORROW, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_WEEK, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: WEEK,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_WEEK_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: WEEK,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_WEEK, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: WEEK,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_WEEK, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: WEEK,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_MONTH, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: MONTH,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_MONTH_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: MONTH,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_MONTH, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: MONTH,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_MONTH, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: MONTH,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_QUARTER, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: QUARTER,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_FISCAL_QUARTER, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: QUARTER,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_QUARTER_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: QUARTER,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_FISCAL_QUARTER_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: QUARTER,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_QUARTER, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: QUARTER,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_FISCAL_QUARTER, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: QUARTER,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_QUARTER, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: QUARTER,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_FISCAL_QUARTER, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: QUARTER,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_YEAR, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: YEAR,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_FISCAL_YEAR, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: true,
  timeUnit: YEAR,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_YEAR_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: YEAR,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.THIS_FISCAL_YEAR_SO_FAR, RollingDateConfig({
  direction: BACKWARD,
  includeFutureDates: false,
  isInclusive: true,
  timeUnit: YEAR,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_YEAR, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: YEAR,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_FISCAL_YEAR, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: YEAR,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_YEAR, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: YEAR,
  useFiscalYear: false,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.NEXT_FISCAL_YEAR, RollingDateConfig({
  direction: FORWARD,
  isInclusive: false,
  timeUnit: YEAR,
  useFiscalYear: true,
  value: 1
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_7_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 7
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_14_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 14
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_30_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 30
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_60_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 60
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_90_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 90
})), _defineProperty(_OptionValueToRolling, RollingDateOptionValues.LAST_365_DAYS, RollingDateConfig({
  direction: BACKWARD,
  isInclusive: false,
  timeUnit: DAY,
  useFiscalYear: false,
  value: 365
})), _OptionValueToRolling);
var OptionValueToRollingDateConfigMap = ImmutableMap(OptionValueToRollingDateConfig);

RollingDateConfig.fromRollingDateOptionValue = function (optionValue) {
  return OptionValueToRollingDateConfig[optionValue];
};

RollingDateConfig.toRollingDateOptionValue = function (rollingDateConfig) {
  var rollingDateEntry = OptionValueToRollingDateConfigMap.findEntry(function (knownConfig) {
    return is(knownConfig, rollingDateConfig);
  });

  if (Array.isArray(rollingDateEntry)) {
    var _rollingDateEntry = _slicedToArray(rollingDateEntry, 1),
        optionValue = _rollingDateEntry[0];

    return optionValue;
  }

  return undefined;
};

export default RollingDateConfig;