'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _LANG_KEYS;

import I18n from 'I18n';
import { List } from 'immutable';
import { SAME_TIME, HALF_HOUR_BEFORE, HOUR_BEFORE, DAY_BEFORE, WEEK_BEFORE, TODAY, TOMORROW, ONE_BUSINESS_DAY, TWO_BUSINESS_DAYS, THREE_BUSINESS_DAYS, ONE_WEEK, TWO_WEEKS, ONE_MONTH, THREE_MONTHS, SIX_MONTHS } from '../constants/RelativeDates';
import { snapToBusinessDay, addBusinessDays } from '../utils/businessDayHelpers';
var FRIDAY = 5;
var SATURDAY = 6;
var LANG_KEYS = (_LANG_KEYS = {}, _defineProperty(_LANG_KEYS, SAME_TIME, 'customerDataProperties.PropertyInputTaskReminder.preset.sameTime'), _defineProperty(_LANG_KEYS, HALF_HOUR_BEFORE, 'customerDataProperties.PropertyInputTaskReminder.preset.halfHourBefore'), _defineProperty(_LANG_KEYS, HOUR_BEFORE, 'customerDataProperties.PropertyInputTaskReminder.preset.hourBefore'), _defineProperty(_LANG_KEYS, DAY_BEFORE, 'customerDataProperties.PropertyInputTaskReminder.preset.dayBefore'), _defineProperty(_LANG_KEYS, WEEK_BEFORE, 'customerDataProperties.PropertyInputTaskReminder.preset.weekBefore'), _defineProperty(_LANG_KEYS, TODAY, 'customerDataProperties.PropertyInputRelativeDate.preset.today'), _defineProperty(_LANG_KEYS, TOMORROW, 'customerDataProperties.PropertyInputRelativeDate.preset.tomorrow'), _defineProperty(_LANG_KEYS, ONE_BUSINESS_DAY, 'customerDataProperties.PropertyInputRelativeDate.preset.oneBusinessDay'), _defineProperty(_LANG_KEYS, TWO_BUSINESS_DAYS, 'customerDataProperties.PropertyInputRelativeDate.preset.twoBusinessDays'), _defineProperty(_LANG_KEYS, THREE_BUSINESS_DAYS, 'customerDataProperties.PropertyInputRelativeDate.preset.threeBusinessDays'), _defineProperty(_LANG_KEYS, ONE_WEEK, 'customerDataProperties.PropertyInputRelativeDate.preset.oneWeek'), _defineProperty(_LANG_KEYS, TWO_WEEKS, 'customerDataProperties.PropertyInputRelativeDate.preset.twoWeeks'), _defineProperty(_LANG_KEYS, ONE_MONTH, 'customerDataProperties.PropertyInputRelativeDate.preset.oneMonth'), _defineProperty(_LANG_KEYS, THREE_MONTHS, 'customerDataProperties.PropertyInputRelativeDate.preset.threeMonths'), _defineProperty(_LANG_KEYS, SIX_MONTHS, 'customerDataProperties.PropertyInputRelativeDate.preset.sixMonths'), _LANG_KEYS);
export function datePresetToMoment(presetKey) {
  var _relatesTo$clone;

  var relatesTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : I18n.moment.userTz();
  var diff;

  switch (presetKey) {
    case SAME_TIME:
      return relatesTo.clone();

    case HALF_HOUR_BEFORE:
      return relatesTo.clone().subtract(0.5, 'hours');

    case HOUR_BEFORE:
      return relatesTo.clone().subtract(1, 'hour');

    case DAY_BEFORE:
      return relatesTo.clone().subtract(1, 'day');

    case WEEK_BEFORE:
      return relatesTo.clone().subtract(1, 'week');

    case TODAY:
      return relatesTo.clone().startOf('day');

    case TOMORROW:
      return relatesTo.clone().add(1, 'day').startOf('day');

    case ONE_BUSINESS_DAY:
      return addBusinessDays(relatesTo, 1).startOf('day');

    case TWO_BUSINESS_DAYS:
      return addBusinessDays(relatesTo, 2).startOf('day');

    case THREE_BUSINESS_DAYS:
      return addBusinessDays(relatesTo, 3).startOf('day');

    case ONE_WEEK:
      diff = [1, 'week'];
      break;

    case TWO_WEEKS:
      diff = [2, 'weeks'];
      break;

    case ONE_MONTH:
      diff = [1, 'month'];
      break;

    case THREE_MONTHS:
      diff = [3, 'months'];
      break;

    case SIX_MONTHS:
      diff = [6, 'months'];
      break;

    default:
      return relatesTo.clone();
  }

  return snapToBusinessDay((_relatesTo$clone = relatesTo.clone()).add.apply(_relatesTo$clone, _toConsumableArray(diff)).startOf('day'));
}
export function momentToDatePreset(value, presets) {
  var relatesTo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : I18n.moment.userTz();
  return presets.find(function (presetKey) {
    var presetValue = datePresetToMoment(presetKey, relatesTo);
    return presetValue.valueOf() === value;
  });
}
export function getRelativeLabel(presetKey) {
  var relatesTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : I18n.moment.userTz();
  var options;

  switch (presetKey) {
    case ONE_BUSINESS_DAY:
    case TWO_BUSINESS_DAYS:
    case THREE_BUSINESS_DAYS:
      options = {
        day: datePresetToMoment(presetKey, relatesTo).format('dddd')
      };
      break;

    case ONE_WEEK:
    case TWO_WEEKS:
    case ONE_MONTH:
    case THREE_MONTHS:
    case SIX_MONTHS:
      options = {
        day: datePresetToMoment(presetKey, relatesTo).format('MMMM D')
      };
      break;

    default:
      options = undefined;
      break;
  }

  return I18n.text(LANG_KEYS[presetKey], options);
}
export function getDueDatePresets() {
  var relatesTo = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : I18n.moment.userTz();
  var config = List.of(TODAY, TOMORROW, ONE_BUSINESS_DAY, TWO_BUSINESS_DAYS, THREE_BUSINESS_DAYS, ONE_WEEK, TWO_WEEKS, ONE_MONTH, THREE_MONTHS, SIX_MONTHS); // The whole list of options includes 'Tomorrow' and
  // '1 business day', which in most cases are the same, so we usually delete
  // the '1 business day' option. On fridays and saturdays, they're different
  // (1bd -> monday, tomorrow -> sat or sun). So we leave both in.

  if (![FRIDAY, SATURDAY].includes(relatesTo.day())) {
    return config.filterNot(function (cat) {
      return cat === ONE_BUSINESS_DAY;
    });
  }

  return config;
}
export function getTaskReminderPresets() {
  return List.of(SAME_TIME, HALF_HOUR_BEFORE, HOUR_BEFORE, DAY_BEFORE, WEEK_BEFORE);
}
export function getUISelectFormattedOptions(options) {
  var relatesTo = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : I18n.moment.userTz();
  return options.map(function (cat) {
    return {
      value: datePresetToMoment(cat, relatesTo).valueOf(),
      text: getRelativeLabel(cat, relatesTo),
      key: cat
    };
  }).toArray();
}