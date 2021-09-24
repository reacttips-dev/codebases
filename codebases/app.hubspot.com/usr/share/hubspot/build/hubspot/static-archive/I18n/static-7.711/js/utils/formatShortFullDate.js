'use es6';

import getDateNumberFormattingLocale from './getDateNumberFormattingLocale';
import getMomentToDateValue from './internal/getMomentToDateValue';
export default (function (value, type) {
  var dateValue = getMomentToDateValue(value, type);
  var dateFormatter = new Intl.DateTimeFormat(getDateNumberFormattingLocale(), {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  });
  return dateFormatter.format(dateValue);
});