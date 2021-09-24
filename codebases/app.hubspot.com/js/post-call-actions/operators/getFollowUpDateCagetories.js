'use es6';

import I18n from 'I18n';
import getIn from 'transmute/getIn';
import { addWeekdays } from '../../utils/dateUtils';
import { TODAY, TOMORROW, ONE_BUSINESS_DAY, TWO_BUSINESS_DAYS, THREE_BUSINESS_DAYS, ONE_WEEK, TWO_WEEKS, ONE_MONTH, THREE_MONTHS, SIX_MONTHS } from 'customer-data-properties/constants/RelativeDates';
var DAY_FORMAT = 'dddd';
var MONTH_DATE_FORMAT = 'MMMM D';
var FRIDAY = 5;
var SATURDAY = 6;

var _getBusinessDayLabel = function _getBusinessDayLabel(key, numberOfDays, format) {
  var now = I18n.moment.userTz();
  var date = addWeekdays(now, numberOfDays);
  return I18n.text(key, {
    day: date.format(format)
  });
};

export var getFollowUpDateCategories = function getFollowUpDateCategories() {
  var categories = [{
    value: TODAY,
    text: _getBusinessDayLabel('follow-up-task.categories.today', 1, DAY_FORMAT)
  }, {
    value: TOMORROW,
    text: _getBusinessDayLabel('follow-up-task.categories.tomorrow', 1, DAY_FORMAT),
    oneDay: true
  }, {
    value: ONE_BUSINESS_DAY,
    text: _getBusinessDayLabel('follow-up-task.categories.oneDay', 1, DAY_FORMAT),
    oneBusinessDay: true
  }, {
    value: TWO_BUSINESS_DAYS,
    text: _getBusinessDayLabel('follow-up-task.categories.twoDays', 2, DAY_FORMAT)
  }, {
    value: THREE_BUSINESS_DAYS,
    text: _getBusinessDayLabel('follow-up-task.categories.threeDays', 3, DAY_FORMAT)
  }, {
    value: ONE_WEEK,
    text: _getBusinessDayLabel('follow-up-task.categories.oneWeek', 5, MONTH_DATE_FORMAT)
  }, {
    value: TWO_WEEKS,
    valueTime: 10,
    text: _getBusinessDayLabel('follow-up-task.categories.twoWeeks', 10, MONTH_DATE_FORMAT)
  }, {
    value: ONE_MONTH,
    text: _getBusinessDayLabel('follow-up-task.categories.oneMonth', 20, MONTH_DATE_FORMAT)
  }, {
    value: THREE_MONTHS,
    text: _getBusinessDayLabel('follow-up-task.categories.threeMonths', 60, MONTH_DATE_FORMAT)
  }, {
    value: SIX_MONTHS,
    text: _getBusinessDayLabel('follow-up-task.categories.sixMonths', 120, MONTH_DATE_FORMAT)
  }];

  if (![FRIDAY, SATURDAY].includes(I18n.moment.userTz().day())) {
    return categories.filter(function (cat) {
      return !cat.oneBusinessDay;
    });
  }

  return categories;
};
export var getDefaultFollowUpDateCategory = function getDefaultFollowUpDateCategory(defaultTaskSettings) {
  var defaultValue = {
    value: THREE_BUSINESS_DAYS,
    text: _getBusinessDayLabel('follow-up-task.categories.threeDays', 3, DAY_FORMAT)
  };
  var defaultDueDatePreset = getIn(['defaultDueDatePreset'], defaultTaskSettings);

  if (defaultDueDatePreset) {
    var categories = getFollowUpDateCategories();
    var shouldIncludeOneBusinessDay = [FRIDAY, SATURDAY].includes(I18n.moment.userTz().day());
    return categories.find(function (category) {
      // if ONE_BUSINESS_DAY not included then ONE_BUSINESS_DAY === TOMORROW
      if (!shouldIncludeOneBusinessDay && defaultDueDatePreset === ONE_BUSINESS_DAY && category.oneDay) {
        return true;
      }

      return category.value === getIn(['defaultDueDatePreset'], defaultTaskSettings);
    }) || defaultValue;
  }

  return defaultValue;
};