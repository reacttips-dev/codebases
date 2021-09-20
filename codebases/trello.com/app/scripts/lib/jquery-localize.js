// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { l } = require('app/scripts/lib/localize');

$.fn.format = function (key, data) {
  this.text(l(key, data, { raw: true }));
  return this;
};

$.fn.formatHtml = function (key, data) {
  this.html(l(key, data));
  return this;
};
