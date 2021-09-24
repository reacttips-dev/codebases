'use es6';

import I18n from 'I18n';
import isDateString from './isDateString';
export default (function (date) {
  if (isDateString(date)) {
    return I18n.moment(date, 'MM-DD-YYYY');
  }

  return I18n.moment(date);
});