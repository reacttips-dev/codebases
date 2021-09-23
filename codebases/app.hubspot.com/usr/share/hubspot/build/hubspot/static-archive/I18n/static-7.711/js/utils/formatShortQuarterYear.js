'use es6';

import I18n from 'I18n';
import getDateNumberFormattingLocale from './getDateNumberFormattingLocale';
export default (function (value, type) {
  var momentValue = !type ? value : I18n.moment[type](value);
  return I18n.text('i18n.dateTime.quarterAndYear', {
    locale: getDateNumberFormattingLocale(),
    quarterNumber: momentValue.quarter(),
    yearNumber: momentValue.year().toString()
  });
});