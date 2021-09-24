'use es6';

import getMomentToDateValue from './internal/getMomentToDateValue';
import getDateNumberFormattingLocale from './getDateNumberFormattingLocale';
export default (function (value, type) {
  var dateValue = getMomentToDateValue(value, type);
  var dateFormatter = new Intl.DateTimeFormat(getDateNumberFormattingLocale(), {
    month: 'long',
    day: 'numeric'
  });
  return dateFormatter.format(dateValue);
});