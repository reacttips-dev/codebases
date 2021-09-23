'use es6';

import { translate } from './text';
export var html = function html(key, opts) {
  if (opts == null) {
    opts = {};
  }

  var gap = '';

  if (opts.useGap === true || opts.noGap === false) {
    gap = ' ';
  }

  return gap + "<i18n-string data-key='" + key + "' data-locale-at-render='" + I18n.locale + "'>" + translate(key, opts) + "</i18n-string>" + gap;
};
export function initializeHTMLFormatters(I18n) {
  I18n.html = html;
}