'use es6';

import I18n from 'I18n';
/**
 * Returns data for the current user's locale according to MomentJS. It's important that this not
 * be called until I18n is ready. For UIComponents, this means waiting until render.
 *
 * @return {Object}
 */

export var getLocaleData = function getLocaleData() {
  var locale = (I18n.moment.locale || I18n.moment.lang)();
  return (I18n.moment.localeData || I18n.moment.langData)(locale);
};
/**
 * @param {("L"|"YYYY-MM-DD")} format
 * @return {string}
 */

export var getLocalizedDateFormat = function getLocalizedDateFormat(format) {
  return getLocaleData()._longDateFormat[format] || format;
};
/**
 * @param {("L"|"YYYY-MM-DD")} format
 * @return {string}
 */

export var getDatePlaceholder = function getDatePlaceholder(format) {
  return getLocalizedDateFormat(format).replace(/MM/, I18n.text('ui.datePicker.placeholder.month')).replace(/DD/, I18n.text('ui.datePicker.placeholder.day')).replace(/YYYY/, I18n.text('ui.datePicker.placeholder.year'));
};